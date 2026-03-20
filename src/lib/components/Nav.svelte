<script>
    import { onMount } from 'svelte'

    let scrolled = $state(false)
    let hidden = $state(false)
    let menuOpen = $state(false)
    let lastScroll = 0

    onMount(() => {
        const onScroll = () => {
            const y = window.scrollY
            scrolled = y > 80
            hidden = y > lastScroll && y > 200
            lastScroll = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    })

    function toggleMenu() {
        menuOpen = !menuOpen
        document.body.style.overflow = menuOpen ? 'hidden' : ''
    }

    function closeMenu() {
        menuOpen = false
        document.body.style.overflow = ''
    }
</script>

<nav class="nav" class:scrolled class:hidden>
    <a href="#" class="nav-logo">
        <svg class="logo-mark" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="4" width="18" height="22" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <rect x="8" y="2" width="18" height="22" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
            <line x1="6" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1" opacity="0.4"/>
            <line x1="6" y1="16" x2="14" y2="16" stroke="currentColor" stroke-width="1" opacity="0.4"/>
            <line x1="6" y1="20" x2="12" y2="20" stroke="currentColor" stroke-width="1" opacity="0.4"/>
        </svg>
        papergram
    </a>
    <div class="nav-links">
        <a href="#products" class="nav-link">Products</a>
        <a href="#contact" class="nav-link nav-link--cta">Get a Quote</a>
    </div>
    <button class="nav-menu-btn" class:active={menuOpen} onclick={toggleMenu} aria-label="Menu">
        <span></span><span></span>
    </button>
</nav>

{#if menuOpen}
    <div class="mobile-menu" class:active={menuOpen}>
        <a href="#products" class="mobile-menu-link" onclick={closeMenu}>Products</a>
        <a href="#contact" class="mobile-menu-link" onclick={closeMenu}>Get a Quote</a>
    </div>
{/if}

<style>
    .nav {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 48px;
        transition: transform 0.4s var(--ease-out-expo), backdrop-filter 0.4s, background 0.4s;
    }

    .nav.scrolled {
        background: rgba(250, 246, 240, 0.85);
        backdrop-filter: blur(12px);
    }

    .nav.hidden {
        transform: translateY(-100%);
    }

    .nav-logo {
        font-family: var(--font-display);
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .logo-mark { color: var(--kraft-dark); }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 32px;
    }

    .nav-link {
        font-family: var(--font-label);
        font-size: 0.8rem;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--ink-faint);
        position: relative;
        padding: 4px 0;
        transition: color 0.3s;
    }

    .nav-link:hover { color: var(--ink); }

    .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0;
        width: 0;
        height: 1px;
        background: var(--kraft-dark);
        transition: width 0.4s var(--ease-out-expo);
    }

    .nav-link:hover::after { width: 100%; }

    .nav-link--cta {
        background: var(--ink);
        color: var(--paper) !important;
        padding: 10px 24px;
        border-radius: 100px;
        font-weight: 600;
        transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s;
    }

    .nav-link--cta::after { display: none; }
    .nav-link--cta:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 20px rgba(26, 23, 20, 0.15);
    }

    .nav-menu-btn {
        display: none;
        background: none;
        border: none;
        cursor: none;
        width: 32px;
        height: 24px;
        position: relative;
        z-index: 200;
    }

    .nav-menu-btn span {
        display: block;
        width: 100%;
        height: 2px;
        background: var(--ink);
        position: absolute;
        left: 0;
        transition: all 0.4s var(--ease-out-expo);
    }

    .nav-menu-btn span:first-child { top: 4px; }
    .nav-menu-btn span:last-child { bottom: 4px; }

    .nav-menu-btn.active span:first-child {
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
    }
    .nav-menu-btn.active span:last-child {
        bottom: 50%;
        transform: translateY(50%) rotate(-45deg);
    }

    .mobile-menu {
        position: fixed;
        inset: 0;
        background: var(--paper);
        z-index: 99;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 24px;
    }

    .mobile-menu-link {
        font-family: var(--font-display);
        font-size: clamp(2.5rem, 8vw, 4rem);
        opacity: 0;
        transform: translateY(30px);
        animation: menuIn 0.5s var(--ease-out-expo) forwards;
    }

    .mobile-menu-link:nth-child(2) { animation-delay: 0.1s; }

    @keyframes menuIn {
        to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
        .nav { padding: 20px 24px; }
        .nav-links { display: none; }
        .nav-menu-btn { display: block; cursor: pointer; }
    }
</style>
