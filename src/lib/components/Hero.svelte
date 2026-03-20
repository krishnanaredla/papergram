<script>
    import { onMount } from 'svelte'
    import PaperCanvas from './PaperCanvas.svelte'
    import gsap from 'gsap'
    import { config } from '../config.js'

    let heroEl
    let towelEl
    let dirtLayer1
    let dirtLayer2
    let dirtLayer3
    let dirtAmbient
    let towelStain1
    let towelStain2
    let towelStain3
    let heroBelowEl
    let titleEl
    let visible = $state(false)

    onMount(() => {
        visible = true

        // Build GSAP timeline using direct element refs
        const tl = gsap.timeline({ delay: 0.9 })

        // --- Phase 1: Towel swoops in with arc motion ---
        tl.fromTo(towelEl,
            { x: 350, y: -250, rotation: -30, opacity: 0, scale: 0.7 },
            {
                x: 20, y: -10, rotation: -8, opacity: 1, scale: 1,
                duration: 0.7, ease: 'back.out(1.2)'
            }
        )
        // Subtle settle wobble
        tl.to(towelEl, {
            rotation: -5, y: 0, duration: 0.15, ease: 'power1.out'
        })

        // --- Phase 2: Wipe across line 1 (accelerating swipe) ---
        tl.to(towelEl, {
            x: -480, y: 15, rotation: -2, scaleX: 1.04,
            duration: 0.55, ease: 'power3.inOut'
        })
        tl.to(dirtLayer1, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.55, ease: 'power3.inOut'
        }, '<')
        tl.to(towelStain1, {
            opacity: 0.6, duration: 0.25
        }, '-=0.2')

        // --- Quick snap back (feels like a flick) ---
        tl.to(towelEl, {
            x: 380, y: 55, rotation: -12, scaleX: 1,
            duration: 0.25, ease: 'power4.in'
        })

        // --- Phase 3: Wipe across line 2 (slightly different arc) ---
        tl.to(towelEl, {
            x: -460, y: 85, rotation: 1, scaleX: 1.06,
            duration: 0.6, ease: 'power3.inOut'
        })
        tl.to(dirtLayer2, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.6, ease: 'power3.inOut'
        }, '<')
        tl.to(towelStain2, {
            opacity: 0.55, duration: 0.25
        }, '-=0.2')

        // --- Flick back ---
        tl.to(towelEl, {
            x: 360, y: 130, rotation: -14, scaleX: 1,
            duration: 0.22, ease: 'power4.in'
        })

        // --- Phase 4: Wipe across line 3 (fastest, most confident) ---
        tl.to(towelEl, {
            x: -500, y: 148, rotation: 3, scaleX: 1.08,
            duration: 0.5, ease: 'power3.inOut'
        })
        tl.to(dirtLayer3, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.5, ease: 'power3.inOut'
        }, '<')
        tl.to(towelStain3, {
            opacity: 0.5, duration: 0.25
        }, '-=0.2')

        // --- Phase 5: Final sweep clears ambient dirt ---
        tl.to(towelEl, {
            x: 380, y: 190, rotation: -15, scaleX: 1,
            duration: 0.2, ease: 'power3.in'
        })
        tl.to(towelEl, {
            x: -550, y: 240, rotation: 8, scaleX: 1.12,
            duration: 0.7, ease: 'power2.inOut'
        })
        tl.to(dirtAmbient, {
            opacity: 0,
            duration: 0.7, ease: 'power2.inOut'
        }, '<')

        // --- Phase 6: Towel flies off with spin ---
        tl.to(towelEl, {
            x: 500, y: -200, rotation: 35, opacity: 0, scale: 0.6,
            duration: 0.5, ease: 'power3.in'
        })

        // --- Phase 7: Clean shine pulse ---
        tl.to(titleEl, {
            textShadow: '0 0 60px rgba(196, 168, 130, 0.5)',
            duration: 0.25, ease: 'power2.out'
        }, '-=0.2')
        tl.to(titleEl, {
            textShadow: '0 0 0px rgba(196, 168, 130, 0)',
            duration: 0.8, ease: 'power2.out'
        })

        // --- Phase 8: Show description + CTA with spring-like ease ---
        tl.to(heroBelowEl, {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'back.out(1.4)'
        }, '-=0.6')

        return () => tl.kill()
    })
</script>

