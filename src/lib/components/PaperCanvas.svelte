<script>
    import { onMount } from 'svelte'

    let canvas
    let ctx
    let width = 0
    let height = 0
    let papers = []
    let mouse = { x: -1000, y: -1000 }

    const PAPER_COUNT = 18
    const COLORS = [
        '#faf6f0', '#f3ece2', '#e8dfd3', '#fff9f0',
        '#f0e8d8', '#d4cec5', '#c4a882'
    ]

    class PaperSheet {
        constructor() {
            this.reset(true)
        }

        reset(initial = false) {
            // Depth layer: 0 = far back (small, slow, faint), 1 = foreground (big, fast, opaque)
            this.depth = Math.random()
            const depthScale = 0.4 + this.depth * 0.6

            this.w = (25 + Math.random() * 55) * depthScale
            this.h = this.w * (1.1 + Math.random() * 0.4)
            this.x = Math.random() * width
            this.y = initial ? Math.random() * height : -this.h - Math.random() * 300
            this.rotation = (Math.random() - 0.5) * 0.8
            this.rotSpeed = (Math.random() - 0.5) * 0.006 * depthScale
            this.vy = (0.15 + Math.random() * 0.4) * depthScale
            this.vx = (Math.random() - 0.5) * 0.2
            this.wobbleAmp = (0.4 + Math.random() * 1.2) * depthScale
            this.wobbleSpeed = 0.008 + Math.random() * 0.016
            this.wobblePhase = Math.random() * Math.PI * 2
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
            this.shadow = (Math.random() * 0.06 + 0.02) * depthScale
            this.t = 0
            this.opacity = (0.25 + this.depth * 0.55) * (0.7 + Math.random() * 0.3)
            // Flutter: secondary oscillation for paper tumble effect
            this.flutterAmp = (Math.random() * 0.15) * depthScale
            this.flutterSpeed = 0.03 + Math.random() * 0.04
            this.flutterPhase = Math.random() * Math.PI * 2
            // Ruled lines
            this.hasLines = Math.random() > 0.35
            this.hasMargin = Math.random() > 0.6
            // Corner fold
            this.hasFold = Math.random() > 0.5
            this.foldSize = 6 + Math.random() * 8
            // Slight perspective skew
            this.skewX = (Math.random() - 0.5) * 0.1
        }

        update() {
            this.t++
            this.wobblePhase += this.wobbleSpeed
            this.flutterPhase += this.flutterSpeed

            // Gentle floating with flutter
            const wobble = Math.sin(this.wobblePhase) * this.wobbleAmp * 0.3
            const flutter = Math.sin(this.flutterPhase) * this.flutterAmp
            this.x += this.vx + wobble
            this.y += this.vy + Math.sin(this.wobblePhase * 0.7) * 0.08
            this.rotation += this.rotSpeed + Math.sin(this.wobblePhase) * 0.002 + flutter

            // Mouse repulsion — scaled by depth (foreground reacts more)
            const dx = this.x - mouse.x
            const dy = this.y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const repulseRadius = 120 + this.depth * 60
            if (dist < repulseRadius) {
                const force = (repulseRadius - dist) / repulseRadius * (0.5 + this.depth * 0.8)
                this.x += (dx / dist) * force * 3
                this.y += (dy / dist) * force * 2
                this.rotation += force * 0.03
            }

            // Reset when off screen
            if (this.y > height + this.h + 20) {
                this.reset()
            }
            if (this.x < -this.w * 2) this.x = width + this.w
            if (this.x > width + this.w * 2) this.x = -this.w
        }

        draw(ctx) {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(this.rotation)
            ctx.transform(1, 0, this.skewX, 1, 0, 0)
            ctx.globalAlpha = this.opacity

            // Shadow
            ctx.shadowColor = `rgba(139, 115, 85, ${this.shadow})`
            ctx.shadowBlur = 12
            ctx.shadowOffsetX = 3
            ctx.shadowOffsetY = 5

            // Paper body
            const foldSize = this.hasFold ? this.foldSize : 0
            ctx.beginPath()
            ctx.moveTo(-this.w / 2, -this.h / 2)
            ctx.lineTo(this.w / 2 - foldSize, -this.h / 2)
            if (this.hasFold) {
                ctx.lineTo(this.w / 2, -this.h / 2 + foldSize)
            }
            ctx.lineTo(this.w / 2, this.h / 2)
            ctx.lineTo(-this.w / 2, this.h / 2)
            ctx.closePath()
            ctx.fillStyle = this.color
            ctx.fill()

            // Remove shadow for details
            ctx.shadowColor = 'transparent'

            // Border
            ctx.strokeStyle = 'rgba(139, 115, 85, 0.12)'
            ctx.lineWidth = 0.5
            ctx.stroke()

            // Corner fold triangle
            if (this.hasFold) {
                ctx.beginPath()
                ctx.moveTo(this.w / 2 - foldSize, -this.h / 2)
                ctx.lineTo(this.w / 2 - foldSize, -this.h / 2 + foldSize)
                ctx.lineTo(this.w / 2, -this.h / 2 + foldSize)
                ctx.closePath()
                ctx.fillStyle = 'rgba(139, 115, 85, 0.08)'
                ctx.fill()
                ctx.strokeStyle = 'rgba(139, 115, 85, 0.1)'
                ctx.lineWidth = 0.5
                ctx.stroke()
            }

            // Ruled lines
            if (this.hasLines && this.h > 40) {
                ctx.strokeStyle = 'rgba(180, 175, 168, 0.3)'
                ctx.lineWidth = 0.5
                const lineGap = 6
                const startY = -this.h / 2 + 12
                for (let ly = startY; ly < this.h / 2 - 6; ly += lineGap) {
                    ctx.beginPath()
                    ctx.moveTo(-this.w / 2 + 6, ly)
                    ctx.lineTo(this.w / 2 - 6, ly)
                    ctx.stroke()
                }

                // Red margin line
                if (this.hasMargin) {
                    ctx.strokeStyle = 'rgba(196, 92, 74, 0.2)'
                    ctx.lineWidth = 0.5
                    ctx.beginPath()
                    ctx.moveTo(-this.w / 2 + 14, -this.h / 2 + 4)
                    ctx.lineTo(-this.w / 2 + 14, this.h / 2 - 4)
                    ctx.stroke()
                }
            }

            ctx.restore()
        }
    }

    function init() {
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        width = rect.width
        height = rect.height
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx = canvas.getContext('2d')
        ctx.scale(dpr, dpr)

        papers = []
        for (let i = 0; i < PAPER_COUNT; i++) {
            papers.push(new PaperSheet())
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height)

        // Sort by depth (far papers render first, close papers on top)
        papers.sort((a, b) => a.depth - b.depth)

        for (const p of papers) {
            p.update()
            p.draw(ctx)
        }

        requestAnimationFrame(animate)
    }

    onMount(() => {
        init()
        animate()

        const onResize = () => {
            const dpr = window.devicePixelRatio || 1
            const rect = canvas.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx = canvas.getContext('2d')
            ctx.scale(dpr, dpr)
        }

        const onMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }

        const onMouseLeave = () => {
            mouse.x = -1000
            mouse.y = -1000
        }

        window.addEventListener('resize', onResize)
        canvas.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mouseleave', onMouseLeave)

        return () => {
            window.removeEventListener('resize', onResize)
            canvas.removeEventListener('mousemove', onMouseMove)
            canvas.removeEventListener('mouseleave', onMouseLeave)
        }
    })
</script>

<canvas bind:this={canvas} class="paper-canvas"></canvas>

<style>
    .paper-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: auto;
    }
</style>
