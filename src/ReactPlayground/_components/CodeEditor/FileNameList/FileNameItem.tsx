import classNames from "classnames";
import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./index.module.scss";
import { Popconfirm } from "antd";

export interface FileNameItemProps {
  value: string;
  actived: boolean;
  creating: boolean;
  onClick: () => void;
  readonly: boolean;
  onEditComplete: (name: string) => void;
  rightItem: string[];
  onRemove: (name: string) => void;
  fileList: string[];
}

export const FileNameItem = forwardRef<
  {
    blur: () => void;
  },
  FileNameItemProps
>((props, ref) => {
  const {
    value,
    actived = false,
    onClick,
    onEditComplete,
    creating,
    rightItem,
    onRemove,
    readonly,
  } = props;
  const [name, setName] = useState<string>(value);

  useImperativeHandle(ref, () => {
    return {
      blur: () => {
        inputRef.current?.blur();
      },
    };
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<boolean>(creating);

  //双击后可以进行编辑
  const handleOnDoubleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  };

  //鼠标离开input时，取消编辑
  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setEditing(false);
    //修改文件名称
    onEditComplete(name);
  };

  useEffect(() => {
    //判断是否在编辑中，如果编辑中，则获取焦点
    if (editing) {
      inputRef?.current?.focus();
    }
  }, [editing]);

  return (
    <div
      onClick={onClick}
      className={classNames(
        styles["tab-item"],
        actived ? styles.actived : null,
        rightItem.includes(value) ? styles["right-item"] : null
      )}
    >
      {editing ? (
        <input
          type="text"
          ref={inputRef}
          className={styles["tabs-item-input"]}
          value={name}
          onBlur={(e) => handleOnBlur(e)}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <>
          <span
            onDoubleClick={!readonly ? (e) => handleOnDoubleClick(e) : () => {}}
          >
            {name}
          </span>
          {!readonly ? (
            <Popconfirm
              title="确认删除该文件吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={(e) => {
                e?.stopPropagation();
                onRemove(name);
              }}
            >
              <span
                style={{ marginLeft: 5, display: "flex" }}
                className={styles["remove-icon"]}
              >
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
                  <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </Popconfirm>
          ) : null}
        </>
      )}
    </div>
  );
});
