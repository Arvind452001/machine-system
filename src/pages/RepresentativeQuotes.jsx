import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const RepresentativeQuotes = () => {
  const [searchParams] = useSearchParams();
  const enquiryParam = searchParams.get("enquiry");

  const [machinePrice, setMachinePrice] = useState(50900);
  const [optionsPrice, setOptionsPrice] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [validity, setValidity] = useState("30 days");
  const [leadTime, setLeadTime] = useState("12–16 weeks");
  const [notes, setNotes] = useState("");

  const total =
    (Number(machinePrice) || 0) +
    (Number(optionsPrice) || 0) +
    (Number(deliveryPrice) || 0);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(total);

  const emailBody = `Hello Morgan,\n\nPlease find the Axis 400 quotation for Northline Precision.\n\nIndicative total: ${formattedTotal} USD excluding tax.\nEstimated lead time: ${leadTime}\nValidity: ${validity}\n${
    notes ? `\nNotes: ${notes}\n` : ""
  }\nBest,\nAlex Morgan`;
  const emailLink = `mailto:morgan.chen@northlineprecision.example?subject=${encodeURIComponent(
    "Axis 400 quotation"
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <main className="customer-content rep-content rep-quote-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / QUOTATION WORKFLOW</span>
      </div>

      <section className="customer-welcome rep-welcome rep-quote-hero">
        <div>
          <div className="eyebrow">
            <span></span> PRICING &amp; FINAL QUOTE
          </div>
          <h1>
            Build a quote <em> with confidence.</em>
          </h1>
          <p>
            Confirm the numbers and terms before sharing a clear proposal with
            Morgan.
          </p>
        </div>
        <div className="rep-quote-hero-side">
          <span>ACTIVE ENQUIRY</span>
          <strong>{enquiryParam || "NL-ENQ-10482"}</strong>
          <small>Axis 400 · Northline Precision</small>
          <Link
            className="button button-outline"
            to="/representative/customers"
          >
            <i className="bi bi-person-lines-fill"></i> Customer record
          </Link>
        </div>
      </section>

      <div className="rep-detail-grid rep-quote-page-grid">
        <section className="rep-section rep-quote-pricing">
          <div className="rep-section-heading">
            <span>01</span>
            <div>
              <h3>Commercial pricing</h3>
              <p>Set the machine price and any additional costs.</p>
            </div>
          </div>

          <div className="rep-price-fields">
            <label>
              <span>Machine price (USD)</span>
              <span className="rep-money-input">
                <b>$</b>
                <input
                  aria-label="Machine price in USD"
                  className="quote-price-input"
                  min="0"
                  step="100"
                  type="number"
                  value={machinePrice}
                  onChange={(e) => setMachinePrice(e.target.value)}
                />
              </span>
            </label>
            <label>
              <span>Options &amp; custom work</span>
              <span className="rep-money-input">
                <b>$</b>
                <input
                  aria-label="Options and custom work in USD"
                  className="quote-price-input"
                  min="0"
                  step="100"
                  type="number"
                  value={optionsPrice}
                  onChange={(e) => setOptionsPrice(e.target.value)}
                />
              </span>
            </label>
            <label>
              <span>Delivery &amp; installation</span>
              <span className="rep-money-input">
                <b>$</b>
                <input
                  aria-label="Delivery and installation in USD"
                  className="quote-price-input"
                  min="0"
                  step="100"
                  type="number"
                  value={deliveryPrice}
                  onChange={(e) => setDeliveryPrice(e.target.value)}
                />
              </span>
            </label>
          </div>

          <div className="rep-price-total">
            <span>
              INDICATIVE QUOTE TOTAL<small>USD · EXCLUDING TAX</small>
            </span>
            <strong aria-live="polite" id="quote-total">
              {formattedTotal}
            </strong>
          </div>

          <p className="rep-inline-note">
            Tax and final delivery charges are confirmed in the formal
            quotation.
          </p>
        </section>

        <section className="rep-section rep-quote-terms">
          <div className="rep-section-heading">
            <span>02</span>
            <div>
              <h3>Quote terms</h3>
              <p>Set expectations before the quote is prepared.</p>
            </div>
          </div>

          <div className="rep-quote-meta">
            <label>
              <span>Quote valid for</span>
              <select
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
              >
                <option value="30 days">30 days</option>
                <option value="45 days">45 days</option>
                <option value="60 days">60 days</option>
              </select>
            </label>
            <label>
              <span>Estimated lead time</span>
              <input
                type="text"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
              />
            </label>
          </div>

          <label
            className="rep-field-label rep-quote-notes-label"
            htmlFor="quote-notes"
          >
            Customer-specific quote notes
          </label>
          <textarea
            className="rep-textarea"
            id="quote-notes"
            placeholder="Add confirmed options, exclusions, delivery, installation, and payment terms."
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <section className="rep-section rep-customer-wide rep-quote-final">
          <div className="rep-section-heading">
            <span>03</span>
            <div>
              <h3>Review before sending</h3>
              <p>Check the recipient, reference, and indicative total.</p>
            </div>
          </div>

          <div className="rep-quote-preview">
            <div>
              <i className="bi bi-file-earmark-text"></i>
              <span>
                <strong>Axis 400 · Final quotation</strong>
                <small>
                  Morgan Chen · Northline Precision · NL-ENQ-10482
                </small>
              </span>
            </div>
            <b className="quote-preview-total">{formattedTotal}</b>
          </div>

          <div className="rep-quote-actions">
            <Link
              className="button button-outline"
              to="/representative/customer-details?customer=morgan"
            >
              <i className="bi bi-arrow-left"></i> Review customer details
            </Link>
            <a
              className="button button-lime"
              href={emailLink}
              id="quote-email-link"
            >
              <i className="bi bi-send"></i> Email quote draft
            </a>
          </div>
        </section>
      </div>

      <p className="summary-note rep-disclaimer">
        Static quote preview. Confirm all requirements and pricing; the email
        action opens a draft and does not deliver a quote.
      </p>
    </main>
  );
};

export default RepresentativeQuotes;
