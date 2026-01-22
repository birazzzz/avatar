<script lang="ts">
    import ImageUploader from "$lib/components/ImageUploader.svelte";
    import GenderRoleSelector from "$lib/components/GenderRoleSelector.svelte";
    import { fade, fly } from "svelte/transition";

    interface Role {
        id: string;
        name: string;
        description: string;
    }

    // State
    let uploadedImageUrl = $state<string | null>(null);
    let selectedGender = $state<"male" | "female" | null>(null);
    let selectedRole = $state<Role | null>(null);
    let currentStep = $state(1);
    let isGenerating = $state(false);
    let generatedAvatarUrl = $state<string | null>(null);
    let cloudinaryUrl = $state<string | null>(null);
    let error = $state<string | null>(null);

    function handleImageUpload(url: string) {
        uploadedImageUrl = url;
        currentStep = 2; // Auto-advance
    }

    function handleGenderSelect(gender: "male" | "female") {
        selectedGender = gender;
    }

    function handleRoleSelect(role: Role) {
        selectedRole = role;
        currentStep = 3; // Auto-advance to generate step
    }

    async function generateAvatar() {
        if (!uploadedImageUrl || !selectedGender || !selectedRole) return;

        isGenerating = true;
        error = null;
        generatedAvatarUrl = null;

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userImageUrl: uploadedImageUrl,
                    gender: selectedGender,
                    role: selectedRole.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate avatar");
            }

            generatedAvatarUrl = data.avatarUrl;
            cloudinaryUrl = data.cloudinaryUrl;
        } catch (err) {
            error =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
        } finally {
            isGenerating = false;
        }
    }

    function downloadAvatar() {
        const imageUrl = generatedAvatarUrl || cloudinaryUrl;
        if (!imageUrl) return;

        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `avatar-${selectedRole?.id || "custom"}-${Date.now()}.png`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function reset() {
        uploadedImageUrl = null;
        selectedGender = null;
        selectedRole = null;
        generatedAvatarUrl = null;
        cloudinaryUrl = null;
        error = null;
        currentStep = 1;
    }

    function goToStep(step: number) {
        if (step === 2 && !uploadedImageUrl) return;
        if (
            step === 3 &&
            (!uploadedImageUrl || !selectedGender || !selectedRole)
        )
            return;
        currentStep = step;
    }
</script>

<svelte:head>
    <title>Create Avatar | Avatar Creator</title>
    <meta
        name="description"
        content="Upload your photo and select your role to get your personalized AI avatar."
    />
</svelte:head>

<div class="create-page">
    <header class="page-header">
        <a
            href="/"
            data-sveltekit-reload
            class="impact-btn impact-btn--secondary impact-btn--sm"
            style="text-decoration: none; display: inline-flex; align-items: center;"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
        </a>
        <div class="header-content">
            <h1 class="impact-title">
                Create Your <span class="impact-gradient-text">Avatar</span>
            </h1>
            <p class="impact-subtitle">
                Upload your photo and select your role for an AI-generated
                avatar
            </p>
        </div>
    </header>

    <!-- Progress Steps -->
    <div class="steps-indicator">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="step"
            class:active={currentStep >= 1}
            class:completed={currentStep > 1}
            class:clickable={true}
            onclick={() => goToStep(1)}
        >
            <span class="step-num">1</span>
            <span class="step-label">Upload</span>
        </div>
        <div class="step-line" class:active={currentStep > 1}></div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="step"
            class:active={currentStep >= 2}
            class:completed={currentStep > 2}
            class:clickable={!!uploadedImageUrl}
            onclick={() => goToStep(2)}
        >
            <span class="step-num">2</span>
            <span class="step-label">Select Role</span>
        </div>
        <div class="step-line" class:active={currentStep > 2}></div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="step"
            class:active={currentStep >= 3}
            class:clickable={!!selectedRole}
            onclick={() => goToStep(3)}
        >
            <span class="step-num">3</span>
            <span class="step-label">Generate</span>
        </div>
    </div>

    <div class="create-content">
        <div class="wizard-container impact-card">
            {#if currentStep === 1}
                <div
                    class="wizard-step"
                    in:fly={{ y: 20, duration: 400, delay: 200 }}
                    out:fade={{ duration: 200 }}
                >
                    <div class="section-header centered">
                        <h2 class="impact-section-header-text">
                            Upload Your Photo
                        </h2>
                        <p class="step-desc">
                            Select a clear photo of yourself to get started
                        </p>
                    </div>

                    <div class="step-content">
                        <ImageUploader onUpload={handleImageUpload} />
                    </div>
                </div>
            {:else if currentStep === 2}
                <div
                    class="wizard-step"
                    in:fly={{ y: 20, duration: 400, delay: 200 }}
                    out:fade={{ duration: 200 }}
                >
                    <div class="section-header centered">
                        <button
                            class="back-link"
                            onclick={() => (currentStep = 1)}
                        >
                            ← Back
                        </button>
                        <h2 class="impact-section-header-text">
                            Select Gender & Role
                        </h2>
                        <p class="step-desc">
                            Choose your gender and role for your AI avatar
                        </p>
                    </div>

                    <div class="step-content">
                        <GenderRoleSelector
                            {selectedGender}
                            selectedRole={selectedRole?.id || null}
                            onGenderSelect={handleGenderSelect}
                            onRoleSelect={handleRoleSelect}
                        />
                    </div>
                </div>
            {:else if currentStep === 3}
                <div
                    class="wizard-step"
                    in:fly={{ y: 20, duration: 400, delay: 200 }}
                    out:fade={{ duration: 200 }}
                >
                    <div class="section-header centered">
                        <button
                            class="back-link"
                            onclick={() => (currentStep = 2)}
                        >
                            ← Back
                        </button>
                        <h2 class="impact-section-header-text">
                            {generatedAvatarUrl
                                ? "Your Avatar"
                                : "Generate Avatar"}
                        </h2>
                        <p class="step-desc">
                            {generatedAvatarUrl
                                ? `Your personalized ${selectedRole?.name} avatar is ready!`
                                : "Ready to create your AI-powered avatar"}
                        </p>
                    </div>

                    <div class="step-content">
                        {#if !generatedAvatarUrl && !isGenerating && !error}
                            <!-- Generate prompt -->
                            <div class="generate-prompt">
                                <div class="confirmation-card">
                                    <div class="preview-summary">
                                        <div class="preview-item">
                                            <img
                                                src={uploadedImageUrl}
                                                alt="Your photo"
                                                class="source-thumb"
                                            />
                                            <span class="preview-label"
                                                >Your Photo</span
                                            >
                                        </div>
                                        <div class="arrow">+</div>
                                        <div class="preview-item">
                                            <img
                                                src={`/${selectedGender === "male" ? "m" : "f"}-${selectedRole?.id}.png`}
                                                alt="Role reference"
                                                class="source-thumb"
                                            />
                                            <span class="preview-label"
                                                >{selectedRole?.name}</span
                                            >
                                        </div>
                                        <div class="arrow">=</div>
                                        <div
                                            class="preview-item result-placeholder"
                                        >
                                            <span class="result-icon">✨</span>
                                            <span class="preview-label"
                                                >AI Avatar</span
                                            >
                                        </div>
                                    </div>

                                    <button
                                        class="impact-btn impact-btn--lg"
                                        onclick={generateAvatar}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M12 2L2 7l10 5 10-5-10-5z"
                                            />
                                            <path d="M2 17l10 5 10-5" />
                                            <path d="M2 12l10 5 10-5" />
                                        </svg>
                                        Generate AI Avatar
                                    </button>
                                </div>
                            </div>
                        {:else if isGenerating}
                            <!-- Loading state -->
                            <div class="loading-container">
                                <div class="loading-spinner"></div>
                                <h3>Creating your AI avatar...</h3>
                                <p>This may take 30-60 seconds</p>
                            </div>
                        {:else if error}
                            <!-- Error state -->
                            <div class="error-container">
                                <div class="error-icon">⚠️</div>
                                <h3>Generation Failed</h3>
                                <p>{error}</p>
                                <button
                                    class="impact-btn impact-btn--secondary"
                                    onclick={() => {
                                        error = null;
                                    }}
                                >
                                    Try Again
                                </button>
                            </div>
                        {:else if generatedAvatarUrl}
                            <!-- Result -->
                            <div class="result-container">
                                <div class="avatar-display">
                                    <img
                                        src={generatedAvatarUrl}
                                        alt="{selectedRole?.name} Avatar"
                                        class="avatar-image"
                                    />
                                </div>
                                <div class="role-info">
                                    <span
                                        class="role-badge impact-badge impact-badge--accent"
                                    >
                                        {selectedRole?.name}
                                    </span>
                                    <p class="role-description">
                                        {selectedRole?.description}
                                    </p>
                                    {#if cloudinaryUrl}
                                        <p class="saved-notice">
                                            ✓ Saved to cloud
                                        </p>
                                    {/if}
                                </div>
                                <div class="action-buttons">
                                    <button
                                        class="impact-btn impact-btn--lg"
                                        onclick={downloadAvatar}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                                            />
                                            <polyline
                                                points="7,10 12,15 17,10"
                                            />
                                            <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                            />
                                        </svg>
                                        Download Avatar
                                    </button>
                                    <button
                                        class="impact-btn impact-btn--secondary"
                                        onclick={reset}
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .create-page {
        min-height: 100vh;
        padding: var(--impact-space-lg) 0 var(--impact-space-2xl);
    }

    .page-header {
        max-width: 900px;
        margin: 0 auto var(--impact-space-xl);
        padding: 0 var(--impact-space-lg);
    }

    .header-content {
        text-align: center;
        margin-top: var(--impact-space-lg);
    }

    /* Steps Indicator */
    .steps-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--impact-space-sm);
        max-width: 500px;
        margin: 0 auto var(--impact-space-xl);
        padding: 0 var(--impact-space-lg);
    }

    .step {
        display: flex;
        align-items: center;
        gap: var(--impact-space-sm);
        opacity: 0.4;
        transition: all 0.3s;
        cursor: not-allowed;
    }

    .step.active {
        opacity: 1;
    }

    .step.clickable {
        cursor: pointer;
    }

    .step.clickable:hover {
        opacity: 1;
    }

    .step-num {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--impact-card);
        border: 2px solid var(--impact-border);
        border-radius: 50%;
        font-size: 0.9rem;
        font-weight: 700;
        transition: all 0.3s;
        color: var(--impact-text);
    }

    .step.active .step-num {
        background: var(--impact-accent);
        border-color: var(--impact-accent);
        color: var(--impact-text);
        box-shadow: 0 0 15px var(--impact-accent-glow);
    }

    .step.completed .step-num {
        background: var(--impact-success);
        border-color: var(--impact-success);
        color: white;
    }

    .step-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--impact-text-secondary);
    }

    .step.active .step-label {
        color: var(--impact-text);
    }

    .step-line {
        flex: 1;
        height: 2px;
        background: var(--impact-border);
        max-width: 80px;
        transition: all 0.3s;
    }

    .step-line.active {
        background: var(--impact-accent);
    }

    /* Wizard Content */
    .create-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 var(--impact-space-lg);
    }

    .wizard-container {
        min-height: 400px;
        padding: var(--impact-space-xl);
        position: relative;
    }

    .section-header.centered {
        text-align: center;
        position: relative;
        margin-bottom: var(--impact-space-2xl);
    }

    .impact-section-header-text {
        font-size: 1.75rem;
        margin-bottom: var(--impact-space-xs);
        display: block;
        text-align: center;
    }

    .step-desc {
        color: var(--impact-text-secondary);
        font-size: 1rem;
    }

    .back-link {
        position: absolute;
        left: 0;
        top: 0;
        background: none;
        border: none;
        color: var(--impact-text-secondary);
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
        font-size: 0.9rem;
    }

    .back-link:hover {
        color: var(--impact-accent-dark);
        text-decoration: underline;
    }

    /* Preview Summary */
    .confirmation-card {
        text-align: center;
    }

    .preview-summary {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--impact-space-lg);
        margin-bottom: var(--impact-space-2xl);
        flex-wrap: wrap;
    }

    .preview-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--impact-space-sm);
    }

    .source-thumb {
        width: 100px;
        height: 100px;
        border-radius: var(--impact-radius-lg);
        object-fit: cover;
        border: 3px solid var(--impact-accent);
        box-shadow: var(--impact-shadow-md);
    }

    .preview-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--impact-text-secondary);
    }

    .arrow {
        font-size: 1.5rem;
        color: var(--impact-text-secondary);
        font-weight: bold;
    }

    .result-placeholder {
        width: 100px;
        height: 100px;
        border-radius: var(--impact-radius-lg);
        background: linear-gradient(
            135deg,
            var(--impact-accent-light),
            var(--impact-accent)
        );
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 3px dashed var(--impact-accent);
    }

    .result-icon {
        font-size: 2rem;
    }

    /* Loading State */
    .loading-container {
        text-align: center;
        padding: var(--impact-space-2xl);
    }

    .loading-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid var(--impact-border);
        border-top-color: var(--impact-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--impact-space-lg);
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .loading-container h3 {
        margin-bottom: var(--impact-space-sm);
    }

    .loading-container p {
        color: var(--impact-text-secondary);
    }

    /* Error State */
    .error-container {
        text-align: center;
        padding: var(--impact-space-2xl);
    }

    .error-icon {
        font-size: 3rem;
        margin-bottom: var(--impact-space-md);
    }

    .error-container h3 {
        color: var(--impact-error, #dc3545);
        margin-bottom: var(--impact-space-sm);
    }

    .error-container p {
        color: var(--impact-text-secondary);
        margin-bottom: var(--impact-space-lg);
    }

    /* Result Container */
    .result-container {
        text-align: center;
    }

    .avatar-display {
        margin-bottom: var(--impact-space-xl);
    }

    .avatar-image {
        max-width: 350px;
        width: 100%;
        height: auto;
        border-radius: var(--impact-radius-lg);
        box-shadow: var(--impact-shadow-lg);
        border: 4px solid var(--impact-accent);
    }

    .role-info {
        margin-bottom: var(--impact-space-xl);
    }

    .role-badge {
        font-size: 1.1rem;
        padding: var(--impact-space-sm) var(--impact-space-lg);
    }

    .role-description {
        margin-top: var(--impact-space-md);
        color: var(--impact-text-secondary);
        font-size: 1rem;
    }

    .saved-notice {
        margin-top: var(--impact-space-sm);
        color: var(--impact-success, #28a745);
        font-size: 0.9rem;
    }

    .action-buttons {
        display: flex;
        gap: var(--impact-space-md);
        justify-content: center;
        flex-wrap: wrap;
    }

    @media (max-width: 640px) {
        .steps-indicator {
            gap: var(--impact-space-xs);
        }

        .step-label {
            display: none;
        }

        .wizard-container {
            padding: var(--impact-space-lg);
        }

        .preview-summary {
            gap: var(--impact-space-sm);
        }

        .source-thumb,
        .result-placeholder {
            width: 70px;
            height: 70px;
        }

        .avatar-image {
            max-width: 280px;
        }

        .action-buttons {
            flex-direction: column;
        }

        .action-buttons button {
            width: 100%;
        }
    }
</style>
