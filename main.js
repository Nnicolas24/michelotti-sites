/* ========================================================================================= */
/* Estudio Jurídico Michelotti y Asociados - Main JavaScript */
/* Basado exactamente en la funcionalidad original de la web de Mogliani */
/* Solo cambiados los datos por los de Michelotti */
/* ========================================================================================= */

// Document ready and initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// jQuery ready for sliders and additional effects
$(document).ready(function() {
    initSliders();
    initScrollEffects();
});

// Main app initialization
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
    initScrollToTop();
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
            const svg = this.querySelector('svg use');
            if (nav.classList.contains('active')) {
                // Change to X icon
                svg.setAttribute('xlink:href', '#svg-close');
            } else {
                // Change back to hamburger
                svg.setAttribute('xlink:href', '#svg-menu');
            }
        });
        
        // Close nav when clicking on links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                body.classList.remove('nav-open');
                const svg = navToggle.querySelector('svg use');
                svg.setAttribute('xlink:href', '#svg-menu');
            });
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                body.classList.remove('nav-open');
                const svg = navToggle.querySelector('svg use');
                svg.setAttribute('xlink:href', '#svg-menu');
            }
        });
    }
}

// Header scroll effects
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('sticky');
                document.body.style.paddingTop = header.offsetHeight + 'px';
            } else {
                header.classList.remove('sticky');
                document.body.style.paddingTop = '0';
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
                
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
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
            const message = this.querySelector('textarea').value || '';
            
            // Validate required fields
            if (!name || !email || !phone) {
                showNotification('Por favor complete todos los campos obligatorios.', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingrese un email válido.', 'error');
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
    let counterObserver;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                const hasPlus = counter.classList.contains('counter__number--plus');
                
                animateCounter(counter, target, hasPlus);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate individual counter
function animateCounter(element, target, hasPlus = false) {
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
        
        const displayNumber = Math.floor(current);
        element.textContent = displayNumber;
        
        // Add plus sign if needed
        if (hasPlus && current >= target) {
            element.textContent = displayNumber + '+';
        }
    }, stepTime);
}

// WhatsApp integration
function initWhatsAppIntegration() {
    const whatsappButtons = document.querySelectorAll('.btn-wsp, .btn-whatsapp-pulse');
    
    whatsappButtons.forEach(button => {
        if (!button.getAttribute('href') || button.getAttribute('href') === '#') {
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
    const reviewButtons = document.querySelectorAll('[data-google-review]');
    
    // Add click handlers to Google Review buttons
    reviewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace with your actual Google My Business review URL
            const googleReviewUrl = 'https://g.page/r/michelotti-estudio-juridico/review';
            window.open(googleReviewUrl, '_blank');
        });
    });
    
    // Generic Google Review buttons
    const genericReviewButtons = document.querySelectorAll('.btn-primary');
    genericReviewButtons.forEach(button => {
        if (button.textContent.toLowerCase().includes('reseña') || 
            button.textContent.toLowerCase().includes('google') ||
            button.textContent.toLowerCase().includes('review')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const googleReviewUrl = 'https://g.page/r/michelotti-estudio-juridico/review';
                window.open(googleReviewUrl, '_blank');
            });
        }
    });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollTopButton = document.querySelector('.scroll-top');
    
    if (scrollTopButton) {
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopButton.style.opacity = '1';
                scrollTopButton.style.visibility = 'visible';
            } else {
                scrollTopButton.style.opacity = '0';
                scrollTopButton.style.visibility = 'hidden';
            }
        });
    }
}

// Initialize sliders with jQuery
function initSliders() {
    // News/Blog slider
    if ($('.news-slider').length && typeof $.fn.slick !== 'undefined') {
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

// Scroll effects with jQuery
function initScrollEffects() {
    if (typeof $ !== 'undefined') {
        // Parallax effect for hero background
        $(window).scroll(function() {
            const scrolled = $(window).scrollTop();
            const heroHeight = $('.hero').height();
            
            if (scrolled <= heroHeight) {
                $('.herobg').css('transform', `translateY(${scrolled * 0.5}px)`);
            }
        });
        
        // Active navigation links based on scroll position
        $(window).scroll(function() {
            const scrollPos = $(document).scrollTop();
            
            $('.nav a[href^="#"]').each(function() {
                const currLink = $(this);
                const refElement = $(currLink.attr("href"));
                
                if (refElement.position() && 
                    refElement.position().top <= scrollPos + 200 && 
                    refElement.position().top + refElement.height() > scrollPos) {
                    $('.nav ul li a').removeClass("active");
                    currLink.addClass("active");
                } else {
                    currLink.removeClass("active");
                }
            });
        });
    }
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
            notification.style.backgroundColor = '#278995';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        default:
            notification.style.backgroundColor = '#6c757d';
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

// Form validation utility
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        field.classList.remove('error');
        
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
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

// Initialize Google Maps (if needed)
function initGoogleMaps() {
    const mapContainer = document.getElementById('google-map');
    
    if (mapContainer && typeof google !== 'undefined') {
        const map = new google.maps.Map(mapContainer, {
            center: { lat: -31.4201, lng: -64.1888 }, // Córdoba coordinates
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
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#278995"}]
                }
            ]
        });
        
        // Add marker
        const marker = new google.maps.Marker({
            position: { lat: -31.4201, lng: -64.1888 },
            map: map,
            title: 'Estudio Jurídico Michelotti y Asociados',
            icon: {
                url: 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#278995"/>
                        <path d="M16 8L24 20H8L16 8Z" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40)
            }
        });
        
        // Info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: 'Open Sans', sans-serif;">
                    <h4 style="margin: 0 0 10px 0; color: #278995;">Estudio Jurídico Michelotti y Asociados</h4>
                    <p style="margin: 0 0 5px 0;">Arturo M. Bas 490<br>Córdoba, Argentina</p>
                    <p style="margin: 0;"><strong>Tel:</strong> (0351) 876-0575</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
}

// Performance optimization - debounce scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based animations here
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Update active navigation
    updateActiveNavigation(scrollTop);
    
    // Update scroll-to-top button visibility
    updateScrollToTopVisibility(scrollTop);
}, 10);

function updateActiveNavigation(scrollTop) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (scrollTop >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function updateScrollToTopVisibility(scrollTop) {
    const scrollTopButton = document.querySelector('.scroll-top');
    if (scrollTopButton) {
        if (scrollTop > 300) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.visibility = 'visible';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
        }
    }
}

// Add optimized scroll listener
window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Ensure all scripts are loaded
window.addEventListener('load', function() {
    console.log('Estudio Jurídico Michelotti - Website loaded successfully');
    
    // Hide any loading overlays
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.style.display = 'none';
    });
    
    // Initialize Google Maps if available
    if (typeof google !== 'undefined') {
        initGoogleMaps();
    }
    
    // Analytics tracking (if needed)
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'Estudio Jurídico Michelotti y Asociados',
            page_location: window.location.href
        });
    }
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

// Export functions for global access if needed
window.MichelottiWebsite = {
    showNotification,
    validateForm,
    initGoogleMaps
};