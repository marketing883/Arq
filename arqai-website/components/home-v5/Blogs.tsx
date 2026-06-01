import { ArrowRight } from "./icons";
import { INSIGHTS } from "./content";

export default function Blogs() {
  return (
    <section className="v5-section v5-bg-grey" id="insights">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {INSIGHTS.eyebrow}
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">{INSIGHTS.heading}</h2>
            <p className="v5-lead">{INSIGHTS.sub}</p>
          </div>
        </div>

        <div className="v5-blog-grid">
          {INSIGHTS.posts.map((post) => (
            <a className="v5-blog-card" href={INSIGHTS.cta.href} key={post.title}>
              <div className="v5-blog-cover">
                <img src={post.cover} alt="" />
              </div>
              <div className="v5-blog-body">
                <span className="v5-blog-meta">{post.date}</span>
                <h3 className="v5-h3">{post.title}</h3>
                <p className="v5-body">{post.body}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="v5-blog-foot">
          <a href={INSIGHTS.cta.href} className="v5-btn v5-btn-dark">
            {INSIGHTS.cta.label}
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
