"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
//kintamasis kuris rodo ar mes prisijungia prie duomenu bazes
let connected = false;
//Si dalus sukuria prisijungima prie duomenu bases 
const con = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "LabasRytas",
    port: 3306,
    database: "students"
});
//Prisijungi apire duomenu bases
// con.connect();
// con.connect(funkcija kuri bus vykdoma po prisijungimo)
con.connect((error) => {
    if (error)
        throw error;
    //Po prisijungimo be klaidos, nustatome jog esame prisijunge prie DB
    connected = true;
    console.log("Prisijungta");
});
//sukuriame http serveri ir paduodame funkcija kuri bus vygdoma kai ateis uzklausa
const server = http_1.default.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    /*
    //Jei kaskas atejo i puslapi su GET metodu i url: localhost:2999/students, Galime jam issiusti JSON formatu duomenis
    if (url=='/students' && method=='GET'){
    if (connected){
    con.query<Student[]>("SELECT * FROM students WHERE sex='vyras' ORDER BY name ASC", (error, result)=>{
            if (error) throw error;
            res.setHeader("Content-Type", "text/JSON; charset=utf-8");
            res.write(JSON.stringify(result));
    
            res.end();
    });
    }
    }
    */
    //Dalis skirta statiniem failam isvesti
    //Jei kaskas atejo i puslapi su GET metodu i url: localhost:2999/students, issiunciame jam studentu sarasa HTML formatu
    if (url == '/students' && method == 'GET') {
        if (connected) {
            con.query("SELECT * FROM students ORDER BY name ASC", (error, result) => {
                if (error)
                    throw error;
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                let rows = "";
                result.forEach((s) => {
                    rows += "<tr>";
                    rows += `<td>${s.name}</td> <td>${s.surname}</td> <td>${s.phone}</td> <td> <a href='/student/${s.id}' class="btn btn-success">Plačiau</a></td>`;
                    rows += "</tr>";
                });
                let template = fs_1.default.readFileSync('templates/students.html').toString();
                template = template.replace('{{ students_table }}', rows);
                res.write(template);
                res.end();
            });
        }
    }
    //Vieno studento atvaizdavimas, kai url = localhost:2999/student/5
    if ((url === null || url === void 0 ? void 0 : url.split("/")[1]) == 'student') {
        //pasiimame is url id
        let id = parseInt(url === null || url === void 0 ? void 0 : url.split("/")[2]);
        con.query(`SELECT * FROM students WHERE id=${id};`, (error, result) => {
            if (error)
                throw error;
            let student = result[0];
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            let template = fs_1.default.readFileSync('templates/student.html').toString();
            template = template.replace("{{name}}", student.name);
            template = template.replace("{{surname}}", student.surname);
            template = template.replace("{{phone}}", student.phone != null ? student.phone : '-');
            template = template.replace("{{sex}}", student.sex != null ? student.sex : '-');
            template = template.replace("{{birthday}}", student.birthday != null ? student.birthday.toLocaleDateString() : '-');
            template = template.replace("{{email}}", student.email != null ? student.email : '-');
            res.write(template);
            res.end();
        });
    }
});
//Paleidziame serveri
server.listen(2999, 'localhost');
