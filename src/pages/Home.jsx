import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div>
        <main>
      <section className="hero hero-slider" aria-label="MACHINE industrial machinery">
        <div className="hero-copy">
          <div className="eyebrow">
            <span></span> Precision equipment. Personal expertise.

          </div>
          <h1>Your next great<br/>run starts 

            <em>here.</em>
          </h1>
          <p>Discover dependable industrial machines, configure the details for your work, and get a considered quote from a local expert.</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/machines">Explore machines 

              <i className="bi bi-arrow-up-right"></i>
            </Link>
            <Link className="quiet-link" to="#how-it-works">See how it works 

              <i className="bi bi-arrow-down-right"></i>
            </Link>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              <span>JM</span>
              <span>AL</span>
              <span>RK</span>
            </div>
            <span>Trusted by makers in 

              <strong>28 countries</strong>
            </span>
          </div>
        </div>
        <div className="carousel slide hero-image-carousel" id="machineHero" data-carousel data-carousel-interval="6000" aria-label="Machine photography">
          <div className="carousel-inner" data-carousel-track>
            <div className="carousel-item active" data-carousel-slide>
              <div className="hero-image">
                <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="Precision industrial equipment on a production floor"/></div>
            </div>
            <div className="carousel-item" data-carousel-slide>
              <div className="hero-image">
                <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Machining equipment inside a bright factory"/></div>
            </div>
            <div className="carousel-item" data-carousel-slide>
              <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=85" alt="Industrial cutting equipment in a production cell"/></div>
            </div>
          </div>
          <button className="carousel-control-prev hero-carousel-control" type="button" data-carousel-prev aria-label="Previous machine image">
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="carousel-control-next hero-carousel-control" type="button" data-carousel-next aria-label="Next machine image">
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
        <div className="hero-vertical">CONFIGURE 

          <span>·</span> COMPARE 

          <span>·</span> CONNECT

        </div>
      </section>
      <section className="about-section section-space" id="about" aria-labelledby="about-title">
        <div className="row g-5 align-items-center">
          <div className="about-media col-12 col-lg-5">
            <div className="about-image-stack">
              <figure className="about-image about-image-main">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85" alt="MACHINE engineer reviewing equipment on a production floor" loading="lazy"/>
                <figcaption>ENGINEERED AROUND REAL WORK</figcaption>
              </figure>
            </div>
          </div>
          <div className="about-copy col-12 col-lg-6 offset-lg-1">
            <div className="eyebrow">
              <span></span> About MACHINE

            </div>
            <h2 id="about-title">Built around your work.<br/>
              <em>Ready for what's next.</em>
            </h2>
            <p>MACHINE pairs proven industrial machinery with practical, local expertise. We start with your parts, materials, and production goals, then help you shape a platform that fits the work ahead.</p>
            <div className="about-points">
              <div>
                <i className="bi bi-check2"></i>
                <span>
                  <strong>Machines with purpose</strong>
                  <small>Turning, milling, and laser systems selected for real production needs.</small>
                </span>
              </div>
              <div>
                <i className="bi bi-check2"></i>
                <span>
                  <strong>Advice that stays practical</strong>
                  <small>Clear conversations about capability, options, and fit.</small>
                </span>
              </div>
              <div>
                <i className="bi bi-check2"></i>
                <span>
                  <strong>People close to your work</strong>
                  <small>Local specialists to help shape a considered specification.</small>
                </span>
              </div>
            </div>
            <Link className="button button-dark about-cta" to="#contact">More About Us 

              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </div>
      </section>
      <section className="proof-strip" aria-label="MACHINE at a glance">
        <article className="proof-card">
          <span className="proof-icon">
            <i className="bi bi-gear-wide-connected"></i>
          </span>
          <div>
            <strong>40

              <span>+</span>
            </strong>
            <p>years building production machinery</p>
          </div>
        </article>
        <article className="proof-card">
          <span className="proof-icon">
            <i className="bi bi-globe-americas"></i>
          </span>
          <div>
            <strong>28</strong>
            <p>countries with local support</p>
          </div>
        </article>
        <article className="proof-card">
          <span className="proof-icon">
            <i className="bi bi-person-check"></i>
          </span>
          <div>
            <strong>1:1</strong>
            <p>guidance from a real specialist</p>
          </div>
        </article>
        <article className="proof-card proof-card-note">
          <span className="proof-icon">
            <i className="bi bi-shield-check"></i>
          </span>
          <div>
            <strong>Made to work</strong>
            <p>Purpose-built machines. Support that stays with you.</p>
          </div>
        </article>
      </section>
      <section className="featured section-space" id="machines">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span></span> The MACHINE range

            </div>
            <h2>Find your starting point.</h2>
            <p>Six proven platforms. Plenty of room to make them yours.</p>
          </div>
          <Link className="text-arrow" to="/machines">View all machines 
