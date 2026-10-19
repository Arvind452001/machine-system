import { Link } from "react-router-dom";
const CustomerWorkspace = () => {
  return (
     <div className="customer-shell">
      <aside className="customer-sidebar">
        <div className="customer-sidebar-intro">
          <span className="customer-nav-label">YOUR WORKSPACE</span>
          <h2>Built around<br/>your 

            <em>work.</em>
          </h2>
          <p>Enquiries, quotations, and machine details in one place.</p>
        </div>
        <nav className="customer-nav" aria-label="Customer navigation">
          <Link className="active" to="/customer-dashboard" aria-current="page">
            <i className="bi bi-grid-1x2"></i> Overview

          </Link>
          <Link to="/my-enquiries">
            <i className="bi bi-file-earmark-text"></i> My enquiries

          </Link>
          <Link to="/my-quotations">
            <i className="bi bi-receipt"></i> My quotations

          </Link>
          <Link to="/my-machines">
            <i className="bi bi-gear"></i> My machines

          </Link>
          <Link to="/profile-settings">
            <i className="bi bi-person-gear"></i> Profile settings

          </Link>
          <Link to="/login">
            <i className="bi bi-box-arrow-right"></i> Log out

          </Link>
        </nav>
        <div className="customer-sidebar-note">
          <i className="bi bi-headset"></i> Need a help?<br/>
        
        </div>
      </aside>
      <div className="customer-main">
        <main className="customer-content">
          <section className="customer-welcome">
            <div>
              <div className="eyebrow">
                <span></span> Customer overview

              </div>
              <h1>Your Northline 

                <em>workspace.</em>
              </h1>
              <p>Pick up where you left off or explore a machine for your next run.</p>
            </div>
            <Link className="button button-lime" to="/machines">
              <i className="bi bi-search"></i> Explore machines

            </Link>
          </section>
          <section className="customer-metrics" aria-label="Account summary">
            <article className="customer-metric">
              <span>OPEN ENQUIRIES</span>
              <strong>01</strong>
              <i className="bi bi-chat-square-text"></i>
            </article>
            <article className="customer-metric">
              <span>QUOTES READY</span>
              <strong>02</strong>
              <i className="bi bi-file-earmark-check"></i>
            </article>
            <article className="customer-metric">
              <span>BASKET ITEMS</span>
              <strong>01</strong>
              <i className="bi bi-bag-check"></i>
            </article>
            <article className="customer-metric customer-metric-dark">
              <span>MACHINE PLATFORMS</span>
              <strong>03</strong>
              <i className="bi bi-gear-wide-connected"></i>
            </article>
          </section>
          <section className="customer-recent-machines">
            <div className="customer-section-heading">
              <div>
                <span className="customer-section-kicker">RECENTLY VIEWED</span>
                <h2>Back to the machines.</h2>
              </div>
              <Link to="/machines">View catalogue 

                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
            <div className="customer-machine-grid">
              <Link className="customer-machine-card" to="/machine-details#axis-400">
                <span className="customer-machine-image">
                  <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="Industrial machining equipment"/>
                  <span>AX-400 · CNC TURNING</span>
                </span>
                <span className="customer-machine-info">
                  <small>PRECISION CNC LATHE</small>
                  <strong>Axis 400</strong>
                  <span>From $48,500 

                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </span>
              </Link>
              <Link className="customer-machine-card" to="/machine-details#arc-700">
                <span className="customer-machine-image">
                  <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Vertical machining equipment on a production floor"/>
                  <span>AR-700 · CNC MILLING</span>
                </span>
                <span className="customer-machine-info">
                  <small>VERTICAL MACHINING CENTRE</small>
                  <strong>Arc 700</strong>
                  <span>From $72,400 

                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </span>
              </Link>
              <Link className="customer-machine-card" to="/machine-details#flare-6">
                <span className="customer-machine-image">
                  <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=85" alt="Industrial laser cutting equipment"/>
                  <span>FL-6000 · LASER</span>
                </span>
                <span className="customer-machine-info">
                  <small>FIBER LASER SYSTEM</small>
                  <strong>Flare 6</strong>
                  <span>From $96,300 

                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </span>
              </Link>
            </div>
          </section>
          <div className="customer-overview">
            <section className="customer-panel customer-enquiries-panel">
              <div className="customer-panel-heading">
                <h2>Recent enquiries</h2>
                <Link to="/customer-dashboard">View all 

                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              <div className="customer-table-scroll" role="region" aria-label="Recent enquiries" tabIndex="0">
                <table className="customer-enquiries-table">
                  <thead>
                    <tr>
                      <th scope="col">Machine / reference</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Indicative price</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Axis 400 · Precision CNC lathe</strong>
                        <small>NL-ENQ-10482</small>
                      </td>
                      <td>Oct 12, 2026</td>
                      <td>
                        <span className="status-pill">Awaiting contact</span>
                      </td>
                      <td>$50,900</td>
                      <td>
                        <Link className="customer-details-button" to="/enquiry-details?id=NL-ENQ-10482">Details 

                          <i className="bi bi-arrow-up-right"></i>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Arc 700 · Vertical machining centre</strong>
                        <small>NL-ENQ-09916</small>
                      </td>
                      <td>Sep 28, 2026</td>
                      <td>
                        <span className="status-pill ready">Quote ready</span>
                      </td>
                      <td>$78,500</td>
                      <td>
                        <Link className="customer-details-button" to="/quotation-details?id=NL-Q-2026-0419">Details 

                          <i className="bi bi-arrow-up-right"></i>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Flare 6 · Fiber laser system</strong>
                        <small>NL-ENQ-08354</small>
                      </td>
                      <td>Aug 14, 2026</td>
                      <td>
                        <span className="status-pill ready">Quote ready</span>
                      </td>
                      <td>$108,600</td>
                      <td>
                        <Link className="customer-details-button" to="/quotation-details?id=NL-Q-2026-0382">Details 

                          <i className="bi bi-arrow-up-right"></i>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section className="customer-panel">
              <div className="customer-panel-heading">
                <h2>Quick links</h2>
              </div>
              <div className="customer-quicklinks">
                <Link to="/my-quotations">
                  <i className="bi bi-file-earmark-check"></i> Review latest quotation 

                  <i className="bi bi-arrow-up-right"></i>
                </Link>
                <Link to="/configure#axis-config">
                  <i className="bi bi-sliders"></i> Configure a machine 

                  <i className="bi bi-arrow-up-right"></i>
                </Link>
                <Link to="/enquiry">
                  <i className="bi bi-chat-square-text"></i> Start a new enquiry 

                  <i className="bi bi-arrow-up-right"></i>
                </Link>
                <Link to="/contact">
                  <i className="bi bi-headset"></i> Contact Northline 

                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>
            </section>
          </div>
          <p className="summary-note">Sample customer workspace. Account records and authentication are not connected in this static preview.</p>
        </main>
      </div>
    </div>
  )
}

export default CustomerWorkspace
