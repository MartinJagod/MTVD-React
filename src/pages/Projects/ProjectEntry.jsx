// src/pages/Projects/ProjectEntry.jsx
import { useMediaQuery } from 'react-responsive';
import Project from './Project';           // mobile / default
import ProjectDesktop from './ProjectDesktop';

export default function ProjectEntry() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  return isDesktop ? <ProjectDesktop /> : <Project />;
}
