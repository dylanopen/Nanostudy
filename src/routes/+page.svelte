<script>
  import './layout.css';
</script>

<div class="page-wrapper">
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="brand-logo">
        <span class="brand-symbol">N</span>
        <span class="brand-title">Nanostudy</span>
      </a>

      <nav class="nav-links">
        <a href="#features">Features</a>
        <a href="#courses">Courses</a>
        <a href="/login" class="btn">Sign In</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero-section">
      <div class="container hero-container">
        <div class="badge hero-badge">
          <span>A-Level Further Maths</span>
          <span class="badge-dot">•</span>
          <span>Edexcel & AQA</span>
        </div>

        <h1 class="hero-title">
          Built to save <span class="highlight-underline">every mark</span>
        </h1>

        <p class="hero-subheadline">
          Stop guessing where you drop marks. Nanostudy pinpoints your exact mistake patterns and builds targeted practice to push you into the next grade boundary.
        </p>

        <div class="hero-actions">
          <a href="/study" class="btn btn-accent btn-lg">
            <span>Start Studying Now</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div class="widget-slot hero-widget-slot">
          <!-- Svelte interactive graph or hero widget component goes here -->
        </div>
      </div>
    </section>

    <section class="features-section" id="features">
      <div class="container">
        <hr />
        
        <div class="features-grid">
          <div class="card feature-card">
            <h3>Diagnostic Error Tracking</h3>
            <p>Every attempted question categorizes step failures, showing exactly which algebraic manipulations or theorems drag down your score.</p>
            <div class="widget-slot card-widget-slot">
            </div>
          </div>

          <div class="card feature-card">
            <h3>Templated Math Engine</h3>
            <p>Infinite spec-aligned questions with fuzz-tested variable constraints ensuring integer outputs and rigorous step-by-step mark scheme breakdowns.</p>
            <div class="widget-slot card-widget-slot">
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <p>© Nanostudy. Built for A-Level & GCSE STEM students.</p>
    </div>
  </footer>
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--nano-border-subtle-color);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
  }

  .brand-symbol {
    width: 32px;
    height: 32px;
    background-color: var(--nano-bg-accent-color);
    color: var(--nano-fg-inverse-color);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.125rem;
  }

  .brand-title {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--nano-fg-primary-color);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-links a:not(.btn) {
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--nano-fg-secondary-color);
    transition: color 0.15s ease;
  }

  .nav-links a:not(.btn):hover {
    color: var(--nano-fg-primary-color);
  }

  .hero-section {
    padding: 4.5rem 0 3rem;
  }

  .hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-badge {
    margin-bottom: 1.5rem;
  }

  .badge-dot {
    color: var(--nano-border-color);
  }

  .hero-title {
    max-width: 800px;
    margin-bottom: 1.25rem;
  }

  .hero-subheadline {
    max-width: 620px;
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 2.25rem;
  }

  .hero-actions {
    margin-bottom: 3.5rem;
  }

  .hero-widget-slot {
    min-height: 380px;
  }

  .features-section {
    padding-bottom: 4.5rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .feature-card h3 {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }

  .feature-card p {
    font-size: 0.9375rem;
    line-height: 1.5;
    margin-bottom: 1.25rem;
  }

  .card-widget-slot {
    min-height: 200px;
  }

  .footer {
    margin-top: auto;
    padding: 2rem 0;
    border-top: 1px solid var(--nano-border-subtle-color);
  }

  .footer-inner p {
    font-size: 0.875rem;
    color: var(--nano-fg-muted-color);
    text-align: center;
  }
</style>
