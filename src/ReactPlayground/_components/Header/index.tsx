import logoSvg from "@/assets/icons/logo.svg";
import styles from "./index.module.scss";
import {
  DownloadOutlined,
  MoonOutlined,
  ShareAltOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
import copy from "copy-to-clipboard";
import { downloadFiles } from "../../utils";

export default function Header() {
  const { theme, setTheme } = useContext(PlaygroundContext);
  const { files } = useContext(PlaygroundContext);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img alt="logo" src={logoSvg} />
        <span>React Playground</span>
      </div>
      <div className={styles.links}>
        {theme === "light" && (
          <MoonOutlined
            title="切换暗色主题"
            className={styles.theme}
            onClick={() => setTheme("dark")}
          ></MoonOutlined>
        )}
        {theme === "dark" && (
          <SunOutlined
            title="切换亮色主题"
            className={styles.theme}
            onClick={() => setTheme("light")}
          ></SunOutlined>
        )}
        <ShareAltOutlined
          style={{ marginLeft: "10px" }}
          onClick={() => {
            copy(window.location.href);
            alert("分享链接已复制");
          }}
        ></ShareAltOutlined>
        <DownloadOutlined
          style={{ marginLeft: "10px" }}
          onClick={async () => {
            await downloadFiles(files);
            alert("下载完成");
          }}
        ></DownloadOutlined>
      </div>
    </div>
  );
}
