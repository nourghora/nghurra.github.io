document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
document.addEventListener('DOMContentLoaded', function() {
    const clientLogos = document.querySelectorAll('.client-logo');
    
    clientLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            

            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                company: this.querySelector('input[placeholder="الشركة"]').value,
                service: this.querySelector('select').value,
                message: this.querySelector('textarea').value
            };
            

            alert('شكراً لك على رسالتك! سأتصل بك قريباً.');
            

            contactForm.reset();
            
            // يمكن إضافة إرسال بيانات النموذج إلى خادم هنا
            // console.log('بيانات النموذج:', formData);
            // fetch('نقطة-نهاية-الخادم', { method: 'POST', body: JSON.stringify(formData) })
        });
    }
    

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    

    document.querySelectorAll('.service-card, .stat-item, .timeline-content, .skill-category').forEach(el => {
        observer.observe(el);
    });
    

    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.timeline-item, .service-card');
        
        elements.forEach(el => {
            const position = el.getBoundingClientRect();
            

            if (position.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
    

    document.querySelectorAll('.timeline-item, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.dispatchEvent(new Event('scroll'));
});
// حل لمشكلة stat-label
document.addEventListener('DOMContentLoaded', function() {
    // تأكد من ظهور النصوص
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach(label => {
        // أعد تعيين الأنماط بشكل قوي
        label.style.setProperty('color', '#ffffff', 'important');
        label.style.setProperty('opacity', '1', 'important');
        label.style.setProperty('visibility', 'visible', 'important');
        label.style.setProperty('display', 'block', 'important');
        label.style.setProperty('font-size', '1.1rem', 'important');
        label.style.setProperty('font-weight', '600', 'important');
    });
    
    // تأكد من أن العناصر مرئية
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.setProperty('visibility', 'visible', 'important');
        item.style.setProperty('opacity', '1', 'important');
    });

});
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6jxa3AuqAfx4IHB_UOwcjODjr6JkJctmt76xIA3lomklwSsjXskK8tlzKQwdUL_m4/exec';

// إرسال البيانات عبر Google Script
function sendFormData(formData) {
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // مهم للـ Google Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
}
