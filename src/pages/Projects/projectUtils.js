import dataProjects from './projectsData';

// 🔍 Buscar el ID según el nombre del proyecto, ignorando espacios
export function getIdByProjectName(nombreBuscado) {
  if (!nombreBuscado) return null;

  const normalizar = (str) => str.toLowerCase().replace(/\s+/g, '');

  const entry = Object.entries(dataProjects).find(
    ([, v]) =>
      v?.nombreproyecto &&
      normalizar(v.nombreproyecto) === normalizar(nombreBuscado)
  );

  return entry ? entry[0] : null;
}
