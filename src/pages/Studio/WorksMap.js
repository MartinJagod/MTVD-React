import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { COLORS, tipoPorId } from "./projectsForMap";

/* ─────────────────────────────────────────────
   Iconos
───────────────────────────────────────────── */
function svgPin(color, size = 20, inner = 4.5) {
  const html = `
    <svg width="${size}" height="${size}" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="11.5" fill="${color}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="${inner}" fill="rgba(255,255,255,.92)"/>
    </svg>`;

  return L.divIcon({
    className: "mtvd-pin",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -16],
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
    popupAnchor: [0, -26],
  });
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function groupByCoordinates(items) {
  const groups = {};

  items.forEach((p) => {
    if (p.lat != null && p.lng != null) {
      const lat = Number(p.lat);
      const lng = Number(p.lng);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;

      if (!groups[key]) {
        groups[key] = { lat, lng, projects: [] };
      }

      groups[key].projects.push(p);
    }
  });

  return Object.values(groups);
}

function getProjectType(project) {
  if (project.isCountry) return "country";
  if (project.isStudio) return "studio";
  return project.tipo || tipoPorId(project.id) || "interiorismo";
}

/* ─────────────────────────────────────────────
   Leaflet resize fix
───────────────────────────────────────────── */
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const run = () => {
      setTimeout(() => map.invalidateSize(), 50);
      setTimeout(() => map.invalidateSize(), 300);
    };

    run();
    window.addEventListener("resize", run);

    return () => {
      window.removeEventListener("resize", run);
    };
  }, [map]);

  return null;
}

/* ─────────────────────────────────────────────
   Marcadores dinámicos
───────────────────────────────────────────── */
function ClusteredMarkers({ projects, icons, activeLayer }) {
  const map = useMap();
  const markersRef = useRef([]);

  useEffect(() => {
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    const groups = groupByCoordinates(projects);

    groups.forEach((group) => {
      if (!group.projects.length) return;

      if (group.projects.length === 1) {
        const p = group.projects[0];
        const tipo = getProjectType(p);

        let icon = icons[tipo] || icons.interiorismo;

        if (activeLayer === "countries" && p.isCountry) {
          icon = icons.country;
        }

        const marker = L.marker([p.lat, p.lng], { icon }).bindPopup(`
          <div style="min-width: 200px">
            <strong>${p.nombre || "Project"}</strong><br />
            <small>${p.localidad || ""}</small><br />
            <small>${
              p.isCountry
                ? "Country"
                : p.isStudio
                ? "Studio"
                : tipo
            }</small>
            ${
              !p.isCountry && !p.isStudio && p.url
                ? `<br /><br /><a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-weight: 600">View project →</a>`
                : ""
            }
          </div>
        `);

        marker.addTo(map);
        markersRef.current.push(marker);
        return;
      }

      const first = group.projects[0];
      const tipo = getProjectType(first);

      let icon = icons[tipo] || icons.interiorismo;

      if (activeLayer === "countries") {
        icon = icons.country;
      }

      const popupContent = `
        <div style="min-width: 250px; max-height: 400px; overflow-y: auto;">
          <strong style="display:block; margin-bottom:10px; font-size:1.1em;">
            ${group.projects.length} items in this location
          </strong>
          ${group.projects
            .map((p) => {
              const pTipo = p.isCountry
                ? "Country"
                : p.isStudio
                ? "Studio"
                : getProjectType(p);

              return `
                <div style="padding: 8px 0; border-top: 1px solid #eee;">
                  <strong>${p.nombre || "Project"}</strong><br />
                  <small style="color:#666;">${pTipo}</small>
                  ${
                    !p.isCountry && !p.isStudio && p.url
                      ? `<br /><a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-size:0.9em; font-weight:600;">View project →</a>`
                      : ""
                  }
                </div>
              `;
            })
            .join("")}
        </div>
      `;

      const marker = L.marker([group.lat, group.lng], { icon }).bindPopup(
        popupContent,
        { maxWidth: 300 }
      );

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];
    };
  }, [map, projects, icons, activeLayer]);

  return null;
}

/* ─────────────────────────────────────────────
   Principal
───────────────────────────────────────────── */
export default function WorksMap({
  projects = [],
  countryPoints = [],
  activeLayer = "cities",
}) {
  const withCoordsProjects = useMemo(
    () =>
      projects.filter((p) => {
        const lat = Number(p.lat);
        const lng = Number(p.lng);
        return Number.isFinite(lat) && Number.isFinite(lng);
      }),
    [projects]
  );

  const withCoordsCountries = useMemo(
    () =>
      countryPoints.filter((p) => {
        const lat = Number(p.lat);
        const lng = Number(p.lng);
        return Number.isFinite(lat) && Number.isFinite(lng);
      }),
    [countryPoints]
  );

  const visibleProjects = useMemo(() => {
    if (activeLayer === "countries") {
      return withCoordsCountries;
    }

    if (activeLayer === "studios") {
      return withCoordsProjects.filter((p) => p.isStudio);
    }

    return withCoordsProjects.filter((p) => !p.isStudio);
  }, [withCoordsProjects, withCoordsCountries, activeLayer]);

  const icons = useMemo(
    () => ({
      interiorismo: svgPin(COLORS.yellow, 20, 4.5),
      arquitectura: svgPin(COLORS.green, 20, 4.5),
      branding: svgPin(COLORS.orange, 20, 4.5),
      studio: svgDiamond(COLORS.blue),
      country: svgPin("rgba(0,0,0,0.78)", 24, 5.2),
    }),
    []
  );

  return (
    <MapContainer
      center={[10, -20]}
      zoom={3}
      scrollWheelZoom={false}
      dragging={true}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      zoomControl={false}
      attributionControl={false}
      worldCopyJump={false}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1.0}
      className={`studio-map studio-map--${activeLayer}`}
      style={{
        width: "100%",
        height: "100%",
        background: "#dfe8f5",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />

      <MapResizer />

      <ClusteredMarkers
        projects={visibleProjects}
        icons={icons}
        activeLayer={activeLayer}
      />
    </MapContainer>
  );
}