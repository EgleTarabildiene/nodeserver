"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// HTTP biblioteka skirta HTTP serveriams
const fs = __importStar(require("fs"));
// Failinės sistemos biblioteka skirta darbui su failais
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
//Susikuriame serverio objektą
const server = http_1.default.createServer((req, res) => {
    const method = req.method;
    const url = req.url;
    console.log(`Metodas: ${method}, URL: ${url}`);
    let filePath = `public${url}`;
    //fs.existsSync("kelias iki failo") -patikrina ar failas egzistuoja,
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        console.log(path_1.default.extname(filePath));
        // res.setHeader("Content-Type", "image/jpg; charset=utf-8");
        let file = fs.readFileSync(filePath);
        res.write(file);
        // res.write("body{background-color:red!important;}");
        return res.end();
    }
    if (url == '/calculate' && method == 'POST') {
        //Saugomi duomenų "gabalai"
        const reqBody = [];
        //Funkcija kuri iškviečiama kai gaunamas duomenų gabalas
        req.on('data', (d) => {
            console.log(`Gaunami duomenys`);
            console.log(`Duomenys: ${d}`);
            //Kiekvieną duomenų gabalą įdedame į masyvą
            reqBody.push(d);
        });
        //Funkcija kuri iškviečiama kai baigiami siųsti duomenys (visi duomenų gabalai gauti)
        req.on('end', () => {
            console.log(`Baigti siųsti duomenys`);
            //Sujungiame visus gabalus į vieną sąrašą ir paverčiame į string'ą
            const reqData = Buffer.concat(reqBody).toString();
            const va = reqData.split('&');
            const x = parseFloat(va[0].split('=')[1]);
            const y = parseFloat(va[1].split('=')[1]);
            console.log(`Visi gauti duomenys: ${reqData}`);
            console.log(va);
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            //Nuskaitome failą result.html (į buffer tipo kintamąjį, ir paverčiame į stringą)
            let template = fs.readFileSync('templates/result.html').toString();
            //Pakeičiame tekstą template {{ result }} į suskaičiuotą rezultatą 
            template = template.replace('{{ result }}', `Rezultatas: ${x * y}`);
            res.write(template);
            res.end();
        });
        return;
    }
    if (url == '/') {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        const template = fs.readFileSync('templates/index.html');
        res.write(template);
        return res.end();
    }
    //Jei puslapis nebuvo rastas
    res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8"
    });
    const template = fs.readFileSync('templates/404.html');
    res.write(template);
    return res.end();
});
server.listen(2999, 'localhost');
