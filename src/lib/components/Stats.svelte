<script>
    import { onMount } from 'svelte'
    import { config } from '../config.js'

    const stats = [
        { target: config.stats.partners, suffix: '+', label: 'Retail Partners' },
        { target: config.stats.units, suffix: 'K', label: 'Units / Month' },
        { target: config.stats.products, suffix: '', label: 'Product Lines' },
        { target: config.stats.delivery, suffix: 'hr', label: 'Delivery in Hyderabad' }
    ]

    let values = $state(stats.map(() => 0))
    let sectionEl
    let animated = false
    let visible = $state(false)

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true
                visible = true
                // Stagger: start each counter slightly after the previous
                stats.forEach((_, i) => {
                    setTimeout(() => animateStat(i), i * 150)
                })
                observer.disconnect()
            }
        }, { threshold: 0.3 })

        observer.observe(sectionEl)
        return () => observer.disconnect()
    })

    function animateStat(index) {
        const duration = 1800
        const start = performance.now()
        const target = stats[index].target

        function update(now) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Snappy ease-out with slight overshoot
            const eased = 1 - Math.pow(1 - progress, 4)

            values[index] = Math.round(target * eased)

            if (progress < 1) requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
    }
</script>

<section class="stats-section" bind:this={sectionEl}>
    <div class="stats-paper" class:visible>
        <div class="paper-lines"></div>
        <div class="stats-grid">
            {#each stats as stat, i}
                <div class="stat" class:visible style="transition-delay: {i * 0.1}s">
                    <span class="stat-number">{values[i]}</span><span class="stat-suffix">{stat.suffix}</span>
                    <span class="stat-label">{stat.label}</span>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .stats-section {
        padding: 80px 48px;
        background: var(--paper-warm);
    }

    .stats-paper {
        max-width: 900px;
        margin: 0 auto;
        padding: 48px;
        background: var(--paper);
        border: 1px solid var(--ruled-line);
        border-radius: var(--radius);
        position: relative;
        box-shadow: 0 2px 20px rgba(139, 115, 85, 0.06);
        opacity: 0;
        transform: translateY(30px) scale(0.97);
        transition: opacity 0.8s var(--ease-out-expo),
                    transform 0.8s var(--ease-out-expo);
    }

    .stats-paper.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .paper-lines {
        position: absolute;
        inset: 48px 40px;
        background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 31px,
            var(--ruled-line) 31px,
            var(--ruled-line) 32px
        );
        opacity: 0.5;
        pointer-events: none;
    }

    .paper-lines::before {
        content: '';
        position: absolute;
        top: -8px; bottom: -8px;
        left: 40px;
        width: 1px;
        background: rgba(196, 92, 74, 0.2);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        position: relative;
        z-index: 1;
    }

    .stat {
        text-align: center;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.7s var(--ease-out-expo),
                    transform 0.7s var(--ease-out-expo);
    }

    .stat.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .stat-number {
        font-family: var(--font-display);
        font-size: clamp(2.5rem, 4.5vw, 3.5rem);
        color: var(--ink);
        letter-spacing: -0.03em;
    }

    .stat-suffix {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 2.5vw, 2rem);
        color: var(--kraft-dark);
    }

    .stat-label {
        display: block;
        font-family: var(--font-label);
        font-size: 0.7rem;
        font-weight: 500;
        color: var(--pencil);
        margin-top: 4px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    @media (max-width: 768px) {
        .stats-section { padding: 60px 24px; }
        .stats-paper { padding: 32px 24px; }
        .stats-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    }

    @media (max-width: 480px) {
        .stats-grid { grid-template-columns: 1fr 1fr; }
    }
</style>
