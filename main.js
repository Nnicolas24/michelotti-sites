// Estudio Jurídico Michelotti y Asociados - Main JavaScript
// Basado en la funcionalidad original de Mogliani con todas las características

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// jQuery ready
$(document).ready(function() {
    initSliders();
    initScrollEffects();
});

// Main initialization function
function initializeApp() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // Initialize all components
    initMobileNavigation();
    initHeaderScroll();
    initSmoothScrolling();
    initFormHandling();
    initCounterAnimations();
    initWhatsAppIntegration();
    initGoogleReviews();
}

// Mobile navigation functionality
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle navigation
            nav.classList.toggle('active');
            body.classList.toggle('nav-open');
            
            // Animate hamburger icon
            const svg = this.querySelector('svg');
            if (nav.classList.contains('active')) {
                // Change to X icon
                svg.innerHTML = '<path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 0 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>';
            } else {
                // Change back to hamburger
                svg.innerHTML = '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>';
            }
        });
        
        // Close nav when clicking on links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                body.classList.remove('nav-open');
                const svg = navToggle.querySelector('svg');
                svg.innerHTML = '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>';
            });
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                body.classList.remove('nav-open');
                const svg = navToggle.querySelector('svg');
                svg.innerHTML = '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>';
            }
        });
    }
}

// Header scroll effects
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const body = document.body;
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                body.classList.add('has-scroll');
            } else {
                body.classList.remove('has-scroll');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const appointmentForm = document.getElementById('appointment-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const message = this.querySelector('textarea').value;
            
            // Validate required fields
            if (!name || !email || !phone) {
                showNotification('Por favor complete todos los campos obligatorios.', 'error');
                return;
            }
            
            // Create WhatsApp message
            const whatsappMessage = `Hola, me interesa agendar una cita.

*Datos de contacto:*
Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
${message ? `Mensaje: ${message}` : ''}

¡Espero su respuesta!`;
            
            // Open WhatsApp
            const whatsappUrl = `https://wa.me/543518760575?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            this.reset();
            
            // Show success message
            showNotification('Formulario enviado. Te redirigimos a WhatsApp.', 'success');
        });
    }
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter__number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate individual counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(function() {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
    }, stepTime);
}

// WhatsApp integration
function initWhatsAppIntegration() {
    const whatsappButtons = document.querySelectorAll('.btn-wsp, .btn-whatsapp-pulse');
    
    whatsappButtons.forEach(button => {
        if (!button.getAttribute('href')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const message = 'Hola, me interesa hacer una consulta legal sobre mis derechos.';
                const whatsappUrl = `https://wa.me/543518760575?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
    });
}

// Google Reviews functionality
function initGoogleReviews() {
    const reviewButtons = document.querySelectorAll('.btn-primary');
    
    reviewButtons.forEach(button => {
        if (button.textContent.includes('reseña') || button.textContent.includes('Google')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Replace with your actual Google My Business review URL
                // Format: https://g.page/r/YOUR_GOOGLE_MY_BUSINESS_ID/review
                window.open('https://g.page/r/michelotti-estudio-juridico/review', '_blank');
            });
        }
    });
}

// Initialize sliders with jQuery
function initSliders() {
    // News/Blog slider
    if ($('.news-slider').length) {
        $('.news-slider').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        arrows: false
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false
                    }
                }
            ]
        });
    }
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for hero background
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        const heroHeight = $('.hero').height();
        
        if (scrolled <= heroHeight) {
            $('.herobg').css('transform', `translateY(${scrolled * 0.5}px)`);
        }
    });
    
    // Fade in sections on scroll
    $(window).scroll(function() {
        $('.section').each(function() {
            const sectionTop = $(this).offset().top;
            const sectionHeight = $(this).height();
            const windowTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            
            if (windowTop + windowHeight > sectionTop + 100) {
                $(this).addClass('section-visible');
            }
        });
    });
    
    // Active navigation links based on scroll position
    $(window).scroll(function() {
        const scrollPos = $(document).scrollTop();
        
        $('.nav a[href^="#"]').each(function() {
            const currLink = $(this);
            const refElement = $(currLink.attr("href"));
            
            if (refElement.position() && refElement.position().top <= scrollPos + 200 && refElement.position().top + refElement.height() > scrollPos) {
                $('.nav ul li a').removeClass("active");
                currLink.addClass("active");
            } else {
                currLink.removeClass("active");
            }
        });
    });
}

// Utility function for notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#26de81';
            break;
        case 'error':
            notification.style.backgroundColor = '#fc5c65';
            break;
        default:
            notification.style.backgroundColor = '#AB7B67';
    }
    
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Loading state management
function setLoadingState(element, isLoading = true) {
    if (isLoading) {
        element.style.opacity = '0.7';
        element.style.pointerEvents = 'none';
        const originalText = element.textContent;
        element.setAttribute('data-original-text', originalText);
        element.textContent = 'Enviando...';
    } else {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
        }
    }
}

// Intersection Observer for animations
function createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const finalOptions = Object.assign(defaultOptions, options);
    
    return new IntersectionObserver(callback, finalOptions);
}

// Initialize custom animations
function initCustomAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = createIntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-animate');
                
                element.classList.add('animate-' + animation);
                animationObserver.unobserve(element);
            }
        });
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Enhanced form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        }
        
        // Phone validation (basic)
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize Google Maps (if needed)
function initGoogleMaps() {
    const mapContainer = document.getElementById('google-map');
    
    if (mapContainer) {
        // Initialize Google Map
        const map = new google.maps.Map(mapContainer, {
            center: { lat: -31.411, lng: -64.186 }, // Córdoba coordinates
            zoom: 15,
            styles: [
                {
                    "elementType": "geometry",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#616161"}]
                }
            ]
        });
        
        // Add marker
        const marker = new google.maps.Marker({
            position: { lat: -31.411, lng: -64.186 },
            map: map,
            title: 'Estudio Jurídico Michelotti y Asociados',
            icon: {
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNBQjdCNjciLz4KPHBhdGggZD0iTTE2IDhMMjQgMjBIOEwxNiA4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
                scaledSize: new google.maps.Size(40, 40)
            }
        });
        
        // Info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h4>Estudio Jurídico Michelotti y Asociados</h4>
                    <p>Gregorio de Laferrere 2130 Local 2<br>Córdoba, Argentina</p>
                    <p><strong>Tel:</strong> (0351) 876-0575</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        // Update scroll-based animations
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Error handling
window.addEventListener('error', function(e) {
    console.log('Script error:', e.error);
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Ensure all scripts are loaded
window.addEventListener('load', function() {
    console.log('Estudio Jurídico Michelotti - Website loaded successfully');
    
    // Hide any loading overlays
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.style.display = 'none';
    });
    
    // Initialize any remaining components
    initCustomAnimations();
    initLazyLoading();
    optimizePerformance();
    
    // Analytics tracking (if needed)
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID');
    }
});

// Export functions for global access if needed
window.MichelottiWebsite = {
    showNotification,
    setLoadingState,
    createIntersectionObserver,
    validateForm
};