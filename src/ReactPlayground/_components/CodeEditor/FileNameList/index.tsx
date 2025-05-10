import { useContext, useEffect, useRef, useState } from "react";
import { PlaygroundContext } from "../../../PlaygroundContext";
import styles from "./index.module.scss";
import { FileNameItem } from "./FileNameItem";
import {
  APP_COMPONENT_NAME,
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
} from "../../../files";

export default function FileNameList() {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState<Array<string>>([""]);
  const rightItem = ["import-map.json"];
  const [creating, setCreating] = useState<boolean>(false);
  const [fileList] = useState<Array<string>>([]);

  const fileNameRef = useRef<
    Array<{
      blur: () => void;
    }>
  >([]);

  const readonlyFileNames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_NAME,
  ];

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name);
    setSelectedFileName(name);
    setCreating(false);
  };

  //添加新文件
  const handleAddNewFile = () => {
    fileNameRef?.current?.blur();

    const newFileName = "Comp" + Math.random().toString().slice(2, 6) + ".tsx";
    addFile(newFileName);
    setSelectedFileName(newFileName);
    setCreating(true);
  };

  //删除文件
  const handleRemoveFile = (name: string) => {
    removeFile(name);
    setSelectedFileName(ENTRY_FILE_NAME);
  };

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  return (
    <div className={styles.tabs}>
      {tabs.map((fileName, index) => (
        <FileNameItem
          ref={fileNameRef[index]}
          readonly={readonlyFileNames.includes(fileName)}
          fileList={fileList}
          rightItem={rightItem}
          creating={creating}
          onEditComplete={(name: string) => handleEditComplete(name, fileName)}
          key={fileName + index}
          value={fileName}
          actived={selectedFileName == fileName}
          onClick={() => setSelectedFileName(fileName)}
          onRemove={(name) => handleRemoveFile(name)}
        ></FileNameItem>
      ))}

      <div className={styles.add} onMouseDown={handleAddNewFile}>
        {" "}
        +{" "}
      </div>
    </div>
  );
}
