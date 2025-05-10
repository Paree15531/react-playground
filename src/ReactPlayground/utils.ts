import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import { Files } from "./PlaygroundContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const fileName2Language = (name: string) => {
  const suffix = name.split(".").pop() || "";
  if (["js", "jsx"].includes(suffix)) return "javascript";
  if (["ts", "tsx"].includes(suffix)) return "typescript";
  if (["json"].includes(suffix)) return "json";
  if (["css"].includes(suffix)) return "css";
  return "javascript";
};

//压缩url地址中的hash内容
//这个函数用于将字符串数据压缩并转换为base64编码的字符串
export function compress(data: string) {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(zipped, true);
  return btoa(binary);
}

//解析压缩后的hash内容
export function uncompress(base64: string) {
  const binary = atob(base64);
  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
}

//下载文件
// 下载文件功能函数
// 接收一个Files对象，将所有文件压缩成一个zip文件并触发下载
export function downloadFiles(files: Files) {
  // 创建一个新的JSZip实例，用于压缩文件
  const zip = new JSZip();

  // 遍历files对象中的所有文件
  // 将每个文件添加到zip压缩包中
  // name是文件名，files[name].value是文件内容
  Object.keys(files).forEach((name) => {
    zip.file(name, files[name].value);
  });

  // 生成blob类型的压缩文件
  zip.generateAsync({ type: "blob" }).then((res) => {
    saveAs(res, `code${Math.random().toString().slice(2, 8)}.zip`);
  });

  // 使用saveAs触发文件下载
  // 文件名为 "code" + 随机6位数字 + ".zip"
}
