// ===============================
// app.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------
    // Lenis Smooth Scroll
    // -------------------------
    let lenis = null;

    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            gestureOrientation: "vertical",
            touchMultiplier: 2,
            infinite: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // -------------------------
    // Scroll suave nas âncoras
    // -------------------------
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            const target = document.querySelector(href);

            if (!target) return;

            e.preventDefault();

            if (lenis) {
                lenis.scrollTo(target);
            } else {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // -------------------------
    // Navbar dinâmica
    // -------------------------
    const header = document.querySelector("header");

    const updateHeader = () => {
        if (!header) return;

        if (window.scrollY > 50) {
            header.style.background = "rgba(0,0,0,.92)";
            header.style.borderBottom = "1px solid rgba(255,0,0,.25)";
            header.style.backdropFilter = "blur(18px)";
            header.style.webkitBackdropFilter = "blur(18px)";
        } else {
            header.style.background = "rgba(5,5,5,.75)";
            header.style.borderBottom = "1px solid rgba(255,0,0,.08)";
            header.style.backdropFilter = "blur(12px)";
            header.style.webkitBackdropFilter = "blur(12px)";
        }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    // -------------------------
    // Reveal ao rolar
    // -------------------------
    const reveal = document.querySelectorAll(
        ".card, .section-title, .contact-box, .social-grid a"
    );

    reveal.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(60px)";
        el.style.transition = "opacity .8s ease, transform .8s ease";
        el.style.willChange = "opacity, transform";
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        reveal.forEach(el => observer.observe(el));
    } else {
        reveal.forEach(el => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        });
    }

    // -------------------------
    // Hero fade
    // -------------------------
    const hero = document.querySelector(".hero");

    if (hero) {
        hero.style.opacity = "0";
        hero.style.transform = "translateY(40px)";
        hero.style.transition = "opacity 1.2s ease, transform 1.2s ease";

        setTimeout(() => {
            hero.style.opacity = "1";
            hero.style.transform = "translateY(0)";
        }, 250);
    }

    // -------------------------
    // Ano automático
    // -------------------------
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // -------------------------
    // Cursor Glow
    // -------------------------
    const glow = document.createElement("div");
    glow.style.position = "fixed";
    glow.style.width = "18px";
    glow.style.height = "18px";
    glow.style.borderRadius = "50%";
    glow.style.background = "rgba(255,0,0,.45)";
    glow.style.pointerEvents = "none";
    glow.style.zIndex = "99999";
    glow.style.filter = "blur(10px)";
    glow.style.transition = "transform .08s linear, left .02s linear, top .02s linear";
    glow.style.display = "none";

    document.body.appendChild(glow);

    const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
        glow.style.display = "block";

        window.addEventListener("mousemove", e => {
            glow.style.left = e.clientX - 9 + "px";
            glow.style.top = e.clientY - 9 + "px";
        }, { passive: true });
    }

    // -------------------------
    // Partículas
    // -------------------------
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const dot = document.createElement("div");

        dot.style.position = "fixed";
        dot.style.width = "2px";
        dot.style.height = "2px";
        dot.style.borderRadius = "50%";
        dot.style.background = "rgba(255,0,0,.25)";
        dot.style.pointerEvents = "none";
        dot.style.left = Math.random() * 100 + "vw";
        dot.style.top = Math.random() * 100 + "vh";
        dot.style.zIndex = "-1";

        document.body.appendChild(dot);
        animate(dot);
    }

    function animate(dot) {
        const speed = 8 + Math.random() * 12;
        let y = parseFloat(dot.style.top);

        function frame() {
            y -= 0.05 * speed;

            if (y < -5) {
                y = 105;
                dot.style.left = Math.random() * 100 + "vw";
            }

            dot.style.top = y + "vh";
            requestAnimationFrame(frame);
        }

        frame();
    }
});