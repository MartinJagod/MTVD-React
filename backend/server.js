const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Habilitar CORS para permitir acceso desde cualquier dispositivo
app.use(cors({ origin: "*" }));

// 🔹 Definir la ruta donde están las imágenes
const IMAGES_PATH = path.join(__dirname, "../build/assets/images");

// 🔹 Servir archivos estáticos (frontend y assets)
app.use(express.static(path.join(__dirname, "../build")));
app.use("/assets/images", express.static(IMAGES_PATH)); // Permite acceder a las imágenes

// 🔹 Endpoint para obtener imágenes de una carpeta específica
app.get("/api/images/:folder", (req, res) => {
    try {
        let folder = req.params.folder.replace(/\s+/g, ""); // 🔹 Eliminar espacios en el nombre de la carpeta
        const directoryPath = path.join(IMAGES_PATH, folder);

        // 🔹 Verificar si la carpeta existe
        if (!fs.existsSync(directoryPath)) {
            return res.status(404).json({ error: "Carpeta no encontrada." });
        }

        // 🔹 Leer archivos de la carpeta
        const files = fs.readdirSync(directoryPath);
        const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];

        // 🔹 Filtrar imágenes y devolver URLs absolutas
        const images = files
            .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => `http://${req.headers.host}/assets/images/${folder}/${file}`);

        res.json({ images });
    } catch (error) {
        console.error("Error en /api/images:", error);
        res.status(500).json({ error: "Error al leer la carpeta." });
    }
});

// 🔹 Servir React en cualquier ruta no manejada
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"), (err) => {
        if (err) {
            res.status(500).send("Error cargando el frontend.");
        }
    });
});

// 🔹 Iniciar el servidor y mostrar la IP real
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://${getLocalIp()}:${PORT}`);
});

// 🔹 Función para obtener la IP local del servidor
function getLocalIp() {
    const os = require("os");
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address;
            }
        }
    }
    return "localhost";
}
