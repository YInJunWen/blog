const fs = require("fs");
const path = require("path");
const os = require("os");

console.log(
  "begin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
);
console.log("");

const docPath = path.resolve(__dirname, "./docs");
const menuFile = path.resolve(__dirname, "./readme.md");
let fiels;
try {
  allFiles = fs.readdirSync(docPath);
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

// 过滤掉以点开头的文件夹
let files = allFiles.filter(item => {
  return !/^\./.test(item);
});

let errorFile = [];
ws.write(
  `# 目录 (一共 ${files.length} 篇文章)${os.EOL}${os.EOL}|标题|修改时间|详情|${
    os.EOL
  }|---|---|---|${os.EOL}`,
  () => {
    generator(files);
  }
);

function generator(fileList, index = 0) {
  if (!fileList[index]) {
    ws.end();
    console.log(``);
    console.log(`all success,一共 ${index} 篇文章${os.EOL}${os.EOL}`);
    if (errorFile.length > 0) {
      console.log(`以下 ${errorFile.length} 个文件未找到标题${os.EOL}`);
      console.log(errorFile.join(`${os.EOL}`));
    }
    return false;
  }
  let realPath = path.resolve(docPath, "./" + fileList[index] + "/readme.md");

  // console.log(realPath);
  fs.readFile(realPath, "utf8", (err, data) => {
    let title = data.match(/^#\ (.*)/g);
    if (!title) {
      // console.log(`${realPath}文件中未找到标题`);
      errorFile.push(realPath);
      generator(fileList, ++index);
    } else {
      if (title) {
        title = title[0].replace("# ", "");
        console.log("");
        console.log(title);

        let state = fs.statSync(realPath);
        // console.log(JSON.stringify(state.mtime));
        const mtime = formatDate(state.mtime);

        let wsData = `|${title}|${mtime}|[详情](./docs/${
          fileList[index]
        }/index.md)|${os.EOL}`;
        ws.write(wsData, (err, data) => {
          if (err) {
            throw new Error(`write function failed at ${file[index]}`);
            return false;
          }
          generator(fileList, ++index);
        });
      }
    }
  });
}

function formatDate(date) {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "-" +
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    " " +
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
    ":" +
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
  );
}
