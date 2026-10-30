/*
 * Server tĩnh cho Bắc Đẩu (Lịch vạn niên / Tử Vi).
 * Chạy:  node server/server.js   (mặc định http://localhost:8080, đổi cổng bằng biến môi trường PORT)
 * Prompt: server/prompt.txt (tùy chọn, thay prompt mặc định trong js/tuvi-prompt.js) – không phục vụ dạng file tĩnh; trình duyệt chỉ lấy được qua GET /api/prompt (nút "Copy prompt").
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import '../js/tuvi-prompt.js';   // gán globalThis.TuViPrompt (dùng chung với trình duyệt)

const { DEFAULT_SYSTEM } = globalThis.TuViPrompt;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8080);
const PROMPT_FILE = path.join(__dirname, 'prompt.txt');

function readPrompt() {
  try { return fs.readFileSync(PROMPT_FILE, 'utf8').trim(); } catch (e) { return ''; }
}

/* ---------- Static ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8' };

function serveStatic(req, res) {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  if (p.startsWith('/server/')) { res.writeHead(403); res.end('Forbidden'); return; } // không lộ mã server / prompt
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (url.pathname === '/api/prompt') {   // prompt để người dùng tự copy sang Gemini / ChatGPT
    const p = readPrompt();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ prompt: p || DEFAULT_SYSTEM, custom: !!p }));
    return;
  }
  serveStatic(req, res);
}).listen(PORT, () => {
  console.log(`Bắc Đẩu: http://localhost:${PORT}  (prompt: ${readPrompt() ? 'server/prompt.txt' : 'mặc định'})`);
});
