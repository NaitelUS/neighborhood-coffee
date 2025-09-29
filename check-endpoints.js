import fs from "fs";
import path from "path";

// 🧭 Directorio base a escanear — ajusta si tus archivos están en otro lugar
const ROOT_DIR = "./src";

// 🧩 Expresión regular para detectar URLs de funciones Netlify
const NETLIFY_FUNCTION_REGEX = /\.netlify\/functions\/[A-Za-z]+/g;

// 🧰 Función recursiva para escanear archivos
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const matches = content.match(NETLIFY_FUNCTION_REGEX);

      if (matches) {
        for (const match of matches) {
          // Detecta si hay mayúsculas en el endpoint
          const endpoint = match.split("/").pop();
          if (/[A-Z]/.test(endpoint)) {
            console.warn(`⚠️  Mayúscula detectada en: ${match}`);
            console.log(`   📂 Archivo: ${fullPath}`);
          } else {
            console.log(`✅ Correcto: ${match}`);
          }
        }
      }
    }
  }
}

console.log("🔍 Escaneando proyecto en busca de endpoints Netlify con mayúsculas...");
scanDir(ROOT_DIR);
console.log("✅ Escaneo completado.");
