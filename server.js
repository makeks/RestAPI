import { createServer } from 'node:http';
import { getAllNotes, createNote, deleteNote, updateNote } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.statusCode = 200;
        res.end();
        return;
    }
    if (req.url === '/script.js' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'script.js');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading JS');
                return;
            }
            res.setHeader('Content-Type', 'application/javascript');
            res.end(data);
        });
        return;
    }
    if (req.url === '/notes' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getAllNotes()));
    return;
    }

    if (req.url === '/notes' && req.method === 'POST') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(body);
            const rawDataString = buffer.toString();
            const data = JSON.parse(rawDataString);
            const createdNote = createNote(data);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(createdNote));
        });
        return;
    }

    if (req.url === '/notes' && req.method === 'PATCH') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(body);
            const rawDataString = buffer.toString();
            const data = JSON.parse(rawDataString);
            const result = updateNote(data);
            if (!result) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: "False" }));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        });
        return;
    }

    if (req.url === '/notes' && req.method === 'DELETE') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(body);
            const rawDataString = buffer.toString();
            const data = JSON.parse(rawDataString);
            const result = deleteNote(data.id);
            if (!result) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: "Fail" }));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: "Success" }));
        });
        return;
    }
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Page not found' }));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
