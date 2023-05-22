import * as vscode from "vscode";
import axios, { AxiosHeaders } from "axios";
import * as https from "https";
import * as http from "http";
import "./extension";
// 解决https证书报错
// axios在vscode里不行
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const httpAgent = new http.Agent({});
// let ques: string = "hello";

export async function activate(context: vscode.ExtensionContext) {
  try {
    vscode.window.showInformationMessage("欢迎来到Onion的VScode插件!");
  } catch (e) {
    console.log(e);
  }

  let disposable = vscode.commands.registerCommand(
    "quick-search-plus.qs",
    async () => {
      const list: string[] = ["快速搜索", "热搜", "About Me"];
      const inputs: any = await vscode.window.showQuickPick(list, {
        matchOnDetail: true,
      });
      if (inputs === "About Me") {
        const myWeb: any = "https://bigonion.cn";
        vscode.env.openExternal(myWeb);
      }
      if (inputs === "快速搜索") {
        vscode.window
          .showInputBox({
            // 这个对象中所有参数都是可选参数
            password: false, // 输入内容是否是密码
            ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
            placeHolder: "你到底想输入什么？", // 在输入框内的提示信息
            prompt: "赶紧输入，不输入就赶紧滚", // 在输入框下方的提示信息
            // validateInput:function(text){return text;} // 对输入内容进行验证并返回
          })
          .then(function (msg: any) {
            console.log("用户输入：" + msg);
            if (msg) {
              msg = "https://cn.bing.com/search?q=" + msg;
              vscode.env.openExternal(msg);
            }
          });
      }
      if (inputs === "热搜") {
        axios({
          url: "https://tenapi.cn/resou/",
          method: "POST",
        })
          .then((e: any) => {
            // console.log(e.data.list);
            let resouList = [];
            for (let i = 0; i <= 20; i++) {
              resouList.push(e.data.list[i].name);
            }
            return vscode.window.showQuickPick(resouList);
          })
          .then((e: any) => {
            if (e) {
              e = "https://cn.bing.com/search?q=" + e;
              vscode.env.openExternal(e);
            }
          });
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function askGPT(ques: string): any {
  let answer: any | string;
  const req = https.request(
    {
      hostname: "api.bigonion.cn",
      path: "/",
      port: 443,
      method: "POST",
      rejectUnauthorized: false,
    },
    (res) => {
      // res.on("data", (e) => {
      //   console.log(JSON.parse(e.toString()).bot);
      //   answer = JSON.parse(e.toString()).bot.toString();
      // });
    }
  );
  req.write(ques, (e) => {
    console.log(e);
  });
  req.end();
  return answer;
}

async function axiosGPT(ques: string) {
  const a = await axios({
    url: "http://api.bigonion.cn",
    method: "POST",
    data: { prompt: `${ques}` },
    httpsAgent: httpsAgent,
    httpAgent: httpAgent,
  });
  return a;
}
