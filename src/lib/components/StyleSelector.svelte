<script lang="ts">
    interface AvatarStyle {
        id: string;
        name: string;
        emoji: string;
        description: string;
        prompt: string;
    }

    interface Props {
        selectedStyle: string | null;
        onSelect: (style: AvatarStyle) => void;
    }

    let { selectedStyle, onSelect }: Props = $props();

    const styles: AvatarStyle[] = [
        {
            id: "anime",
            name: "Anime",
            emoji: "🎨",
            description: "Japanese anime art style",
            prompt: "Transform this photo into a beautiful anime character portrait in the style of Studio Ghibli. Keep the facial features recognizable but stylized with large expressive eyes, detailed hair, and smooth cel-shaded coloring. The background should be a soft gradient.",
        },
        {
            id: "3d-render",
            name: "3D Render",
            emoji: "🤖",
            description: "Pixar-like 3D character",
            prompt: "Create a high-quality 3D rendered avatar in the style of Pixar and Disney animated movies. The character should have a friendly, appealing look with exaggerated proportions, smooth skin textures, and vibrant lighting. Keep the essence of the original face recognizable.",
        },
        {
            id: "pixel-art",
            name: "Pixel Art",
            emoji: "👾",
            description: "Retro 8-bit style",
            prompt: "Convert this photo into nostalgic 16-bit pixel art style like classic RPG character portraits. Use a limited color palette, visible pixels, and retro gaming aesthetic. The avatar should look like it belongs in a classic video game.",
        },
        {
            id: "cartoon",
            name: "Cartoon",
            emoji: "🎪",
            description: "Fun cartoon illustration",
            prompt: "Transform this photo into a fun, colorful cartoon illustration. Use bold outlines, exaggerated features, bright saturated colors, and a playful artistic style. The result should look like a professional cartoon character design.",
        },
        {
            id: "fantasy",
            name: "Fantasy",
            emoji: "🎭",
            description: "Epic fantasy portrait",
            prompt: "Create an epic fantasy portrait in the style of high fantasy concept art. Add magical elements like glowing effects, ethereal lighting, fantasy clothing or armor. The style should be detailed and painterly, suitable for a fantasy game or book cover.",
        },
        {
            id: "cyberpunk",
            name: "Cyberpunk",
            emoji: "💿",
            description: "Futuristic neon style",
            prompt: "Transform this into a cyberpunk avatar with neon lighting, futuristic tech implants or accessories, and a dark urban atmosphere. Use vibrant neon colors (cyan, magenta, electric blue) against dark backgrounds. Add cybernetic or holographic elements.",
        },
        {
            id: "watercolor",
            name: "Watercolor",
            emoji: "🎨",
            description: "Artistic watercolor painting",
            prompt: "Create a beautiful watercolor portrait painting. Use soft, flowing watercolor techniques with visible brush strokes, color bleeds, and artistic imperfections. The style should be elegant and artistic, like a hand-painted portrait.",
        },
        {
            id: "pop-art",
            name: "Pop Art",
            emoji: "🔴",
            description: "Andy Warhol inspired",
            prompt: "Transform this photo into bold pop art style inspired by Andy Warhol and Roy Lichtenstein. Use flat bold colors, halftone dots patterns, thick black outlines, and high contrast. The result should be iconic and striking.",
        },
    ];
</script>

<div class="style-selector">
    <h3 class="impact-section-header">Choose Your Style</h3>
    <div class="styles-grid">
        {#each styles as style}
            <button
                class="impact-card style-card"
                class:selected={selectedStyle === style.id}
                onclick={() => onSelect(style)}
            >
                <div class="style-icon-wrapper">
                    <span class="style-emoji">{style.emoji}</span>
                </div>
                <h4>{style.name}</h4>
                <p>{style.description}</p>
                {#if selectedStyle === style.id}
                    <div class="selected-indicator">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                {/if}
            </button>
        {/each}
    </div>
</div>

<style>
    .style-selector {
        width: 100%;
    }

    .styles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--impact-space-md);
    }

    .style-card {
        position: relative;
        padding: var(--impact-space-lg);
        text-align: center;
        cursor: pointer;
        border: 2px solid transparent;
        font-family: inherit;
        color: inherit;
        transition: all var(--impact-transition-base);
        background: rgba(255, 255, 255, 0.9);
    }

    .style-card:hover {
        border-color: var(--impact-accent-light);
    }

    .style-card.selected {
        border-color: var(--impact-accent);
        background: rgba(129, 237, 255, 0.1);
        box-shadow: 0 0 0 2px var(--impact-accent-glow);
    }

    .style-icon-wrapper {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--impact-bg);
        border-radius: 50%;
        margin: 0 auto var(--impact-space-md);
        font-size: 2rem;
    }

    .style-card h4 {
        font-size: 1rem;
        margin-bottom: var(--impact-space-xs);
        font-weight: 700;
        color: var(--impact-text);
    }

    .style-card p {
        font-size: 0.75rem;
        color: var(--impact-text-secondary);
        line-height: 1.4;
    }

    .selected-indicator {
        position: absolute;
        top: var(--impact-space-sm);
        right: var(--impact-space-sm);
        width: 24px;
        height: 24px;
        background: var(--impact-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--impact-text);
        box-shadow: 0 2px 10px var(--impact-accent-glow);
    }

    @media (max-width: 480px) {
        .styles-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