<i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
        <div className="machine-carousel" data-carousel data-carousel-interval="7000" aria-label="Featured machines">
          <div className="machine-carousel-track" data-carousel-track>
            <div className="machine-carousel-page" data-carousel-slide>
              <div className="machine-grid">
                <article className="machine-card">
                  <Link className="machine-image" to="/machine-details#axis-400">
                    <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="Precision machining equipment on a production floor" loading="lazy"/>
                    <span className="machine-category">CNC · TURNING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AX-400</span>
                      <span>PRECISION CNC LATHE</span>
                    </div>
                    <h3>Axis 400</h3>
                    <p>Compact, accurate turning for flexible production.</p>
                    <div className="machine-card-bottom">
                      <span>FROM 

                        <strong>$48,500</strong>
                      </span>
                      <Link to="/machine-details#axis-400" aria-label="View Axis 400">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
                <article className="machine-card">
                  <Link className="machine-image" to="/machine-details#arc-700">
                    <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Industrial vertical machining centre" loading="lazy"/>
                    <span className="machine-category">CNC · MILLING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AR-700</span>
                      <span>VERTICAL MACHINING CENTRE</span>
                    </div>
                    <h3>Arc 700</h3>
                    <p>Rigid, versatile machining for demanding parts.</p>
                    <div className="machine-card-bottom">
                      <span>FROM 

                        <strong>$72,400</strong>
                      </span>
                      <Link to="/machine-details#arc-700" aria-label="View Arc 700">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
                <article className="machine-card">
                  <Link className="machine-image" to="/machine-details#flare-6">
                    <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=85" alt="Industrial laser cutting machinery" loading="lazy"/>
                    <span className="machine-category">LASER · CUTTING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>FL-6000</span>
                      <span>FIBER LASER SYSTEM</span>
                    </div>
                    <h3>Flare 6</h3>
                    <p>Clean, fast sheet cutting in a production-ready cell.</p>
                    <div className="machine-card-bottom">
                      <span>FROM 

                        <strong>$96,300</strong>
                      </span>
                      <Link to="/machine-details#flare-6" aria-label="View Flare 6">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </div>
            <div className="machine-carousel-page" data-carousel-slide>
              <div className="machine-grid">
                <article className="machine-card">
                  <Link className="machine-image" to="/machines#contact">
                    <img src="https://assets.haascnc.com/is/image/haascnc/ST-30?wid=1200&amp;fmt=webp" alt="Industrial turning equipment in a machine shop" loading="lazy"/>
                    <span className="machine-category">CNC · HEAVY TURNING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AX-520</span>
                      <span>HIGH-CAPACITY CNC LATHE</span>
                    </div>
                    <h3>Axis 520</h3>
                    <p>Extra turning capacity for larger, demanding workpieces.</p>
                    <div className="machine-card-bottom">
                      <span>FROM 

                        <strong>$61,200</strong>
                      </span>
                      <Link to="/machines#contact" aria-label="Ask about Axis 520">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
                <article className="machine-card">
                  <Link className="machine-image" to="/machines#contact">
                    <img src="https://assets.haascnc.com/is/image/haascnc/VF-2TR?wid=1200&amp;fmt=webp" alt="Advanced machining equipment on a factory floor" loading="lazy"/>
                    <span className="machine-category">CNC · 5-AXIS MILLING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AR-900</span>
                      <span>5-AXIS MACHINING CENTRE</span>
                    </div>
                    <h3>Arc 900</h3>
                    <p>Five-axis flexibility for complex parts and fewer setups.</p>
                    <div className="machine-card-bottom">
                      <span>FROM 

                        <strong>$118,900</strong>
                      </span>
                      <Link to="/machines#contact" aria-label="Ask about Arc 900">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
                <article className="machine-card">
                  <Link className="machine-image" to="/machines#contact">
                    <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=85" alt="High-power laser production machinery" loading="lazy"/>
                    <span className="machine-category">LASER · HIGH POWER</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>FL-12000</span>
                      <span>12 KW FIBER LASER SYSTEM</span>
                    </div>
                    <h3>Flare 12</h3>
                    <p>High-power sheet cutting for faster throughput at scale.</p>
                    <div className="machine-card-bottom">
                      <span>FROM 

                        <strong>$149,800</strong>
                      </span>
                      <Link to="/machines#contact" aria-label="Ask about Flare 12">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <div className="machine-carousel-controls">
            <button type="button" data-carousel-prev aria-label="Previous three machines">
              <i className="bi bi-arrow-left"></i>
            </button>
            <div className="field-indicators" aria-label="Choose machine page">
              <button className="active" type="button" data-carousel-to="0" aria-current="true" aria-label="Machines 1 to 3"></button>
              <button type="button" data-carousel-to="1" aria-label="Machines 4 to 6"></button>
            </div>
            <button type="button" data-carousel-next aria-label="Next three machines">
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
      <section className="how-section" id="how-it-works">
        <div className="how-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> A clearer way to buy

          </div>
          <h2>From first idea<br/>to first 

            <em>part.</em>
          </h2>
          <p>Get a useful estimate, then work through the important details with someone who knows the machine and your market.</p>
          <Link className="button button-dark" to="/machines">Start configuring 

            <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
        <div className="steps-list">
          <article className="journey-step">
            <span className="step-number">01</span>
            <span className="step-icon">
              <i className="bi bi-toggles"></i>
            </span>
            <div>
              <h3>Choose your platform</h3>
              <p>Compare machine capabilities, footprint, and starting price.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
          <article className="journey-step">
            <span className="step-number">02</span>
            <span className="step-icon">
              <i className="bi bi-sliders"></i>
            </span>
            <div>
              <h3>Shape your specification</h3>
              <p>Explore available options and build a clear starting configuration.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
          <article className="journey-step">
            <span className="step-number">03</span>
            <span className="step-icon">
              <i className="bi bi-chat-dots"></i>
            </span>
            <div>
              <h3>Talk with a local expert</h3>
              <p>Share your application and discuss the requirements that matter.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
          <article className="journey-step">
            <span className="step-number">04</span>
            <span className="step-icon">
              <i className="bi bi-file-earmark-check"></i>
            </span>
            <div>
              <h3>Receive your final quote</h3>
              <p>Your representative confirms the details and prepares a tailored quotation.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
        </div>
      </section>
      <section className="capability-section section-space">
        <div className="capability-photo">
          <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1100&q=85" alt="Engineer inspecting industrial manufacturing equipment" loading="lazy"/>
          <span>BUILT WITH THE PEOPLE WHO RUN IT</span>
        </div>
        <div className="capability-copy">
          <div className="eyebrow">
            <span></span> More than a machine

          </div>
          <h2>Good engineering<br/>keeps showing up.</h2>
          <p>Every production floor has its own pressures. Our team helps match the right platform and options to your material, workflow, and plans for growth.</p>
          <div className="capability-points">
            <div>
              <i className="bi bi-check2"></i>
              <span>
                <strong>Practical guidance</strong>
                <small>Talk through the application with a real specialist.</small>
              </span>
            </div>
            <div>
              <i className="bi bi-check2"></i>
              <span>
                <strong>Regional support</strong>
                <small>Work with a representative who understands your market.</small>
              </span>
            </div>
            <div>
              <i className="bi bi-check2"></i>
              <span>
                <strong>A considered quote</strong>
                <small>Final pricing follows a technical conversation.</small>
              </span>
            </div>
          </div>
          <Link className="text-arrow" to="/contact">Meet your local team 

            <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
      </section>
      <section className="testimonial-section" id="testimonial">
        <div className="testimonial-intro">
          <div>
            <div className="eyebrow">
              <span></span> Customer stories · Sample

            </div>
            <h2>Good work travels.<br/>
              <em>Good partners stay.</em>
            </h2>
          </div>
          <p>Example customer feedback for this design preview.</p>
        </div>
        <div className="carousel slide testimonial-carousel" id="customerStories" data-carousel data-carousel-interval="7000">
          <div className="carousel-inner testimonial-pages" data-carousel-track>
            <div className="carousel-item active testimonial-page" id="customer-story-page-1" data-carousel-slide>
              <figure className="testimonial-card">
                <img className="testimonial-photo" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" alt="Portrait of Daniel Torres" loading="lazy"/><blockquote>â€œWe arrived with a part, a deadline, and a lot of questions. The team helped us get clear on the right setup before we made a decision.â€</blockquote>
                <figcaption>
                  <strong>Daniel Torres</strong>
                  <span>Operations Director</span>
                  <small>Meridian Precision Works · Ohio, USA</small>
                </figcaption>
                <span className="testimonial-mark">
                  <i className="bi bi-quote"></i>
                </span>
              </figure>
              <figure className="testimonial-card">
                <img className="testimonial-photo" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" alt="Portrait of Lauren Chen" loading="lazy"/><blockquote>â€œThe options made our first conversation more useful. We could focus on throughput, tooling, and floor space straight away.â€</blockquote>
                <figcaption>
                  <strong>Lauren Chen</strong>
                  <span>Manufacturing Lead</span>
                  <small>Summit Components · Ontario, Canada</small>
                </figcaption>
                <span className="testimonial-mark">
                  <i className="bi bi-quote"></i>
                </span>
              </figure>
              <figure className="testimonial-card">
                <img className="testimonial-photo" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80" alt="Portrait of Marco Silva" loading="lazy"/><blockquote>â€œWe needed a flexible platform, not a one-size-fits-all quote. The regional team helped us work through the trade-offs.â€</blockquote>
                <figcaption>
                  <strong>Marco Silva</strong>
                  <span>Owner</span>
                  <small>Formline Fabrication · Lisbon, Portugal</small>
                </figcaption>
                <span className="testimonial-mark">
                  <i className="bi bi-quote"></i>
                </span>
              </figure>
            </div>
            <div className="carousel-item testimonial-page" id="customer-story-page-2" data-carousel-slide>
              <figure className="testimonial-card">
                <img className="testimonial-photo" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80" alt="Portrait of Amelia Brooks" loading="lazy"/><blockquote>We could see the available options and likely investment before bringing our whole production team into the discussion.</blockquote>
                <figcaption>
                  <strong>Amelia Brooks</strong>
                  <span>Plant Manager</span>
                  <small>North Ridge Tooling · Michigan, USA</small>
                </figcaption>
                <span className="testimonial-mark">
                  <i className="bi bi-quote"></i>
                </span>
              </figure>
              <figure className="testimonial-card">
                <img className="testimonial-photo" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" alt="Portrait of Ethan Miller" loading="lazy"/><blockquote>Our local representative understood the material and the tolerances. The conversation felt grounded in our real work.</blockquote>
                <figcaption>
                  <strong>Ethan Miller</strong>
                  <span>Production Engineer</span>
                  <small>Fieldstone Manufacturing · Alberta, Canada</small>
                </figcaption>
                <span className="testimonial-mark">
                  <i className="bi bi-quote"></i>
                </span>
              </figure>
              <figure className="testimonial-card">
                <img className="testimonial-photo" src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80" alt="Portrait of Sofia Martin" loading="lazy"/><blockquote>Having a clear starting specification made it much easier to discuss the custom details that matter to our shop.</blockquote>
                <figcaption>
                  <strong>Sofia Martin</strong>
                  <span>Managing Director</span>
                  <small>Atelier Motion · Lyon, France</small>
                </figcaption>
                <span className="testimonial-mark">
                  <i className="bi bi-quote"></i>
                </span>
              </figure>
            </div>
          </div>
          <div className="testimonial-controls">
            <button className="carousel-control-prev story-control" type="button" data-carousel-prev aria-label="Previous customer stories">
              <i className="bi bi-arrow-left"></i>
            </button>
            <button className="carousel-control-next story-control" type="button" data-carousel-next aria-label="Next customer stories">
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
      <section className="faq-section section-space" id="faq" aria-label="Frequently asked questions">
        <div className="faq-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> Before you configure

          </div>
          <span className="faq-index">MACHINE FIELD NOTES 

          </span>
          <h2>Good questions.<br/>
            <em>Clear answers.</em>
          </h2>
          <p>Know what to expect before you choose a platform or start a conversation with our team.</p>
          <Link className="faq-contact" to="/contact">
            <i className="bi bi-headset"></i>
            <span>Have a specific application?

              <strong>Talk with a specialist</strong>
            </span>
            <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
        <div className="faq-list">
          <details open>
            <summary>
              <span className="faq-number">01</span>
              <span className="faq-question">Are the prices shown final?</span>
              <i className="bi bi-plus"></i>
            </summary>
            <p>Catalogue and configuration prices are indicative starting points. Your representative prepares a final quotation after reviewing the application, selected options, delivery, and installation requirements.</p>
          </details>
          <details>
            <summary>
              <span className="faq-number">02</span>
              <span className="faq-question">Can I review options with a specialist?</span>
              <i className="bi bi-plus"></i>
            </summary>
            <p>Yes. Send your configuration as an enquiry and a local representative can confirm compatibility, discuss custom requirements, and help refine the specification.</p>
          </details>
          <details>
            <summary>
              <span className="faq-number">03</span>
              <span className="faq-question">What happens after I send an enquiry?</span>
              <i className="bi bi-plus"></i>
            </summary>
            <p>Your regional sales representative reviews the configuration, contacts you to discuss the project, and prepares a tailored quotation based on that conversation.</p>
          </details>
          <details>
            <summary>
              <span className="faq-number">04</span>
              <span className="faq-question">Can delivery, installation, and training be included?</span>
              <i className="bi bi-plus"></i>
            </summary>
            <p>Yes. Your representative can review delivery, installation, commissioning, and operator training with you and include the agreed scope in the final quote.</p>
          </details>
        </div>
      </section>
      <section className="field-stories" id="field-stories" aria-label="MACHINE field stories">
        <div className="field-stories-heading">
          <div>
            <div className="eyebrow">
              <span></span> From the shop floor

            </div>
            <h2>Good work starts with<br/>
              <em>the right details.</em>
            </h2>
          </div>
          <p>Explore the machines, choices, and conversations that help shape a confident next step.</p>
        </div>
        <div className="carousel slide field-carousel" id="fieldCarousel" data-carousel data-carousel-interval="7000">
          <div className="carousel-inner" data-carousel-track>
            <div className="carousel-item active" id="field-story-1" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=85" alt="Engineer reviewing industrial production equipment" loading="lazy"/>
                  <span>01 / GETTING STARTED</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">A CLEARER FIRST STEP</span>
                  <h3>Start with the work you need to do.</h3>
                  <p>Part geometry, materials, tolerances, and output goals are a practical place to begin a machine conversation.</p>
                  <Link className="field-slide-link" to="/machines">Explore the machine range 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-2" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="CNC turning equipment on a production floor" loading="lazy"/>
                  <span>02 / CNC TURNING</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">AXIS 400 · AX-400</span>
                  <h3>Precision turning, built for flexibility.</h3>
                  <p>Explore the Axis 400 platform and compare a starting specification for short or long production runs.</p>
                  <Link className="field-slide-link" to="/machine-details#axis-400">View Axis 400 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-3" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Vertical machining centre in a factory" loading="lazy"/>
                  <span>03 / CNC MILLING</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">ARC 700 · AR-700</span>
                  <h3>Make room for demanding parts.</h3>
                  <p>Review the Arc 700 vertical machining platform, then discuss tooling, spindle, and coolant requirements.</p>
                  <Link className="field-slide-link" to="/machine-details#arc-700">View Arc 700 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-4" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85" alt="Laser cutting machinery in an industrial workspace" loading="lazy"/>
                  <span>04 / LASER CUTTING</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">FLARE 6 · FL-6000</span>
                  <h3>Bring sheet cutting into focus.</h3>
                  <p>Compare the Flare 6 starting platform and consider power, handling, extraction, and cutting area.</p>
                  <Link className="field-slide-link" to="/machine-details#flare-6">View Flare 6 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-5" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1200&q=85" alt="Manufacturing team working with industrial equipment" loading="lazy"/>
                  <span>05 / CONFIGURATION</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">YOUR BUILD · YOUR PROCESS</span>
                  <h3>Shape a specification around your workflow.</h3>
                  <p>Use the configuration preview to compare options, then bring the details to your local representative.</p>
                  <Link className="field-slide-link" to="/configure#axis-config">Configure a machine 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-6" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85" alt="Specialist working with manufacturing equipment" loading="lazy"/>
                  <span>06 / LOCAL EXPERTISE</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">A REAL CONVERSATION</span>
                  <h3>Get practical guidance from a local team.</h3>
                  <p>Talk through your application, confirm compatible options, and work toward a quote that fits your operation.</p>
                  <Link className="field-slide-link" to="/enquiry">Start an enquiry 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
          </div>
          <div className="field-carousel-footer">
            <div className="field-indicators" aria-label="Choose a field story">
              <button className="active" type="button" data-carousel-to="0" aria-current="true" aria-label="Story 1"></button>
              <button type="button" data-carousel-to="1" aria-label="Story 2"></button>
              <button type="button" data-carousel-to="2" aria-label="Story 3"></button>
              <button type="button" data-carousel-to="3" aria-label="Story 4"></button>
              <button type="button" data-carousel-to="4" aria-label="Story 5"></button>
              <button type="button" data-carousel-to="5" aria-label="Story 6"></button>
            </div>
            <div className="field-carousel-controls">
              <button className="field-carousel-arrow" type="button" data-carousel-prev aria-label="Previous story">
                <i className="bi bi-arrow-left"></i>
              </button>
              <button className="field-carousel-arrow" type="button" data-carousel-next aria-label="Next story">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="closing-cta" id="contact">
        <div className="closing-icon">
          <i className="bi bi-chat-square-text"></i>
        </div>
        <div>
          <span className="eyebrow eyebrow-light">Your next shift starts somewhere</span>
          <h2>Let's find the right machine.</h2>
        </div>
        <p>Bring us the part, the process, or just the question.</p>
        <Link className="button button-dark" to="/machines">Explore the range 

          <i className="bi bi-arrow-right"></i>
        </Link>
      </section>
    </main>
    </div>
  )
}

export default Home
