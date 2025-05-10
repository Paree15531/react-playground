import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { compress, fileName2Language, uncompress } from "./utils";
import { initFiles } from "./files";

export interface File {
  name: string;
  value: string;
  language: string;
}

export type Files = Record<string, File>;

export type Theme = "light" | "dark";

export interface PlaygroundContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  files: Files;
  selectedFileName: string;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: Files) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldFileName: string, newFileName: string) => void;
}

//创建上下文
export const PlaygroundContext = createContext<PlaygroundContextType>({
  selectedFileName: "App.tsx",
} as PlaygroundContextType);
//创建上下文提供者

//获取当前url中hash内容就是URL#后的内容，并将他们转换为对象格式
const getFilesFromUrl = () => {
  let files: Files | undefined;
  try {
    const hash = window.location.hash.slice(1);
    const uncompressed = uncompress(hash);
    files = JSON.parse(uncompressed);
  } catch (e) {}
  return files;
};

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [files, setFiles] = useState<Files>(
    getFilesFromUrl() || { ...initFiles }
  );
  const [selectedFileName, setSelectedFileName] = useState<string>("App.tsx");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const hashUrl = compress(JSON.stringify(files));
    window.location.hash = hashUrl;
  }, [files]);

  const addFile = (name: string) => {
    files[name] = {
      name,
      language: fileName2Language(name),
      value: "",
    };
    setFiles({ ...files });
  };
  const removeFile = (name: string) => {
    delete files[name];
    setFiles({ ...files });
  };
  const updateFileName = (oldFieldName: string, newFieldName: string) => {
    if (
      !files[oldFieldName] ||
      newFieldName === undefined ||
      newFieldName === null
    )
      return;
    const { [oldFieldName]: value, ...rest } = files;

    const newFile = {
      [newFieldName]: {
        ...value,
        language: fileName2Language(newFieldName),
        name: newFieldName,
      },
    };

    setFiles({
      ...rest,
      ...newFile,
    });
  };

  return (
    <>
      <PlaygroundContext.Provider
        value={{
          theme,
          setTheme,
          files,
          selectedFileName,
          setSelectedFileName,
          setFiles,
          addFile,
          removeFile,
          updateFileName,
        }}
      >
        {children}
      </PlaygroundContext.Provider>
    </>
  );
};
