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
    const words = ['Web Developer', 'Mobile Developer', 'UI/UX Designer', 'Problem Solver'];
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
    
    // Scroll Animation
    const sections = document.querySelectorAll('section');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        // Add active class to navbar links based on scroll position
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-links a[href*=${sectionId}]`).classList.add('active');
            } else {
                document.querySelector(`.nav-links a[href*=${sectionId}]`).classList.remove('active');
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
            // Show success message
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
    
    // Initialize cube rotation
    const cube = document.querySelector('.cube');
    let startX, startY, currentX = -15, currentY = 15;
    let isDragging = false;
    
    // Make cube interactive
    cube.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        cube.style.animation = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            currentY = (currentY + deltaX * 0.5) % 360;
            currentX = Math.max(-75, Math.min(75, currentX - deltaY * 0.5));
            
            cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            
            startX = e.clientX;
            startY = e.clientY;
        }
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // Resume cube animation when mouse leaves
    cube.addEventListener('mouseleave', function() {
        if (!isDragging) {
            cube.style.animation = 'rotate 20s infinite linear';
        }
    });
    
    // Add CSS class for error styling
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
    `;
    document.head.appendChild(style);
    
    // Fix image paths for GitHub Pages
    const projectImages = document.querySelectorAll('.project-card img');
    const heroImage = document.querySelector('.hero-image img');
    
    // Update hero image path
    if (heroImage && heroImage.src.includes('C:\\Users\\Dell\\Desktop\\portfolio\\assets\\')) {
        heroImage.src = 'assets/profile.jpg';
    }
    
    // Update project image paths
    projectImages.forEach((img, index) => {
        if (img.src.includes('assets/project')) {
            img.src = `assets/project${index + 1}.jpg`;
        }
    });
});
