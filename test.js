const http = require('http');  // 引入 HTTP 模块

const data = 'id=1&name=Louis';  // 要发送的内容
// 使用 request 方法发送 POST 请求
const req = http.request({
  hostname: 'localhost',
  path: '/php/test/api.php',
  port: 80,
  method: 'POST',
}, res => {
  // 如果状态码不是 200 就输出状态码
  if (res.statusCode !== 200) console.log(res.statusCode);

  res.on('data', d => {
    // 把接收到的内容转为字符串在控制台输出
    console.log(d.toString())
  });
});

// 设置要发送的内容
req.write(data);
// 如果出错就在控制台输出错误信息
req.on('error', err => {
  console.log(err);
});

req.end();  // 结束