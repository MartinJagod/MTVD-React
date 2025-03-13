const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const SERVER_IP = "193.203.182.77"; // 🔹 Usamos la IP FIJA del servidor

// 🔹 Habilitar CORS para acceso desde cualquier dispositivo
app.use(cors({ origin: "*" }));

// 🔹 Definir la ruta donde están las imágenes
const IMAGES_PATH = path.join(__dirname, "../build/assets/images");
const FOLDERS = ["design", "architecture", "branding"];

console.log(`✅ Servidor corriendo en: http://${SERVER_IP}:${PORT}`);
console.log(`📁 Directorio de imágenes: ${IMAGES_PATH}`);

// ✅ 1. API para obtener imágenes de una carpeta específica
app.get("/api/images/:folder", (req, res) => {
    try {
        let folder = decodeURIComponent(req.params.folder).replace(/\s+/g, "").trim();
        console.log(`🛠 (DEV) Buscando imágenes en la carpeta: "${folder}"`);
        const directoryPath = path.join(IMAGES_PATH, folder);

        if (!fs.existsSync(directoryPath)) {
            console.warn(`⚠ La carpeta ${folder} no existe.`);
            return res.status(404).json({ error: "Carpeta no encontrada." });
        }

        const files = fs.readdirSync(directoryPath);
        const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        const images = files
            .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => `http://${SERVER_IP}:${PORT}/assets/images/${folder}/${encodeURIComponent(file)}`);

        console.log(`📸 ${images.length} imágenes encontradas en ${folder}`);
        res.json({ images });
    } catch (error) {
        console.error("❌ Error en /api/images:", error);
        res.status(500).json({ error: "Error al leer la carpeta." });
    }
});

// ✅ 2. API para obtener imágenes de `design`, `architecture` y `branding`
app.get("/api/projects-home", (req, res) => {
    try {
        let result = {};

        FOLDERS.forEach(folder => {
            const directoryPath = path.join(IMAGES_PATH, folder);

            if (!fs.existsSync(directoryPath)) {
                console.warn(`⚠ La carpeta ${folder} no existe.`);
                result[folder] = { hits: [] };
                return;
            }

            const files = fs.readdirSync(directoryPath);
            const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
            const images = files
                .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
                .map(file => `http://${SERVER_IP}:${PORT}/assets/images/${folder}/${encodeURIComponent(file)}`);

            console.log(`📸 ${images.length} imágenes en ${folder}`);
            result[folder] = { hits: images };
        });

        res.json(result);
    } catch (error) {
        console.error("❌ Error en /api/projects-home:", error);
        res.status(500).json({ error: "Error al leer las carpetas." });
    }
});

// 🔹 Servir archivos estáticos sin afectar las rutas de la API
app.use("/assets/images", express.static(IMAGES_PATH, { redirect: false }));

// 🔹 Servir React solo cuando no es una API o imagen
app.get("*", (req, res, next) => {
    if (req.url.startsWith("/api/") || req.url.startsWith("/assets/images/")) {
        return next(); // No servir `index.html` para API ni imágenes
    }
    res.sendFile(path.join(__dirname, "../build", "index.html"), (err) => {
        if (err) {
            console.error("❌ Error cargando el frontend:", err);
            res.status(500).send("Error cargando el frontend.");
        }
    });
});

// 🔹 Iniciar el servidor en `0.0.0.0` para acceso desde cualquier dispositivo
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor corriendo en: http://${SERVER_IP}:${PORT}`);
});
