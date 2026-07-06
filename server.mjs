// Minimal zero-dependency static file server for the Home Matter Labs site.
import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { extname, join, normalize } from "node:path"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname)
    if (urlPath === "/") urlPath = "/index.html"

    // Allow extensionless routes like /about -> /about.html
    let filePath = normalize(join(__dirname, urlPath))
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403)
      res.end("Forbidden")
      return
    }

    let ext = extname(filePath)
    if (!ext) {
      filePath += ".html"
      ext = ".html"
    }

    try {
      const info = await stat(filePath)
      if (info.isDirectory()) {
        filePath = join(filePath, "index.html")
        ext = ".html"
      }
    } catch {
      // fall through to 404 handling below
    }

    const data = await readFile(filePath)
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" })
    res.end(data)
  } catch {
    try {
      const notFound = await readFile(join(__dirname, "404.html"))
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
      res.end(notFound)
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
      res.end("404 Not Found")
    }
  }
})

server.listen(PORT, () => {
  console.log(`[v0] Home Matter Labs static server running on http://localhost:${PORT}`)
})
