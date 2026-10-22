import { Link } from "react-router-dom";
const QuotationExample = () => {
  return (
    <div>
        <main>
      <div className="page-crumb">
        <Link to="/customer-dashboard">
          <i className="bi bi-arrow-left"></i> Enquiry history

        </Link>
        <span>/</span>
        <span>Quotation example</span>
      </div>
      <section className="quote-toolbar">
        <div>
          <div className="eyebrow">
            <span></span> Northline Systems · Example

          </div>
          <h1>Your machine 

            <em> quotation.</em>
          </h1>
          <p className="quote-toolbar-copy">Review the itemized estimate and save a PDF copy for your records.</p>
        </div>
        <button className="quote-download-button" type="button" onClick={() => window.print()}>
          <i className="bi bi-download"></i> Download / print PDF

        </button>
      </section>
      <article className="quote-sheet">
        <div className="quote-sheet-header">
          <Link className="brand" to="/">
            <span className="brand-icon">
              <i className="bi bi-asterisk"></i>
            </span>
            <span className="brand-type">NORTHLINE

              <small>SYSTEMS</small>
            </span>
          </Link>
          <div className="quote-meta">
            <span>INDICATIVE QUOTATION · EXAMPLE</span>
            <strong>NL-Q-2026-0418</strong>
            <small>Valid 30 days · USD</small>
          </div>
        </div>
        <div className="quote-rule"></div>
        <div className="quote-addresses">
          <div>
            <span>PREPARED FOR</span>
            <strong>Morgan Chen</strong>
            <p>Meridian Precision Works</p>
          </div>
          <div>
            <span>PREPARED BY</span>
            <strong>Northline Systems</strong>
            <p>Regional Sales Team · United States</p>
          </div>
          <div>
            <span>ISSUED</span>
            <strong>12 October 2026</strong>
            <p>Reference build NL-AX4-0182</p>
          </div>
        </div>
        <div className="quote-machine">
          <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="Illustrative CNC machine"/>
          <div>
            <span>PROPOSED PLATFORM</span>
            <h2>Axis 400 · Precision CNC lathe</h2>
            <p>Built for flexible turning operations with dependable accuracy across short and long production runs.</p>
          </div>
        </div>
        <div className="quote-line quote-line-heading">
          <span>ITEM / SPECIFICATION</span>
          <span>QTY</span>
          <span>INDICATIVE PRICE</span>
        </div>
        <div className="quote-line">
          <span>
            <strong>Axis 400 base machine</strong>
            <small>Standard enclosure · 10-station turret · 8,000 rpm spindle</small>
          </span>
          <span>1</span>
          <span>$48,500</span>
        </div>
        <div className="quote-line">
          <span>
            <strong>High-pressure coolant package</strong>
            <small>Integrated filtration and delivery system</small>
          </span>
          <span>1</span>
          <span>$2,400</span>
        </div>
        <div className="quote-line">
          <span>
            <strong>Commissioning &amp; operator training</strong>
            <small>To be discussed with your regional representative</small>
          </span>
          <span>1</span>
          <span>To discuss</span>
        </div>
        <div className="quote-total">
          <span>INDICATIVE CONFIGURATION TOTAL

            <small>Excludes taxes, freight, and installation</small>
          </span>
          <strong>$50,900</strong>
        </div>
        <div className="quote-notes">
          <p>This quotation is an interface example and not a binding offer.</p>
          <p>Final specifications, delivery, and pricing require technical review.</p>
          <p>Contact your representative to discuss your application.</p>
        </div>
        <div className="quote-sheet-footer">
          <span>NORTHLINE SYSTEMS · BUILT AROUND YOUR PRODUCTION</span>
          <span>northlinesystems.example</span>
        </div>
      </article>
      <p className="text-center summary-note">Sample quotation for interface preview only.</p>
    </main>
    </div>
  )
}

export default QuotationExample
