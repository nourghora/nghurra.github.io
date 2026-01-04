// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                company: this.querySelector('input[placeholder="Company"]').value,
                service: this.querySelector('select').value,
                message: this.querySelector('textarea').value
            };
            
            // Here you can add code to send the form data to a server
            alert('Thank you for your message! I will contact you soon.');
            
            // Reset the form
            contactForm.reset();
            
            // You can add form data submission to a server here
            // console.log('Form data:', formData);
            // fetch('your-server-endpoint', { method: 'POST', body: JSON.stringify(formData) })
        });
    }
    
    // Smooth Scrolling
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
    
    // Scroll Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

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
// Enhanced client logos effects
document.addEventListener('DOMContentLoaded', function() {
    const clientLogos = document.querySelectorAll('.client-logo');
    
    // Add parallax effect on mouse move
    clientLogos.forEach(logo => {
        logo.addEventListener('mousemove', function(e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            this.style.transform = `translateY(-12px) scale(1.02) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateY(0deg) rotateX(0deg)';
        });
        
        // Add click effect
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'translateY(-12px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-12px) scale(1.02)';
            }, 150);
        });
    });
    
    // Add scroll animation for client logos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const clientObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Set initial styles and observe
    clientLogos.forEach(logo => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(30px)';
        logo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        clientObserver.observe(logo);
    });
});
// Counter animation for stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Call function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateCounter();
    
    // Add hover effects for client cards
    const clientCards = document.querySelectorAll('.client-card');
    
    clientCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .stat-item, .timeline-content, .skill-category').forEach(el => {
        observer.observe(el);
    });
    
    // Add scroll effects
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.timeline-item, .service-card');
        
        elements.forEach(el => {
            const position = el.getBoundingClientRect();
            
            // If element is visible in the viewport
            if (position.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Initialize some styles for elements
    document.querySelectorAll('.timeline-item, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger scroll effect immediately
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
