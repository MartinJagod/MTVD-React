// /src/pages/Studio/WorksMap.js
import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { COLORS, tipoPorId } from "./projectsForMap";

// ---------- Iconos personalizados ----------
function svgPin(color) {
  const html = `
    <svg width="20" height="20" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="11.5" fill="${color}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="4.5" fill="rgba(255,255,255,.9)"/>
    </svg>`;
  return L.divIcon({
    className: "mtvd-pin",
    html,
    iconSize:   [20, 20],  // ~⅔ de 28px
    iconAnchor: [10, 20],  // centro-abajo
    popupAnchor:[0, -16]   // popup un poco más arriba
  });
}

function svgDiamond(color) {
  const html = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="6" width="18" height="18" transform="rotate(45 15 15)"
            fill="${color}" stroke="rgba(0,0,0,.35)" stroke-width="1.5" rx="2" ry="2"/>
      <circle cx="15" cy="15" r="3.8" fill="white" />
    </svg>`;
  return L.divIcon({ 
    className: "mtvd-studio", 
    html, 
    iconSize: [30, 30], 
    iconAnchor: [15, 30], 
    popupAnchor: [0, -26] 
  });
}

// ---------- Función para agrupar proyectos por coordenadas ----------
function groupByCoordinates(projects) {
  const groups = {};
  projects.forEach(p => {
    if (p.lat != null && p.lng != null) {
      const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
      if (!groups[key]) {
        groups[key] = { lat: p.lat, lng: p.lng, projects: [] };
      }
      groups[key].projects.push(p);
    }
  });
  return Object.values(groups);
}

// ---------- Componente para crear marcadores agrupados ----------
function ClusteredMarkers({ projects, icons }) {
  const map = useMap();
  const markersRef = useRef([]);

  useEffect(() => {
    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Agrupar proyectos por coordenadas
    const groups = groupByCoordinates(projects);

    groups.forEach(group => {
      if (group.projects.length === 1) {
        // Un solo proyecto: marcador simple
        const p = group.projects[0];
        const tipo = p.isStudio ? "studio" : (p.tipo || tipoPorId(p.id));
        const icon = icons[tipo] || icons.interiorismo;

        const marker = L.marker([p.lat, p.lng], { icon })
          .bindPopup(`
            <div style="min-width: 200px">
              <strong>${p.nombre}</strong><br />
              <small>${p.localidad}</small><br />
              <small>${p.isStudio ? "Estudio" : tipo}</small>
              ${!p.isStudio && p.url ? `<br /><br /><a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-weight: 600">Ver proyecto →</a>` : ''}
            </div>
          `);

        marker.addTo(map);
        markersRef.current.push(marker);
      } else {
        // Múltiples proyectos: popup con lista
        const tipo = group.projects[0].isStudio ? "studio" : (group.projects[0].tipo || tipoPorId(group.projects[0].id));
        const icon = icons[tipo] || icons.interiorismo;

        const popupContent = `
          <div style="min-width: 250px; max-height: 400px; overflow-y: auto;">
            <strong style="display: block; margin-bottom: 10px; font-size: 1.1em;">
              ${group.projects.length} proyectos en esta ubicación
            </strong>
            ${group.projects.map(p => {
              const pTipo = p.isStudio ? "Estudio" : (p.tipo || tipoPorId(p.id));
              return `
                <div style="padding: 8px 0; border-top: 1px solid #eee;">
                  <strong>${p.nombre}</strong><br />
                  <small style="color: #666;">${pTipo}</small>
                  ${!p.isStudio && p.url ? `<br /><a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.9em; font-weight: 600;">Ver proyecto →</a>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `;

        const marker = L.marker([group.lat, group.lng], { icon })
          .bindPopup(popupContent, { maxWidth: 300 });

        marker.addTo(map);
        markersRef.current.push(marker);
      }
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => map.removeLayer(marker));
      markersRef.current = [];
    };
  }, [map, projects, icons]);

  return null;
}

// ---------- Componente principal ----------
export default function WorksMap({ projects = [] }) {
  const withCoords = projects.filter(p => p.lat != null && p.lng != null);
  const center = withCoords.length ? [withCoords[0].lat, withCoords[0].lng] : [0, 0];

  const icons = useMemo(() => ({
    interiorismo: svgPin(COLORS.yellow),
    arquitectura: svgPin(COLORS.green),
    branding:     svgPin(COLORS.orange),
    studio:       svgDiamond(COLORS.blue),
  }), []);

  return (
    <MapContainer
  center={[0, 0]}
  zoom={2}
  scrollWheelZoom={true} 
  className="studio-map"
  style={{ height: "60vh", width: "100%", background: "ice" }} // fondo gris claro
  attributionControl={false}
  worldCopyJump={false}      // 👈 evita el salto
  maxBounds={[[-85, -180], [85, 180]]} // 👈 bloquea panning fuera del mundo
  maxBoundsViscosity={1.0}   // “goma” en los bordes
>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       noWrap={true} />
      <ClusteredMarkers projects={projects} icons={icons} />
    </MapContainer>
  );
}