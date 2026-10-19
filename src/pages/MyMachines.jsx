import { Link } from "react-router-dom";
const MyMachines = () => {
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
          <Link to="/customer-dashboard">
            <i className="bi bi-grid-1x2"></i> Overview

          </Link>
          <Link  to="/my-enquiries">
            <i className="bi bi-file-earmark-text"></i> My enquiries

          </Link>
          <Link  to="/my-quotations">
            <i className="bi bi-receipt"></i> My quotations

          </Link>
          <Link className="active" aria-current="page" to="/my-machines">
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
        <main className="customer-content account-hub my-machines-page">
          <div className="page-crumb">
            <Link to="/customer-dashboard">
              <i className="bi bi-arrow-left"></i> My workspace

            </Link>
            <span>/</span>
            <span>My machines</span>
          </div>
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span></span> YOUR MACHINES

              </div>
              <h1>Machines for 

                <em>your work.</em>
              </h1>
              <p>Explore your saved platforms and pick up a configuration when you are ready.</p>
            </div>
            <Link className="button button-dark" to="/machines">Full catalogue 

              <i className="bi bi-arrow-right"></i>
            </Link>
          </section>
          <div className="account-notice">
            <i className="bi bi-info-circle"></i>
            <span>Your recently viewed machines. Sign in to save machines to your account.</span>
          </div>
          <section className="my-machines-grid">
            <Link className="my-machine-card" to="/machine-details#axis-400">
              <div className="my-machine-image">
                <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1000&amp;fmt=webp" alt="Axis 400 precision CNC lathe"/>
                <span>AX-400 · CNC TURNING</span>
                <i className="bi bi-arrow-up-right"></i>
              </div>
              <div className="my-machine-copy">
                <small>PRECISION CNC LATHE</small>
                <h2>Axis 400</h2>
                <p>Compact, accurate turning for flexible production.</p>
                <div>
                  <span>From 

                    <strong>$48,500</strong>
                  </span>
                  <span>View machine 

                    <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
            <Link className="my-machine-card" to="/machine-details#arc-700">
              <div className="my-machine-image">
                <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1000&amp;fmt=webp" alt="Arc 700 vertical machining centre"/>
                <span>AR-700 · CNC MILLING</span>
                <i className="bi bi-arrow-up-right"></i>
              </div>
              <div className="my-machine-copy">
                <small>VERTICAL MACHINING CENTRE</small>
                <h2>Arc 700</h2>
                <p>Rigid, versatile machining for demanding parts.</p>
                <div>
                  <span>From 

                    <strong>$72,400</strong>
                  </span>
                  <span>View machine 

                    <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
            <Link className="my-machine-card" to="/machine-details#flare-6">
              <div className="my-machine-image">
                <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&amp;fit=crop&amp;w=1000&amp;q=85" alt="Flare 6 fiber laser system"/>
                <span>FL-6000 · LASER</span>
                <i className="bi bi-arrow-up-right"></i>
              </div>
              <div className="my-machine-copy">
                <small>FIBER LASER SYSTEM</small>
                <h2>Flare 6</h2>
                <p>Fast, reliable sheet processing for production teams.</p>
                <div>
                  <span>From 

                    <strong>$96,300</strong>
                  </span>
                  <span>View machine 

                    <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
          </section>
          <div className="account-bottom">
            <span className="account-help">
              <i className="bi bi-sliders"></i> Have a machine in mind? 

              <Link to="/configure">Build a configuration</Link>
            </span>
            <Link className="button button-lime" to="/machines">Browse all machines 

              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </main>

      </div>
    </div>
  )
}

export default MyMachines
