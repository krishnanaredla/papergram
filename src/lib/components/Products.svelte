<script>
    import { onMount } from 'svelte'

    const products = [
        {
            num: '01', name: 'Kitchen Paper Towels', tag: 'Bestseller',
            desc: 'Heavy-duty absorbent towels for commercial kitchens and homes. Available in bulk.',
            icon: 'towel'
        },
        {
            num: '02', name: 'Tissue Rolls', tag: 'Popular',
            desc: 'Soft, strong 2-ply and 3-ply options. Perfect for restrooms and hospitality.',
            icon: 'roll'
        },
        {
            num: '03', name: 'Paper Napkins', tag: 'Essential',
            desc: 'Restaurant-grade folded napkins. Clean look for hotels, cafes, and catering.',
            icon: 'napkin'
        },
        {
            num: '04', name: 'Box Napkins', tag: 'Convenient',
            desc: 'Convenient dispenser-box format for offices, counters, and table tops.',
            icon: 'box'
        },
        {
            num: '05', name: 'Garbage Covers', tag: 'Heavy Duty',
            desc: 'Durable bin liners in all sizes. Tear-resistant, leak-proof. Bulk pricing available.',
            icon: 'bag'
        }
    ]

    let cardEls = []

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

        cardEls.forEach(el => { if (el) observer.observe(el) })

        return () => observer.disconnect()
    })

    let tiltTargets = {}
    let tiltCurrents = {}
    let tiltRaf = null

    function lerpTilt() {
        let needsUpdate = false
        for (const i in tiltTargets) {
            if (!tiltCurrents[i]) tiltCurrents[i] = { rx: 0, ry: 0, ty: 0 }
            const t = tiltTargets[i]
            const c = tiltCurrents[i]
            const ease = 0.12
            c.rx += (t.rx - c.rx) * ease
            c.ry += (t.ry - c.ry) * ease
            c.ty += (t.ty - c.ty) * ease

            if (Math.abs(t.rx - c.rx) > 0.01 || Math.abs(t.ry - c.ry) > 0.01 || Math.abs(t.ty - c.ty) > 0.01) {
                needsUpdate = true
            }

            if (cardEls[i]) {
                cardEls[i].style.transform = `translateY(${c.ty}px) perspective(800px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`
            }
        }
        if (needsUpdate) {
            tiltRaf = requestAnimationFrame(lerpTilt)
        } else {
            tiltRaf = null
        }
    }

    function handleTilt(e, el, index) {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const cx = rect.width / 2
        const cy = rect.height / 2
        const rx = (y - cy) / cy * -5
        const ry = (x - cx) / cx * 5
        tiltTargets[index] = { rx, ry, ty: -8 }
        if (!tiltRaf) tiltRaf = requestAnimationFrame(lerpTilt)
    }

    function resetTilt(index) {
        tiltTargets[index] = { rx: 0, ry: 0, ty: 0 }
        if (!tiltRaf) tiltRaf = requestAnimationFrame(lerpTilt)
    }
</script>

