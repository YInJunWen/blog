const fs = require("fs");
const path = require("path");
const os = require("os");

const originDirectory = path.resolve(__dirname, "./docs");
const targetDirectory = path.resolve(__dirname, "./dist");

// 读取文件
// 获取文件名
// 创建同名文件夹
// 移动文件并修改文件名为index.md
let allFiles, files;
try {
  allFiles = fs.readdirSync(originDirectory);
} catch (err) {
  console.log(err);
}
// console.log(files);
files = allFiles.filter(item => {
  return !/^\./.test(item);
});
// console.log(files);
move(files, 0);

function move(fileList, index) {
  if (!fileList[index]) {
    return false;
  }
  const currentFile = path.resolve(
    originDirectory,
    "./" + fileList[index] + "/index.md"
  );
  const option = path.parse(currentFile);
  const targetFile = path.resolve(
    originDirectory,
    "./" + fileList[index] + "/readme.md"
  );
  // console.log(currentFile, targetFile);
  // move(fileList, ++index);
  fs.rename(currentFile, targetFile, err => {
    if (err) {
      console.log("文件移动失败");
      return false;
    }
    console.log("文件移动成功");
    move(fileList, ++index);
  });
}
