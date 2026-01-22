<script lang="ts">
    interface Props {
        selectedGender: "male" | "female" | null;
        selectedRole: string | null;
        onGenderSelect: (gender: "male" | "female") => void;
        onRoleSelect: (role: {
            id: string;
            name: string;
            description: string;
        }) => void;
    }

    let { selectedGender, selectedRole, onGenderSelect, onRoleSelect }: Props =
        $props();

    const roles = [
        {
            id: "innovator",
            name: "Innovator",
            emoji: "💡",
            description: "Creative problem solver driving change",
        },
        {
            id: "coach",
            name: "Coach",
            emoji: "🎯",
            description: "Empowering others to reach their potential",
        },
        {
            id: "leader",
            name: "Leader",
            emoji: "👑",
            description: "Inspiring vision and guiding teams forward",
        },
    ];
</script>

<div class="gender-role-selector">
    <!-- Gender Selection -->
    <div class="selection-section">
        <h3 class="impact-section-header">Select Your Gender</h3>
        <div class="gender-grid">
            <button
                class="impact-card gender-card"
                class:selected={selectedGender === "male"}
                onclick={() => onGenderSelect("male")}
            >
                <div class="gender-icon-wrapper">
                    <span class="gender-emoji">👨</span>
                </div>
                <h4>Male</h4>
                {#if selectedGender === "male"}
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
            <button
                class="impact-card gender-card"
                class:selected={selectedGender === "female"}
                onclick={() => onGenderSelect("female")}
            >
                <div class="gender-icon-wrapper">
                    <span class="gender-emoji">👩</span>
                </div>
                <h4>Female</h4>
                {#if selectedGender === "female"}
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
        </div>
    </div>

    <!-- Role Selection -->
    {#if selectedGender}
        <div
            class="selection-section"
            style="margin-top: var(--impact-space-xl);"
        >
            <h3 class="impact-section-header">Select Your Role</h3>
            <div class="roles-grid">
                {#each roles as role}
                    <button
                        class="impact-card role-card"
                        class:selected={selectedRole === role.id}
                        onclick={() => onRoleSelect(role)}
                    >
                        <div class="role-icon-wrapper">
                            <span class="role-emoji">{role.emoji}</span>
                        </div>
                        <h4>{role.name}</h4>
                        <p>{role.description}</p>
                        {#if selectedRole === role.id}
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
    {/if}
</div>

<style>
    .gender-role-selector {
        width: 100%;
    }

    .selection-section {
        margin-bottom: var(--impact-space-lg);
    }

    .gender-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--impact-space-md);
        max-width: 400px;
        margin: 0 auto;
    }

    .roles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--impact-space-md);
    }

    .gender-card,
    .role-card {
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

    .gender-card:hover,
    .role-card:hover {
        border-color: var(--impact-accent-light);
    }

    .gender-card.selected,
    .role-card.selected {
        border-color: var(--impact-accent);
        background: rgba(129, 237, 255, 0.1);
        box-shadow: 0 0 0 2px var(--impact-accent-glow);
    }

    .gender-icon-wrapper,
    .role-icon-wrapper {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--impact-bg);
        border-radius: 50%;
        margin: 0 auto var(--impact-space-md);
        font-size: 2.5rem;
    }

    .gender-card h4,
    .role-card h4 {
        font-size: 1.1rem;
        margin-bottom: var(--impact-space-xs);
        font-weight: 700;
        color: var(--impact-text);
    }

    .role-card p {
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
        .roles-grid {
            grid-template-columns: 1fr;
        }

        .gender-grid {
            max-width: 100%;
        }
    }
</style>
