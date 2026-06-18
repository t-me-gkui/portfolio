    // Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Theme Toggle
    const themeToggle = document.querySelector('.toggle-input');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const savedToggleState = localStorage.getItem('toggleState') === 'true';

    // Set initial theme and toggle state
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedToggleState;
    } else {
        // Default to light theme if no preference is saved
        body.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
    }

    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        if (themeToggle.checked) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            localStorage.setItem('toggleState', 'true');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            localStorage.setItem('toggleState', 'false');
        }
    });
    
    // Typing Animation
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const words = ['Software Engineer', 'Full-Stack Developer', 'Problem Solver', 'Spring Boot & React'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;
    
    function type() {
        const currentWord = words[wordIndex];
        const speed = isDeleting ? 30 : 100; // Faster when deleting
        
        if (!isDeleting && charIndex < currentWord.length) {
            // Typing
            typingText.textContent += currentWord.charAt(charIndex);
            charIndex++;
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else if (charIndex === 0) {
            // Word deleted, move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        } else {
            // Word typed, start deleting after pause
            isDeleting = true;
            setTimeout(type, 1500); // Pause before deleting
            return;
        }
        
        setTimeout(type, speed);
    }
    
    // Start typing animation
    setTimeout(type, 1000);
    
    // Scroll Animation & URL Hash Update
    const sections = document.querySelectorAll('section');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        // Add active class to navbar links and update URL endpoint hash based on scroll position
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                    // Dynamically update URL hash without scrolling the page
                    if (history.replaceState && window.location.hash !== '#' + sectionId) {
                        history.replaceState(null, null, '#' + sectionId);
                    }
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
        
        // Sticky Navbar with shadow on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Project Cards Animation
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Search Functionality (Filters Projects & Skills)
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        // Filter Projects (hides non-matching)
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.style.display = 'none';
            }
        });
        
        // Filter Skills (dims non-matching to preserve visual layout)
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const skillName = item.querySelector('span').textContent.toLowerCase();
            
            if (skillName.includes(query)) {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.opacity = query ? '0.15' : '1';
            }
        });
    });
    
    // Form Validation
   const contactForm = document.querySelector('.contact-form');
let isFormCooldown = false;

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted!');
    if (isFormCooldown) {
        alert('Please wait 10 seconds before sending another message.');
        return;
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    let isValid = true;

    // Simple validation
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required');
        isValid = false;
    } else {
        removeError(nameInput);
    }

    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
    } else {
        removeError(emailInput);
    }

    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Message is required');
        isValid = false;
    } else {
        removeError(messageInput);
    }

    if (isValid) {
        // Prepare form data for Netlify submission
        const formData = new FormData(contactForm);
        const encodedFormData = new URLSearchParams(formData).toString();

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encodedFormData
        })
        .then(response => {
            if (response.ok) {
                console.log("Form successfully submitted to Netlify");
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();

                // Start cooldown
                isFormCooldown = true;
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Please wait 10 seconds...';

                // Start countdown
                let timeLeft = 10;
                let cooldownTimer = setInterval(() => {
                    timeLeft--;
                    submitButton.textContent = `Please wait ${timeLeft} seconds...`;

                    if (timeLeft <= 0) {
                        clearInterval(cooldownTimer);
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                        isFormCooldown = false;
                    }
                }, 1000);
            } else {
                console.error("Form submission to Netlify failed");
                alert("Oops! Something went wrong. Please try again later.");
            }
        })
        .catch(error => {
            console.error("Error submitting form:", error);
            alert("Oops! Something went wrong. Please try again later.");
        });
    }
});

function showError(input, message) {
    const formGroup = input.parentElement;
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add('error');
}

function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');

    if (errorElement) {
        formGroup.removeChild(errorElement);
    }

    input.classList.remove('error');
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
    
    // Animate skills on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillItems.forEach(item => {
        observer.observe(item);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize physics-based cube rotation
    const cube = document.querySelector('.cube');
    cube.style.animation = 'none'; // Disable CSS rotation animation
    
    let currentX = -15; // Initial X rotation
    let currentY = 15;  // Initial Y rotation
    
    // Default constant rotation velocities (degrees per frame ~16.7ms)
    const defaultVx = 0.15;
    const defaultVy = 0.25;
    
    let vx = defaultVx;
    let vy = defaultVy;
    
    let isDragging = false;
    let lastX, lastY, lastTime;
    const friction = 0.96; // Deceleration rate per frame when released
    
    function updateRotation() {
        // Apply friction and blend towards default velocity
        vx = vx * friction + defaultVx * (1 - friction);
        vy = vy * friction + defaultVy * (1 - friction);
        
        // Apply velocities to current angles
        currentX += vx;
        currentY += vy;
        
        // Constrain X rotation to avoid flipping upside down
        currentX = Math.max(-85, Math.min(85, currentX));
        
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        
        requestAnimationFrame(updateRotation);
    }
    
    // Start physics loop
    requestAnimationFrame(updateRotation);
    
    // Drag handlers
    function startDrag(clientX, clientY, e) {
        isDragging = true;
        lastX = clientX;
        lastY = clientY;
        lastTime = performance.now();
        
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    
    function moveDrag(clientX, clientY) {
        if (!isDragging) return;
        
        const now = performance.now();
        const dt = now - lastTime;
        
        const deltaX = clientX - lastX;
        const deltaY = clientY - lastY;
        
        // Update rotation position instantly during drag
        currentY = (currentY + deltaX * 0.4) % 360;
        currentX = Math.max(-85, Math.min(85, currentX - deltaY * 0.4));
        
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        
        // Calculate velocity (degrees per millisecond, converted to degrees per frame)
        if (dt > 0) {
            vy = (deltaX * 0.4 / dt) * 16.7;
            vx = -(deltaY * 0.4 / dt) * 16.7;
            
            // Cap speed to keep it natural and avoid extreme spins
            const maxSpeed = 15;
            vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
            vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));
        }
        
        lastX = clientX;
        lastY = clientY;
        lastTime = now;
    }
    
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        
        const now = performance.now();
        if (now - lastTime > 100) {
            vx = defaultVx;
            vy = defaultVy;
        }
    }
    
    // Mouse Event Listeners
    cube.addEventListener('mousedown', function(e) {
        startDrag(e.clientX, e.clientY, e);
    });
    
    document.addEventListener('mousemove', function(e) {
        moveDrag(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', function() {
        endDrag();
    });
    
    // Touch Event Listeners (Mobile support)
    cube.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            startDrag(e.touches[0].clientX, e.touches[0].clientY, e);
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (isDragging && e.touches.length === 1) {
            moveDrag(e.touches[0].clientX, e.touches[0].clientY);
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function() {
        endDrag();
    });
    
    document.addEventListener('touchcancel', function() {
        endDrag();
    });
    
    // Add CSS class for error styling and interactive cube cursors
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 5px;
        }
        
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444;
        }
        
        .nav-links a.active {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .nav-links a.active::after {
            width: 100%;
        }
        
        .navbar.scrolled {
            box-shadow: 0 5px 15px var(--shadow-color);
            padding: 10px 30px;
        }
        
        .skill-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s, transform 0.5s;
        }
        
        .skill-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .cube-container, .cube, .cube-face {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        
        .cube {
            cursor: grab;
        }
        
        .cube:active {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(style);
    

});
