<script lang="ts">
  import { CldUploadWidget } from "svelte-cloudinary";
  import { env } from "$env/dynamic/public";

  interface Props {
    onUpload: (url: string) => void;
  }

  let { onUpload }: Props = $props();
  let uploadedUrl = $state<string | null>(null);
  let isCloudinaryConfigured = $derived(
    !!env.PUBLIC_CLOUDINARY_CLOUD_NAME && !!env.PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );

  function handleCloudinarySuccess(result: any) {
    const url = result.info?.secure_url;
    if (url) {
      uploadedUrl = url;
      onUpload(url);
    }
  }

  function handleLocalUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        uploadedUrl = result;
        onUpload(result);
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<div class="uploader">
  {#if !uploadedUrl}
    {#if isCloudinaryConfigured}
      <CldUploadWidget
        uploadPreset={env.PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          cloudName: env.PUBLIC_CLOUDINARY_CLOUD_NAME,
          sources: ["local", "camera"],
          multiple: false,
          maxFiles: 1,
          cropping: true,
          croppingAspectRatio: 1,
          croppingShowDimensions: true,
          resourceType: "image",
          maxImageFileSize: 10000000,
          styles: {
            palette: {
              window: "#ffffff",
              sourceBg: "#f4f4f5",
              windowBorder: "#81EDFF",
              tabIcon: "#81EDFF",
              inactiveTabIcon: "#666666",
              menuIcons: "#222222",
              link: "#81EDFF",
              action: "#81EDFF",
              inProgress: "#81EDFF",
              complete: "#28a745",
              error: "#dc3545",
              textDark: "#222222",
              textLight: "#666666",
            },
          },
        }}
        onSuccess={handleCloudinarySuccess}
      >
        {#snippet children({ open }: { open: any })}
          <button class="upload-zone" onclick={open}>
            <div class="upload-icon">
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
            </div>
            <h3>Upload Your Photo</h3>
            <p>Click to upload your photo</p>
            <span class="upload-hint">Supports JPG, PNG, WebP • Max 10MB</span>
          </button>
        {/snippet}
      </CldUploadWidget>
    {:else}
      <!-- Fallback to local upload when Cloudinary not configured -->
      <div class="upload-zone">
        <div class="upload-icon">
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
        </div>
        <h3>Upload Your Photo</h3>
        <p>Click or drag & drop your image here</p>
        <span class="upload-hint">Supports JPG, PNG, WebP • Max 10MB</span>
        <input
          type="file"
          accept="image/*"
          onchange={handleLocalUpload}
          class="file-input"
        />
      </div>
    {/if}
  {:else}
    <div class="preview-container">
      <img src={uploadedUrl} alt="Uploaded preview" class="preview-image" />
      <button
        class="impact-btn impact-btn--secondary impact-btn--sm change-btn"
        onclick={() => (uploadedUrl = null)}
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

  .upload-zone {
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
    position: relative;
    box-sizing: border-box;
  }

  .upload-zone:hover {
    border-color: var(--impact-accent);
  }

  .file-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
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
</style>
