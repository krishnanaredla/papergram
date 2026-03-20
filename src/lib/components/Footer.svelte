<script>
    import { config } from '../config.js'
</script>

<footer class="footer">
    <div class="footer-inner">
        <div class="footer-brand">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="4" width="18" height="22" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <rect x="8" y="2" width="18" height="22" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
            </svg>
            papergram
        </div>
        <div class="footer-copy">&copy; {new Date().getFullYear()} Papergram. {config.location}.</div>
        <div class="footer-links">
            {#if config.instagramUrl}
                <a href={config.instagramUrl} target="_blank" rel="noopener">Instagram</a>
            {/if}
            {#if config.linkedinUrl}
                <a href={config.linkedinUrl} target="_blank" rel="noopener">LinkedIn</a>
            {/if}
        </div>
    </div>
</footer>

<style>
    .footer {
        padding: 28px 48px;
        border-top: 1px solid var(--ruled-line);
    }

    .footer-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    .footer-brand {
        font-family: var(--font-display);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .footer-copy {
        font-size: 0.75rem;
        color: var(--pencil);
    }

    .footer-links {
        display: flex;
        gap: 24px;
        font-size: 0.8rem;
    }

    .footer-links a {
        color: var(--pencil);
        transition: color 0.3s;
    }

    .footer-links a:hover { color: var(--ink); }

    @media (max-width: 768px) {
        .footer { padding: 24px; }
        .footer-inner {
            flex-direction: column;
            text-align: center;
        }
    }
</style>
