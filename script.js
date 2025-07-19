  // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal, .skill-card').forEach(el => {
            observer.observe(el);
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Project form submission handler
        document.querySelector('.project-form').addEventListener('submit', function (e) {
            e.preventDefault();

            // Add loading state
            const submitBtn = this.querySelector('.project-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your project inquiry! I\'ll review your requirements and get back to you within 24 hours.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2500);
        });

        // Form submission handler
        document.querySelector('.contact-form').addEventListener('submit', function (e) {
            e.preventDefault();

            // Add loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
        // save data in localstorage in crome
         let userName = document.querySelector(".userName")
          let userEmail = document.querySelector(".userEmail")
           let msgbox = document.querySelector(".textArea")

            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);
        });

        // Initialize particles
        createParticles();

        // Add mouse move effect for hero section
        document.addEventListener('mousemove', (e) => {
            const hero = document.querySelector('.hero');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            hero.style.backgroundPosition = `${x * 50}px ${y * 50}px`;
        });

        // Parallax effect for sections removed to fix skill-card animation conflicts

        // Add project card interactions
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Animate budget options
        document.querySelectorAll('.budget-option input').forEach(input => {
            input.addEventListener('change', function () {
                document.querySelectorAll('.budget-label').forEach(label => {
                    label.style.transform = 'scale(1)';
                });
                if (this.checked) {
                    this.nextElementSibling.style.transform = 'scale(1.05)';
                }
            });
        });

        // Add typing effect to hero title
        function typeWriter(element, text, speed = 100) {
            let i = 0;
            element.innerHTML = '';

            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }

            type();
        }

        // Initialize typing effect when page loads
        window.addEventListener('load', () => {
            const heroTitle = document.querySelector('.hero h1');
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 150);
        });


   //localstorage in crome
    //    let person={
    //     name:"Shubham kumar",
    //     age:20,
    //     prof:"coder/dancer"
    //    }
    //   let personString= JSON.stringify(person)
    //   console.log(personString);
      
    //     localStorage.setItem("key",personString)

    //     let data = localStorage.getItem("key")
    //     console.log(`from localStorage ${data}`);
    //     let objForm = JSON.parse(data)
    //     console.log(objForm);
        
 

        
