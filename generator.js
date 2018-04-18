const fs = require("fs");
const path = require("path");
console.log(
  "begin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
);
console.log("");

const docPath = path.resolve(__dirname, "./doc");
const menuFile = path.resolve(__dirname, "./readme.md");
let fiels;
try {
  files = fs.readdirSync(docPath);
} catch (err) {
  console.log(err);
}
let state = fs.exists(menuFile);
if (state) {
  fs.unlink(menuFile);
  fs.unlinkSync(menuFile);
}
// 创建输入流
let ws = fs.createWriteStream(menuFile, {
  flags: "w+",
  encoding: "utf8",
  fd: null,
  mode: 0o666,
  autoClose: true
});
files.forEach((element, index) => {
  console.log(element);
  let realPath = path.resolve(docPath, "./" + element);
  console.log(realPath);
  fs.readFile(realPath, "utf8", (err, data) => {
    let title = data.match(/^#\ (.*)/g);
    if (!title) {
      console.log(`${realPath}文件中未找到标题`);
    }
    if (title) {
      title = title[0].replace("# ", "");
      console.log(title);
      let wsData = `[${title}](./doc/${element})\r\n`;
      ws.write(wsData, (err, data) => {
        console.log(wsData);
      });
    }
    if (index == files.length - 1) {
      ws.end();
    }
  });
});
