const folders = [
  "principal",
  "proyecto2",
  "proyecto3",
  "proyecto4",
  "miniatura1",
  "miniatura2",
  "miniatura3",
];

export const importImagesProject = (category, projectName, isDesktop = false) => {
  // 1️⃣ sanitizamos
  const safeCategory = String(category).trim().toLowerCase();
  const safeProject  = String(projectName).trim();

  // 2️⃣ nombre de archivo
  const file = `${safeProject}.jpg`;

  // 3️⃣ si es desktop y arquitectura, añadimos el subdirectorio
  const basePath = `/assets/images/PaginaProyecto/${safeCategory}` +
                   ((isDesktop && safeCategory === "architecture") ? "/Desktop" : "");

  // 4️⃣ construimos el objeto con rutas
  return folders.reduce((acc, folder) => {
    acc[folder] = {
      [file]: `${basePath}/${folder}/${file}`,
    };
    return acc;
  }, {});
};
