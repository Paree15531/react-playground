import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "./_components/Header";
import CodeEditor from "./_components/CodeEditor";
import Preview from "./_components/Preview";
import { useContext } from "react";
import { PlaygroundContext } from "./PlaygroundContext";
import "./index.scss";

export default function ReactPlayground() {
  const { theme } = useContext(PlaygroundContext);

  return (
    <div className={theme} style={{ height: "100vh" }}>
      <Header />
      <div style={{ height: "calc(100vh - 50px)" }}>
        <Allotment defaultSizes={[100, 100]}>
          <Allotment.Pane minSize={300}>
            <CodeEditor></CodeEditor>
          </Allotment.Pane>
          <Allotment.Pane minSize={0}>
            <Preview></Preview>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
}
