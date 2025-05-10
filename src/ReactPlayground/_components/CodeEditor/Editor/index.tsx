import MonacoEditor, { OnMount, EditorProps } from "@monaco-editor/react";
import { createATA } from "./ata";
import { editor } from "monaco-editor";

//设置文件信息接口
export interface EditorFile {
  name: string;
  value: string;
  language: string;
}

//设置编辑器属性接口
interface Props {
  file: EditorFile;
  onChange?: EditorProps["onChange"];
  options?: editor.IStandaloneEditorConstructionOptions;
}

export default function Editor(props: Props) {
  const { file, onChange, options } = props;

  //在onMount编辑器加载完成的回调里，设置ts的编译配置
  const handleEditorMount: OnMount = (editor, monaco) => {
    //配置键盘命令，ctrl+j 格式化代码
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });

    //这里设置jsx为preserve，是为了保留jsx语法，否则会编译成react.createElement
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });

    //创建ATA，用于分析代码用到的类型包
    const ata = createATA((code, path) => {
      //添加类型包
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });

    //监听代码变化，重新分析代码
    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    //初始化ATA，分析代码用到的类型包
    ata(editor.getValue());
  };

  return (
    <>
      <MonacoEditor
        onChange={onChange}
        height="100%"
        path={file.name}
        language={file.language}
        value={file.value}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          ...options,
        }}
      ></MonacoEditor>
    </>
  );
}
