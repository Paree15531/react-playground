import { setupTypeAcquisition } from "@typescript/ata";
import typescript from "typescript";

//分析代码用到的类型包
export function createATA(onDownLoad: (code: string, path: string) => void) {
  const ata = setupTypeAcquisition({
    projectName: "my-ata",
    typescript,
    logger: console,
    delegate: {
      receivedFile(code, path) {
        onDownLoad(code, path);
      },
    },
  });
  return ata;
}
