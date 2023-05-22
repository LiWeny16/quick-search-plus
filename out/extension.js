"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const https = require("https");
const http = require("http");
require("./extension");
// 解决https证书报错
// axios在vscode里不行
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const httpAgent = new http.Agent({});
// let ques: string = "hello";
async function activate(context) {
    try {
        vscode.window.showInformationMessage("欢迎来到Onion的VScode插件!");
    }
    catch (e) {
        console.log(e);
    }
    let disposable = vscode.commands.registerCommand("quick-search-plus.qs", async () => {
        const list = ["快速搜索", "热搜", "About Me"];
        const inputs = await vscode.window.showQuickPick(list, {
            matchOnDetail: true,
        });
        if (inputs === "About Me") {
            const myWeb = "https://bigonion.cn";
            vscode.env.openExternal(myWeb);
        }
        if (inputs === "快速搜索") {
            vscode.window
                .showInputBox({
                // 这个对象中所有参数都是可选参数
                password: false,
                ignoreFocusOut: true,
                placeHolder: "你到底想输入什么？",
                prompt: "赶紧输入，不输入就赶紧滚", // 在输入框下方的提示信息
                // validateInput:function(text){return text;} // 对输入内容进行验证并返回
            })
                .then(function (msg) {
                console.log("用户输入：" + msg);
                if (msg) {
                    msg = "https://cn.bing.com/search?q=" + msg;
                    vscode.env.openExternal(msg);
                }
            });
        }
        if (inputs === "热搜") {
            (0, axios_1.default)({
                url: "https://tenapi.cn/resou/",
                method: "POST",
            })
                .then((e) => {
                // console.log(e.data.list);
                let resouList = [];
                for (let i = 0; i <= 20; i++) {
                    resouList.push(e.data.list[i].name);
                }
                return vscode.window.showQuickPick(resouList);
            })
                .then((e) => {
                if (e) {
                    e = "https://cn.bing.com/search?q=" + e;
                    vscode.env.openExternal(e);
                }
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function askGPT(ques) {
    let answer;
    const req = https.request({
        hostname: "api.bigonion.cn",
        path: "/",
        port: 443,
        method: "POST",
        rejectUnauthorized: false,
    }, (res) => {
        // res.on("data", (e) => {
        //   console.log(JSON.parse(e.toString()).bot);
        //   answer = JSON.parse(e.toString()).bot.toString();
        // });
    });
    req.write(ques, (e) => {
        console.log(e);
    });
    req.end();
    return answer;
}
async function axiosGPT(ques) {
    const a = await (0, axios_1.default)({
        url: "http://api.bigonion.cn",
        method: "POST",
        data: { prompt: `${ques}` },
        httpsAgent: httpsAgent,
        httpAgent: httpAgent,
    });
    return a;
}
//# sourceMappingURL=extension.js.map