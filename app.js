// ===============================
// THIGHITO PORTFÓLIO
// app.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------
    // Scroll suave
    // -------------------------

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            const target = document.querySelector(link.getAttribute("href"));

            if (target) {

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

    // -------------------------
    // Navbar
    // -------------------------

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.style.background = "rgba(0,0,0,.92)";
            header.style.borderBottom = "1px solid rgba(255,0,0,.25)";
            header.style.backdropFilter = "blur(18px)";

        } else {

            header.style.background = "rgba(5,5,5,.75)";
            header.style.borderBottom = "1px solid rgba(255,0,0,.08)";

        }

    });

    // -------------------------
    // Revelar elementos
    // -------------------------

    const reveal = document.querySelectorAll(
        ".card, .section-title, .contact-box, .social-grid a"
    );

    reveal.forEach(el => {

        el.style.opacity = "0";
        el.style.transform = "translateY(60px)";
        el.style.transition = ".8s ease";

    });

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    }, {
        threshold: .15
    });

    reveal.forEach(el => observer.observe(el));

    // -------------------------
    // Hero fade
    // -------------------------

    const hero = document.querySelector(".hero");

    hero.style.opacity = "0";
    hero.style.transform = "translateY(40px)";

    setTimeout(() => {

        hero.style.transition = "1.2s";
        hero.style.opacity = "1";
        hero.style.transform = "translateY(0)";

    }, 250);

    // -------------------------
    // Ano automático
    // -------------------------

    const year = document.getElementById("year");

    if (year) {

        year.textContent = new Date().getFullYear();

    }

});


// =====================================
// Cursor Glow
// =====================================

const glow = document.createElement("div");

glow.style.position = "fixed";
glow.style.width = "18px";
glow.style.height = "18px";
glow.style.borderRadius = "50%";
glow.style.background = "rgba(255,0,0,.45)";
glow.style.pointerEvents = "none";
glow.style.zIndex = "99999";
glow.style.filter = "blur(10px)";
glow.style.transition = "transform .08s linear";

document.body.appendChild(glow);

window.addEventListener("mousemove", e => {

    glow.style.left = e.clientX - 9 + "px";
    glow.style.top = e.clientY - 9 + "px";

});

// =====================================
// Partículas
// =====================================

for (let i = 0; i < 25; i++) {

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