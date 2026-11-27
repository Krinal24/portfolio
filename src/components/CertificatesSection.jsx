import { useEffect, useRef, useState } from "react";
import { certificateItems } from "../constants";
import SectionHeading from "./SectionHeading";

const DRIFT_SPEED = -24; // px per second, leftwards

// Endless strip of certificate cards. Drifts slowly, eases to a stop while hovered or
// focused, and can be flung sideways with a trackpad swipe or shift + mouse wheel.
function CertificateMarquee({ onOpen }) {
  const trackRef = useRef(null);
  const wheelVelocityRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let position = 0;
    let drift = DRIFT_SPEED;
    let lastTime = performance.now();
    let frame;

    const animate = (time) => {
      const elapsed = Math.min(time - lastTime, 40);
      const targetDrift = pausedRef.current ? 0 : DRIFT_SPEED;
      drift += (targetDrift - drift) * Math.min(1, elapsed / 180);
      const loopWidth = track.scrollWidth / 2;

      position += ((drift + wheelVelocityRef.current) * elapsed) / 1000;
      wheelVelocityRef.current *= Math.pow(0.08, elapsed / 1000);

      if (loopWidth > 0) {
        if (position <= -loopWidth) position += loopWidth;
        if (position >= 0) position -= loopWidth;
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
      lastTime = time;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleWheel = (event) => {
    const horizontalDelta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
    if (!horizontalDelta) return;
    wheelVelocityRef.current = Math.max(-360, Math.min(360, wheelVelocityRef.current - horizontalDelta * 2.4));
  };

  const setPaused = (paused) => () => { pausedRef.current = paused; };

  return (
    <div
      className="certificate-marquee"
      aria-label="Certificates and acknowledgements"
      onWheel={handleWheel}
      onPointerEnter={setPaused(true)}
      onPointerLeave={setPaused(false)}
      onFocus={setPaused(true)}
      onBlur={setPaused(false)}
    >
      <div className="certificate-track" ref={trackRef}>
        {[...certificateItems, ...certificateItems].map((certificate, index) => (
          <button
            className="certificate-card"
            key={`${certificate.title}-${index}`}
            type="button"
            onClick={() => onOpen(certificate)}
            aria-label={`View ${certificate.title}`}
            tabIndex={index < certificateItems.length ? 0 : -1}
          >
            <span className="certificate-image-wrap">
              <img
                src={certificate.image}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.nextElementSibling.hidden = false;
                }}
              />
              <span className="certificate-placeholder" hidden aria-hidden="true">Add image</span>
            </span>
            <span className="certificate-type">{certificate.type}</span>
            <strong>{certificate.title}</strong>
            <span className="certificate-open">View <span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CertificateModal({ certificate, onClose }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="certificate-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="certificate-modal" role="dialog" aria-modal="true" aria-label={certificate.title} onClick={(event) => event.stopPropagation()}>
        <button className="certificate-modal-close" type="button" onClick={onClose} aria-label="Close certificate preview" autoFocus>×</button>
        <img src={certificate.image} alt={certificate.title} />
        <p>{certificate.type}</p>
        <h3>{certificate.title}</h3>
      </div>
    </div>
  );
}

function CertificatesSection() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <>
      <section className="portfolio-section certificates-section" id="certifications">
        <SectionHeading
          className="certificates-heading"
          kicker="Proof of practice"
          title="Certificates & acknowledgements"
          intro="A moving archive of the learning, recognition, and communities that have shaped my work."
        />
        <CertificateMarquee onOpen={setSelectedCertificate} />
      </section>

      {selectedCertificate && (
        <CertificateModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />
      )}
    </>
  );
}

export default CertificatesSection;
