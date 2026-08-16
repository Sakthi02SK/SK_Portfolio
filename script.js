/* ================================================
   PORTFOLIO — JavaScript Interactions
   Loader, scroll reveals, nav, counters, cursor
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            revealInitial();
        }, 2000);
    });
    document.body.style.overflow = 'hidden';

    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add('active');
        });

        function animateCursor() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // --- Navigation ---
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal-up');

    function revealInitial() {
        // Reveal hero elements with stagger
        const heroReveals = document.querySelectorAll('.hero .reveal-up');
        heroReveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, i * 120);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger sibling reveals
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.reveal-up:not(.revealed)');
                const index = Array.from(siblings).indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, Math.max(0, index) * 80);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => {
        // Don't observe hero ones, they're handled by revealInitial
        if (!el.closest('.hero')) {
            observer.observe(el);
        }
    });

    // --- Dynamic Experience Calculation ---
    // The portfolio has one source of truth for the employment start year.
    // Update data-start-year in #experiencePeriod when the start year changes.
    const experiencePeriod = document.getElementById('experiencePeriod');
    const experienceYears = document.getElementById('experienceYears');

    function calculateExperienceYears(startYear) {
        const currentYear = new Date().getFullYear();
        const parsedStartYear = Number(startYear);

        if (!Number.isFinite(parsedStartYear) || parsedStartYear > currentYear) {
            return 0;
        }

        return currentYear - parsedStartYear;
    }

    if (experiencePeriod) {
        const startYear = experiencePeriod.dataset.startYear;
        const years = calculateExperienceYears(startYear);

        // Keep the displayed employment period in sync with the current year.
        const experienceDate = document.getElementById('experienceDate');
        if (experienceDate) {
            experienceDate.textContent = `${startYear} — Present`;
        }

        // Feed the calculated value into the existing counter animation.
        if (experienceYears) {
            experienceYears.setAttribute('data-count', years);
        }
    }

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el, target) {
        let current = 0;
        const duration = 1500;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            current = Math.round(eased * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // --- Skill Tag Hover Tilt Effect ---
    document.querySelectorAll('.project-card, .exp-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // --- Parallax Hero Grid ---
    const heroGrid = document.querySelector('.hero-grid');
    if (heroGrid) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroGrid.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

});
