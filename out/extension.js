"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const https = require("https");
const http = require("http");
require("./extension");
const jwt = require("jsonwebtoken");
// 解决https证书报错
// axios在vscode里不行
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const httpAgent = new http.Agent({});
// let ques: string = "hello";
async function activate(context) {
    try {
        // vscode.window.showInformationMessage(a);
    }
    catch (e) {
        console.log(e);
    }
    let quickSearchCommon = vscode.commands.registerCommand("quick-search-plus.qs", async () => {
        // choices
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
                prompt: "赶紧输入，不输入就关掉！", // 在输入框下方的提示信息
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
    let quickGPT = vscode.commands.registerCommand("quick-search-plus.qGPT", async () => {
        vscode.window
            .showInputBox({
            password: false,
            ignoreFocusOut: false,
            placeHolder: "OPENAI READY",
            prompt: "请输入你的问题", // 在输入框下方的提示信息
            // validateInput:function(text){return text;} // 对输入内容进行验证并返回
        })
            .then((e) => {
            try {
                // e 是问题
                if (e) {
                    thinkEvent(true); //思考
                    askGPT(e, "gpt-3.5-turbo-0301").then((e) => {
                        // console.log(e.data.choices[0]);
                        vscode.window.showInformationMessage(e.data.choices[0].message.content);
                        thinkEvent(false); //结束思考
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    });
    let quickGPT4 = vscode.commands.registerCommand("quick-search-plus.qGPT4.0", async () => {
        let _token_ = getConfigValue("GPT4.0token");
        try {
            if (!_token_ || !normalDecode(_token_, "iloveJavascript&")) {
                vsAlert("请填入正确的token");
                return;
            }
        }
        catch (error) {
            vsAlert("请填入正确的token");
            return;
        }
        vscode.window
            .showInputBox({
            password: false,
            ignoreFocusOut: false,
            placeHolder: "OPENAI READY",
            prompt: "请输入你的问题", // 在输入框下方的提示信息
            // validateInput:function(text){return text;} // 对输入内容进行验证并返回
        })
            .then((e) => {
            try {
                if (e) {
                    thinkEvent(true); //思考
                    askGPT(e, normalDecode(_token_, "iloveJavascript&").type).then((e) => {
                        // console.log(e.data.choices[0]);
                        vscode.window.showInformationMessage(e.data.choices[0].message.content);
                        thinkEvent(false); //结束思考
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    });
    // 注册命令区
    context.subscriptions.push(quickSearchCommon);
    context.subscriptions.push(quickGPT);
    context.subscriptions.push(quickGPT4);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function askGPT(ques, token) {
    // token=token?"gpt-3.5-turbo-0301":""
    return (0, axios_1.default)({
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Content-Type": "application/json",
        },
        httpsAgent: httpsAgent,
        method: "POST",
        url: "https://q.icodef.com/v1/chat/completions",
        data: `{
  "token": "6spM5IRmrXskQHMA",
  "model":"${token}",
  "stream":false,
  "ret_usage":false,
  "messages": [
    {
      "role": "user",
      "content": "${ques}",
      "createtime": ${Date.now()},
      "name": "Onion"
    }
  ],
  "use_context": true
}
`,
    });
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
/**
 * @description getVscode Config
 * @param name
 * @returns config value
 */
function getConfigValue(name) {
    return vscode.workspace.getConfiguration("bigonion").get(name);
}
/**
 * @description JWT
 */
function normalDecode(token, secret) {
    let decoded = jwt.verify(token, secret);
    // console.log(decoded)
    return decoded;
}
function vsAlert(e) {
    vscode.window.showInformationMessage(e);
}
function thinkEvent(startOrEnd) {
    let dots = "...";
    // start 1 end 0
    if (startOrEnd) {
        vscode.window.setStatusBarMessage("chatGPT is thinking" + dots);
    }
    else {
        vscode.window.setStatusBarMessage(" ");
    }
}
//# sourceMappingURL=extension.js.map