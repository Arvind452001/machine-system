import { Link } from "react-router-dom";
const Configure = () => {
  return (
    <div>
       <main>
      <div className="page-crumb">
        <Link to="/machine-details#axis-400">
          <i className="bi bi-arrow-left"></i> Machine overview

        </Link>
        <span>/</span>
        <span>Configure</span>
      </div>
      <section className="configure-heading">
        <div>
          <div className="eyebrow">
            <span></span> Build your specification

          </div>
          <h1>Make it 

            <em>work harder.</em>
          </h1>
          <p>Compare platform options and find the right starting specification.</p>
        </div>
        <div className="build-code">
          <span>CONFIGURATION PREVIEW</span>
          <strong>AXIS 400 · AX-400</strong>
        </div>
      </section>
      <div className="stepper">
        <span className="active">
          <b>01</b> Configure

        </span>
        <i></i>
        <span>
          <b>02</b> Review basket

        </span>
        <i></i>
        <span>
          <b>03</b> Send enquiry

        </span>
      </div>
      <section className="configure-layout" id="axis-config">
        <div className="options-panel">
          <div className="panel-kicker">
            <span>AXIS 400 · SPECIFICATION</span>
            <span>04 OPTIONS</span>
          </div>
          <h2>Precision CNC lathe</h2>
          <p className="options-intro">Choose a starting specification. Final compatibility is confirmed with your representative.</p>
          <div className="option-group">
            <label htmlFor="axis-spindle">01 &nbsp; Spindle package 

              <small>Choose your speed</small>
            </label>
            <select className="option-select" id="axis-spindle">
              <option>Standard · 8,000 rpm</option>
              <option>High torque · 10,000 rpm · +$3,200</option>
              <option>High speed · 12,000 rpm · +$5,100</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="axis-tooling">02 &nbsp; Tooling system 

              <small>Tool capacity</small>
            </label>
            <select className="option-select" id="axis-tooling">
              <option>10-station turret</option>
              <option>12-station live tooling · +$4,800</option>
              <option>Servo turret · 16 station · +$7,600</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="axis-coolant">03 &nbsp; Coolant package 

              <small>Chip management</small>
            </label>
            <select className="option-select" id="axis-coolant">
              <option>Standard coolant</option>
              <option>High-pressure · 70 bar · +$2,400</option>
              <option>Through-spindle · 40 bar · +$3,900</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="axis-enclosure">04 &nbsp; Enclosure &amp; safety 

              <small>Work environment</small>
            </label>
            <select className="option-select" id="axis-enclosure">
              <option>Standard safety enclosure</option>
              <option>Acoustic reduction · +$1,350</option>
              <option>Full mist extraction · +$2,150</option>
            </select>
          </div>
          <div className="compatibility-note">
            <i className="bi bi-info-circle"></i>Final option compatibility is subject to engineering review.

          </div>
        </div>
        <div className="preview-column">
          <div className="preview-toolbar">
            <span>
              <i className="bi bi-eye"></i> CONFIGURATION PREVIEW

            </span>
            <span>REFERENCE RENDER</span>
          </div>
          <div className="preview-image">
            <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="Axis 400 industrial machine reference image"/>
            <span>AX-400 · REFERENCE PLATFORM</span>
            <strong className="preview-caption">Axis 400</strong>
          </div>
          <div className="price-box">
            <div>
              <span>INDICATIVE STARTING PRICE · USD</span>
              <p>Base machine, before selected options</p>
            </div>
            <strong>$48,500</strong>
          </div>
          <p className="price-note">Final price is confirmed by your regional sales representative.</p>
        </div>
      </section>
      <section className="configure-layout" id="arc-config">
        <div className="options-panel">
          <div className="panel-kicker">
            <span>ARC 700 · SPECIFICATION</span>
            <span>04 OPTIONS</span>
          </div>
          <h2>Vertical machining centre</h2>
          <p className="options-intro">Build from the Arc 700 platform, then discuss your application with our team.</p>
          <div className="option-group">
            <label htmlFor="arc-spindle">01 &nbsp; Spindle package 

              <small>Choose your speed</small>
            </label>
            <select className="option-select" id="arc-spindle">
              <option>Standard · 8,000 rpm</option>
              <option>High speed · 12,000 rpm · +$4,200</option>
              <option>Precision · 18,000 rpm · +$7,900</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="arc-tooling">02 &nbsp; Tool changer 

              <small>Tool capacity</small>
            </label>
            <select className="option-select" id="arc-tooling">
              <option>24-tool carousel</option>
              <option>40-tool magazine · +$3,900</option>
              <option>60-tool magazine · +$7,200</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="arc-coolant">03 &nbsp; Coolant package 

              <small>Chip management</small>
            </label>
            <select className="option-select" id="arc-coolant">
              <option>Standard coolant</option>
              <option>High-pressure · 70 bar · +$2,200</option>
              <option>Through-spindle · 40 bar · +$4,100</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="arc-enclosure">04 &nbsp; Enclosure &amp; safety 

              <small>Work environment</small>
            </label>
            <select className="option-select" id="arc-enclosure">
              <option>Full safety enclosure</option>
              <option>Acoustic reduction · +$1,750</option>
            </select>
          </div>
          <div className="compatibility-note">
            <i className="bi bi-info-circle"></i>Final option compatibility is subject to engineering review.

          </div>
        </div>
        <div className="preview-column">
          <div className="preview-toolbar">
            <span>
              <i className="bi bi-eye"></i> CONFIGURATION PREVIEW

            </span>
            <span>REFERENCE RENDER</span>
          </div>
          <div className="preview-image">
            <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Arc 700 industrial machining centre reference image"/>
            <span>AR-700 · REFERENCE PLATFORM</span>
            <strong className="preview-caption">Arc 700</strong>
          </div>
          <div className="price-box">
            <div>
              <span>INDICATIVE STARTING PRICE · USD</span>
              <p>Base machine, before selected options</p>
            </div>
            <strong>$72,400</strong>
          </div>
          <p className="price-note">Final price is confirmed by your regional sales representative.</p>
        </div>
      </section>
      <section className="configure-layout" id="flare-config">
        <div className="options-panel">
          <div className="panel-kicker">
            <span>FLARE 6 · SPECIFICATION</span>
            <span>04 OPTIONS</span>
          </div>
          <h2>Fiber laser cutting system</h2>
          <p className="options-intro">Review the laser platform. Power and handling are tailored to your material and throughput.</p>
          <div className="option-group">
            <label htmlFor="flare-power">01 &nbsp; Laser power 

              <small>Fiber source</small>
            </label>
            <select className="option-select" id="flare-power">
              <option>3 kW fiber source</option>
              <option>6 kW fiber source · +$14,800</option>
              <option>12 kW fiber source · +$29,400</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="flare-handling">02 &nbsp; Material handling 

              <small>Loading workflow</small>
            </label>
            <select className="option-select" id="flare-handling">
              <option>Manual loading table</option>
              <option>Twin shuttle table · +$9,600</option>
              <option>Robot-ready interface · +$5,100</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="flare-extraction">03 &nbsp; Fume extraction 

              <small>Air quality</small>
            </label>
            <select className="option-select" id="flare-extraction">
              <option>Standard extraction</option>
              <option>High-capacity filtration · +$3,200</option>
              <option>Central extraction interface · +$4,600</option>
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="flare-area">04 &nbsp; Cutting area 

              <small>Sheet size</small>
            </label>
            <select className="option-select" id="flare-area">
              <option>Standard · 3,000 Ã— 1,500 mm</option>
              <option>Large format · 4,000 Ã— 2,000 mm · +$7,200</option>
            </select>
          </div>
          <div className="compatibility-note">
            <i className="bi bi-info-circle"></i>Final option compatibility is subject to engineering review.

          </div>
        </div>
        <div className="preview-column">
          <div className="preview-toolbar">
            <span>
              <i className="bi bi-eye"></i> CONFIGURATION PREVIEW

            </span>
            <span>REFERENCE RENDER</span>
          </div>
          <div className="preview-image">
            <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85" alt="Flare 6 laser system reference image"/>
            <span>FL-6000 · REFERENCE PLATFORM</span>
            <strong className="preview-caption">Flare 6</strong>
          </div>
          <div className="price-box">
            <div>
              <span>INDICATIVE STARTING PRICE · USD</span>
              <p>Base machine, before selected options</p>
            </div>
            <strong>$96,300</strong>
          </div>
          <p className="price-note">Final price is confirmed by your regional sales representative.</p>
        </div>
      </section>
      <section className="home-contact" id="contact">
        <div className="contact-mark">
          <i className="bi bi-chat-square-text"></i>
        </div>
        <div>
          <span className="eyebrow eyebrow-light">Ready to discuss your build?</span>
          <h2>Take your specification further.</h2>
        </div>
        <p>Our team can confirm compatible options and prepare your final quote.</p>
        <Link className="contact-action" to="/enquiry">Continue to enquiry 

          <i className="bi bi-arrow-up-right"></i>
        </Link>
      </section>
    </main>
    </div>
  )
}

export default Configure
