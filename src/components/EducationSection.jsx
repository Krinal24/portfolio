import { education } from "../constants";
import SectionHeading from "./SectionHeading";

function EducationSection() {
  return (
    <section className="portfolio-section education-section" id="education">
      <SectionHeading
        kicker="The foundation"
        title="Education"
        intro="A computer science foundation growing into deeper work in machine learning and AI."
      />

      <div className="education-list">
        {education.map((item, index) => (
          <article className="education-item" key={item.institution}>
            <span className="education-number">0{index + 1}</span>
            <div>
              <p className="education-duration">{item.duration}</p>
              <h3>{item.degree}</h3>
              <p className="education-institution">{item.institution}</p>
              <p className="education-result">{item.grade}{item.location ? ` · ${item.location}` : ""}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EducationSection;
