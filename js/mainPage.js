document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const buttons = document.querySelectorAll('.btn');
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    const logo = document.querySelector('.logo');
    const slogan = document.querySelector('.slogan');
    const fullScreenContainer = document.querySelector('.full-screen-container');

    // Button Hover Animations
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05) translateY(-3px)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
            // Play subtle click sound (if supported)
            if (typeof Audio !== 'undefined') {
                const sound = new Audio('https://www.soundjay.com/buttons/button-09a.mp3');
                sound.volume = 0.3;
                sound.play().catch(() => { });
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });

        // Click Animation
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });

        // Keyboard Accessibility
        button.addEventListener('focus', () => {
            button.style.outline = '3px solid #e63946';
            button.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', () => {
            button.style.outline = 'none';
        });
    });

    // Logo Hover Animation
    logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'translateY(-5px) rotateX(5deg)';
        logo.style.textShadow = '4px 4px 8px rgba(0, 0, 0, 0.9)';
    });

    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'translateY(0) rotateX(0)';
        logo.style.textShadow = '3px 3px 6px rgba(0, 0, 0, 0.7)';
    });

    // Parallax Effect for Hero Image
    const applyParallax = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) / 50;
        const moveY = (clientY - centerY) / 50;
        heroImage.style.transform = `translateZ(-10px) scale(1.1) translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener('mousemove', applyParallax);

    // Device Orientation for Mobile Parallax
    window.addEventListener('deviceorientation', (e) => {
        const { beta, gamma } = e; // beta: tilt front-back, gamma: tilt left-right
        const moveX = gamma / 5; // Reduce intensity
        const moveY = beta / 5;
        heroImage.style.transform = `translateZ(-10px) scale(1.1) translate(${moveX}px, ${moveY}px)`;
    });

    // Lazy Loading for Hero Image
    if ('loading' in HTMLImageElement.prototype) {
        heroImage.loading = 'lazy';
    } else {
        // Fallback for browsers not supporting native lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroImage.src = heroImage.dataset.src;
                    observer.unobserve(heroImage);
                }
            });
        });
        observer.observe(heroImage);
    }

    // Dynamic Background Color Transition
    const colors = [
        'linear-gradient(135deg, #1a1a2e 0%, #0a0a23 100%)',
        'linear-gradient(135deg, #2e2e4e 0%, #1a1a2e 100%)',
        'linear-gradient(135deg, #4e2e4e 0%, #2e1a2e 100%)'
    ];
    let colorIndex = 0;

    setInterval(() => {
        fullScreenContainer.style.background = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
        fullScreenContainer.style.transition = 'background 2s ease';
    }, 10000); // Change every 10 seconds

    // Content Fade-In Animation
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    setTimeout(() => {
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);

    // Slogan Pulse Animation
    slogan.style.animation = 'pulse 2s infinite ease-in-out';

    // Keyboard Navigation for Accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('btn')) {
                focusedElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    focusedElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
    });

    // Touch Feedback for Mobile
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
        });
    });

    // Service Worker for PWA (Progressive Web App)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }

    // Reduced Motion Check for Accessibility
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        heroImage.style.transform = 'translateZ(0) scale(1)';
        window.removeEventListener('mousemove', applyParallax);
        buttons.forEach(button => {
            button.style.transition = 'none';
        });
        logo.style.transition = 'none';
    }
});

// Service Worker for Offline Support (Placeholder)
const swContent = `
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('avto-salon-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/mainPage.css',
        '/mainPage.js',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
`;

// Create a virtual service-worker.js for PWA
const swBlob = new Blob([swContent], { type: 'application/javascript' });
const swUrl = URL.createObjectURL(swBlob);
navigator.serviceWorker.register(swUrl).catch(err => {
    console.log('Virtual Service Worker registration failed:', err);
});