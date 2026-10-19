import { Link } from "react-router-dom";
const Basket = () => {
  return (
    <div>
      <main>
      <div className="page-crumb">
        <Link to="/machines">
          <i className="bi bi-arrow-left"></i> Continue browsing

        </Link>
        <span>/</span>
        <span>Your basket</span>
      </div>
      <section className="page-heading basket-page-heading">
        <div>
          <div className="eyebrow">
            <span></span> Your machine shortlist

          </div>
          <h1>Review your 

            <em>selection.</em>
          </h1>
          <p>Check the platform and indicative price before sending your enquiry.</p>
        </div>
        <span className="page-index">01 / BASKET</span>
      </section>
      <section className="basket-layout">
        <div className="basket-content">
          <div className="basket-list-heading">
            <span>
              <i className="bi bi-bag-check"></i> CONFIGURATION SHORTLIST

            </span>
            <span>1 MACHINE</span>
          </div>
          <article className="basket-item basket-item-featured">
            <div className="basket-item-visual">
              <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="Axis 400 CNC lathe reference image"/>
              <span>AX-400 · CNC TURNING</span>
            </div>
            <div className="basket-item-content">
              <div className="basket-item-heading">
                <div>
                  <span className="item-code">NORTHLINE PLATFORM</span>
                  <h2>Axis 400</h2>
                  <p className="basket-subtitle">Precision CNC lathe</p>
                </div>
                <strong className="item-price">$48,500</strong>
              </div>
              <p className="basket-description">A compact, accurate turning platform for flexible production.</p>
              <div className="basket-specs">
                <span>
                  <i className="bi bi-speedometer2"></i> 8,000 rpm spindle

                </span>
                <span>
                  <i className="bi bi-tools"></i> 10-station turret

                </span>
                <span>
                  <i className="bi bi-shield-check"></i> Safety enclosure

                </span>
              </div>
              <div className="basket-item-footer">
                <Link className="text-link" to="/configure#axis-config">
                  <i className="bi bi-sliders"></i> Review machine options

                </Link>
                <span>Indicative starting price</span>
              </div>
            </div>
          </article>
          <div className="compatibility-note">
            <i className="bi bi-info-circle"></i>
            <span>Example basket only. Configuration choices are not saved or submitted in this static preview.</span>
          </div>
          <div className="basket-help">
            <span className="basket-help-icon">
              <i className="bi bi-person-workspace"></i>
            </span>
            <span>
              <strong>Want to check a detail?</strong>
              <small>Our regional team can review your process and help refine the specification.</small>
            </span>
            <Link to="/contact" aria-label="Talk to the Northline team">
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </div>
        <aside className="basket-summary">
          <div className="basket-summary-kicker">
            <i className="bi bi-receipt"></i> ENQUIRY SUMMARY

          </div>
          <h2>Your next conversation<br/>starts here.</h2>
          <div className="summary-row">
            <span>Machine configurations</span>
            <strong>01</strong>
          </div>
          <div className="summary-row">
            <span>Indicative subtotal</span>
            <strong>$48,500</strong>
          </div>
          <div className="basket-total">
            <span>Indicative total</span>
            <strong>$48,500</strong>
            <small>USD before taxes, freight &amp; installation</small>
          </div>
          <p className="summary-note">A local representative confirms your options, delivery, installation, and final quotation.</p>
          <Link className="button button-dark" to="/enquiry">Continue to enquiry 

            <i className="bi bi-arrow-right"></i>
          </Link>
          <Link className="basket-continue" to="/machines">
            <i className="bi bi-arrow-left"></i> Continue browsing

          </Link>
          <div className="basket-summary-foot">
            <i className="bi bi-shield-check"></i> Indicative pricing · Final quote by your local team

          </div>
        </aside>
      </section>
    </main>
    </div>
  )
}

export default Basket
