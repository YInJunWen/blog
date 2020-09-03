const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('begin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
console.log('');

const docPath = path.resolve(__dirname, './docs');
const menuFile = path.resolve(__dirname, './readme.md');
let fiels;
try {
    allFiles = fs.readdirSync(docPath);
} catch (err) {
    console.log(err);
}
let state = fs.existsSync(menuFile);
if (state) {
    fs.unlinkSync(menuFile);
}
// 创建输入流
let ws = fs.createWriteStream(menuFile, {
    flags: 'w+',
    encoding: 'utf8',
    fd: null,
    mode: 0o666,
    autoClose: true,
});

// 过滤掉以点开头的文件夹
let files = allFiles.filter((item) => {
    return !/^\./.test(item);
});

let errorFile = [];
ws.write(`# 目录 (一共 ${files.length} 篇文章)${os.EOL}${os.EOL}|标题|日期|详情|${os.EOL}|---|---|---|${os.EOL}`, () => {
    generator(files);
});

const articleList = [];
function generator(fileList, index = 0) {
    if (!fileList[index]) {
        // ws.end();
        // console.log(articleList);
        articleList.sort((a, b) => {
            return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        });
        let wsData = ``;
        articleList.forEach((item) => {
            console.log(item.createTime);
            wsData += `|${item.title}|${item.createTime}|[详情](${item.path})|${os.EOL}`;
        });
        console.log(wsData);

        ws.write(wsData, (err, data) => {
            if (err) {
                throw new Error(`write function failed at ${file[index]}`);
                return false;
            }
        });
        console.log(``);
        console.log(`all success,一共 ${index} 篇文章${os.EOL}${os.EOL}`);
        if (errorFile.length > 0) {
            // console.log(`以下 ${errorFile.length} 个文件未找到标题${os.EOL}`);
            console.log(`${os.EOL}`);
            console.log(errorFile.join(`${os.EOL}`));
        }

        return false;
    }
    let realPath = path.resolve(docPath, './' + fileList[index] + '/readme.md');
    // console.log(realPath);
    let fileExists = fs.existsSync(realPath);
    if (!fileExists) {
        errorFile.push('未找到文件: ' + realPath);
        generator(fileList, ++index);
    } else {
        fs.readFile(realPath, 'utf8', (err, data = '') => {
            // console.log('data', data);
            let title = data.match(/^#\ (.*)/gm);
            if (!title) {
                errorFile.push('未找到标题: ' + realPath);
                generator(fileList, ++index);
            } else {
                title = title[0].replace('# ', '');
                console.log('');
                // console.log(title);
                let createTime = data.match(/Date:\ (.*)\ /);
                // console.log(createTime);
                // console.log(JSON.stringify(state.mtime));
                // const mtime = formatDate(state.mtime);
                if (!createTime) {
                    errorFile.push('未找到日期: ' + realPath);
                    generator(fileList, ++index);
                    return false;
                }
                articleList.push({
                    title,
                    createTime: createTime[1],
                    path: `./docs/${fileList[index]}`,
                });

                generator(fileList, ++index);
            }
        });
    }
}

function formatDate(date) {
    return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    );
}
