import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const config = JSON.parse(await readFile(new URL('./vercel.json', import.meta.url), 'utf8'));
const headers = Object.fromEntries(config.headers[0].headers.map(({key,value}) => [key,value]));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.webmanifest':'application/manifest+json','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const port = Number(process.env.PORT || 4280);
const server = createServer(async (req,res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, headers);res.end('Method not allowed');return;}
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/index.html') {res.writeHead(308, {...headers, Location:'/'});res.end();return;}
    const file = resolve(root, path === '/' ? 'index.html' : '.' + path);
    if (!file.startsWith(resolve(root) + sep)) {res.writeHead(404, headers);res.end('Not found');return;}
    const body = await readFile(file);
    res.writeHead(200, {...headers,'Content-Type':types[extname(file)] || 'application/octet-stream'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : ['ENOENT','EISDIR'].includes(error.code) ? 404 : 500;
    res.writeHead(status, headers);res.end(status === 404 ? 'Not found' : 'Request failed');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Puro: http://127.0.0.1:${server.address().port}`));
