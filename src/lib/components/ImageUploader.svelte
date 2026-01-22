<script lang="ts">
  import { env } from "$env/dynamic/public";

  interface Props {
    onUpload: (url: string) => void;
  }

  let { onUpload }: Props = $props();
  let uploadedUrl = $state<string | null>(null);
  let isUploading = $state(false);
  let uploadError = $state<string | null>(null);

  let isCloudinaryConfigured = $derived(
    !!env.PUBLIC_CLOUDINARY_CLOUD_NAME && !!env.PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );

  async function handleFileUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Reset error
    uploadError = null;

    // Local preview first
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // If Cloudinary is configured, upload it
    if (isCloudinaryConfigured) {
      try {
        isUploading = true;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", env.PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        const secureUrl = data.secure_url;

        if (secureUrl) {
          uploadedUrl = secureUrl; // Update to remote URL
          onUpload(secureUrl);
        }
      } catch (err: any) {
        console.error("Cloudinary upload error:", err);
        uploadError = "Failed to upload image. Using local preview instead.";
        // Fallback: still notify parent with local data URL if upload fails
        if (uploadedUrl) onUpload(uploadedUrl);
      } finally {
        isUploading = false;
      }
    } else {
      // Local fallback mode
      if (uploadedUrl) onUpload(uploadedUrl);
    }
  }
</script>

<div class="uploader">
  {#if !uploadedUrl}
    <label
      for="file-upload"
      class="upload-zone {isUploading ? 'uploading' : ''}"
    >
      <div class="upload-icon">
        {#if isUploading}
          <div class="spinner"></div>
        {:else}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
            />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
          </svg>
        {/if}
      </div>
      <h3>{isUploading ? "Uploading..." : "Upload Your Photo"}</h3>
      <p>
        {isUploading ? "Please wait a moment" : "Click to upload your photo"}
      </p>
      <span class="upload-hint">Supports JPG, PNG, WebP • Max 10MB</span>

      {#if uploadError}
        <div class="error-message">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {uploadError}
        </div>
      {/if}

      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onchange={handleFileUpload}
        class="sr-only"
        disabled={isUploading}
      />
    </label>
  {:else}
    <div class="preview-container">
      <div class="image-wrapper">
        <img src={uploadedUrl} alt="Uploaded preview" class="preview-image" />
        {#if isUploading}
          <div class="upload-overlay">
            <div class="spinner"></div>
          </div>
        {/if}
      </div>

      <button
        class="impact-btn impact-btn--secondary impact-btn--sm change-btn"
        type="button"
        onclick={() => {
          uploadedUrl = null;
          uploadError = null;
        }}
        disabled={isUploading}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
        </svg>
        Change Photo
      </button>
    </div>
  {/if}
</div>

<style>
  .uploader {
    width: 100%;
  }

  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: var(--impact-space-2xl) var(--impact-space-xl);
    background: var(--impact-card);
    border: 2px dashed var(--impact-border);
    border-radius: var(--impact-radius-xl);
    cursor: pointer;
    text-align: center;
    transition: all var(--impact-transition-base);
    font-family: inherit;
    color: inherit;
    box-sizing: border-box;
    position: relative;
  }

  .upload-zone:hover:not(.uploading) {
    border-color: var(--impact-accent);
    background: rgba(129, 237, 255, 0.05);
  }

  .upload-zone:active:not(.uploading) {
    transform: scale(0.99);
  }

  .upload-zone.uploading {
    cursor: wait;
    opacity: 0.8;
  }

  .upload-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(
      135deg,
      var(--impact-accent-light),
      rgba(255, 255, 255, 0)
    );
    border-radius: 50%;
    margin-bottom: var(--impact-space-lg);
    color: var(--impact-accent-dark);
  }

  .upload-zone h3 {
    font-size: 1.25rem;
    margin-bottom: var(--impact-space-xs);
    font-weight: 700;
  }

  .upload-zone p {
    color: var(--impact-text-secondary);
    margin-bottom: var(--impact-space-sm);
  }

  .upload-hint {
    font-size: 0.875rem;
    color: #999;
  }

  .preview-container {
    position: relative;
    text-align: center;
  }

  .image-wrapper {
    position: relative;
    display: inline-block;
  }

  .preview-image {
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: var(--impact-radius-xl);
    border: 2px solid var(--impact-accent);
    box-shadow: var(--impact-shadow-glow);
  }

  .change-btn {
    margin-top: var(--impact-space-md);
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(129, 237, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--impact-accent-dark);
    animation: spin 1s ease-in-out infinite;
  }

  .upload-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--impact-radius-xl);
  }

  .error-message {
    color: #dc3545;
    margin-top: 10px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
