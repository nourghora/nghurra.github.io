// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
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
    
    // Enhanced client logos effects
    const clientLogos = document.querySelectorAll('.client-logo');
    
    clientLogos.forEach(logo => {
        logo.addEventListener('mousemove', function(e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            this.style.transform = `translateY(-12px) scale(1.02) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateY(0deg) rotateX(0deg)';
        });
    });
    
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
    
    // Initialize counter animation
    animateCounter();
    
    // Scroll Animation
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
    
    // Ensure stat labels are visible
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach(label => {
        label.style.setProperty('color', '#ffffff', 'important');
        label.style.setProperty('opacity', '1', 'important');
        label.style.setProperty('visibility', 'visible', 'important');
        label.style.setProperty('display', 'block', 'important');
        label.style.setProperty('font-size', '1.1rem', 'important');
        label.style.setProperty('font-weight', '600', 'important');
    });
    
    // Trigger scroll effect immediately
    window.dispatchEvent(new Event('scroll'));
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission started');
            
            // Collect form data using getElementsByName (more reliable)
            const formData = {
                name: document.getElementsByName('name')[0]?.value || '',
                email: document.getElementsByName('email')[0]?.value || '',
                company: document.getElementsByName('company')[0]?.value || '',
                service: document.getElementsByName('service')[0]?.value || '',
                message: document.getElementsByName('message')[0]?.value || '',
                timestamp: new Date().toLocaleString('en-US'),
                language: 'English'
            };
            
            console.log('Form data collected:', formData);
            
            // Validate form data
            if (!validateForm(formData)) {
                return;
            }
            
            // Send data to Google Script
            sendToGoogleScript(formData, this);
        });
    }
});

// Google Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6jxa3AuqAfx4IHB_UOwcjODjr6JkJctmt76xIA3lomklwSsjXskK8tlzKQwdUL_m4/exec';

// Form validation function
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.company.trim()) errors.push('Company is required');
    if (!formData.service) errors.push('Please select a service type');
    if (!formData.message.trim()) errors.push('Message is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        alert('❌ Please fix the following errors:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// Send data to Google Script function
function sendToGoogleScript(formData, formElement) {
    const submitBtn = formElement.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Update button state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Send data to Google Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // With no-cors we can't read the response, but assume success
        alert('✅ Message sent successfully! I will contact you soon.');
        formElement.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error sending message. Please try again or contact me directly.');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}
// 1. دالة العد التدريجي
function animateCounter(element, target, suffix = '+') {
    const duration = 1500; // مدة الحركة بالميلي ثانية
    const frameDuration = 1000 / 60; // ~60 إطار في الثانية
    const totalFrames = Math.round(duration / frameDuration);
    let currentFrame = 0;
    
    const initialValue = parseInt(element.textContent) || 0;
    const increment = (target - initialValue) / totalFrames;
    
    const counter = setInterval(() => {
        currentFrame++;
        const currentValue = Math.round(initialValue + (increment * currentFrame));
        
        // تحديث النص في العنصر
        if (currentFrame >= totalFrames) {
            element.textContent = target + suffix;
            clearInterval(counter);
        } else {
            element.textContent = currentValue + suffix;
        }
    }, frameDuration);
}

// 2. بدء العد عند ظهور العنصر على الشاشة
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item');
            
            statItems.forEach(item => {
                // البحث عن الرقم داخل العنصر (قد يكون في <span> أو <h3>)
                const numberElement = item.querySelector('h3, .stat-number, span:first-child');
                if (numberElement) {
                    // استخراج الرقم من النص (مثال: "30+")
                    const text = numberElement.textContent.trim();
                    const match = text.match(/(\d+)/);
                    
                    if (match) {
                        const targetNumber = parseInt(match[1]);
                        // إعادة تعيين النص إلى 0 مؤقتًا
                        numberElement.textContent = '0';
                        // بدء العد بعد تأخير بسيط
                        setTimeout(() => {
                            animateCounter(numberElement, targetNumber, '+');
                        }, 300);
                    }
                }
            });
            
            // إيقاف المراقبة بعد التنفيذ مرة واحدة
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); // عندما يكون 50% من العنصر مرئيًا

// 3. بدء مراقبة قسم الإحصائيات
const statsSection = document.querySelector('.stats-section, section:has(.stat-item)');
if (statsSection) {
    statObserver.observe(statsSection);
}

const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
