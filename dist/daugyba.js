"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer((req, res) => {
    const url = req.url;
    console.log(url);
    const method = req.method;
    console.log(method);
    //Daugiklio pasirinkimas
    let daugiklis = 1;
    if (url != null) {
        daugiklis = parseInt(url === null || url === void 0 ? void 0 : url.split("/")[1]);
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('vartotojas', 'jonas');
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write("<head>");
    res.write("<title>Daugybos lentele</title>");
    res.write("</head>");
    res.write("<body>");
    for (let i = 1; i <= 10; i++) {
        res.write(`<a href="/${i}">${i}</a>&nbsp;&nbsp;`);
    }
    res.write(`<h1>${daugiklis} Daugybos lentele</h1>`);
    res.write("<table border='1'>");
    for (let i = 1; i <= 10; i++) {
        res.write("<tr>");
        res.write(`<td>${i}</td><td>*</td><td>${daugiklis}</td><td>=</td><td>${i * daugiklis}</td>`);
        res.write("</tr>");
    }
    res.write("</table>");
    res.write("<body>");
    res.write("</html>");
    res.end();
});
server.listen(2999, 'localhost');
