// EU NÂO TÔ BEM, EU TÔ LOUCO AQUI! AAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const body = document.body;
    const root = document.documentElement;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector(".site-header");
    const glow = document.getElementById("glow");
    const noise = document.getElementById("noise");

    const hero = document.querySelector(".hero");
    const heroTitle = document.querySelector(".hero-title");
    const heroLines = heroTitle ? Array.from(heroTitle.querySelectorAll(".line")) : [];

    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    const magneticItems = Array.from(
        document.querySelectorAll(".btn-red, .btn-outline, .card-link, .social-link")
    );

    let lenis = null;

    /* =====================================================
       Helpers
    ===================================================== */
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (start, end, amount) => start + (end - start) * amount;
    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const getScrollY = () => {
        if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
        return window.scrollY || root.scrollTop || 0;
    };

    const updateHeaderState = () => {
        if (!header) return;
        header.classList.toggle("scrolled", getScrollY() > 20);
    };

    const splitTextToChars = (element) => {
        if (!element) return;

        const text = element.textContent.trim();
        element.textContent = "";

        const frag = document.createDocumentFragment();

        for (const char of text) {
            const span = document.createElement("span");
            span.className = "char";
            span.textContent = char === " " ? "\u00A0" : char;
            frag.appendChild(span);
        }

        element.appendChild(frag);
    };

    const setMouseVars = (x, y) => {
        root.style.setProperty("--mouse-x", `${x}px`);
        root.style.setProperty("--mouse-y", `${y}px`);
    };

    /* =====================================================
       Lenis
    ===================================================== */
    if (window.Lenis) {
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            smoothWheel: true,
            smoothTouch: false,
            wheelMultiplier: 1,
            touchMultiplier: 1.2
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        lenis.on("scroll", updateHeaderState);
    }

    updateHeaderState();

    /* =====================================================
       Noise
    ===================================================== */
    if (noise && !prefersReducedMotion) {
        let noiseOffset = 0;

        const animateNoise = () => {
            noiseOffset += 0.18;
            noise.style.backgroundPosition = `${noiseOffset}px ${noiseOffset * 0.8}px`;
            requestAnimationFrame(animateNoise);
        };

        requestAnimationFrame(animateNoise);
    }

    /* =====================================================
       Glow seguindo o mouse
    ===================================================== */
    if (glow) {
        body.classList.add("mouse-active");

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;
        let active = false;

        glow.style.left = "0px";
        glow.style.top = "0px";
        glow.style.marginLeft = "0";
        glow.style.marginTop = "0";
        glow.style.transform = "translate3d(-50%, -50%, 0)";

        const onPointerMove = (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            active = true;
            body.classList.add("mouse-active");
            setMouseVars(mouseX, mouseY);
        };

        const onPointerLeave = () => {
            active = false;
            body.classList.remove("mouse-active");
        };

        window.addEventListener("mousemove", onPointerMove, { passive: true });
        window.addEventListener("mouseleave", onPointerLeave, { passive: true });

        const followGlow = () => {
            currentX = lerp(currentX, mouseX, 0.08);
            currentY = lerp(currentY, mouseY, 0.08);

            glow.style.left = `${currentX}px`;
            glow.style.top = `${currentY}px`;
            glow.style.opacity = active ? "1" : "0.72";

            requestAnimationFrame(followGlow);
        };

        requestAnimationFrame(followGlow);
    }

    /* =====================================================
       Smooth anchors
    ===================================================== */
    const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();

            if (lenis) {
                lenis.scrollTo(target, {
                    offset: -80,
                    immediate: false
                });
            } else {
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });

    /* =====================================================
       Reveal on scroll
    ===================================================== */
    const revealNow = (el, delay = 0) => {
        el.classList.add("is-visible");

        if (prefersReducedMotion || !window.anime) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.filter = "blur(0)";
            return;
        }

        anime({
            targets: el,
            translateY: [28, 0],
            opacity: [0, 1],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 900,
            delay,
            easing: "easeOutExpo"
        });
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((el, index) => revealNow(el, index * 60));
    } else {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const el = entry.target;
                    const index = revealItems.indexOf(el);
                    revealNow(el, index * 70);

                    observer.unobserve(el);
                });
            },
            {
                root: null,
                threshold: 0.16,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        revealItems.forEach((el) => observer.observe(el));
    }

    /* =====================================================
       Hero split
    ===================================================== */
    if (heroTitle) {
        heroLines.forEach(splitTextToChars);
    }

});

    /* =====================================================
       Hero intro
    ===================================================== */
    const runHeroIntro = () => {
        const badge = document.querySelector(".badge");
        const kicker = document.querySelector(".hero-kicker");
        const chars = Array.from(document.querySelectorAll(".hero-title .char"));
        const heroText = document.querySelector(".hero-text");
        const heroActions = document.querySelector(".hero-actions");

        if (prefersReducedMotion || !window.anime) {
            [badge, kicker, heroText, heroActions].forEach((el) => {
                if (!el) return;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
                el.style.filter = "blur(0)";
            });

            chars.forEach((char) => {
                char.style.opacity = "1";
                char.style.transform = "translateY(0)";
            });
            return;
        }

        anime.timeline({
            easing: "easeOutExpo",
            duration: 900
        })
        .add({
            targets: badge,
            opacity: [0, 1],
            translateY: [16, 0],
            filter: ["blur(8px)", "blur(0px)"],
            duration: 700
        })
        .add({
            targets: kicker,
            opacity: [0, 1],
            translateY: [14, 0],
            filter: ["blur(8px)", "blur(0px)"],
            duration: 650,
            offset: "-=450"
        })
        .add({
            targets: chars,
            opacity: [0, 1],
            translateY: [52, 0],
            rotateX: [38, 0],
            delay: anime.stagger(18),
            duration: 950,
            easing: "easeOutCubic"
        }, "-=250")
        .add({
            targets: heroText,
            opacity: [0, 1],
            translateY: [20, 0],
            filter: ["blur(8px)", "blur(0px)"],
            duration: 700,
            offset: "-=580"
        })
        .add({
            targets: heroActions,
            opacity: [0, 1],
            translateY: [16, 0],
            filter: ["blur(8px)", "blur(0px)"],
            duration: 700,
            offset: "-=500"
        });
    };

    runHeroIntro();

    /* =====================================================
       Visible on load
    ===================================================== */
    const visibleOnLoad = revealItems.filter(isInViewport);
    if (visibleOnLoad.length && !prefersReducedMotion) {
        visibleOnLoad.forEach((el, index) => {
            if (el.classList.contains("is-visible")) return;
            revealNow(el, index * 60);
        });
    }

    /* =====================================================
       Magnetic hover effect
    ===================================================== */
    magneticItems.forEach((el) => {
        if (!el) return;

        let rect = null;
        let raf = null;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const reset = () => {
            targetX = 0;
            targetY = 0;

            if (raf) cancelAnimationFrame(raf);

            const settle = () => {
                currentX = lerp(currentX, 0, 0.14);
                currentY = lerp(currentY, 0, 0.14);
                el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

                if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                    raf = requestAnimationFrame(settle);
                }
            };

            raf = requestAnimationFrame(settle);
        };

        el.addEventListener("mouseenter", () => {
            rect = el.getBoundingClientRect();
        });

        el.addEventListener("mousemove", (event) => {
            if (!rect) rect = el.getBoundingClientRect();

            const dx = event.clientX - rect.left - rect.width / 2;
            const dy = event.clientY - rect.top - rect.height / 2;

            targetX = clamp(dx * 0.18, -12, 12);
            targetY = clamp(dy * 0.18, -12, 12);

            if (raf) cancelAnimationFrame(raf);

            const tick = () => {
                currentX = lerp(currentX, targetX, 0.18);
                currentY = lerp(currentY, targetY, 0.18);
                el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

                if (Math.abs(currentX - targetX) > 0.08 || Math.abs(currentY - targetY) > 0.08) {
                    raf = requestAnimationFrame(tick);
                }
            };

            raf = requestAnimationFrame(tick);
        });

        el.addEventListener("mouseleave", reset);
    });

    /* =====================================================
       3D tilt for cards
    ===================================================== */
    const cards = Array.from(document.querySelectorAll(".card"));

    cards.forEach((card) => {
        if (!card) return;

        let rect = null;

        card.addEventListener("mouseenter", () => {
            rect = card.getBoundingClientRect();
        });

        card.addEventListener("mousemove", (event) => {
            if (!rect) rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = (((y / rect.height) - 0.5) * -10);

            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* =====================================================
       Parallax hero
    ===================================================== */
    if (hero && !prefersReducedMotion) {
        let px = 0;
        let py = 0;
        let cx = 0;
        let cy = 0;

        window.addEventListener("mousemove", (event) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            px = (event.clientX - centerX) / centerX;
            py = (event.clientY - centerY) / centerY;
        }, { passive: true });

        const parallax = () => {
            cx = lerp(cx, px, 0.05);
            cy = lerp(cy, py, 0.05);

            hero.style.setProperty("--hero-parallax-x", `${cx * 10}px`);
            hero.style.setProperty("--hero-parallax-y", `${cy * 10}px`);

            if (heroTitle) {
                heroTitle.style.transform = `translate3d(${cx * 8}px, ${cy * 8}px, 0)`;
            }

            requestAnimationFrame(parallax);
        };

        requestAnimationFrame(parallax);
    }

    /* =====================================================
       Navbar scroll state
    ===================================================== */
    const onScroll = () => {
        updateHeaderState();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    /* =====================================================
       Load / Resize
    ===================================================== */
    window.addEventListener("load", () => {
        body.classList.add("is-loaded");
        updateHeaderState();

        if (lenis && typeof lenis.resize === "function") {
            lenis.resize();
        }
    });

    window.addEventListener("resize", () => {
        updateHeaderState();
    }, { passive: true });

    /* =====================================================
       Ripple effect
    ===================================================== */
    const rippleTargets = Array.from(document.querySelectorAll(".btn-red, .btn-outline, .card-link"));

    rippleTargets.forEach((target) => {
        target.addEventListener("click", function (event) {
            if (prefersReducedMotion) return;

            const rect = this.getBoundingClientRect();
            const ripple = document.createElement("span");

            const size = Math.max(rect.width, rect.height) * 1.15;
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.position = "absolute";
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.borderRadius = "50%";
            ripple.style.pointerEvents = "none";
            ripple.style.background = "rgba(255,255,255,0.18)";
            ripple.style.transform = "scale(0)";
            ripple.style.opacity = "1";

            this.appendChild(ripple);

            if (window.anime) {
                anime({
                    targets: ripple,
                    scale: [0, 1],
                    opacity: [0.35, 0],
                    duration: 650,
                    easing: "easeOutQuad",
                    complete: () => ripple.remove()
                });
            } else {
                ripple.animate(
                    [
                        { transform: "scale(0)", opacity: 0.35 },
                        { transform: "scale(1)", opacity: 0 }
                    ],
                    { duration: 650, easing: "ease-out" }
                ).onfinish = () => ripple.remove();
            }
        });
    });

    /* =====================================================
       Keyboard / mouse state
    ===================================================== */
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;
        body.classList.add("keyboard-user");
    });

    document.addEventListener("mousedown", () => {
        body.classList.remove("keyboard-user");
    });