<section class="products" id="products">
    <div class="section-header">
        <span class="section-label reveal-el">What We Carry</span>
        <h2 class="section-title reveal-el">Our Products</h2>
    </div>

    <div class="products-grid">
        {#each products as product, i}
            <div
                class="product-card reveal-card"
                style="transition-delay: {i * 0.12}s"
                bind:this={cardEls[i]}
                onmousemove={(e) => handleTilt(e, cardEls[i], i)}
                onmouseleave={() => resetTilt(i)}
                role="article"
            >
                <div class="product-card-fold"></div>

                <div class="product-visual">
                    <!-- Large product number as background texture -->
                    <span class="product-visual-num">{product.num}</span>

                    <div class="product-visual-icon product-visual-icon--{product.icon}">
                        {#if product.icon === 'towel'}
                            <!-- Single clean towel sheet with tear -->
                            <svg viewBox="0 0 120 120" fill="none">
                                <rect class="towel-sheet" x="20" y="12" width="80" height="96" rx="2" fill="var(--paper)" stroke="var(--kraft-dark)" stroke-width="1.2"/>
                                <line x1="20" y1="36" x2="100" y2="36" stroke="var(--kraft)" stroke-width="0.8" stroke-dasharray="5 4" opacity="0.6"/>
                                <!-- Emboss texture -->
                                <line x1="34" y1="50" x2="86" y2="50" stroke="var(--kraft)" stroke-width="0.6" opacity="0.2"/>
                                <line x1="34" y1="60" x2="86" y2="60" stroke="var(--kraft)" stroke-width="0.6" opacity="0.2"/>
                                <line x1="34" y1="70" x2="80" y2="70" stroke="var(--kraft)" stroke-width="0.6" opacity="0.2"/>
                                <line x1="34" y1="80" x2="74" y2="80" stroke="var(--kraft)" stroke-width="0.6" opacity="0.2"/>
                                <line x1="34" y1="90" x2="68" y2="90" stroke="var(--kraft)" stroke-width="0.6" opacity="0.2"/>
                                <!-- Absorb ripple -->
                                <circle class="absorb-ring" cx="68" cy="66" r="12" stroke="var(--kraft)" stroke-width="0.8" fill="none" opacity="0"/>
                                <circle class="absorb-ring absorb-ring--2" cx="68" cy="66" r="8" stroke="var(--kraft)" stroke-width="0.6" fill="none" opacity="0"/>
                            </svg>
                        {:else if product.icon === 'roll'}
                            <!-- Minimal toilet roll side view -->
                            <svg viewBox="0 0 120 120" fill="none">
                                <!-- Outer circle -->
                                <circle cx="60" cy="60" r="42" fill="var(--paper)" stroke="var(--kraft-dark)" stroke-width="1.2"/>
                                <!-- Inner hole -->
                                <circle cx="60" cy="60" r="14" fill="var(--paper-warm)" stroke="var(--kraft)" stroke-width="0.8"/>
                                <!-- Ply rings -->
                                <circle cx="60" cy="60" r="24" fill="none" stroke="var(--kraft)" stroke-width="0.4" opacity="0.25"/>
                                <circle cx="60" cy="60" r="32" fill="none" stroke="var(--kraft)" stroke-width="0.4" opacity="0.18"/>
                                <circle cx="60" cy="60" r="38" fill="none" stroke="var(--kraft)" stroke-width="0.4" opacity="0.12"/>
                                <!-- Unrolling tail -->
                                <path class="roll-tail" d="M102 60 C106 58, 108 62, 106 68 C104 74, 108 78, 112 76" stroke="var(--kraft-dark)" stroke-width="1" fill="none" stroke-linecap="round"/>
                            </svg>
                        {:else if product.icon === 'napkin'}
                            <!-- Folded napkin, minimal -->
                            <svg viewBox="0 0 120 120" fill="none">
                                <!-- Back layer (peeking) -->
                                <rect x="22" y="22" width="76" height="76" rx="1" fill="var(--paper-dark)" stroke="var(--kraft)" stroke-width="0.6" opacity="0.4" transform="rotate(-6 60 60)"/>
                                <!-- Front napkin -->
                                <rect class="napkin-front" x="24" y="24" width="72" height="72" rx="1" fill="var(--paper)" stroke="var(--kraft-dark)" stroke-width="1.2"/>
                                <!-- Diagonal fold -->
                                <path d="M96 60 L96 96 L60 96 Z" fill="var(--paper-warm)" stroke="var(--kraft)" stroke-width="0.8" opacity="0.5"/>
                                <!-- Crease line -->
                                <line x1="60" y1="96" x2="96" y2="60" stroke="var(--kraft)" stroke-width="0.6" stroke-dasharray="3 3" opacity="0.35"/>
                            </svg>
                        {:else if product.icon === 'box'}
                            <!-- Open dispenser box with napkin being pulled out -->
                            <svg viewBox="0 0 120 120" fill="none">
                                <!-- Box base -->
                                <path d="M16 50 L16 100 C16 102, 18 104, 20 104 L100 104 C102 104, 104 102, 104 100 L104 50" fill="var(--paper-warm)" stroke="var(--kraft-dark)" stroke-width="1.2"/>
                                <!-- Stack of napkins visible inside -->
                                <line x1="28" y1="70" x2="92" y2="70" stroke="var(--kraft)" stroke-width="0.5" opacity="0.2"/>
                                <line x1="28" y1="78" x2="92" y2="78" stroke="var(--kraft)" stroke-width="0.5" opacity="0.15"/>
                                <line x1="28" y1="86" x2="92" y2="86" stroke="var(--kraft)" stroke-width="0.5" opacity="0.1"/>
                                <!-- Box lid, slightly open -->
                                <path d="M14 50 L60 42 L106 50" fill="var(--paper)" stroke="var(--kraft-dark)" stroke-width="1.2" stroke-linejoin="round"/>
                                <!-- Napkin being pulled out -->
                                <rect class="box-napkin-pull" x="40" y="22" width="40" height="28" rx="1" fill="var(--paper)" stroke="var(--kraft-dark)" stroke-width="1"/>
                                <!-- Fold line on pulled napkin -->
                                <line class="box-napkin-pull" x1="46" y1="36" x2="74" y2="36" stroke="var(--kraft)" stroke-width="0.6" stroke-dasharray="3 2" opacity="0.4"/>
                            </svg>
                        {:else}
                            <!-- Bin bag, minimal -->
                            <svg viewBox="0 0 120 120" fill="none">
                                <!-- Bag body -->
                                <path class="bag-body" d="M30 36 L26 98 C26 104, 32 108, 40 108 L80 108 C88 108, 94 104, 94 98 L90 36 Z" fill="var(--ink)" opacity="0.06" stroke="var(--ink-faint)" stroke-width="1.2"/>
                                <!-- Drawstring tie -->
                                <path d="M36 36 C48 28, 72 28, 84 36" stroke="var(--ink-faint)" stroke-width="1.2" fill="none"/>
                                <!-- Tie knot -->
                                <circle cx="60" cy="28" r="4" fill="var(--paper-warm)" stroke="var(--ink-faint)" stroke-width="0.8"/>
                                <!-- Ear loops -->
                                <path class="bag-ear" d="M56 28 C50 16, 42 16, 44 24" stroke="var(--ink-faint)" stroke-width="1" fill="none" stroke-linecap="round"/>
                                <path class="bag-ear bag-ear--r" d="M64 28 C70 16, 78 16, 76 24" stroke="var(--ink-faint)" stroke-width="1" fill="none" stroke-linecap="round"/>
                                <!-- Sheen line -->
                                <path d="M42 50 C40 65, 38 85, 42 100" stroke="var(--ink-faint)" stroke-width="0.6" fill="none" opacity="0.15"/>
                            </svg>
                        {/if}
                    </div>
                </div>

                <div class="product-card-inner">
                    <span class="product-number">{product.num}</span>
                    <h3 class="product-name">{product.name}</h3>
                    <p class="product-desc">{product.desc}</p>
                    <span class="product-tag">{product.tag}</span>
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    .products {
        padding: 100px 0 120px;
    }

    .section-header {
        padding: 0 48px;
        margin-bottom: 64px;
    }

    .section-label {
        font-family: var(--font-label);
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--kraft-dark);
        display: block;
        margin-bottom: 12px;
    }

    .section-title {
        font-family: var(--font-display);
        font-size: clamp(2.8rem, 5.5vw, 5rem);
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.08;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        padding: 0 48px;
    }

    .product-card {
        background: var(--paper-warm);
        border: 1px solid var(--ruled-line);
        border-radius: var(--radius);
        overflow: hidden;
        position: relative;
        transition: box-shadow 0.6s var(--ease-out-expo);
        will-change: transform;
    }

    .product-card:hover {
        box-shadow: 0 16px 48px rgba(139, 115, 85, 0.12),
                    0 2px 8px rgba(139, 115, 85, 0.08);
    }

    /* Corner fold */
    .product-card-fold {
        position: absolute;
        top: 0; right: 0;
        width: 0; height: 0;
        border-style: solid;
        border-width: 0 40px 40px 0;
        border-color: transparent var(--paper) transparent transparent;
        z-index: 2;
        filter: drop-shadow(-2px 2px 2px rgba(139, 115, 85, 0.1));
        transition: border-width 0.4s var(--ease-out-expo);
    }

    .product-card:hover .product-card-fold {
        border-width: 0 52px 52px 0;
    }

    .product-card-fold::after {
        content: '';
        position: absolute;
        top: 0;
        right: -40px;
        width: 0; height: 0;
        border-style: solid;
        border-width: 0 0 40px 40px;
        border-color: transparent transparent var(--paper-dark) transparent;
        transition: border-width 0.4s var(--ease-out-expo);
    }

    .product-card:hover .product-card-fold::after {
        border-width: 0 0 52px 52px;
        right: -52px;
    }

    /* --- Visual / illustration area --- */
    .product-visual {
        height: 180px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--paper);
        border-bottom: 1px solid var(--ruled-line);
        overflow: hidden;
    }

    .product-visual-num {
        position: absolute;
        right: -8px;
        bottom: -16px;
        font-family: var(--font-display);
        font-size: 7rem;
        font-weight: 400;
        line-height: 1;
        color: var(--kraft);
        opacity: 0.07;
        pointer-events: none;
        user-select: none;
    }

    .product-visual-icon {
        width: 100px;
        height: 100px;
        position: relative;
        z-index: 1;
        transition: transform 0.6s var(--ease-out-expo);
    }

    .product-visual-icon :global(svg) {
        width: 100%;
        height: 100%;
        display: block;
    }

    .product-card:hover .product-visual-icon {
        transform: translateY(-4px);
    }

    /* --- Product-specific hover animations --- */

    /* Towel: absorb ripple on hover */
    .absorb-ring {
        transform-origin: 68px 66px;
        transition: none;
    }

    .product-card:hover .absorb-ring {
        animation: absorbPulse 1.2s var(--ease-out-expo) forwards;
    }

    .product-card:hover .absorb-ring--2 {
        animation: absorbPulse 1.2s var(--ease-out-expo) 0.15s forwards;
    }

    @keyframes absorbPulse {
        0%   { r: 4; opacity: 0.5; }
        100% { r: 22; opacity: 0; }
    }

    /* Roll: tail unfurls on hover */
    .roll-tail {
        stroke-dasharray: 40;
        stroke-dashoffset: 40;
        transition: stroke-dashoffset 0.8s var(--ease-out-expo);
    }

    .product-card:hover .roll-tail {
        stroke-dashoffset: 0;
    }

    /* Napkin: back layer peeks out more on hover */
    .napkin-front {
        transition: transform 0.6s var(--ease-out-expo);
        transform-origin: 60px 60px;
    }

    .product-card:hover .napkin-front {
        transform: rotate(3deg);
    }

    /* Box: napkin lifts out on hover */
    .box-napkin-pull {
        transition: transform 0.5s var(--ease-out-expo);
    }

    .product-card:hover .box-napkin-pull {
        transform: translateY(-8px);
    }

    /* Bag: ears wiggle on hover */
    .bag-ear {
        transition: transform 0.5s var(--ease-out-expo);
        transform-origin: 60px 28px;
    }

    .product-card:hover .bag-ear {
        animation: earWiggle 0.6s var(--ease-out-expo);
    }

    .product-card:hover .bag-ear--r {
        animation: earWiggleR 0.6s var(--ease-out-expo) 0.08s;
    }

    @keyframes earWiggle {
        0%   { transform: rotate(0deg); }
        40%  { transform: rotate(-8deg); }
        100% { transform: rotate(0deg); }
    }

    @keyframes earWiggleR {
        0%   { transform: rotate(0deg); }
        40%  { transform: rotate(8deg); }
        100% { transform: rotate(0deg); }
    }

    /* --- Card content --- */
    .product-card-inner {
        padding: 24px 28px 28px;
    }

    .product-number {
        font-family: var(--font-label);
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--kraft);
        letter-spacing: 0.1em;
        margin-bottom: 8px;
        display: block;
    }

    .product-name {
        font-family: var(--font-display);
        font-size: 1.6rem;
        font-weight: 400;
        margin-bottom: 10px;
    }

    .product-desc {
        font-size: 0.9rem;
        color: var(--ink-faint);
        line-height: 1.65;
        margin-bottom: 20px;
    }

    .product-tag {
        display: inline-block;
        font-family: var(--font-label);
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 5px 12px;
        border-radius: 2px;
        color: var(--stamp);
        border: 1.5px solid var(--stamp);
        transform: rotate(-2deg);
        opacity: 0.8;
    }

    /* Reveal animation */
    .reveal-card {
        opacity: 0;
        transform: translateY(60px) rotate(1.5deg) scale(0.96);
        transition: opacity 1s var(--ease-out-expo),
                    transform 1s var(--ease-out-expo);
    }

    :global(.reveal-card.visible) {
        opacity: 1;
        transform: translateY(0) rotate(0deg) scale(1);
    }

    @media (max-width: 768px) {
        .section-header { padding: 0 24px; }
        .products-grid {
            padding: 0 24px;
            grid-template-columns: 1fr;
        }
        .product-visual { height: 150px; }
        .product-visual-num { font-size: 5rem; }
    }
</style>
