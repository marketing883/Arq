import { ArrowRight } from "./icons";

const PRIMARY = {
  tag: "Operational AI",
  title: "Why production beats pilots: shipping AI that actually runs",
  meta: "8 min read · Strategy",
  href: "/blog",
};

const SECONDARY = [
  {
    tag: "Healthcare",
    title: "Inside a Blind Spot Assessment: finding waste vendors miss",
    meta: "6 min read",
    href: "/blog",
  },
  {
    tag: "Governance",
    title: "Proof on every decision: making AI auditable by design",
    meta: "5 min read",
    href: "/blog",
  },
];

export default function Blogs() {
  return (
    <section className="v5-section v5-bg-grey" id="blog">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Insights
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">Discover the Future of AI in Business</h2>
            <p className="v5-lead">
              Stay informed with expert-written articles on AI transformation,
              operational strategy, and enterprise innovation. Learn how to drive
              growth with the right technology.
            </p>
          </div>
        </div>

        <div className="v5-blog-grid">
          <a className="v5-blog-card primary" href={PRIMARY.href}>
            <div className="v5-blog-cover">
              <span className="v5-blog-tag">{PRIMARY.tag}</span>
            </div>
            <div className="v5-blog-body">
              <h3 className="v5-h3">{PRIMARY.title}</h3>
              <span className="v5-blog-meta">{PRIMARY.meta}</span>
            </div>
          </a>

          <div className="v5-blog-col">
            {SECONDARY.map((post) => (
              <a className="v5-blog-card secondary" href={post.href} key={post.title}>
                <div className="v5-blog-cover">
                  <span className="v5-blog-tag">{post.tag}</span>
                </div>
                <div className="v5-blog-body">
                  <h3 className="v5-h3">{post.title}</h3>
                  <span className="v5-blog-meta">{post.meta}</span>
                </div>
              </a>
            ))}
            <a href="/blog" className="v5-btn v5-btn-ghost" style={{ alignSelf: "flex-start" }}>
              View all insights
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