<section class="hero" bind:this={heroEl}>
    <PaperCanvas />

    <div class="hero-content" class:visible>
        <div class="hero-tag">
            <span class="tag-line"></span>
            Wholesale & Retail — {config.location.split(',')[0]}
        </div>

        <!-- Title area with dirt overlays -->
        <div class="hero-title-area">
            <h1 class="hero-title" bind:this={titleEl}>
                <span class="line line-1"><span class="line-inner">Every sheet,</span></span>
                <span class="line line-2"><span class="line-inner">every roll,</span></span>
                <span class="line line-3"><span class="line-inner">delivered.</span></span>
            </h1>

            <!-- Dirt layer for line 1: coffee + grease -->
            <div class="dirt-layer dirt-layer-1" bind:this={dirtLayer1}>
                <svg viewBox="0 0 800 120" preserveAspectRatio="none">
                    <!-- Big coffee ring -->
                    <ellipse cx="200" cy="55" rx="55" ry="48" fill="none" stroke="#6B4E12" stroke-width="8" opacity="0.45"/>
                    <ellipse cx="200" cy="55" rx="42" ry="36" fill="#6B4E12" opacity="0.12"/>
                    <!-- Grease smear -->
                    <ellipse cx="450" cy="50" rx="100" ry="28" fill="#5C4A2A" opacity="0.2" transform="rotate(-5 450 50)"/>
                    <!-- Blobs -->
                    <ellipse cx="100" cy="70" rx="60" ry="22" fill="#4A3A1F" opacity="0.18" transform="rotate(-8 100 70)"/>
                    <circle cx="600" cy="45" r="35" fill="#6B5B3A" opacity="0.14"/>
                    <circle cx="700" cy="65" r="25" fill="#5C4A2A" opacity="0.16"/>
                    <!-- Splatter drops -->
                    <circle cx="320" cy="30" r="8" fill="#6B4E12" opacity="0.3"/>
                    <circle cx="520" cy="80" r="6" fill="#4A3A1F" opacity="0.25"/>
                    <circle cx="680" cy="25" r="5" fill="#6B4E12" opacity="0.22"/>
                    <circle cx="150" cy="20" r="4" fill="#5C4A2A" opacity="0.28"/>
                    <!-- Drip -->
                    <path d="M185 95 Q190 110, 183 120" stroke="#6B4E12" stroke-width="3" fill="none" opacity="0.3"/>
                </svg>
            </div>

            <!-- Dirt layer for line 2: sauce + ketchup -->
            <div class="dirt-layer dirt-layer-2" bind:this={dirtLayer2}>
                <svg viewBox="0 0 800 120" preserveAspectRatio="none">
                    <!-- Red sauce splatter -->
                    <ellipse cx="150" cy="55" rx="70" ry="35" fill="#7A2218" opacity="0.22" transform="rotate(8 150 55)"/>
                    <circle cx="100" cy="30" r="15" fill="#943A2B" opacity="0.2"/>
                    <circle cx="220" cy="85" r="12" fill="#7A2218" opacity="0.18"/>
                    <!-- Grease streak -->
                    <ellipse cx="450" cy="50" rx="110" ry="22" fill="#5C4A2A" opacity="0.16" transform="rotate(-3 450 50)"/>
                    <!-- Brown smudge -->
                    <ellipse cx="650" cy="60" rx="60" ry="30" fill="#4A3A1F" opacity="0.2" transform="rotate(5 650 60)"/>
                    <!-- Dots -->
                    <circle cx="350" cy="35" r="9" fill="#943A2B" opacity="0.25"/>
                    <circle cx="530" cy="80" r="7" fill="#7A2218" opacity="0.2"/>
                    <circle cx="750" cy="40" r="6" fill="#5C4A2A" opacity="0.22"/>
                    <circle cx="300" cy="90" r="5" fill="#943A2B" opacity="0.18"/>
                </svg>
            </div>

            <!-- Dirt layer for line 3: ink + water stains -->
            <div class="dirt-layer dirt-layer-3" bind:this={dirtLayer3}>
                <svg viewBox="0 0 800 120" preserveAspectRatio="none">
                    <!-- Dark ink blotch -->
                    <ellipse cx="130" cy="55" rx="75" ry="30" fill="#1A1714" opacity="0.18" transform="rotate(-4 130 55)"/>
                    <!-- Water ring -->
                    <circle cx="380" cy="50" r="40" fill="none" stroke="#5A7080" stroke-width="6" opacity="0.2"/>
                    <circle cx="380" cy="50" r="30" fill="#5A7080" opacity="0.06"/>
                    <!-- Grime -->
                    <ellipse cx="580" cy="60" rx="65" ry="28" fill="#4A4540" opacity="0.16" transform="rotate(6 580 60)"/>
                    <!-- Marks -->
                    <circle cx="250" cy="30" r="10" fill="#1A1714" opacity="0.2"/>
                    <circle cx="500" cy="85" r="7" fill="#5A7080" opacity="0.18"/>
                    <circle cx="700" cy="40" r="8" fill="#4A4540" opacity="0.15"/>
                    <circle cx="50" cy="75" r="6" fill="#1A1714" opacity="0.22"/>
                </svg>
            </div>

            <!-- Ambient floating stains across everything -->
            <div class="dirt-ambient" bind:this={dirtAmbient}>
                <svg viewBox="0 0 800 400" preserveAspectRatio="none">
                    <ellipse cx="650" cy="80" rx="50" ry="40" fill="#6B4E12" opacity="0.1"/>
                    <ellipse cx="100" cy="300" rx="45" ry="35" fill="#943A2B" opacity="0.08"/>
                    <circle cx="500" cy="200" r="8" fill="#4A3A1F" opacity="0.2"/>
                    <circle cx="200" cy="150" r="6" fill="#7A2218" opacity="0.18"/>
                    <circle cx="700" cy="300" r="7" fill="#5C4A2A" opacity="0.15"/>
                    <circle cx="350" cy="350" r="5" fill="#6B4E12" opacity="0.2"/>
                    <circle cx="50" cy="50" r="4" fill="#943A2B" opacity="0.16"/>
                    <circle cx="750" cy="180" r="6" fill="#4A3A1F" opacity="0.12"/>
                    <!-- Grime streaks -->
                    <path d="M50 120 Q250 110, 500 130" stroke="#4A4540" stroke-width="2" fill="none" opacity="0.1"/>
                    <path d="M300 280 Q500 270, 750 290" stroke="#5C4A2A" stroke-width="1.5" fill="none" opacity="0.08"/>
                </svg>
            </div>

            <!-- THE PAPER TOWEL -->
            <div class="towel" bind:this={towelEl}>
                <svg viewBox="0 0 220 140" overflow="visible">
                    <defs>
                        <filter id="towel-shadow">
                            <feDropShadow dx="4" dy="8" stdDeviation="10" flood-color="#5C4A2A" flood-opacity="0.35"/>
                        </filter>
                    </defs>
                    <g filter="url(#towel-shadow)">
                        <!-- Main towel sheet -->
                        <rect x="5" y="5" width="210" height="130" rx="4" fill="#fefcf8" stroke="#c4a882" stroke-width="1"/>
                        <!-- Crumple texture -->
                        <path d="M20 15 Q50 8, 80 18 Q110 26, 140 14 Q170 6, 200 16" stroke="#e8dfd3" stroke-width="1.5" fill="none" opacity="0.7"/>
                        <path d="M15 40 Q45 32, 75 42 Q105 50, 135 38 Q165 30, 205 40" stroke="#e8dfd3" stroke-width="1.2" fill="none" opacity="0.6"/>
                        <path d="M10 65 Q40 58, 70 68 Q100 76, 130 64 Q160 56, 210 65" stroke="#e8dfd3" stroke-width="1.5" fill="none" opacity="0.7"/>
                        <path d="M20 90 Q50 82, 80 92 Q110 100, 140 88 Q170 80, 200 90" stroke="#e8dfd3" stroke-width="1.2" fill="none" opacity="0.6"/>
                        <path d="M15 115 Q45 108, 75 118 Q105 124, 135 112 Q165 106, 205 115" stroke="#e8dfd3" stroke-width="1" fill="none" opacity="0.5"/>
                        <!-- Perforation line -->
                        <line x1="10" y1="70" x2="210" y2="70" stroke="#c4a882" stroke-width="1" stroke-dasharray="6 4" opacity="0.4"/>
                        <!-- Embossed diamond pattern -->
                        <path d="M35 20 L50 35 L35 50 L20 35Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                        <path d="M75 20 L90 35 L75 50 L60 35Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                        <path d="M115 20 L130 35 L115 50 L100 35Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                        <path d="M155 20 L170 35 L155 50 L140 35Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                        <path d="M55 70 L70 85 L55 100 L40 85Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                        <path d="M95 70 L110 85 L95 100 L80 85Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                        <path d="M135 70 L150 85 L135 100 L120 85Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                        <path d="M175 70 L190 85 L175 100 L160 85Z" stroke="#d4cec5" stroke-width="0.8" fill="none" opacity="0.35"/>
                    </g>
                    <!-- Stains that accumulate -->
                    <ellipse bind:this={towelStain1} cx="70" cy="45" rx="35" ry="20" fill="#6B4E12" opacity="0" transform="rotate(-5 70 45)"/>
                    <ellipse bind:this={towelStain2} cx="140" cy="65" rx="30" ry="16" fill="#943A2B" opacity="0" transform="rotate(8 140 65)"/>
                    <ellipse bind:this={towelStain3} cx="100" cy="100" rx="28" ry="14" fill="#4A4540" opacity="0" transform="rotate(-3 100 100)"/>
                </svg>
            </div>
        </div>

        <div class="hero-below" bind:this={heroBelowEl}>
            <p class="hero-desc">
                Premium paper products from warehouse to your doorstep.
                Kitchen towels, tissues, napkins & more.
            </p>
            <div class="hero-cta">
                <a href="#products" class="btn btn--primary">
                    <span>See Products</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
                <a href="#contact" class="btn btn--ghost">Partner With Us</a>
            </div>
        </div>
    </div>

    <div class="hero-scroll">
        <div class="scroll-line"></div>
        <span>Scroll</span>
    </div>
