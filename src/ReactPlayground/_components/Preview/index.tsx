import { useContext, useEffect, useRef, useState } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
import { compile } from "./compiler.worker";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { Message } from "../Message";
import CompilerWorker from "./compiler.worker?worker";
import { debounce } from "lodash-es";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

export default function Preview() {
  const compilerWorkerRef = useRef<Worker | null>(null);
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState("");
  const getIframeUrl = () => {
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };

  //错误消息
  const [errorMsg, setErrorMsg] = useState<string>("");

  //错误监听处理函数
  const handleErrorMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type == "ERROR") {
      setErrorMsg(message);
    }
  };
  useEffect(() => {
    if (!compilerWorkerRef.current) {
      compilerWorkerRef.current = new CompilerWorker();
      compilerWorkerRef.current.addEventListener("message", (data) => {
        console.log("worker", data);
        if (data.type === "COMPILED_CODE") {
          setCompiledCode(data.data);
        } else {
          //console.log('error', data);
        }
      });
    }
  }, []);
  useEffect(
    debounce(() => {
      compilerWorkerRef.current?.postMessage(files);
    }, 500),
    [files]
  );
  useEffect(() => {
    window.addEventListener("message", handleErrorMessage);
    return () => {
      window.removeEventListener("message", handleErrorMessage);
    };
  }, []);

  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

  useEffect(() => {
    const res = compile(files);
    setCompiledCode(res);
  }, [files]);

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

  return (
    <div style={{ height: "100%" }}>
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
        }}
      />
      {<Message type="error" content={errorMsg} />}
      {/* <Editor file={{
            name: 'dist.js',
            value: compiledCode,
            language: 'javascript'
        }}/> */}
    </div>
  );
}
