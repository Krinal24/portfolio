import { FiArrowUpRight, FiArrowUp, FiMail } from "react-icons/fi";
import { CONTACT_EMAIL, socialLinks } from "./socialLinks";

function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-cta">
          <p className="section-kicker">Let&apos;s talk</p>
          <h2>
            Have a system to make reliable, data to make useful, or an idea to build with AI?
            <span> I&apos;d love to hear about it.</span>
          </h2>
          <div className="footer-actions">
            <a className="footer-primary" href={`mailto:${CONTACT_EMAIL}`}>
              <FiMail aria-hidden="true" /> {CONTACT_EMAIL}
            </a>
            <a className="footer-secondary" href="https://www.linkedin.com/in/krinal-naghera/" target="_blank" rel="noreferrer">
              Message me on LinkedIn <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <ul className="footer-socials">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  <social.Icon aria-hidden="true" /> {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="footer-meta">© {year} Krinal Naghera · Built with React &amp; Vite</p>
          <a className="footer-top" href="#home">
            Back to top <FiArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