</section>

<style>
    .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 120px 48px 80px;
        position: relative;
        overflow: hidden;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 900px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* --- Tag --- */
    .hero-tag {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-family: var(--font-label);
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-faint);
        margin-bottom: 32px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s var(--ease-out-expo) 0.5s;
    }

    .visible .hero-tag {
        opacity: 1;
        transform: translateY(0);
    }

    .tag-line {
        width: 32px;
        height: 1.5px;
        background: var(--kraft);
        display: inline-block;
    }

    /* --- Title Area --- */
    .hero-title-area {
        position: relative;
        margin-bottom: 40px;
        width: 100%;
    }

    .hero-title {
        font-family: var(--font-display);
        line-height: 1.08;
        position: relative;
        z-index: 1;
    }

    .line {
        display: block;
        overflow: hidden;
    }

    .line-inner {
        display: inline-block;
        transform: translateY(110%);
        transition: transform 1.1s var(--ease-out-expo);
    }

    .visible .line-1 .line-inner {
        transform: translateY(0);
        transition-delay: 0.15s;
    }
    .visible .line-2 .line-inner {
        transform: translateY(0);
        transition-delay: 0.3s;
    }
    .visible .line-3 .line-inner {
        transform: translateY(0);
        transition-delay: 0.45s;
    }

    .line-1 .line-inner {
        font-size: clamp(2.8rem, 6vw, 5.5rem);
        color: var(--ink-light);
        font-style: italic;
    }

    .line-2 .line-inner,
    .line-3 .line-inner {
        font-size: clamp(3.2rem, 7vw, 6.5rem);
        color: var(--ink);
        letter-spacing: -0.03em;
    }

    /* --- Dirt layers (strong visibility) --- */
    .dirt-layer {
        position: absolute;
        left: -5%;
        right: -5%;
        height: 33.33%;
        z-index: 2;
        pointer-events: none;
        clip-path: inset(0 0 0 0);
    }

    .dirt-layer :global(svg) {
        width: 100%;
        height: 100%;
        display: block;
    }

    .dirt-layer-1 { top: 0; }
    .dirt-layer-2 { top: 33.33%; }
    .dirt-layer-3 { top: 66.66%; }

    .dirt-ambient {
        position: absolute;
        inset: -5%;
        z-index: 2;
        pointer-events: none;
    }

    .dirt-ambient :global(svg) {
        width: 100%;
        height: 100%;
        display: block;
    }

    /* --- Paper Towel (BIG, starts off-screen) --- */
    .towel {
        position: absolute;
        top: -20px;
        right: -80px;
        width: clamp(260px, 35vw, 380px);
        z-index: 10;
        pointer-events: none;
        opacity: 0;
    }

    .towel :global(svg) {
        width: 100%;
        height: auto;
        overflow: visible;
        display: block;
    }

    /* --- Below title --- */
    .hero-below {
        opacity: 0;
        transform: translateY(30px);
        text-align: center;
    }

    .hero-desc {
        font-size: clamp(1rem, 1.4vw, 1.15rem);
        line-height: 1.75;
        color: var(--ink-faint);
        max-width: 500px;
        margin: 0 auto 40px;
    }

    .hero-cta {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
    }

    /* --- Buttons --- */
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

    .btn--ghost {
        background: transparent;
        color: var(--ink);
        border: 1.5px solid var(--kraft);
    }

    .btn--ghost:hover {
        border-color: var(--ink);
        transform: scale(1.05);
    }

    /* --- Scroll indicator --- */
    .hero-scroll {
        position: absolute;
        bottom: 40px;
        right: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .scroll-line {
        width: 1px;
        height: 48px;
        background: linear-gradient(to bottom, var(--kraft-dark), transparent);
        animation: scrollPulse 2s ease infinite;
    }

    @keyframes scrollPulse {
        0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
        40%  { transform: scaleY(1); transform-origin: top; opacity: 0.8; }
        60%  { transform: scaleY(1); transform-origin: bottom; opacity: 0.8; }
        100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
    }

    .hero-scroll span {
        font-family: var(--font-label);
        font-size: 0.65rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--pencil);
        writing-mode: vertical-rl;
    }

    @media (max-width: 768px) {
        .hero {
            padding: 100px 24px 60px;
        }

        .hero-scroll { display: none; }

        .hero-cta {
            flex-direction: column;
        }

        .btn {
            width: 100%;
            cursor: pointer;
        }

        .towel {
            width: 180px;
        }
    }
</style>
