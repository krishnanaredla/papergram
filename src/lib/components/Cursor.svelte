<script>
    import { onMount } from 'svelte'

    let dotX = $state(0)
    let dotY = $state(0)
    let ringX = $state(0)
    let ringY = $state(0)
    let hovering = $state(false)
    let isMobile = $state(false)

    onMount(() => {
        isMobile = 'ontouchstart' in window || window.innerWidth < 768

        if (isMobile) return

        const onMove = (e) => {
            dotX = e.clientX
            dotY = e.clientY
        }
        document.addEventListener('mousemove', onMove)

        let raf
        let ringVx = 0
        let ringVy = 0
        const stiffness = 0.08
        const damping = 0.72
        const animate = () => {
            // Spring physics for smoother, more natural trailing
            const dx = dotX - ringX
            const dy = dotY - ringY
            ringVx += dx * stiffness
            ringVy += dy * stiffness
            ringVx *= damping
            ringVy *= damping
            ringX += ringVx
            ringY += ringVy
            raf = requestAnimationFrame(animate)
        }
        animate()

        // Hover detection via event delegation
        const onOver = (e) => {
            if (e.target.closest('a, button, .product-card')) {
                hovering = true
            }
        }
        const onOut = (e) => {
            if (e.target.closest('a, button, .product-card')) {
                hovering = false
            }
        }
        document.addEventListener('mouseover', onOver)
        document.addEventListener('mouseout', onOut)

        return () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseover', onOver)
            document.removeEventListener('mouseout', onOut)
            cancelAnimationFrame(raf)
        }
    })
</script>

{#if !isMobile}
    <div class="cursor-dot" style="transform: translate({dotX - 3}px, {dotY - 3}px)"></div>
    <div class="cursor-ring" class:hovering style="transform: translate({ringX - 18}px, {ringY - 18}px)"></div>
{/if}

<style>
    .cursor-dot {
        width: 6px;
        height: 6px;
        background: var(--ink);
        border-radius: 50%;
        position: fixed;
        top: 0; left: 0;
        pointer-events: none;
        z-index: 9999;
        will-change: transform;
    }

    .cursor-ring {
        width: 36px;
        height: 36px;
        border: 1.5px solid var(--kraft-dark);
        border-radius: 50%;
        position: fixed;
        top: 0; left: 0;
        pointer-events: none;
        z-index: 9998;
        transition: width 0.3s var(--ease-out-expo),
                    height 0.3s var(--ease-out-expo),
                    border-color 0.3s;
        will-change: transform;
    }

    .cursor-ring.hovering {
        width: 56px;
        height: 56px;
        border-color: var(--stamp);
    }

    :global(body) {
        cursor: none;
    }

    @media (max-width: 768px) {
        :global(body) {
            cursor: auto;
        }
    }
</style>
