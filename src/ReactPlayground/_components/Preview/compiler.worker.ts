import { transform } from "@babel/standalone";
import { File, Files } from "../../PlaygroundContext";
import { ENTRY_FILE_NAME } from "../../files";
import { PluginObj } from "@babel/core";

export const beforeTransformCode = (filename: string, code: string) => {
  let _code = code;
  const regexReact = /import\s+React/g;
  if (
    (filename.endsWith(".jsx") || filename.endsWith(".tsx")) &&
    !regexReact.test(code)
  ) {
    _code = `import React from 'react';\n${code}`;
  }
  return _code;
};

export const babaelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  let _code = beforeTransformCode(filename, code);
  let result = "";
  try {
    // 使用Babel的transform方法将代码转换为兼容的JavaScript
    result = transform(_code, {
      // 使用React和TypeScript预设，确保代码可以正确编译
      presets: ["react", "typescript"],
      // 传入当前文件名，帮助Babel进行上下文转换
      filename,
      // 可以添加额外的Babel插件，目前为空数组
      plugins: [customResolver(files)],
      // 保留原始代码的行号，便于调试
      retainLines: true,
    }).code!;
  } catch (e) {}
  return result;
};

const getModuleFile = (files: Files, modulePath: string) => {
  let moduleName = modulePath.split("./").pop() || "";
  if (!moduleName.includes(".")) {
    const realModuleName = Object.keys(files)
      .filter((key) => {
        return (
          key.endsWith(".ts") ||
          key.endsWith(".tsx") ||
          key.endsWith(".js") ||
          key.endsWith(".jsx")
        );
      })
      .find((key) => {
        return key.split(".").includes(moduleName);
      });
    if (realModuleName) {
      moduleName = realModuleName;
    }
  }
  return files[moduleName];
};

//转换json文件
const json2Js = (file: File) => {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

const css2Js = (file: File) => {
  const randomId = new Date().getTime();
  const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
    `;
  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

// 自定义模块解析器
function customResolver(files: Files): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;

        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath);
          if (!file) {
            return;
          }
          if (file.name.endsWith(".css")) {
            path.node.source.value = css2Js(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2Js(file);
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babaelTransform(file.name, file.value, files)], {
                type: "application/javascript",
              })
            );
          }
        }
      },
    },
  };
}

export const compile = (files: Files) => {
  const main = files[ENTRY_FILE_NAME];
  return babaelTransform(ENTRY_FILE_NAME, main.value, files);
};

self.postMessage({
  type: "COMPILED_CODEs",
  data: "xx",
});
