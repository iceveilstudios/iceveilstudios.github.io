document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis = null;

    if (typeof Lenis !== "undefined" && !reduceMotion) {
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
                    behavior: reduceMotion ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });

    const header = document.querySelector("header");

    const updateHeader = () => {
        if (!header) return;

        if (window.scrollY > 50) {
            header.style.background = "rgba(6,3,4,.92)";
            header.style.borderBottom = "1px solid rgba(200,30,60,.3)";
        } else {
            header.style.background = "rgba(8,4,5,.78)";
            header.style.borderBottom = "1px solid rgba(200,30,60,.22)";
        }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const reveal = document.querySelectorAll(
        ".card, .section-title, .contact-box, .social-grid a"
    );

    if (!reduceMotion) {
        reveal.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(50px)";
            el.style.transition = "opacity .8s ease, transform .8s ease";
        });
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveal.forEach(el => observer.observe(el));
    }

    const bootBody = document.getElementById("boot-body");
    const heroTitle = document.querySelector(".hero-title");
    const heroP = document.querySelector(".hero p");
    const heroButtons = document.querySelector(".buttons");

    const bootLines = [
        { text: "whoami", type: "prompt" },
        { text: "thighito — desenvolvedor web", type: "out" },
        { text: "status --studio", type: "prompt" },
        { text: "membro ativo, Iceveil Studios", type: "out" }
    ];

    if (heroTitle) {
        heroTitle.style.opacity = "0";
        heroTitle.style.transform = "translateY(20px)";
        heroTitle.style.transition = "opacity .8s ease, transform .8s ease";
    }
    if (heroP) { heroP.style.opacity = "0"; heroP.style.transition = "opacity .8s ease"; }
    if (heroButtons) { heroButtons.style.opacity = "0"; heroButtons.style.transition = "opacity .8s ease"; }

    function revealHeroContent() {
        if (heroTitle) {
            heroTitle.style.opacity = "1";
            heroTitle.style.transform = "translateY(0)";
        }
        setTimeout(() => { if (heroP) heroP.style.opacity = "1"; }, 200);
        setTimeout(() => { if (heroButtons) heroButtons.style.opacity = "1"; }, 400);
    }

    if (!bootBody) {
        revealHeroContent();
    } else if (reduceMotion) {
        bootLines.forEach(line => {
            const p = document.createElement("p");
            p.className = line.type === "prompt" ? "prompt" : "out";
            p.textContent = (line.type === "prompt" ? "$ " : "") + line.text;
            bootBody.appendChild(p);
        });
        revealHeroContent();
    } else {
        let lineIndex = 0;

        function typeNextLine() {
            if (lineIndex >= bootLines.length) {
                revealHeroContent();
                return;
            }

            const line = bootLines[lineIndex];
            const p = document.createElement("p");
            p.className = "type-line typing " + (line.type === "prompt" ? "prompt" : "out");
            bootBody.appendChild(p);

            const fullText = (line.type === "prompt" ? "$ " : "") + line.text;
            let charIndex = 0;

            const typeInterval = setInterval(() => {
                p.textContent = fullText.slice(0, charIndex + 1);
                charIndex++;

                if (charIndex >= fullText.length) {
                    clearInterval(typeInterval);
                    p.classList.remove("typing");
                    lineIndex++;
                    setTimeout(typeNextLine, 220);
                }
            }, 28);
        }

        setTimeout(typeNextLine, 300);
    }

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice && !reduceMotion) {
        const glow = document.createElement("div");
        glow.style.position = "fixed";
        glow.style.width = "18px";
        glow.style.height = "18px";
        glow.style.borderRadius = "50%";
        glow.style.background = "rgba(200,30,60,.45)";
        glow.style.pointerEvents = "none";
        glow.style.zIndex = "99999";
        glow.style.filter = "blur(10px)";
        glow.style.transition = "left .02s linear, top .02s linear";

        document.body.appendChild(glow);

        window.addEventListener("mousemove", e => {
            glow.style.left = e.clientX - 9 + "px";
            glow.style.top = e.clientY - 9 + "px";
        }, { passive: true });
    }
});