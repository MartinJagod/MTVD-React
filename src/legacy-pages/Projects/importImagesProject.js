const folderNames = ["principal", "proyecto2", "proyecto3", "proyecto4", "miniatura1", "miniatura2"];
const imageNames = ["Che Mono.jpg", "Barilatte.jpg", "Soberana.jpg"];

const generateImagePaths = (folders, images) => {
    return folders.reduce((acc, folder) => {
        acc[folder] = images.reduce((imgAcc, img) => {
            imgAcc[img] = `/assets/images/PaginaProyecto/${folder}/${img}`;
            return imgAcc;
        }, {});
        return acc;
    }, {});
};

const imagesPrincipal = generateImagePaths(folderNames, imageNames);

// Función para obtener las imágenes
export const importImagesProject = () => imagesPrincipal;

console.log(importImagesProject()); // Para probar
