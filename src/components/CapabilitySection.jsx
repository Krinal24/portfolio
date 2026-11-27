import { useState } from "react";
import { capabilityLanes } from "../constants";
import SectionHeading from "./SectionHeading";

const laneNames = Object.keys(capabilityLanes);

// Skill bubbles lean gently toward the pointer.
function handleSkillCloudMove(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left - bounds.width / 2) / 5;
  const y = (event.clientY - bounds.top - bounds.height / 2) / 5;
  event.currentTarget.style.setProperty("--cloud-x", `${x}px`);
  event.currentTarget.style.setProperty("--cloud-y", `${y}px`);
}

function handleSkillCloudLeave(event) {
  event.currentTarget.style.setProperty("--cloud-x", "0px");
  event.currentTarget.style.setProperty("--cloud-y", "0px");
}

function CapabilitySection() {
  const [selectedLane, setSelectedLane] = useState(laneNames[0]);
  const lane = capabilityLanes[selectedLane];

  return (
    <section className="portfolio-section skills-section" id="skills">
      <SectionHeading
        className="skills-heading"
        kicker="The working toolkit"
        title="Capability map"
        intro="Choose a lane to see the skills, working style, and evidence behind how I build."
      />

      <div className="capability-board">
        <div className="capability-tabs" role="tablist" aria-label="Capability lanes">
          {laneNames.map((name, index) => (
            <button
              className={`capability-tab ${selectedLane === name ? "is-selected" : ""}`}
              key={name}
              type="button"
              role="tab"
              aria-selected={selectedLane === name}
              onClick={() => setSelectedLane(name)}
            >
              <span className="capability-tab-number">0{index + 1}</span>
              {name}
            </button>
          ))}
        </div>

        <div className="capability-panel" role="tabpanel" aria-live="polite">
          <div className="capability-copy">
            <p className="capability-eyebrow">{lane.eyebrow}</p>
            <h3>{selectedLane}</h3>
            <p>{lane.description}</p>
            <div className="capability-proof">
              <span>Proof point</span>
              <strong>{lane.proof}</strong>
            </div>
          </div>
          <div className="capability-skills">
            <span className="capability-skills-label">Skills in this lane</span>
            {lane.skills.map((skill, index) => (
              <span
                className="capability-skill"
                style={{ "--cloud-index": index, "--cloud-scale": 0.94 + ((index % 4) * 0.035) }}
                key={skill}
                onMouseMove={handleSkillCloudMove}
                onMouseLeave={handleSkillCloudLeave}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CapabilitySection;
