import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

//SETTING UP DATABASE HALF
import Database from 'better-sqlite3';
const db = new Database('./library.db'); //connect to DB

//NETWORKING HALF
const port = 1234;
// Helper to get the current folder path
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function openFile(name: string, res: http.ServerResponse, sType: string):void {
    console.log("serving file");
    const filePath = path.join(dirname, name);
    console.log('file', filePath);

    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end("File Not Found");
        return;
    }

    let conType = "application/pdf";
    if (sType=== "video"){
        conType = "video/mp4";
    }
    res.writeHead(200, {
        "Content-Type": conType,
        "Content-Disposition": "inline"
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    readStream.on('error', (err) => {
        console.error("Stream error:", err);
        res.end("");
    });

}

type Resource = {
    title: string;
    author: string;
    subject: string;
    year: string;
    file_type: string;
    file_path: string;
}

function searchFile(searchTerm: string):Resource[] {
    const statement = db.prepare("SELECT * FROM resources WHERE resources MATCH ? LIMIT 3");
    const files = statement.all(searchTerm);
    console.log(files);
    return files as Resource[]
}

let server = http.createServer((req,res)=>{
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const searchTerm = url.searchParams.get('term');
    const searchPath = url.searchParams.get('file');
    const searchType = url.searchParams.get('type') as string;

    if (url.pathname === '/open' && searchPath){
        openFile(searchPath, res, searchType);
        return; 
    }

    res.writeHead(200, {"Content-Type":"text/html"});

    res.write(`
        <center>
        <h1>The Library</h1>
        <p>Welcome! Search for any book you need...</p> 
        <form action="/search" method="GET">
        <input
            name = "term"
            aria-label="Search for a place on the map"
            autocomplete="off"
            inputmode="search"
            placeholder="And Then There Were None"
            type="search"
        />
        <button type = "submit"> Search </button>
        </form>
    `);
    let tableRows;

    if (url.pathname === '/search' && searchTerm) {
        console.log(searchTerm);
        const files = searchFile(searchTerm);
        if (files.length == 0){
            res.write(`<p>No matching resource</p>`);
            res.end('</center>');
            return;
        } else {
            res.write(`<p>Search Results:</p>`);
            tableRows = files.map(f => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    <strong>${f.title}</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    ${f.author}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    <form action="/open" method="GET" target="_blank" style="margin:0;">
                        <input type="hidden" name="file" value="${f.file_path}" />
                        <input type="hidden" name="type" value="${f.file_type}" />
                        <button type="submit">View</button>
                    </form>
                </td>
            </tr>
            `).join('');
        }
    }else{
        const statement = db.prepare("SELECT * FROM resources LIMIT 4");
        const files = statement.all() as Resource[];
        res.write(`<p>Some Popular Resources:</p>`);
        tableRows = files.map(book => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    <strong>${book.title}</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    ${book.author}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    <form action="/open" method="GET" target="_blank" style="margin:0;">
                        <input type="hidden" name="file" value="${book.file_path}" />
                        <button type="submit">View</button>
                    </form>
                </td>
            </tr>
            `).join('');


    }

    // Wrap the rows in the table structure with headers
            const tableHTML = `
                <table style="width: 80%; margin: 20px auto; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 12px; border-bottom: 2px solid #333;">Title</th>
                            <th style="padding: 12px; border-bottom: 2px solid #333;">Author</th>
                            <th style="padding: 12px; border-bottom: 2px solid #333;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;

    res.write(tableHTML);
    res.end('</center>');
}).listen(port, "0.0.0.0");

server.on('error', ()=>{
    console.log("There was an error");
})
server.on('listening', ()=>{
    console.log("Server is listening on port ", port);
})

