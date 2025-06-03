// importImagesProject.js
const folders = [
  "principal",
  "proyecto2",
  "proyecto3",
  "proyecto4",
  "miniatura1",
  "miniatura2",
  "miniatura3",

];

/**
 *  Devuelve un objeto con todas las carpetas para una categoría y proyecto:
 *  {
 *    principal : { "Anik.jpg": "/assets/images/PaginaProyecto/design/principal/Anik.jpg" },
 *    proyecto2 : { "Anik.jpg": "/assets/images/PaginaProyecto/design/proyecto2/Anik.jpg" },
 *    ...
 *  }
 *
 *  category     →  "design" | "architecture" | "branding"
 *  projectName  →  "Anik"   (sin extensión)
 */
export const importImagesProject = (category, projectName) => {
  const file = `${projectName}.jpg`;

  return folders.reduce((acc, folder) => {
    acc[folder] = {
      [file]: `/assets/images/PaginaProyecto/${category}/${folder}/${file}`,
    };
    return acc;
  }, {});
};