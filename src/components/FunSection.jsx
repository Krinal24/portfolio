import { useState } from "react";
import { FaBook, FaSpotify } from "react-icons/fa";
import { CONTACT_EMAIL } from "./socialLinks";
import SectionHeading from "./SectionHeading";

const RESEARCH_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScoHUkAQnbwSVi6qxjqv7VioAOAh_1V46Jqkm8Ra4gPaA_8Cw/viewform";
const BUG_START = { top: 42, left: 54 };

// A bug that runs away from the cursor; click it to score.
function BugGame() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(BUG_START);
  const [escaped, setEscaped] = useState(false);

  const catchBug = () => {
    setScore((value) => value + 1);
    setEscaped(false);
    setPosition({ top: 12 + Math.random() * 68, left: 8 + Math.random() * 82 });
  };

  const handleArenaMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const cursorLeft = ((event.clientX - bounds.left) / bounds.width) * 100;
    const cursorTop = ((event.clientY - bounds.top) / bounds.height) * 100;
    const dx = position.left - cursorLeft;
    const dy = position.top - cursorTop;
    const distance = Math.hypot(dx, dy);
    if (distance > 19) return;

    const safeDistance = distance || 1;
    const escapeStrength = 15 + Math.random() * 10;
    setEscaped(true);
    setPosition({
      left: Math.max(8, Math.min(92, position.left + (dx / safeDistance) * escapeStrength)),
      top: Math.max(14, Math.min(84, position.top + (dy / safeDistance) * escapeStrength)),
    });
  };

  const reset = () => {
    setScore(0);
    setEscaped(false);
    setPosition(BUG_START);
  };

  return (
    <article className="fun-card bug-card">
      <div className="bug-card-heading">
        <span className="fun-card-label">04 / Production incident</span>
        <span className="bug-score">Bugs caught: {score}</span>
      </div>
      <h3>Catch the bug.</h3>
      <p>It escaped code review, let&apos;s see if you can catch it now. Click it before it asks for a promotion.</p>
      <div className="bug-arena" aria-label="Mini game: catch the bug" onMouseMove={handleArenaMove}>
        <button
          className="bug-target"
          type="button"
          style={{ top: `${position.top}%`, left: `${position.left}%` }}
          onClick={catchBug}
          aria-label="Catch the bug"
        >
          <span aria-hidden="true">🐛</span>
        </button>
      </div>
      <div className="bug-footer">
        <button className="bug-reset" type="button" onClick={reset}>Reset incident</button>
        <span className="bug-status" aria-live="polite">
          {escaped ? "The bug filed a remote-work request." : score > 4 ? "Senior bug hunter unlocked." : "Status: suspiciously operational"}
        </span>
      </div>
    </article>
  );
}

function FunSection() {
  return (
    <section className="portfolio-section fun-section" id="fun">
      <SectionHeading
        kicker="Outside the stack"
        title="Fun corner"
        intro="A little space for curiosity, conversation, music, and the ideas that keep the work human. Warning: this section contains one extremely unserious bug."
      />

      <div className="fun-grid">
        <div className="fun-column">
          <article className="fun-card ama-card">
            <span className="fun-card-label">01 / AMA</span>
            <h3>Ask me anything.</h3>
            <p>Want to talk about engineering, AI, learning, or build a project in AI, ML or Data with me? Send me a note or reach out on LinkedIn.</p>
            <div className="fun-links">
              <a href={`mailto:${CONTACT_EMAIL}`}>Email me <span aria-hidden="true">↗</span></a>
              <a href="https://www.linkedin.com/in/krinal-naghera/" target="_blank" rel="noreferrer">DM on LinkedIn <span aria-hidden="true">↗</span></a>
            </div>
          </article>

          <article className="fun-card culture-card playlist-card">
            <span className="fun-card-label">02 / Currently into</span>
            <div className="fun-item spotify-heading">
              <span className="fun-symbol spotify-symbol" aria-hidden="true"><FaSpotify /></span>
              <div>
                <span>What&apos;s on my mind (&amp; playing on loop)</span>
                <a href="https://open.spotify.com/track/60SvhHtwefT0e2G7i7kOH3" target="_blank" rel="noreferrer">New Gold · Tame Impala, Gorillaz ↗</a>
              </div>
            </div>
            <div className="spotify-playlist-heading">
              <strong>Vibe as you scroll</strong>
              <span>Spotify playlist</span>
            </div>
            <div className="spotify-embed-wrap">
              <iframe
                title="Spotify playlist"
                src="https://open.spotify.com/embed/playlist/6C31tC65ZJBawgWwSjROgh?utm_source=generator&si=7f805cef7ac64835"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </article>
        </div>

        <article className="fun-card culture-card research-card">
          <span className="fun-card-label">03 / Currently working on</span>
          <div className="research-intro">
            <span className="fun-symbol book-symbol" aria-hidden="true"><FaBook /></span>
            <div>
              <h3>Learning in public.</h3>
              <p>I’m doing my Master’s online in AI &amp; ML, exploring research papers, and learning something new every day.</p>
            </div>
          </div>
          <p className="research-invite">Have a research topic to share? Shoot!</p>
          <div className="research-form">
            <iframe src={`${RESEARCH_FORM_URL}?embedded=true`} width="100%" height="470" loading="lazy" title="Research topic suggestion form">
              Loading…
            </iframe>
          </div>
          <a className="research-form-link" href={RESEARCH_FORM_URL} target="_blank" rel="noreferrer">
            Form not loading? Open it in a new tab <span aria-hidden="true">↗</span>
          </a>
          <div className="fun-item quote-item research-quote">
            <span className="fun-symbol book-symbol" aria-hidden="true"><FaBook /></span>
            <div>
              <span>Life motto ft. great reads</span>
              <blockquote>“I was beginning to learn that your life is a story told about you, not one that you tell.”</blockquote>
              <cite>Turtles all the way down · John Green</cite>
            </div>
          </div>
        </article>

        <BugGame />
      </div>
    </section>
  );
}

export default FunSection;
