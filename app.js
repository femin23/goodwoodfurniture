document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();



  // 1. Sticky Header scroll handler
  const handleScroll = () => {
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check scroll position on initial load

  // 2. Custom Cursor Follower (GSAP based, disabled on touch screens)
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });
    });

    // Add hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .category-card, .collection-card, .detail-card, .dot, .slider-control, .cat-slider-control, .col-slider-control, .view-all-link');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering-interactive');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering-interactive');
      });
    });
  }

  // 3. Hero Section Slider logic
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.slider-control.prev');
  const nextBtn = document.querySelector('.slider-control.next');
  const sliderWrapper = document.querySelector('.hero-section');
  
  let currentSlide = 0;
  let autoplayTimer = null;
  const autoplayInterval = 2000; // 2 seconds

  function goToSlide(index) {
    if (slides.length === 0) return;
    
    // Deactivate current slide and dot
    slides[currentSlide].classList.remove('active');
    if (dots.length > currentSlide) {
      dots[currentSlide].classList.remove('active');
    }
    
    // Calculate new slide index with wrap-around
    currentSlide = (index + slides.length) % slides.length;
    
    // Activate new slide and dot
    slides[currentSlide].classList.add('active');
    if (dots.length > currentSlide) {
      dots[currentSlide].classList.add('active');
    }
    
    // Reset autoplay timer
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, autoplayInterval);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      goToSlide(slideIndex);
    });
  });

  // Pause on hover
  if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseenter', stopAutoplay);
    sliderWrapper.addEventListener('mouseleave', startAutoplay);
  }

  // Initialize Slider autoplay
  if (slides.length > 0) {
    startAutoplay();
  }




  // 4. Entrance & Scroll GSAP Animations
  const tl = gsap.timeline();
  
  tl.fromTo('.hero-section',
    { opacity: 0 },
    { opacity: 1, duration: 1.5, ease: 'power2.out' }
  );

  // Category cards fade-in on scroll using IntersectionObserver
  const catCardsObserver = document.querySelectorAll('.category-card');
  if (catCardsObserver.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    catCardsObserver.forEach(item => {
      gsap.set(item, { opacity: 0 });
      observer.observe(item);
    });
  }

  // Collection cards fade-in on scroll using IntersectionObserver
  const collectionCards = document.querySelectorAll('.collection-card');
  if (collectionCards.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    collectionCards.forEach(item => {
      gsap.set(item, { opacity: 0 });
      observer.observe(item);
    });
  }

  // Quote banner entrance animation using IntersectionObserver
  const quoteSection = document.querySelector('.quote-banner-section');
  if (quoteSection) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo('.craftsmanship-quote',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
          );
          gsap.fromTo('.quote-author',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power2.out' }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    gsap.set('.craftsmanship-quote', { opacity: 0 });
    gsap.set('.quote-author', { opacity: 0 });
    observer.observe(quoteSection);
  }







  // 7. Shop Page Category Filter (with GSAP animations)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        
        // GSAP transition: Fade out and scale down currently visible items
        gsap.to(productCards, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          onComplete: () => {
            productCards.forEach(card => {
              const cardCat = card.getAttribute('data-category');
              if (filterValue === 'all' || cardCat === filterValue) {
                card.style.display = 'flex';
              } else {
                card.style.display = 'none';
              }
            });

            // Fade in and scale up the newly filtered visible items
            const newVisibleCards = Array.from(productCards).filter(card => card.style.display !== 'none');
            gsap.fromTo(newVisibleCards,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
          }
        });
      });
    });
  }

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.submit-btn');
      const submitBtnText = submitBtn.querySelector('span');
      const originalText = submitBtnText.textContent;

      // Disable inputs and show loading state
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending Message...';

      // Simulate API submit delay
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;

        // Show success status
        formStatus.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
        formStatus.className = 'form-status success';
        
        // Reset form
        contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          gsap.to(formStatus, {
            opacity: 0,
            height: 0,
            padding: 0,
            marginTop: 0,
            duration: 0.5,
            onComplete: () => {
              formStatus.style.display = 'none';
              formStatus.style.opacity = '1';
              formStatus.className = 'form-status';
              formStatus.style.height = 'auto';
              formStatus.style.padding = '10px';
              formStatus.style.marginTop = '15px';
            }
          });
        }, 5000);

      }, 1200);
    });
  }
});
