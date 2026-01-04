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
    
    // ========== دالة العد للأرقام (العربية) ==========
    function animateCounter() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            // البحث عن العنصر الذي يحتوي على الرقم (h3 داخل stat-item)
            const numberElement = item.querySelector('h3');
            if (!numberElement) return;
            
            // الحصول على النص الأصلي
            const originalText = numberElement.textContent.trim();
            
            // استخراج الرقم واللاحقة (مثل "30+")
            let targetNumber, suffix;
            
            if (originalText.includes('+')) {
                const parts = originalText.split('+');
                targetNumber = parseInt(parts[0]) || 0;
                suffix = '+';
            } else {
                // محاولة استخراج أي رقم
                const match = originalText.match(/\d+/);
                targetNumber = match ? parseInt(match[0]) : 0;
                suffix = originalText.replace(targetNumber, '');
            }
            
            // إذا كان الرقم غير صالح (NaN)، استخدم قيم افتراضية بناءً على النص
            if (isNaN(targetNumber) || targetNumber === 0) {
                const itemText = item.textContent;
                if (itemText.includes('مشروع') || itemText.includes('Project')) targetNumber = 30;
                else if (itemText.includes('ثغرة') || itemText.includes('Vulnerability')) targetNumber = 400;
                else if (itemText.includes('ترقيع') || itemText.includes('Patch')) targetNumber = 100;
                else if (itemText.includes('عميل') || itemText.includes('Client')) targetNumber = 5;
            }
            
            // تخزين القيم كسمات
            numberElement.setAttribute('data-target', targetNumber);
            numberElement.setAttribute('data-suffix', suffix);
            numberElement.setAttribute('data-original', originalText);
            
            // البدء من 0
            numberElement.textContent = '0' + suffix;
            
            // بدء العد عندما يكون العنصر مرئياً
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
    
    // دالة العد التفصيلية
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
    
    // تهيئة العد
    setTimeout(() => {
        animateCounter();
    }, 300);
    
    // ========== دالة المراسلة والدعم (العربية) ==========
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('بدأ إرسال النموذج...');
            
            // جمع بيانات النموذج
            const formData = {
                name: document.querySelector('input[name="name"]')?.value || '',
                email: document.querySelector('input[name="email"]')?.value || '',
                company: document.querySelector('input[name="company"]')?.value || '',
                service: document.querySelector('select[name="service"]')?.value || '',
                message: document.querySelector('textarea[name="message"]')?.value || '',
                timestamp: new Date().toLocaleString('ar-SA'),
                language: 'العربية'
            };
            
            console.log('بيانات النموذج:', formData);
            
            // التحقق من صحة البيانات
            if (!validateFormArabic(formData)) {
                return;
            }
            
            // إرسال البيانات
            sendFormDataArabic(formData, this);
        });
    }
    
    // ========== دوال المساعدة ==========
    
    // رابط سكريبت جوجل
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6jxa3AuqAfx4IHB_UOwcjODjr6JkJctmt76xIA3lomklwSsjXskK8tlzKQwdUL_m4/exec';
    
    // التحقق من صحة النموذج (العربية)
    function validateFormArabic(formData) {
        const errors = [];
        
        if (!formData.name.trim()) errors.push('الاسم مطلوب');
        if (!formData.email.trim()) errors.push('البريد الإلكتروني مطلوب');
        if (!formData.company.trim()) errors.push('اسم الشركة مطلوب');
        if (!formData.service) errors.push('يرجى اختيار نوع الخدمة');
        if (!formData.message.trim()) errors.push('الرسالة مطلوبة');
        
        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            errors.push('يرجى إدخال بريد إلكتروني صحيح');
        }
        
        if (errors.length > 0) {
            alert('❌ يرجى تصحيح الأخطاء التالية:\n\n' + errors.join('\n'));
            return false;
        }
        
        return true;
    }
    
    // إرسال البيانات (العربية)
    function sendFormDataArabic(formData, formElement) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // تحديث حالة الزر
        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;
        
        // إرسال البيانات إلى سكريبت جوجل
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            alert('✅ تم إرسال رسالتك بنجاح! سأتصل بك قريباً.');
            formElement.reset();
        })
        .catch(error => {
            console.error('خطأ:', error);
            alert('❌ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو الاتصال بي مباشرة.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // ========== تأثيرات التمرير ==========
    
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
    
    // مراقبة العناصر للحركة
    document.querySelectorAll('.service-card, .stat-item, .timeline-content, .skill-category').forEach(el => {
        observer.observe(el);
    });
    
    // تأثيرات التمرير
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.timeline-item, .service-card');
        
        elements.forEach(el => {
            const position = el.getBoundingClientRect();
            
            if (position.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
        
        // إعادة تفعيل العد إذا لزم الأمر
        const unanimatedStats = document.querySelectorAll('.stat-item h3:not([data-counted])');
        if (unanimatedStats.length > 0) {
            // تفعيل العد للعناصر المرئية
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
    
    // تهيئة الأنماط الأولية
    document.querySelectorAll('.timeline-item, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // تأكد من ظهور نصوص الإحصائيات
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
    
    // تشغيل تأثيرات التمرير فوراً
    window.dispatchEvent(new Event('scroll'));
});
