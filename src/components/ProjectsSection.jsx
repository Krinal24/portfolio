import { FaYoutube } from "react-icons/fa";
import { projects } from "../constants";
import SectionHeading from "./SectionHeading";

// "https://youtu.be/ID" or "...watch?v=ID" -> the video's large thumbnail.
function youtubeThumbnail(url) {
  const id = url?.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null;
}

// Feeds the pointer position to CSS so the card's spotlight glow follows the cursor.
function handleSpotlightMove(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
}

function ProjectCard({ project, index }) {
  const thumbnail = youtubeThumbnail(project.demoLink);

  return (
    <article
      className={`project-card project-card-${index + 1} ${project.featured ? "project-card-featured" : ""} scroll-reveal`}
      onPointerMove={handleSpotlightMove}
    >
      <div className="project-card-body">
        <div className="project-card-topline">
          <span className="project-index">0{index + 1}</span>
          <span className="project-type">{project.featured ? `Featured · ${project.category}` : project.category}</span>
        </div>
        <h3>{project.name}</h3>
        {project.highlight && <p className="project-highlight">{project.highlight}</p>}
        <p>{project.description}</p>
        {project.demoLink && !project.featured && (
          <a className="project-demo-link" href={project.demoLink} target="_blank" rel="noreferrer">
            <FaYoutube aria-hidden="true" /> Watch the demo
          </a>
        )}
        <div className="project-footer">
          <div className="skill-tags">
            {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
          {project.link && <a href={project.link} target="_blank" rel="noreferrer">View project <span aria-hidden="true">↗</span></a>}
        </div>
      </div>

      {project.featured && thumbnail && (
        <a className="project-media" href={project.demoLink} target="_blank" rel="noreferrer" aria-label={`Watch the ${project.name} demo on YouTube`}>
          <span className="project-media-bar" aria-hidden="true"><i /><i /><i /></span>
          <img src={thumbnail} alt={`${project.name} app screenshot`} loading="lazy" decoding="async" />
          <span className="project-media-play" aria-hidden="true"><FaYoutube /> Watch the demo</span>
        </a>
      )}
    </article>
  );
}

// Regular (non-featured) cards sit three across when they fill whole rows, otherwise two across.
const regularCount = projects.filter((project) => !project.featured).length;

function ProjectsSection() {
  return (
    <section className="portfolio-section projects-section" id="projects">
      <SectionHeading
        className="projects-heading"
        kicker="Selected work"
        title="Projects & Publications"
        intro="Small, focused systems where machine learning meets thoughtful product experiences."
      />

      <div className={`project-grid ${regularCount % 3 === 0 ? "project-grid-3" : "project-grid-2"}`}>
        {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.name} />)}
      </div>
    </section>
  );
}

export default ProjectsSection;
