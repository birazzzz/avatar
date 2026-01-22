<script lang="ts">
    interface Props {
        avatarUrl: string | null;
        isLoading: boolean;
        error: string | null;
        onDownload: () => void;
        onRegenerate: () => void;
    }

    let { avatarUrl, isLoading, error, onDownload, onRegenerate }: Props =
        $props();
</script>

<div class="preview-section">
    {#if isLoading}
        <div class="loading-state">
            <div class="loading-animation">
                <div class="spinner-large"></div>
                <div class="loading-ring"></div>
            </div>
            <h3 class="impact-section-header">Creating Your Avatar...</h3>
            <p>Our AI is working its magic ✨</p>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Oops, Something Went Wrong</h3>
            <p>{error}</p>
            <button
                class="impact-btn impact-btn--secondary"
                onclick={onRegenerate}>Try Again</button
            >
        </div>
    {:else if avatarUrl}
        <div class="result-state impact-card animate-in">
            <div class="avatar-frame">
                <img
                    src={avatarUrl}
                    alt="Generated avatar"
                    class="avatar-image"
                />
            </div>
            <div class="result-actions">
                <button class="impact-btn" onclick={onDownload}>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Avatar
                </button>
                <button
                    class="impact-btn impact-btn--secondary"
                    onclick={onRegenerate}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                        />
                        <path d="M3 3v5h5" />
                        <path
                            d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
                        />
                        <path d="M16 16h5v5" />
                    </svg>
                    Generate Another
                </button>
            </div>
        </div>
    {:else}
        <div class="empty-state">
            <div class="empty-icon">🖼️</div>
            <h3>Your Avatar Will Appear Here</h3>
            <p>Upload a photo and select a style to get started</p>
        </div>
    {/if}
</div>

<style>
    .preview-section {
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    /* Loading State */
    .loading-state {
        text-align: center;
        padding: var(--impact-space-xl);
    }

    .loading-animation {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto var(--impact-space-xl);
    }

    .spinner-large {
        position: absolute;
        inset: 0;
        border: 4px solid var(--impact-border);
        border-top-color: var(--impact-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .loading-ring {
        position: absolute;
        inset: 15px;
        border: 4px solid transparent;
        border-top-color: var(--impact-accent-dark);
        border-radius: 50%;
        animation: spin 1.5s linear infinite reverse;
    }

    .loading-state p {
        color: var(--impact-text-secondary);
        margin-bottom: var(--impact-space-lg);
    }

    .progress-bar {
        width: 200px;
        height: 4px;
        background: var(--impact-border);
        border-radius: var(--impact-radius-full);
        margin: 0 auto;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--impact-accent),
            var(--impact-accent-dark)
        );
        animation: shimmer 2s ease-in-out infinite;
        background-size: 200% 100%;
    }

    /* Error State */
    .error-state {
        text-align: center;
        padding: var(--impact-space-xl);
    }

    .error-icon {
        font-size: 3rem;
        margin-bottom: var(--impact-space-md);
    }

    .error-state h3 {
        color: var(--impact-error);
        margin-bottom: var(--impact-space-sm);
        font-weight: 700;
    }

    .error-state p {
        color: var(--impact-text-secondary);
        margin-bottom: var(--impact-space-lg);
        max-width: 300px;
    }

    /* Result State */
    .result-state {
        text-align: center;
        padding: var(--impact-space-2xl);
    }

    .avatar-frame {
        position: relative;
        display: inline-block;
        padding: 4px;
        background: linear-gradient(
            135deg,
            var(--impact-accent),
            var(--impact-accent-dark)
        );
        border-radius: var(--impact-radius-xl);
        margin-bottom: var(--impact-space-xl);
    }

    .avatar-image {
        display: block;
        width: 300px;
        height: 300px;
        object-fit: cover;
        border-radius: calc(var(--impact-radius-xl) - 4px);
    }

    .result-actions {
        display: flex;
        gap: var(--impact-space-md);
        justify-content: center;
        flex-wrap: wrap;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: var(--impact-space-3xl);
        background: var(--impact-card);
        border: 2px dashed var(--impact-border);
        border-radius: var(--impact-radius-xl);
        width: 100%;
        max-width: 400px;
    }

    .empty-icon {
        font-size: 3rem;
        margin-bottom: var(--impact-space-md);
        opacity: 0.5;
    }

    .empty-state h3 {
        color: var(--impact-text-secondary);
        margin-bottom: var(--impact-space-sm);
        font-weight: 700;
        font-size: 1.1rem;
    }

    .empty-state p {
        color: var(--impact-text-secondary);
        font-size: 0.9rem;
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 480px) {
        .avatar-image {
            width: 250px;
            height: 250px;
        }

        .result-actions {
            flex-direction: column;
            align-items: center;
        }

        .result-actions .impact-btn {
            width: 100%;
            max-width: 250px;
        }
    }
</style>
