import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "ReidBiz | Sales & Inventory Ledger" };

export default function LandingPage() {

  return (
    <>
      <style>{`
        .landing-header {
            border-bottom: 1px solid var(--sb-border);
            background: #ffffff;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .hero-wrap {
            padding: 4.5rem 1rem 3.5rem;
            max-width: 1080px;
            margin: 0 auto;
            text-align: center;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--sb-surface-muted);
            border: 1px solid var(--sb-border);
            padding: 0.35rem 0.85rem;
            border-radius: var(--sb-radius-pill);
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--sb-text-secondary);
            margin-bottom: 1.5rem;
        }

        .hero-title {
            font-size: clamp(2rem, 5vw, 3.25rem);
            font-weight: 700;
            color: var(--sb-text-primary);
            letter-spacing: -0.035em;
            line-height: 1.15;
            max-width: 860px;
            margin: 0 auto 1.25rem;
        }

        .hero-subtitle {
            font-size: clamp(1rem, 2vw, 1.2rem);
            color: var(--sb-text-muted);
            line-height: 1.6;
            max-width: 680px;
            margin: 0 auto 2rem;
        }

        .preview-window {
            background: var(--sb-surface);
            border: 1px solid var(--sb-border);
            border-radius: var(--sb-radius-lg);
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
            overflow: hidden;
            margin-top: 2.5rem;
            text-align: left;
        }

        .preview-topbar {
            background: var(--sb-surface-muted);
            border-bottom: 1px solid var(--sb-border);
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .preview-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #cbd5e1;
        }

        .feature-item {
            padding: 2rem;
            border: 1px solid var(--sb-border);
            border-radius: var(--sb-radius-lg);
            background: var(--sb-surface);
            height: 100%;
        }

        .feature-icon-box {
            width: 44px;
            height: 44px;
            border-radius: var(--sb-radius-md);
            background: var(--sb-surface-muted);
            border: 1px solid var(--sb-border);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--sb-text-primary);
            margin-bottom: 1.25rem;
        }

        .section-heading {
            max-width: 720px;
            margin: 0 auto 3rem;
            text-align: center;
        }

        .faq-accordion .accordion-item {
            border: 1px solid var(--sb-border);
            border-radius: var(--sb-radius-md) !important;
            margin-bottom: 0.75rem;
            overflow: hidden;
        }

        .faq-accordion .accordion-button {
            font-weight: 600;
            color: var(--sb-text-primary);
            background: var(--sb-surface);
        }

        .faq-accordion .accordion-button:not(.collapsed) {
            background: var(--sb-surface-muted);
            color: var(--sb-text-primary);
            box-shadow: none;
        }
      `}</style>

      {/* Header Navigation */}
      <header className="landing-header">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
            <div className="sb-brand-mark">RB</div>
            <span className="sb-brand-title">ReidBiz</span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            <Link href="/dashboard" className="sb-btn sb-btn-primary sb-btn-sm">Open Dashboard</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-wrap">
        <div className="hero-badge">
          <span className="sb-status-dot green"></span>
          Designed for Retail, Kiosks & Local Merchants
        </div>

        <h1 className="hero-title">
          Simple sales & inventory ledger for your daily business.
        </h1>

        <p className="hero-subtitle">
          Say goodbye to paper notebooks and messy spreadsheets. Log customer sales in seconds, get alerts before stock runs dry, and see daily profits without complicated accounting jargon.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <Link href="/dashboard" className="sb-btn sb-btn-primary sb-btn-lg">
            Open Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
          <Link href="/products" className="sb-btn sb-btn-secondary sb-btn-lg">
            View Inventory
          </Link>
        </div>

        {/* Realistic Product Demo Preview */}
        <div className="preview-window">
          <div className="preview-topbar">
            <span className="preview-dot"></span>
            <span className="preview-dot"></span>
            <span className="preview-dot"></span>
            <span className="ms-2 small text-muted font-monospace">reidbiz.local/dashboard | Daily Merchant Ledger</span>
          </div>
          <div className="p-3 p-md-4">
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="sb-stat-card p-3">
                  <span className="sb-stat-label">Today&apos;s Sales</span>
                  <span className="sb-stat-value text-success fs-4">RM 14,250</span>
                  <span className="sb-stat-meta positive">24 transactions</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="sb-stat-card p-3">
                  <span className="sb-stat-label">7-Day Revenue</span>
                  <span className="sb-stat-value fs-4">RM 96,800</span>
                  <span className="sb-stat-meta">Average RM 13.8k/day</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="sb-stat-card p-3">
                  <span className="sb-stat-label">Stock Items</span>
                  <span className="sb-stat-value fs-4">48 Items</span>
                  <span className="sb-stat-meta">Active inventory</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="sb-stat-card p-3">
                  <span className="sb-stat-label">Low Stock Alert</span>
                  <span className="sb-stat-value text-warning fs-4">2 Items</span>
                  <span className="sb-stat-meta warning">Needs replenishment</span>
                </div>
              </div>
            </div>

            <div className="sb-card">
              <div className="sb-card-header py-2 px-3">
                <span className="sb-card-title small">Live Counter Inventory Sample</span>
                <span className="badge bg-light text-dark border">RM Currency</span>
              </div>
              <div className="sb-table-responsive">
                <table className="sb-table mb-0">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th className="col-right">Cost Price</th>
                      <th className="col-right">Selling Price</th>
                      <th className="col-right">In Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">Maize Flour (2kg Bale)</td>
                      <td className="col-right tabular">RM 180</td>
                      <td className="col-right tabular fw-bold">RM 220</td>
                      <td className="col-right tabular fw-bold">35 units</td>
                      <td><span className="sb-badge sb-badge-in-stock">In Stock</span></td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Cooking Oil (1L bottle)</td>
                      <td className="col-right tabular">RM 260</td>
                      <td className="col-right tabular fw-bold">RM 310</td>
                      <td className="col-right tabular text-warning fw-bold">4 units</td>
                      <td><span className="sb-badge sb-badge-low-stock">Low Stock (4)</span></td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Premium Sugar (1kg packet)</td>
                      <td className="col-right tabular">RM 140</td>
                      <td className="col-right tabular fw-bold">RM 175</td>
                      <td className="col-right tabular fw-bold">52 units</td>
                      <td><span className="sb-badge sb-badge-in-stock">In Stock</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Practical Pillars */}
      <section className="py-5" style={{ borderTop: "1px solid var(--sb-border)", background: "#ffffff" }}>
        <div className="container py-4">
          <div className="section-heading">
            <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: "0.08em" }}>Built For Daily Work</span>
            <h2 className="mt-2 mb-3">Everything you need to run your counter without friction.</h2>
            <p className="text-muted">Focused tools designed for real shops with busy customers waiting at the desk.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                </div>
                <h4 className="mb-2">Instant Sale Recording</h4>
                <p className="text-muted small mb-0">Record items as they sell in 2 clicks. Stock automatically deducts from your inventory in real time, preventing duplicate counts or discrepancies.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h4 className="mb-2">Automated Low-Stock Alerts</h4>
                <p className="text-muted small mb-0">Never get caught telling a customer you&apos;re out. ReidBiz highlights products dipping below 10 units so you can reorder from suppliers ahead of time.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                </div>
                <h4 className="mb-2">Clear Profit & Revenue Ledger</h4>
                <p className="text-muted small mb-0">Understand your daily and weekly cash intake instantly. See top-selling products and full sales logs with timestamps and exact unit totals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5" style={{ borderTop: "1px solid var(--sb-border)" }}>
        <div className="container py-3" style={{ maxWidth: "800px" }}>
          <div className="section-heading mb-4">
            <h2>Frequently Asked Questions</h2>
            <p className="text-muted">Direct answers to how ReidBiz works for your store.</p>
          </div>

          <div className="accordion faq-accordion" id="landingFaq">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  Does it work well on a smartphone behind a counter?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#landingFaq">
                <div className="accordion-body text-muted small">
                  Yes. The entire platform is built with high-contrast, responsive controls and a bottom navigation bar designed for quick single-handed thumb tapping on mobile phones.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  Can I track both cost (buying) and selling price?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#landingFaq">
                <div className="accordion-body text-muted small">
                  Yes. Every product record includes both your buying price and selling price, allowing you to monitor inventory asset valuation and gross margins.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  Are there any hidden fees or subscription lock-ins?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#landingFaq">
                <div className="accordion-body text-muted small">
                  No. All subscription barriers have been removed. You can register your store account and immediately record sales and manage inventory freely.
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5 p-4 sb-card" style={{ background: "var(--sb-surface-muted)" }}>
            <h3 className="mb-2">Ready to organize your shop inventory?</h3>
            <p className="text-muted small mb-3">Takes less than 1 minute to setup your store.</p>
            <Link href="/dashboard" className="sb-btn sb-btn-primary">
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4" style={{ borderTop: "1px solid var(--sb-border)", background: "#ffffff" }}>
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3 text-muted small">
          <div className="d-flex align-items-center gap-2">
            <div className="sb-brand-mark" style={{ width: "24px", height: "24px", fontSize: "0.75rem" }}>RB</div>
            <span className="fw-semibold text-dark">ReidBiz</span>
            <span>- Merchant Sales & Inventory Ledger</span>
          </div>
          <div>
            <Link href="/dashboard" className="text-decoration-none text-muted me-3">Dashboard</Link>
            <Link href="/admin-dashboard" className="text-decoration-none text-dark fw-semibold">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
