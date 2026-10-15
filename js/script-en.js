/* =====================================================================
   Nour El Ddine Ghurra — English site behaviour
   Vanilla JS, no dependencies. Safe to drop in place.
   ===================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    root.dataset.ready = '1';

    var navbar = document.querySelector('.navbar');
    var navLinks = document.querySelector('.nav-links');
    var menuToggle = document.querySelector('.menu-toggle');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Contact form backend — Google Apps Script web app (see apps-script/Code.gs) */
    var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrUXVQ8gwhi8q7Dmrqz-FsNkg2qcAJtRJfmfTNz6fuwtqLcalqcGPxEeWGUivNHsM5/exec';

    /* Must match SHARED_KEY inside the Apps Script */
    var CONTACT_SECRET = 'ngr_5f8c1a7e3b2d9406a4c8e2f6b1d9a3c7e5f0b4d8';

    /* ---------------- Mobile navigation ---------------- */
    function setMenu(open) {
        if (!navLinks || !menuToggle) return;
        navLinks.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            setMenu(!navLinks.classList.contains('active'));
        });

        navLinks.addEventListener('click', function (event) {
            if (event.target.closest('a')) setMenu(false);
        });

        document.addEventListener('click', function (event) {
            if (!navLinks.classList.contains('active')) return;
            if (navLinks.contains(event.target) || menuToggle.contains(event.target)) return;
            setMenu(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') setMenu(false);
        });
    }

    /* ---------------- Back-to-top button ---------------- */
    var toTop = document.createElement('button');
    toTop.type = 'button';
    toTop.className = 'to-top';
    toTop.setAttribute('aria-label', 'Back to top');
    toTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(toTop);

    toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    /* ---------------- Scroll-driven states ---------------- */
    function headerOffset() {
        return navbar ? navbar.offsetHeight + 12 : 0;
    }

    var ticking = false;
    function onScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
        toTop.classList.toggle('show', window.scrollY > 500);
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(onScroll);
    }, { passive: true });

    /* ---------------- Smooth anchor scrolling ---------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            var id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            event.preventDefault();
            var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
            window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    /* ---------------- Scroll reveal ---------------- */
    var revealTargets = document.querySelectorAll(
        '.service-card, .skill-category, .client-card, .stat-item, .timeline-item, .section-header, .cert-item'
    );

    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------------- Animated statistics ---------------- */
    function animateCount(el) {
        var source = (el.dataset.value || el.textContent).trim();
        el.dataset.value = source;

        var match = source.match(/(\d[\d,]*)/);
        if (!match) return;

        var target = parseInt(match[1].replace(/,/g, ''), 10);
        if (!target) return;

        var before = source.slice(0, match.index);
        var after = source.slice(match.index + match[1].length);
        var duration = 1600;
        var started = performance.now();

        function tick(now) {
            var progress = Math.min((now - started) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = before + Math.round(target * eased).toLocaleString('en-US') + after;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = source;
        }

        requestAnimationFrame(tick);
    }

    var counters = document.querySelectorAll('.stat-number');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var countObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                animateCount(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        counters.forEach(function (el) { countObserver.observe(el); });
    }

    /* ---------------- Active navigation link ---------------- */
    var sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                document.querySelectorAll('.nav-links a').forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (section) { sectionObserver.observe(section); });
    }

    /* ---------------- Contact form ---------------- */
    var contactForm = document.getElementById('contactForm');

    function validate(formData) {
        var errors = [];

        if (!formData.name.trim()) errors.push('Name is required');
        if (!formData.email.trim()) errors.push('Email is required');
        if (!formData.company.trim()) errors.push('Company is required');
        if (!formData.service) errors.push('Please choose a service type');
        if (!formData.message.trim()) errors.push('Message is required');

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailPattern.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }

        if (errors.length) {
            window.alert('Please fix the following:\n\n' + errors.join('\n'));
            return false;
        }
        return true;
    }

    function send(formData, formElement) {
        var submitBtn = formElement.querySelector('button[type="submit"]');
        var originalText = submitBtn ? submitBtn.textContent : '';

        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }

        var restoreButton = function () {
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        };

        Promise.resolve()
            .then(function () {
                return window.ContactCrypto.encrypt(formData, CONTACT_SECRET);
            })
            .then(function (envelope) {
                return fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    /* A plain body keeps this a "simple request", so the browser
                       does not send a CORS preflight. */
                    body: JSON.stringify(envelope)
                });
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                var result = null;
                try { result = JSON.parse(text); } catch (parseError) { result = null; }

                if (result && result.ok) {
                    window.alert('Message sent successfully. I will get back to you soon.');
                    formElement.reset();
                    return;
                }

                throw new Error(result && result.error ? result.error : 'Unexpected response from the server');
            })
            .catch(function (error) {
                console.error('Contact form error:', error);
                window.alert('Something went wrong. Please try again or contact me directly.');
            })
            .finally(restoreButton);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var value = function (name) {
                var field = contactForm.querySelector('[name="' + name + '"]');
                return field ? field.value : '';
            };

            var formData = {
                name: value('name'),
                email: value('email'),
                company: value('company'),
                service: value('service'),
                message: value('message'),
                timestamp: new Date().toLocaleString('en-US'),
                language: 'English'
            };

            if (validate(formData)) send(formData, contactForm);
        });
    }

    onScroll();
})();
