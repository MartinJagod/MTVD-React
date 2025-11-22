// src/pages/Studio/projectsForMap.js
// ---------------------------------------------------------
// ⚠️  Archivo clean – reemplaza duplicados y agrega todas las
//     ubicaciones que hoy existen en projectsDataES.js (36).
// ---------------------------------------------------------

import projectsData from "../Projects/projectsDataES.js";

/* --------------------------------------------------------
 *  PALETA – lee de CSS con fallback
 * ------------------------------------------------------*/
const cssVar = (name, fallback) => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};
export const COLORS = {
  yellow: cssVar("--yellow", "#FEC93A"), // interiorismo
  green:  cssVar("--green",  "#44B87E"), // arquitectura
  orange: cssVar("--orange", "#FD7E40"), // branding
  blue:   cssVar("--blue",   "#3B76f3"), // estudios
};

/* --------------------------------------------------------
 *  Tipo → color por rango de ID
 * ------------------------------------------------------*/
export const tipoPorId = (id) => {
  if (id >= 8001) return "branding";      // naranja
  if (id >= 5001) return "arquitectura";  // verde
  return "interiorismo";                  // amarillo
};

/* --------------------------------------------------------
 *  Generador de URL pública
 * ------------------------------------------------------*/
export const makeProjectUrl = (nombre) => {
  if (!nombre) return null;
  const clean = nombre.replace(/\s+/g, "").replace(/[^\wÀ-ÿ]/g, "");
  return `https://www.mtvd-design.com/#/project/Design/${clean}`;
};

/* --------------------------------------------------------
 *  Coordenadas – 36 ubicaciones únicas (+ se puede ampliar)
 * ------------------------------------------------------*/
export const GEO = {
  "Alta Gracia, Córdoba, Argentina":                { lat: -31.6570, lng: -64.4333 },
  "Asunción, Paraguay":                             { lat: -25.2637, lng: -57.5759 },
  "Bali, Indonesia":                                { lat: -8.4095, lng: 115.1889 },
  "Banfield, Buenos Aires, Argentina":              { lat: -34.7443, lng: -58.3895 },
  "Barcelona, España":                              { lat: 41.3851, lng: 2.1734 },
  "Barcelona, Spain":                               { lat: 41.3851, lng: 2.1734 },
  "Belgrano, Buenos Aires, Argentina":              { lat: -34.5632, lng: -58.4569 },
  "Bruselas, Bélgica":                              { lat: 50.8503, lng: 4.3517 },
  "Buenos Aires, Argentina":                        { lat: -34.6037, lng: -58.3816 },
  "Campo Chico Urbanización Residencial, Córdoba, Argentina": { lat: -31.2820, lng: -64.2470 },
  "Cariló, Buenos Aires, Argentina":                { lat: -37.1654, lng: -56.8909 },
  "Ciudad de Córdoba, Córdoba, Argentina":          { lat: -31.4167, lng: -64.1833 },
  "Colonia Caroya, Córdoba, Argentina":             { lat: -31.0427, lng: -64.0873 },
  "Cordoba, Cordoba, Argentina":                    { lat: -31.4167, lng: -64.1833 },
  "Córdoba City, Córdoba, Argentina":               { lat: -31.4167, lng: -64.1833 },
  "Córdoba Ciudad, Córdoba, Argentina":             { lat: -31.4167, lng: -64.1833 },
  "Las Cañitas, Malagueño, Cordoba, Argentina":      { lat: -31.4430, lng: -64.3460 },
  "Las Cañitas, Malagueño, Córdoba, Argentina":      { lat: -31.4430, lng: -64.3460 },
  "Mendoza, Argentina":                             { lat: -32.8895, lng: -68.8458 },
  "Mérida, Yucatán, México":                        { lat: 20.9674, lng: -89.5926 },
  "Miami, USA":                                     { lat: 25.7617, lng: -80.1918 },
  "Madrid, España":                                 { lat: 40.4168, lng: -3.7038 },
  "Palermo Soho, Buenos Aires, Argentina":          { lat: -34.5900, lng: -58.4320 },
  "Palermo, Buenos Aires, Argentina":               { lat: -34.5880, lng: -58.4300 },
  "Pilar, Buenos Aires, Argentina":                 { lat: -34.4587, lng: -58.9147 },
  "Potrero de Garay, Córdoba, Argentina":           { lat: -31.7490, lng: -64.5670 },
  "Quilmes, Buenos Aires, Argentina":               { lat: -34.7200, lng: -58.2700 },
  "San Fernando, Buenos Aires, Argentina":          { lat: -34.4500, lng: -58.5600 },
  "San Luis, Argentina":                            { lat: -33.2950, lng: -66.3350 },
  "Santiago de Chile, Chile":                       { lat: -33.4489, lng: -70.6693 },
  "Villa Allende, Córdoba, Argentina":              { lat: -31.3189, lng: -64.2963 },
  "Villa del Parque, Buenos Aires, Argentina":      { lat: -34.6050, lng: -58.4770 },
  "Viña del Mar, Valparaíso, Chile":                { lat: -33.0245, lng: -71.5518 },
  "Zárate, Argentina":                              { lat: -34.0995, lng: -59.0285 }
};

/* --------------------------------------------------------
 *  Transformación projectsData → array usable por WorksMap
 * ------------------------------------------------------*/
export const projectsForMap = Object.entries(projectsData)
  .map(([idStr, p]) => {
    const id = Number(idStr);
    const geo = GEO[p.location] || {};
    return {
      id,
      nombre: p.nombreproyecto,
      localidad: p.location,
      tipo: tipoPorId(id),
      lat: geo.lat ?? null,
      lng: geo.lng ?? null,
      url: makeProjectUrl(p.nombreproyecto),
      isStudio: false,
    };
  })
  .filter((p) => p.lat != null && p.lng != null);

/* --------------------------------------------------------
 *  Estudios (rombos azules)
 * ------------------------------------------------------*/
export const studioPoints = [
  { id: 10001, nombre: "Madrid – Estudio", localidad: "Madrid, España", lat: 40.4168, lng: -3.7038, isStudio: true },
  { id: 10002, nombre: "Córdoba Interiorismo – Estudio", localidad: "Córdoba, Argentina", lat: -31.4090575, lng: -64.1948818, isStudio: true },
  { id: 10003, nombre: "Córdoba Arquitectura – Estudio", localidad: "Córdoba, Argentina", lat: -31.4264963, lng: -64.1824615, isStudio: true },
  { id: 10004, nombre: "Miami – Estudio", localidad: "Miami, USA", lat: 25.7617, lng: -80.1918, isStudio: true }
];

/* --------------------------------------------------------
 *  Array completo (por comodidad)
 * ------------------------------------------------------*/
export default [...studioPoints, ...projectsForMap];
