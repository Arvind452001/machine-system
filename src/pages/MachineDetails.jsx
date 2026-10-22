import { Link } from "react-router-dom";
const MachineDetails = () => {
  return (
    <div>
       <main>
      <div className="page-crumb">
        <Link to="/machines">
          <i className="bi bi-arrow-left"></i> All machines

        </Link>
        <span>/</span>
        <span>Machine details</span>
      </div>
      <div className="container">
        <section className="machine-details-hero row align-items-end g-4">
          <div className="col-lg-8">
            <div className="eyebrow">
              <span></span> Northline machine platform


            </div>
            <h1>Find your 

              <em> work hours</em>
            </h1>
            <p>Compare machine specifications, starting prices, and application details. Choose a platform to configure it for your production needs.</p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link className="button button-dark" to="/machines">Browse all machines 

              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </section>
        <section aria-labelledby="axis-title" className="machine-static-detail" id="axis-400">
          <article className="machine-profile row g-0">
            <div className="col-lg-6 machine-profile-visual">
              <img alt="Axis 400 precision CNC lathe" src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1400&amp;fmt=webp"/>
              <span className="machine-profile-label">AX-400 

                <i></i> PRECISION CNC LATHE

              </span>
            </div>
            <div className="col-lg-6 machine-profile-copy">
              <div className="machine-profile-kicker">
							CNC TURNING / AX-400
						</div>
              <h2 id="axis-title">Axis 400</h2>
              <p className="machine-profile-tagline">Precision, on repeat.</p>
              <p className="machine-profile-description">A compact turning platform for dependable, high-accuracy production. Built for shops that need flexible capacity without giving up floor space.</p>
              <div className="machine-spec-grid row g-2">
                <div className="col-6">
                  <span>WORK ENVELOPE</span>
                  <strong>Ø 400 × 620 mm</strong>
                </div>
                <div className="col-6">
                  <span>SPINDLE SPEED</span>
                  <strong>8,000 rpm</strong>
                </div>
                <div className="col-6">
                  <span>FOOTPRINT</span>
                  <strong>2.1 × 1.8 m</strong>
                </div>
                <div className="col-6">
                  <span>CONTROL</span>
                  <strong>Northline NC-8</strong>
                </div>
              </div>
              <div className="machine-commerce-price">
                <span>INDICATIVE STARTING PRICE · USD</span>
                <strong>$48,500</strong>
                <small>Final price confirmed after options and application review.</small>
              </div>
              <div className="machine-commerce-actions">
                <Link className="button button-lime" to="/configure#axis-config">
                  <i className="bi bi-sliders"></i> Configure options

                </Link>
                <Link className="button button-dark" to="/enquiry">Enquiry Now 

                  <i className="bi bi-chat-dots"></i>
                </Link>
              </div>
              <div className="machine-commerce-note">
                <span>
                  <i className="bi bi-check-circle"></i> Quote reviewed by a machine specialist

                </span>
                <span>
                  <i className="bi bi-truck"></i> Delivery and installation planned with your team

                </span>
              </div>
            </div>
          </article>
          <div className="machine-information row g-4">
            <div className="col-lg-5">
              <div className="machine-information-panel">
                <div className="machine-profile-kicker">
								APPLICATION FIT
							</div>
                <h3>Where Axis 400 fits your work</h3>
                <p>Flexible turning work, small and medium batches, and shops that need a capable CNC lathe in a compact footprint.</p>
                <Link to="/contact">Discuss your application 

                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="machine-benefits-panel">
                <div className="machine-profile-kicker">
								PLATFORM HIGHLIGHTS
							</div>
                <div className="machine-benefit-list">
                  <div>
                    <span>01</span>
                    <strong>Compact floor plan</strong>
                    <i className="bi bi-check2"></i>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Flexible turning capacity</strong>
                    <i className="bi bi-check2"></i>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Repeatable production setup</strong>
                    <i className="bi bi-check2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section aria-labelledby="related-heading" className="related-machines-section py-5" style={{ background: "#fffaf8" }}>
        <div className="container">
          <div className="related-machines-heading">
            <div>
              <div className="eyebrow">
                <span></span> Complete your production setup


              </div>
              <h2 id="related-heading">Related 

                <em> machines &amp; solutions.</em>
              </h2>
              <p>Swipe or scroll to explore eight products and production options.</p>
            </div>
            <div className="related-carousel-controls" aria-label="Carousel controls">
              <button type="button" id="related-prev" aria-label="Previous related items">
                <i className="bi bi-arrow-left"></i>
              </button>
              <button type="button" id="related-next" aria-label="Next related items">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
          <div aria-label="Related machines and solutions" className="related-machine-track">
            <Link className="related-machine-card" to="/machines#contact">
              <span className="related-machine-image">
                <img alt="Axis 520 high-capacity CNC lathe" src="https://assets.haascnc.com/is/image/haascnc/ST-30?wid=800&amp;fmt=webp"/>
                <span>AX-520</span>
              </span>
              <span className="related-machine-copy">
                <small>HIGH-CAPACITY CNC LATHE</small>
                <strong>Axis 520</strong>
                <span>$61,200 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">More turning capacity for larger workpieces.</span>
              </span>
            </Link>
            <Link className="related-machine-card" to="/machines#contact">
              <span className="related-machine-image">
                <img alt="Arc 900 five-axis machining centre" src="https://assets.haascnc.com/is/image/haascnc/VF-2TR?wid=800&amp;fmt=webp"/>
                <span>AR-900</span>
              </span>
              <span className="related-machine-copy">
                <small>5-AXIS MACHINING CENTRE</small>
                <strong>Arc 900</strong>
                <span>$118,900 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">Five-axis flexibility for complex parts.</span>
              </span>
            </Link>
            <Link className="related-machine-card" to="/machines#contact">
              <span className="related-machine-image">
                <img alt="Flare 12 fiber laser system" src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&amp;fit=crop&amp;w=800&amp;q=85"/>
                <span>FL-12000</span>
              </span>
              <span className="related-machine-copy">
                <small>12 KW FIBER LASER SYSTEM</small>
                <strong>Flare 12</strong>
                <span>$149,800 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">High-power sheet cutting for faster throughput.</span>
              </span>
            </Link>
            <Link className="related-machine-card" to="/contact">
              <span className="related-machine-image">
                <img alt="Machine workholding fixtures" src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&amp;fit=crop&amp;w=800&amp;q=85"/>
                <span>SETUP ESSENTIALS</span>
              </span>
              <span className="related-machine-copy">
                <small>WORKHOLDING &amp; FIXTURES</small>
                <strong>Workholding package</strong>
                <span>Request a quote 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">Plan chuck, fixture, and tooling needs for your parts.</span>
              </span>
            </Link>
            <Link className="related-machine-card" to="/contact">
              <span className="related-machine-image">
                <img alt="Automated manufacturing cell" src="https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&amp;fit=crop&amp;w=800&amp;q=85"/>
                <span>CELL READY</span>
              </span>
              <span className="related-machine-copy">
                <small>MATERIAL HANDLING</small>
                <strong>Automation package</strong>
                <span>Request a quote 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">Explore loading and automation options.</span>
              </span>
            </Link>
            <Link className="related-machine-card" to="/contact">
              <span className="related-machine-image">
                <img alt="Industrial cutting tools" src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&amp;fit=crop&amp;w=800&amp;q=85"/>
                <span>CUTTING TOOLS</span>
              </span>
              <span className="related-machine-copy">
                <small>TOOLING &amp; ACCESSORIES</small>
                <strong>Tooling package</strong>
                <span>Request a quote 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">Match tooling to materials and operations.</span>
              </span>
            </Link>
            <Link className="related-machine-card" to="/contact">
              <span className="related-machine-image">
                <img alt="Industrial machine installation" src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&amp;fit=crop&amp;w=800&amp;q=85"/>
                <span>SITE PREPARATION</span>
              </span>
              <span className="related-machine-copy">
                <small>DELIVERY &amp; INSTALLATION</small>
                <strong>Installation planning</strong>
                <span>Plan with our team 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">Coordinate delivery, placement, and commissioning.</span>
              </span>
            </Link>
            <Link className="related-machine-card" to="/contact">
              <span className="related-machine-image">
                <img alt="Machine operator training" src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&amp;fit=crop&amp;w=800&amp;q=85"/>
                <span>NORTHLINE SUPPORT</span>
              </span>
              <span className="related-machine-copy">
                <small>TRAINING &amp; APPLICATIONS</small>
                <strong>Operator training</strong>
                <span>Plan with our team 

                  <i className="bi bi-arrow-up-right"></i>
                </span>
                <span className="related-machine-description">Prepare operators for setup and production.</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
    </div>
  )
}

export default MachineDetails
