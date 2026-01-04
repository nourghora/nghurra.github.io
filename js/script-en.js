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
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
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
    
    // ========== FIXED COUNTER ANIMATION FOR STATS ==========
    function animateCounter() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            // Find the element containing the number (h3 inside stat-item)
            const numberElement = item.querySelector('h3');
            if (!numberElement) return;
            
            // Get the original text
            const originalText = numberElement.textContent.trim();
            
            // Extract the number and suffix (e.g., "30+")
            let targetNumber, suffix;
            
            if (originalText.includes('+')) {
                const parts = originalText.split('+');
                targetNumber = parseInt(parts[0]) || 0;
                suffix = '+';
            } else {
                // Try to extract any number
                const match = originalText.match(/\d+/);
                targetNumber = match ? parseInt(match[0]) : 0;
                suffix = originalText.replace(targetNumber, '');
            }
            
            // If number is invalid (NaN), use default values based on text
            if (isNaN(targetNumber) || targetNumber === 0) {
                const itemText = item.textContent;
                if (itemText.includes('Project') || itemText.includes('مشروع')) targetNumber = 30;
                else if (itemText.includes('Vulnerability') || itemText.includes('ثغرة')) targetNumber = 400;
                else if (itemText.includes('Patch') || itemText.includes('ترقيع')) targetNumber = 100;
                else if (itemText.includes('Client') || itemText.includes('عميل')) targetNumber = 5;
            }
            
            // Store values as attributes
            numberElement.setAttribute('data-target', targetNumber);
            numberElement.setAttribute('data-suffix', suffix);
            numberElement.setAttribute('data-original', originalText);
            
            // Start from 0
            numberElement.textContent = '0' + suffix;
            
            // Start counting when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const elem = entry.target;
                        const target = parseInt(elem.getAttribute('data-target'));
                        const suffix = elem.getAttribute('data-suffix') || '';
                        
                        if (target > 0) {
                            startCounting(elem, target, suffix);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(numberElement);
        });
    }
    
    // Detailed counting function
    function startCounting(element, target, suffix) {
        const duration = 1500;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = Math.round(target * progress);
            
            element.textContent = currentValue + suffix;
            
            if (frame >= totalFrames) {
                clearInterval(counter);
            }
        }, frameDuration);
    }
    
    // Initialize counter
    setTimeout(() => {
        animateCounter();
    }, 300);
    
    // ========== CONTACT FORM SUBMISSION ==========
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
    
    // ========== HELPER FUNCTIONS ==========
    
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
    
    // ========== SCROLL ANIMATIONS ==========
    
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
        
        // Reactivate counter if needed
        const unanimatedStats = document.querySelectorAll('.stat-item h3:not([data-counted])');
        if (unanimatedStats.length > 0) {
            // Activate counter for visible elements
            unanimatedStats.forEach(stat => {
                const rect = stat.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const suffix = stat.getAttribute('data-suffix');
                    if (target && !stat.hasAttribute('data-counted')) {
                        startCounting(stat, target, suffix);
                        stat.setAttribute('data-counted', 'true');
                    }
                }
            });
        }
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
    
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.setProperty('visibility', 'visible', 'important');
        item.style.setProperty('opacity', '1', 'important');
    });
    
    // Trigger scroll effect immediately
    window.dispatchEvent(new Event('scroll'));
});
