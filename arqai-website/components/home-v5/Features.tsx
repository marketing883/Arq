import { ChatIcon, DocIcon, InsightIcon, ShieldIcon, SparkIcon } from "./icons";

export default function Features() {
  return (
    <section className="v5-section v5-bg-grey" id="features">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Features
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">
              We Make Operational AI work inside your enterprise
            </h2>
            <p className="v5-lead">
              Experience how our AI-powered features simplify workflows, automate
              routine tasks, and help your team achieve more—so you can focus on
              growing your business.
            </p>
          </div>
        </div>

        <div className="v5-features-grid">
          {/* AI Chat Support — wide */}
          <article className="v5-feature-card span-2">
            <div className="v5-feature-visual v5-chat">
              <div className="bubble">How many claims need review today?</div>
              <div className="bubble me">412 flagged — 18 high-risk. Want the breakdown?</div>
              <div className="bubble">Yes, show the high-risk ones.</div>
            </div>
            <div className="v5-feature-icon">
              <ChatIcon />
            </div>
            <h3 className="v5-h3">AI Chat Support</h3>
            <p className="v5-body">
              Conversational agents grounded in your data and policies — answering
              operational questions and triaging work the moment it lands.
            </p>
          </article>

          {/* Smart Document */}
          <article className="v5-feature-card">
            <div className="v5-feature-visual v5-doc">
              <div className="line" style={{ width: "90%" }} />
              <div className="line lime" />
              <div className="line" style={{ width: "70%" }} />
              <div className="line" style={{ width: "80%" }} />
            </div>
            <div className="v5-feature-icon">
              <DocIcon />
            </div>
            <h3 className="v5-h3">Smart Document</h3>
            <p className="v5-body">
              Extract, classify, and validate documents at scale — turning messy
              paperwork into structured, audit-ready data.
            </p>
          </article>

          {/* AI Business Insights */}
          <article className="v5-feature-card">
            <div className="v5-feature-visual v5-bars">
              <div className="bar" style={{ height: "40%" }} />
              <div className="bar" style={{ height: "65%" }} />
              <div className="bar lime" style={{ height: "90%" }} />
              <div className="bar" style={{ height: "55%" }} />
              <div className="bar" style={{ height: "75%" }} />
            </div>
            <div className="v5-feature-icon">
              <InsightIcon />
            </div>
            <h3 className="v5-h3">AI Business Insights</h3>
            <p className="v5-body">
              Surface the signal in your operations with insights that explain the
              &ldquo;why&rdquo; behind every number.
            </p>
          </article>

          {/* AI Detection — wide */}
          <article className="v5-feature-card span-2">
            <div className="v5-feature-visual v5-doc">
              <div className="line" style={{ width: "60%" }} />
              <div className="line lime" style={{ width: "30%" }} />
              <div className="line" style={{ width: "85%" }} />
              <div className="line" style={{ width: "50%" }} />
            </div>
            <div className="v5-feature-icon">
              <ShieldIcon />
            </div>
            <h3 className="v5-h3">AI Detection</h3>
            <p className="v5-body">
              Catch fraud, waste, and anomalies generic tools miss. Vertical-specific
              models trained on the patterns that matter in your industry — with proof
              attached to every flag.
            </p>
          </article>

          {/* Content Generation */}
          <article className="v5-feature-card">
            <div className="v5-feature-visual v5-doc">
              <div className="line" style={{ width: "75%" }} />
              <div className="line" style={{ width: "95%" }} />
              <div className="line lime" style={{ width: "45%" }} />
            </div>
            <div className="v5-feature-icon">
              <SparkIcon />
            </div>
            <h3 className="v5-h3">Content Generation</h3>
            <p className="v5-body">
              Draft reports, summaries, and responses in your voice — grounded in your
              systems, ready for a human to approve.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
