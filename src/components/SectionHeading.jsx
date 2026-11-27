function SectionHeading({ kicker, title, intro, className = "" }) {
  return (
    <div className={`section-heading ${className}`.trim()}>
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      <p className="section-intro">{intro}</p>
    </div>
  );
}

export default SectionHeading;
