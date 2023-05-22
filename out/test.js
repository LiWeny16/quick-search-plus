"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
async function name(params) {
    const res = await axios_1.default.get("https://bigonion.cn");
    console.log(res);
}
name(1);
//# sourceMappingURL=test.js.map