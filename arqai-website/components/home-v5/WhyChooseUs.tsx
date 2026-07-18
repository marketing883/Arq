import { ArrowRight } from "./icons";
import { WHY } from "./content";

export default function WhyChooseUs() {
  return (
    <section className="v5-section v5-bg-white" id="why">
      <div className="v5-container">
        <div className="v5-why-head">
          <span className="v5-badge">
            <span className="v5-badge-dot" />
            {WHY.eyebrow}
          </span>
          <h2 className="v5-h2">{WHY.heading}</h2>
          <p className="v5-lead">{WHY.sub}</p>
        </div>

        <div className="v5-why-bento">
          {/* 120+ — dark card with abstract image */}
          <div className="v5-bento v5-bento-fraud">
            <img className="v5-bento-bg" src={WHY.abstractImage} alt="" loading="lazy" decoding="async" />
            <div className="v5-bento-body">
              <div className="v5-bento-num">{WHY.fraud.num}</div>
              <div className="v5-bento-title">{WHY.fraud.title}</div>
              <p className="v5-bento-text">{WHY.fraud.body}</p>
            </div>
          </div>

          {/* hand image */}
          <div className="v5-bento v5-bento-hand">
            <img src={WHY.handImage} alt="" loading="lazy" decoding="async" />
          </div>

          {/* 70% — green gradient */}
          <div className="v5-bento v5-bento-green">
            <div className="v5-bento-num">{WHY.reuse.num}</div>
            <div className="v5-bento-title">{WHY.reuse.title}</div>
            <p className="v5-bento-text">{WHY.reuse.body}</p>
          </div>

          {/* 100% — white */}
          <div className="v5-bento v5-bento-white">
            <div className="v5-bento-num">{WHY.governance.num}</div>
            <div className="v5-bento-title">{WHY.governance.title}</div>
            <p className="v5-bento-text">{WHY.governance.body}</p>
          </div>

          {/* $3.2M — dark with logos */}
          <div className="v5-bento v5-bento-waste">
            <div className="v5-bento-num">{WHY.waste.num}</div>
            <div className="v5-bento-title">{WHY.waste.title}</div>
            <span
              style={{
                display: "block",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: 0.65,
                marginBottom: 8,
              }}
            >
              Built on the modern AI stack
            </span>
            <div className="v5-bento-logos">
              {WHY.logos.map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" decoding="async" />
              ))}
            </div>
            <p className="v5-bento-text">{WHY.waste.body}</p>
          </div>
        </div>

        <div className="v5-why-foot">
          <a href={WHY.cta.href} className="v5-btn v5-btn-dark">
            {WHY.cta.label}
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
