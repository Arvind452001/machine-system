import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "../api/contentApi";

const fallbackAboutData = {
  hero: {
    eyebrow: "People, machines, and know-how",
    title: "Good production starts with the right fit.",
    subtitle:
      "We bring industrial machinery and practical guidance together, helping you explore options that make sense for your work—not just a catalogue.",
  },
  stories: [
    {
      id: "purpose",
      tag: "01 / OUR PURPOSE",
      eyebrow: "What drives us",
      title: "Machines should make a real difference.",
      paragraphs: [
        "Every production challenge is different. We believe the right machine conversation starts with what you make, how you work, and where you want to go—not with a one-size-fits-all answer.",
        "That is why we bring considered machinery together with practical expertise, helping you explore what may fit your operation and your next stage of growth.",
      ],
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Manufacturing specialist reviewing a production process",
      isReversed: false,
      linkText: "",
      linkUrl: "",
    },
    {
      id: "machines",
      tag: "02 / OUR MACHINES",
      eyebrow: "Built for production",
      title: "Capability that starts with your process.",
      paragraphs: [
        "Our range spans turning, milling, and laser systems, with different platforms and options to consider. We help make the details easier to compare so you can focus on the capabilities that matter.",
        "Explore machine information as a starting point, then talk with a specialist to discuss applications, specifications, and availability for your requirements.",
      ],
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Industrial equipment set up in a modern workshop",
      isReversed: true,
      linkText: "Explore the machine range",
      linkUrl: "/machines",
    },
    {
      id: "approach",
      tag: "03 / OUR APPROACH",
      eyebrow: "Thoughtful guidance",
      title: "Make the complex feel manageable.",
      paragraphs: [
        "Machine selection can involve a lot of questions—from materials and tolerances to floor space and future capacity. We make room for those questions at every step.",
        "Browse the range, explore configuration choices, and share the details you have. Together, we can identify what needs a closer look before you make a decision.",
      ],
      image:
        "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Engineer examining industrial machinery in a factory",
      isReversed: false,
      linkText: "See how it works",
      linkUrl: "/how-it-works",
    },
    {
      id: "people",
      tag: "04 / OUR PEOPLE",
      eyebrow: "Local expertise",
      title: "Real people, close to your work.",
      paragraphs: [
        "A useful conversation is grounded in your application. Our representative-led process connects your enquiry with a person who can understand your needs and help move the discussion forward.",
        "Whether you are comparing options or ready to discuss a quote, you can bring the questions you have and get support with the next step.",
      ],
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Technical team collaborating around manufacturing equipment",
      isReversed: true,
      linkText: "Talk to our team",
      linkUrl: "/contact",
    },
  ],
};

const About = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(fallbackAboutData);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    contentApi
      .getContentBySlug("about")
      .then((res) => {
        if (!mounted) return;
        const rawItem = res?.data || res;
        if (rawItem && rawItem.body) {
          try {
            if (typeof rawItem.body === "string" && rawItem.body.trim().startsWith("{")) {
              const parsed = JSON.parse(rawItem.body);
              setAboutData({
                hero: parsed.hero || fallbackAboutData.hero,
                stories: Array.isArray(parsed.stories) ? parsed.stories : fallbackAboutData.stories,
              });
            } else if (typeof rawItem.body === "object") {
              setAboutData(rawItem.body);
            }
          } catch (e) {
            console.warn("Using fallback about data:", e);
          }
        }
      })
      .catch((err) => {
        console.error("Could not fetch about content from API:", err);
        if (mounted) setError("Could not connect to content API.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const hero = aboutData.hero || fallbackAboutData.hero;
  const stories = Array.isArray(aboutData.stories) && aboutData.stories.length > 0
    ? aboutData.stories
    : fallbackAboutData.stories;

  return (
    <main>
      <div className="page-crumb">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home
        </Link>
        <span>/</span>
        <span>About Us</span>
      </div>

      <section className="info-hero">
        <div>
          <div className="eyebrow">
            <span></span> {hero.eyebrow}
          </div>
          <h1>
            {hero.title.includes("starts with") ? (
              <>
                {hero.title.split("starts with")[0]}starts with{" "}
                <em>{hero.title.split("starts with")[1]}</em>
              </>
            ) : (
              hero.title
            )}
          </h1>
          <p>{hero.subtitle}</p>
        </div>
      </section>

      {loading ? (
        <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
          <div className="spinner-border text-danger" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "1rem", color: "#666" }}>Loading About Us...</p>
        </div>
      ) : (
        <section className="about-stories" aria-label="About MACHINE Systems">
          {stories.map((story, index) => {
            const isReversed = Boolean(story.isReversed);
            const tagNumber = String(index + 1).padStart(2, "0");
            const tag = story.tag || `${tagNumber} / STORY`;

            return (
              <article
                key={story.id || index}
                className={`about-story ${isReversed ? "is-reversed" : ""}`}
              >
                <figure className="about-story-image">
                  <img
                    src={story.image}
                    alt={story.imageAlt || story.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <figcaption>{tag}</figcaption>
                </figure>
                <div className="about-story-copy">
                  {story.eyebrow && (
                    <div className="eyebrow">
                      <span></span> {story.eyebrow}
                    </div>
                  )}
                  <h2>{story.title}</h2>
                  {Array.isArray(story.paragraphs) ? (
                    story.paragraphs.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))
                  ) : (
                    <p>{story.paragraphs}</p>
                  )}
                  {story.linkText && story.linkUrl && (
                    <Link className="info-link" to={story.linkUrl}>
                      {story.linkText} <i className="bi bi-arrow-right"></i>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default About;
