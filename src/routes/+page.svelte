<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<svelte:head>
  <title>Avatar Creator | Personalized Role Avatars</title>
  <meta
    name="description"
    content="Create personalized avatars based on your role. Choose from Innovator, Coach, or Leader styles."
  />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <div class="impact-container impact-container--full">
    <div class="hero-logo">
      <img src="/logo.svg" alt="Logo" width="150" />
    </div>

    <div class="hero-content">
      <h1 class="impact-title impact-title--large">
        Discover Your <span class="impact-gradient-text">Role Avatar</span>
      </h1>
      <p class="impact-subtitle">
        Upload your photo and select your role to get a personalized avatar.
        Choose from Innovator, Coach, or Leader.
      </p>
      <div class="hero-actions">
        <button
          class="impact-btn impact-btn--lg"
          onclick={() => goto("/create")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Your Avatar
        </button>
        <button
          class="impact-btn impact-btn--secondary impact-btn--lg"
          onclick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })}
        >
          Learn More
        </button>
      </div>
    </div>

    <div class="hero-preview">
      <div class="preview-grid">
        <div class="impact-card">
          <div class="preview-placeholder">💡</div>
          <span>Innovator</span>
        </div>
        <div class="impact-card">
          <div class="preview-placeholder">🎯</div>
          <span>Coach</span>
        </div>
        <div class="impact-card">
          <div class="preview-placeholder">👑</div>
          <span>Leader</span>
        </div>
      </div>
      <div class="ai-badge-container">
        <span class="impact-badge impact-badge--accent"
          >✨ Personalized Avatars</span
        >
      </div>
    </div>
  </div>
</section>

<!-- Features Section -->
<section id="features" class="features">
  <div class="impact-container impact-container--full">
    <div class="impact-section-header">How It Works</div>
    <div class="steps-grid">
      <div class="impact-card step-card">
        <div class="step-number">1</div>
        <div class="step-icon">📷</div>
        <h3 class="step-title">Upload Your Photo</h3>
        <p class="step-desc">
          Simply upload a clear photo of yourself to get started.
        </p>
      </div>
      <div class="impact-card step-card">
        <div class="step-number">2</div>
        <div class="step-icon">👤</div>
        <h3 class="step-title">Select Gender & Role</h3>
        <p class="step-desc">
          Choose your gender and pick your role: Innovator, Coach, or Leader.
        </p>
      </div>
      <div class="impact-card step-card">
        <div class="step-number">3</div>
        <div class="step-icon">✨</div>
        <h3 class="step-title">Get Your Avatar</h3>
        <p class="step-desc">
          Instantly receive your personalized role avatar. Download and use it
          anywhere!
        </p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta">
  <div class="impact-container impact-container--wide">
    <div class="impact-card cta-card">
      <h2 class="impact-title">Ready to Create Your Avatar?</h2>
      <p class="impact-subtitle">
        Discover your role and get a personalized avatar that represents you.
      </p>
      <button class="impact-btn impact-btn--lg" onclick={() => goto("/create")}>
        Get Started Free
      </button>
    </div>
  </div>
</section>

<style>
  /* Local Layout Styles */
  .hero {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--impact-space-2xl) 0;
    position: relative;
  }

  .hero-logo {
    margin-bottom: var(--impact-space-2xl);
    animation: fadeInDown 0.8s ease-out;
  }

  .hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto var(--impact-space-2xl);
  }

  .hero-actions {
    display: flex;
    gap: var(--impact-space-md);
    justify-content: center;
    flex-wrap: wrap;
    margin-top: var(--impact-space-xl);
  }

  .hero-preview {
    max-width: 600px;
    margin: 0 auto;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--impact-space-md);
  }

  .preview-placeholder {
    font-size: 2.5rem;
    margin-bottom: var(--impact-space-sm);
  }

  .ai-badge-container {
    margin-top: var(--impact-space-xl);
    text-align: center;
    animation: fadeInUp 0.8s ease-out 0.4s backwards;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .features {
    padding: var(--impact-space-2xl) 0;
  }

  /* Fix for cards overflowing the container */
  .features .impact-container {
    padding-bottom: 100px;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--impact-space-xl);
  }

  .step-card {
    text-align: center;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .step-number {
    position: absolute;
    top: var(--impact-space-md);
    left: var(--impact-space-md);
    width: 28px;
    height: 28px;
    background: linear-gradient(
      135deg,
      var(--impact-accent),
      var(--impact-accent-dark)
    );
    color: var(--impact-text);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .step-icon {
    font-size: 3rem;
    margin-bottom: var(--impact-space-md);
  }

  .step-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: var(--impact-space-sm);
    color: var(--impact-text);
  }

  .step-desc {
    color: var(--impact-text-secondary);
  }

  .cta {
    padding: var(--impact-space-2xl) 0;
    text-align: center;
  }

  .cta-card {
    padding: var(--impact-space-2xl);
    text-align: center;
  }

  /* Helper to center content in impact-container--full/wide which doesn't auto-margin */
  .impact-container--full,
  .impact-container--wide {
    margin: 0 auto;
    padding-left: var(--impact-space-lg);
    padding-right: var(--impact-space-lg);
  }

  @media (max-width: 640px) {
    .preview-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .hero-actions {
      flex-direction: column;
    }

    .impact-btn {
      width: 100%;
    }
  }
</style>
