import FileNameList from "./FileNameList";
import Editor, { EditorFile } from "./Editor";
import styles from "./index.module.scss";
import { useContext } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
import { debounce } from "lodash-es";

export default function CodeEditor() {
  const { files, selectedFileName, setFiles } = useContext(PlaygroundContext);
  const { theme } = useContext(PlaygroundContext);

  const file: EditorFile = files[selectedFileName];

  const handleOnchange = (value?: string) => {
    files[file.name].value = value!;
    setFiles({ ...files });
  };

  return (
    <div className={styles.codeEditor}>
      <FileNameList />
      <Editor
        options={{
          theme: `vs-${theme}`,
        }}
        file={file}
        onChange={debounce(handleOnchange, 500)}
      />
    </div>
  );
}
