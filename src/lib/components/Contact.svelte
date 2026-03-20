<script>
    import { onMount } from 'svelte'
    import { config } from '../config.js'

    let sectionEl
    let visible = $state(false)

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                visible = true
                observer.disconnect()
            }
        }, { threshold: 0.15 })

        observer.observe(sectionEl)
        return () => observer.disconnect()
    })
</script>

<section class="contact" id="contact" bind:this={sectionEl}>
    <div class="contact-inner" class:visible>
        <div class="contact-left">
            <h2 class="contact-title">
                Let's talk<br>
                <span class="contact-accent"><em>paper.</em></span>
            </h2>
            <p class="contact-desc">
                Retailers, hotels, restaurants, offices —
                we'd love to supply you.
            </p>
        </div>
        <div class="contact-right">
            <div class="contact-card">
                <div class="contact-card-corner"></div>
                <div class="contact-item">
                    <span class="contact-label">Call / WhatsApp</span>
                    <a href="tel:{config.phone}" class="contact-value">{config.phoneDisplay}</a>
                </div>
                <div class="contact-item">
                    <span class="contact-label">Email</span>
                    <a href="mailto:{config.email}" class="contact-value">{config.email}</a>
                </div>
                <div class="contact-item">
                    <span class="contact-label">Location</span>
                    <span class="contact-value">{config.location}</span>
                </div>
                <div class="contact-item">
                    <span class="contact-label">Hours</span>
                    <span class="contact-value">{config.hours}</span>
                </div>
                <a href="https://wa.me/{config.whatsapp}" class="btn btn--primary btn--full" target="_blank" rel="noopener">
                    <span>Message on WhatsApp</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</section>

<style>
    .contact {
        padding: 120px 0;
    }

    .contact-inner {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        padding: 0 48px;
        align-items: start;
    }

    /* Reveal */
    .contact-left {
        opacity: 0;
        transform: translateX(-30px) translateY(20px);
        transition: opacity 1s var(--ease-out-expo),
                    transform 1s var(--ease-out-expo);
    }

    .contact-right {
        opacity: 0;
        transform: translateX(30px) translateY(20px) rotate(1deg);
        transition: opacity 1s var(--ease-out-expo),
                    transform 1s var(--ease-out-expo);
    }

    .visible .contact-left {
        opacity: 1;
        transform: translateX(0) translateY(0);
        transition-delay: 0.1s;
    }

    .visible .contact-right {
        opacity: 1;
        transform: translateX(0) translateY(0) rotate(0deg);
        transition-delay: 0.25s;
    }

    .contact-title {
        font-family: var(--font-display);
        font-size: clamp(3rem, 6.5vw, 5.5rem);
        font-weight: 400;
        letter-spacing: -0.03em;
        line-height: 1.05;
        margin-bottom: 20px;
    }

    .contact-accent {
        color: var(--kraft-dark);
    }

    .contact-desc {
        font-size: 1.05rem;
        line-height: 1.7;
        color: var(--ink-faint);
        max-width: 380px;
    }

    .contact-card {
        background: var(--paper-warm);
        border: 1px solid var(--ruled-line);
        border-radius: var(--radius);
        padding: 36px;
        position: relative;
        overflow: hidden;
    }

    .contact-card-corner {
        position: absolute;
        bottom: 0; left: 0;
        width: 0; height: 0;
        border-style: solid;
        border-width: 32px 0 0 32px;
        border-color: transparent transparent transparent var(--paper);
        filter: drop-shadow(2px -2px 2px rgba(139, 115, 85, 0.08));
    }

    .contact-item {
        padding: 16px 0;
        border-bottom: 1px dashed var(--ruled-line);
    }

    .contact-item:last-of-type {
        border-bottom: none;
    }

    .contact-label {
        font-family: var(--font-label);
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--pencil);
        display: block;
        margin-bottom: 4px;
    }

    .contact-value {
        font-size: 1.05rem;
        font-weight: 500;
        display: block;
        color: var(--ink);
        transition: color 0.3s;
    }

    a.contact-value:hover {
        color: var(--kraft-dark);
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-family: var(--font-body);
        font-size: 0.9rem;
        font-weight: 600;
        padding: 16px 32px;
        border-radius: 100px;
        border: none;
        cursor: none;
        transition: all 0.4s var(--ease-out-expo);
    }

    .btn--primary {
        background: var(--ink);
        color: var(--paper);
    }

    .btn--primary:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 32px rgba(26, 23, 20, 0.2);
    }

    .btn--full {
        width: 100%;
        margin-top: 20px;
    }

    @media (max-width: 1024px) {
        .contact-inner {
            grid-template-columns: 1fr;
            gap: 48px;
        }
    }

    @media (max-width: 768px) {
        .contact { padding: 80px 0; }
        .contact-inner { padding: 0 24px; }
        .contact-card { padding: 24px; }
        .btn { cursor: pointer; }
    }
</style>
