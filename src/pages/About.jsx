import { Link } from "react-router-dom";

const About = () => {
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
            <span></span> People, machines, and know-how
          </div>
          <h1>
            Good production starts with <em> the right fit.</em>
          </h1>
          <p>
            We bring industrial machinery and practical guidance together,
            helping you explore options that make sense for your work—not just a
            catalogue.
          </p>
        </div>
      </section>

      <section className="about-stories" aria-label="About MACHINE Systems">
        <article className="about-story">
          <figure className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85"
              alt="Manufacturing specialist reviewing a production process"
              loading="lazy"
            />
            <figcaption>01 / OUR PURPOSE</figcaption>
          </figure>
          <div className="about-story-copy">
            <div className="eyebrow">
              <span></span> What drives us
            </div>
            <h2>
              Machines should make a <em> real difference.</em>
            </h2>
            <p>
              Every production challenge is different. We believe the right
              machine conversation starts with what you make, how you work, and
              where you want to go—not with a one-size-fits-all answer.
            </p>
            <p>
              That is why we bring considered machinery together with practical
              expertise, helping you explore what may fit your operation and
              your next stage of growth.
            </p>
          </div>
        </article>

        <article className="about-story is-reversed">
          <figure className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=85"
              alt="Industrial equipment set up in a modern workshop"
              loading="lazy"
            />
            <figcaption>02 / OUR MACHINES</figcaption>
          </figure>
          <div className="about-story-copy">
            <div className="eyebrow">
              <span></span> Built for production
            </div>  
            <h2>
              Capability that starts with <em> your process.</em>
            </h2>
            <p>
              Our range spans turning, milling, and laser systems, with
              different platforms and options to consider. We help make the
              details easier to compare so you can focus on the capabilities that
              matter.
            </p>
            <p>
              Explore machine information as a starting point, then talk with a
              specialist to discuss applications, specifications, and
              availability for your requirements.
            </p>
            <Link className="info-link" to="/machines">
              Explore the machine range <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </article>

        <article className="about-story">
          <figure className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1400&q=85"
              alt="Engineer examining industrial machinery in a factory"
              loading="lazy"
            />
            <figcaption>03 / OUR APPROACH</figcaption>
          </figure>
          <div className="about-story-copy">
            <div className="eyebrow">
              <span></span> Thoughtful guidance
            </div>
            <h2>
              Make the complex feel <em> manageable.</em>
            </h2>
            <p>
              Machine selection can involve a lot of questions—from materials
              and tolerances to floor space and future capacity. We make room
              for those questions at every step.
            </p>
            <p>
              Browse the range, explore configuration choices, and share the
              details you have. Together, we can identify what needs a closer
              look before you make a decision.
            </p>
            <Link className="info-link" to="/how-it-works">
              See how it works <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </article>

        <article className="about-story is-reversed">
          <figure className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1400&q=85"
              alt="Technical team collaborating around manufacturing equipment"
              loading="lazy"
            />
            <figcaption>04 / OUR PEOPLE</figcaption>
          </figure>
          <div className="about-story-copy">
            <div className="eyebrow">
              <span></span> Local expertise
            </div>
            <h2>
              Real people, close to <em>your work.</em>  
            </h2>
            <p>
              A useful conversation is grounded in your application. Our
              representative-led process connects your enquiry with a person who
              can understand your needs and help move the discussion forward.
            </p>
            <p>
              Whether you are comparing options or ready to discuss a quote, you
              can bring the questions you have and get support with the next
              step.
            </p>
            <Link className="info-link" to="/contact">
              Talk to our team <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
};

export default About;
