export const importImages = (projectName) => {
    try {
        // Webpack requiere que la carpeta sea relativa al archivo donde se usa require.context
        const requireContext = require.context(
            `../assets/images/${projectName}`, // 🔹 Carpeta específica del proyecto
            false, // No busca en subcarpetas
            /\.(jpg|jpeg|png|gif|webp)$/ // Extensiones permitidas
        );

        return requireContext.keys().map(requireContext);
    } catch (error) {
        console.error(`Error al importar imágenes de la carpeta: ${projectName}`, error);
        return [];
    }
};
