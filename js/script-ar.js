/* =====================================================================
   نور الدين غره — سلوك الموقع بالعربية
   جافاسكربت خالص بدون أي مكتبات خارجية.
   ===================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    root.dataset.ready = '1';

    var navbar = document.querySelector('.navbar');
    var navLinks = document.querySelector('.nav-links');
    var menuToggle = document.querySelector('.menu-toggle');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6jxa3AuqAfx4IHB_UOwcjODjr6JkJctmt76xIA3lomklwSsjXskK8tlzKQwdUL_m4/exec';

    /* ---------------- قائمة الجوال ---------------- */
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

    /* ---------------- زر العودة إلى الأعلى ---------------- */
    var toTop = document.createElement('button');
    toTop.type = 'button';
    toTop.className = 'to-top';
    toTop.setAttribute('aria-label', 'العودة إلى الأعلى');
    toTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(toTop);

    toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    /* ---------------- حالات مرتبطة بالتمرير ---------------- */
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

    /* ---------------- التمرير السلس بين الأقسام ---------------- */
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

    /* ---------------- ظهور العناصر مع التمرير ---------------- */
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

    /* ---------------- العدّ التصاعدي للإحصائيات ---------------- */
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

    /* ---------------- تمييز رابط القسم النشط ---------------- */
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

    /* ---------------- نموذج التواصل ---------------- */
    var contactForm = document.getElementById('contactForm');

    function validate(formData) {
        var errors = [];

        if (!formData.name.trim()) errors.push('الاسم مطلوب');
        if (!formData.email.trim()) errors.push('البريد الإلكتروني مطلوب');
        if (!formData.company.trim()) errors.push('اسم الشركة مطلوب');
        if (!formData.service) errors.push('يرجى اختيار نوع الخدمة');
        if (!formData.message.trim()) errors.push('الرسالة مطلوبة');

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailPattern.test(formData.email)) {
            errors.push('يرجى إدخال بريد إلكتروني صحيح');
        }

        if (errors.length) {
            window.alert('يرجى تصحيح ما يلي:\n\n' + errors.join('\n'));
            return false;
        }
        return true;
    }

    function send(formData, formElement) {
        var submitBtn = formElement.querySelector('button[type="submit"]');
        var originalText = submitBtn ? submitBtn.textContent : '';

        if (submitBtn) {
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;
        }

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(function () {
                window.alert('تم إرسال رسالتك بنجاح. سأتواصل معك قريباً.');
                formElement.reset();
            })
            .catch(function (error) {
                console.error('خطأ في نموذج التواصل:', error);
                window.alert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل معي مباشرة.');
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
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
                timestamp: new Date().toLocaleString('ar-SY'),
                language: 'العربية'
            };

            if (validate(formData)) send(formData, contactForm);
        });
    }

    onScroll();
})();
