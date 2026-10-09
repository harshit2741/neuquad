import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
await esbuild.build({
  entryPoints: [path.join(root, "src/main.jsx")],
  bundle: true, minify: true, format: "iife", target: "es2019",
  outdir: path.join(root, "dist/tmp"),
  jsxFactory: "React.createElement", jsxFragment: "React.Fragment", loader: { ".jsx": "jsx" },
  alias: { "react": path.join(root, "build/react-shim.js"), "react-dom/client": path.join(root, "build/react-dom-shim.js") },
  logLevel: "warning",
});
const js = fs.readFileSync(path.join(root, "dist/tmp/main.js"), "utf8").replace(/<\/script/gi, "<\\/script");
const css = fs.readFileSync(path.join(root, "dist/tmp/main.css"), "utf8");
const html = `<title>NeuSquad Prototype</title>
<meta name="description" content="Clickable concept prototype of NeuSquad, a squad layer inside Tata Neu for students.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,800&family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>${css}</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>${js}</script>
`;
fs.writeFileSync(path.join(root, "dist/neusquad.html"), html);
// local preview with full document skeleton
fs.writeFileSync(path.join(root, "dist/preview.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>${html}</body></html>`);
console.log("built", (html.length/1024).toFixed(1), "KB");
