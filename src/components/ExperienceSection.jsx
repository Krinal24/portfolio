import { experiences } from "../constants";
import SectionHeading from "./SectionHeading";

// Wraps figures like "1000+", "30-40%" or "$250k" in <strong> so impact numbers stand out.
function highlightMetrics(text) {
  return text.split(/(\$?\d[\d,.]*(?:-\d+)?(?:%|k\b|\+))/g).map((part, index) => (
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  ));
}

function ExperienceSection() {
  return (
    <section className="portfolio-section experience-section" id="experience">
      <SectionHeading
        kicker="The path so far"
        title="Experience"
        intro="Building dependable systems, useful data products, and better ways to understand what is happening in production."
      />

      <div className="experience-list">
        {experiences.map((experience, index) => (
          <article className="experience-item scroll-reveal" key={`${experience.company}-${experience.role}`}>
            <div className="experience-marker" aria-hidden="true">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="experience-main">
              <div className="experience-meta">
                <p className="experience-duration">{experience.duration}</p>
                <p className="experience-domain">{experience.domain}</p>
              </div>
              <h3>{experience.role}</h3>
              <p className="experience-company">{experience.company}</p>
              <div className="experience-roles">
                {experience.roles.map((role) => (
                  <div className="experience-role" key={role.title || experience.company}>
                    {role.title && (
                      <p className="experience-role-title">
                        {role.title}
                        <span>{role.period}</span>
                      </p>
                    )}
                    <ul>
                      {role.points.map((point) => <li key={point}>{highlightMetrics(point)}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="skill-tags">
                {experience.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ExperienceSection;
