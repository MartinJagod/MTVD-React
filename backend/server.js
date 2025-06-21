/* ────────────────────────────────────────────────────────────────── */
/*  server/index.js                                                  */
/* ────────────────────────────────────────────────────────────────── */
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app       = express();
const PORT      = process.env.PORT || 5000;
const SERVER_IP = '193.203.182.77';          // IP pública o localhost

/* ------------------------------------------------------------------ */
/* 1. Configuración básica                                            */
/* ------------------------------------------------------------------ */
app.use(cors({ origin: '*' }));              // CORS abierto

const BUILD_PATH  = path.join(__dirname, '../build');
const IMAGES_ROOT = path.join(BUILD_PATH, 'assets', 'images');

/* Carpetas usadas por las APIs “antiguas” */
const LEGACY_FOLDERS = ['design', 'architecture', 'branding'];

/* Relación categoría → carpeta física nueva dentro de IMAGES_ROOT */
const CATEGORY_DIR = {
  design:       'FotosDesign',
  architecture: 'FotoArchitecture',
  branding:     'FotoBranding',
  Design:       'FotosDesign',
  Architecture: 'FotoArchitecture',
  Branding:     'FotoBranding',
};
const CATEGORY_DIR2 = {
  Design:       'FotosDesign',
  Architecture: 'FotoArchitecture',
  Branding:     'FotoBranding',
};

/* Extensiones válidas */
const VALID_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/* ------------------------------------------------------------------ */
/* 2. Helper recursivo: devuelve URLs de todas las imágenes del dir    */
/* ------------------------------------------------------------------ */
function readImagesRec(dir) {
  if (!fs.existsSync(dir)) return [];

  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  let result = [];

  dirents.forEach((d) => {
    const full = path.join(dir, d.name);

    if (d.isDirectory()) {
      result = result.concat(readImagesRec(full));
      return;
    }

    if (!VALID_EXT.has(path.extname(d.name).toLowerCase())) return;

    /* Ruta relativa a /assets/images/, convertida a URL */
    const rel = path
      .relative(IMAGES_ROOT, full)
      .split(path.sep)
      .map(encodeURIComponent)
      .join('/');

    result.push(`http://${SERVER_IP}:${PORT}/assets/images/${rel}`);
  });

  return result;
}

/* ------------------------------------------------------------------ */
/* 3. NUEVA API – popup                                               */
/*    /api/images/popup/:category/:project                            */
/* ------------------------------------------------------------------ */
app.get('/api/images/popup/:category/:project', (req, res) => {
  try {
    const { category, project } = req.params;
 console.log(`🔍 Buscando imágenes para ${category}/${project}`);
    /* Carpeta según la categoría */
    const catDir = CATEGORY_DIR[category];
    if (!catDir) {
      return res.status(400).json({ error: 'Categoría inválida.' });
    }

    /* Nombre de proyecto “safe” (sin espacios) */
    /* const safeProject = decodeURIComponent(project).replace(/\s+/g, '').trim(); */
    const safeProject = project;


    /* Ruta base:  FotoDesign/AlgoGrosso/Fotos/Editadas */
    const basePath = path.join(
      IMAGES_ROOT,
      catDir,
      safeProject,
      'Fotos',
      'Editadas'
    );

    if (!fs.existsSync(basePath)) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    /* Mobile + Desktop */
    const images = [
      ...readImagesRec(path.join(basePath, 'Mobile')),
      ...readImagesRec(path.join(basePath, 'Desktop')),
    ];

    console.log(`📸 ${images.length} imágenes para ${category}/${project}`);
    res.json({ images });
  } catch (err) {
    console.error('❌ Error en /api/images/popup/:category/:project', err);
    res.status(500).json({ error: 'Error al leer imágenes.' });
  }
});
/* ------------------------------------------------------------------ */
/* 4. API LEGACY – /api/images/:folder                                */
/* ------------------------------------------------------------------ */
app.get('/api/images/:folder', (req, res) => {
  try {
    const folder = decodeURIComponent(req.params.folder)
      .replace(/\s+/g, '')
      .trim();

    const dir = path.join(IMAGES_ROOT, folder);
    if (!fs.existsSync(dir)) {
      return res.status(404).json({ error: 'Carpeta no encontrada.' });
    }

    const images = fs
      .readdirSync(dir)
      .filter((f) => VALID_EXT.has(path.extname(f).toLowerCase()))
      .map(
        (f) =>
          `http://${SERVER_IP}:${PORT}/assets/images/${folder}/${encodeURIComponent(
            f
          )}`
      );

    res.json({ images });
  } catch (err) {
    console.error('❌ Error en /api/images/:folder', err);
    res.status(500).json({ error: 'Error al leer la carpeta.' });
  }
});

/* ------------------------------------------------------------------ */
/* 5. API LEGACY – /api/projects-home                                 */
/* ------------------------------------------------------------------ */
app.get('/api/projects-home', (req, res) => {
  try {
    const result = {};

    LEGACY_FOLDERS.forEach((folder) => {
      const dir = path.join(IMAGES_ROOT, folder);

      if (!fs.existsSync(dir)) {
        result[folder] = { hits: [] };
        return;
      }

      const images = fs
        .readdirSync(dir)
        .filter((f) => VALID_EXT.has(path.extname(f).toLowerCase()))
        .map(
          (f) =>
            `http://${SERVER_IP}:${PORT}/assets/images/${folder}/${encodeURIComponent(
              f
            )}`
        );

      result[folder] = { hits: images };
    });

    res.json(result);
  } catch (err) {
    console.error('❌ Error en /api/projects-home', err);
    res.status(500).json({ error: 'Error al leer las carpetas.' });
  }
});

/* ------------------------------------------------------------------ */
/* 6. Estáticos + fallback a React                                    */
/* ------------------------------------------------------------------ */
app.use('/assets/images', express.static(IMAGES_ROOT, { redirect: false }));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api/') || req.url.startsWith('/assets/images/')) {
    return next();                     // 👉 no servir index.html a peticiones API
  }
  res.sendFile(path.join(BUILD_PATH, 'index.html'));
});

/* ------------------------------------------------------------------ */
/* 7. Levantar servidor                                               */
/* ------------------------------------------------------------------ */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API    : http://${SERVER_IP}:${PORT}`);
  console.log(`📁 Images : ${IMAGES_ROOT}`);
});
app.use(express.static(path.join(__dirname, 'build'))); // carpeta build

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
