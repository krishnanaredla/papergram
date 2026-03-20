<script>
    const items = [
        'Kitchen Paper Towels', 'Tissue Rolls', 'Paper Napkins',
        'Box Napkins', 'Garbage Covers'
    ]
    // Duplicate for seamless loop
    const track = [...items, ...items]
</script>

<section class="marquee-section">
    <div class="marquee">
        <div class="marquee-track">
            {#each track as item}
                <span class="marquee-item">{item}</span>
                <span class="marquee-dot">&loz;</span>
            {/each}
        </div>
    </div>
</section>

<style>
    .marquee-section {
        padding: 28px 0;
        background: var(--paper-warm);
        overflow: hidden;
        border-top: 1px solid var(--ruled-line);
        border-bottom: 1px solid var(--ruled-line);
    }

    .marquee {
        display: flex;
        width: 100%;
    }

    .marquee-track {
        display: flex;
        align-items: center;
        gap: 36px;
        white-space: nowrap;
        animation: scroll 22s linear infinite;
        font-family: var(--font-display);
        font-size: clamp(1.3rem, 2.5vw, 2rem);
        color: var(--ink-light);
        font-style: italic;
        will-change: transform;
    }

    .marquee:hover .marquee-track {
        animation-play-state: paused;
    }

    .marquee-dot {
        color: var(--kraft);
        font-size: 0.7em;
        font-style: normal;
    }

    @keyframes scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
</style>
