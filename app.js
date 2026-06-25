document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // 0. Clone Cards for Infinite Sliders (Categories and Collections)
  const catTrack = document.querySelector('.categories-track');
  const initialCards = document.querySelectorAll('.category-card');
  if (catTrack && initialCards.length > 0) {
    initialCards.forEach(card => {
      catTrack.appendChild(card.cloneNode(true));
    });
    Array.from(initialCards).slice().reverse().forEach(card => {
      catTrack.insertBefore(card.cloneNode(true), catTrack.firstChild);
    });
  }

  const colTrack = document.querySelector('.collections-track');
  const initialColCards = document.querySelectorAll('.collection-card');
  if (colTrack && initialColCards.length > 0) {
    initialColCards.forEach(card => {
      colTrack.appendChild(card.cloneNode(true));
    });
    Array.from(initialColCards).slice().reverse().forEach(card => {
      colTrack.insertBefore(card.cloneNode(true), colTrack.firstChild);
    });
  }

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

  // 5. Categories Section Slider (Infinite loop, Continuous Smooth Scrolling Marquee)
  const catContainer = document.querySelector('.categories-slider-container');
  // catTrack is already defined in DOMContentLoaded scope
  const catCards = document.querySelectorAll('.category-card');
  const catPrevBtn = document.querySelector('.cat-slider-control.prev');
  const catNextBtn = document.querySelector('.cat-slider-control.next');
  const catProgressFill = document.querySelector('.categories-progress-fill');

  if (catContainer && catTrack && catCards.length > 0) {
    const originalCount = catCards.length / 3; // 5 original items
    
    let isDragging = false;
    let isHovered = false;
    let startX = 0;
    let translation = 0;
    const speed = 0.8; // pixels per frame
    let animationFrameId = null;
    let isTransitioning = false;

    const getCardWidth = () => {
      if (catCards.length === 0) return 0;
      const card = catCards[0];
      const trackStyle = window.getComputedStyle(catTrack);
      const gap = parseFloat(trackStyle.gap) || 0;
      return card.offsetWidth + gap;
    };

    const originalWidth = () => {
      return originalCount * getCardWidth();
    };

    const setSliderPosition = () => {
      catTrack.style.transform = `translateX(${translation}px)`;
    };

    const updateProgress = () => {
      if (!catProgressFill) return;
      const origWidth = originalWidth();
      if (origWidth === 0) return;
      const normalizedTranslation = ((translation % origWidth) + origWidth) % origWidth;
      const pct = (1 - (normalizedTranslation / origWidth)) * 100;
      catProgressFill.style.width = `${pct}%`;
    };

    const animate = () => {
      if (!isDragging && !isHovered && !isTransitioning) {
        const origWidth = originalWidth();
        translation -= speed;
        
        if (translation <= -origWidth * 2) {
          translation += origWidth;
        } else if (translation >= -origWidth) {
          translation -= origWidth;
        }
        
        setSliderPosition();
        updateProgress();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const cardWidth = getCardWidth();
    translation = -originalCount * cardWidth;
    setSliderPosition();
    updateProgress();

    const dragStart = (event) => {
      if (isTransitioning) return;
      isDragging = true;
      startX = event.clientX || event.touches[0].clientX;
      catTrack.style.transition = 'none';
    };

    const dragMove = (event) => {
      if (!isDragging) return;
      const currentX = event.clientX || event.touches[0].clientX;
      const diffX = currentX - startX;
      startX = currentX;
      translation += diffX;
      
      const origWidth = originalWidth();
      if (translation <= -origWidth * 2) {
        translation += origWidth;
      } else if (translation >= -origWidth) {
        translation -= origWidth;
      }
      setSliderPosition();
      updateProgress();
    };

    const dragEnd = () => {
      isDragging = false;
    };

    catContainer.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    catContainer.addEventListener('touchstart', dragStart, { passive: true });
    window.addEventListener('touchmove', dragMove, { passive: true });
    window.addEventListener('touchend', dragEnd);

    catContainer.addEventListener('mouseenter', () => {
      isHovered = true;
      document.body.classList.add('hovering-interactive');
    });
    catContainer.addEventListener('mouseleave', () => {
      isHovered = false;
      document.body.classList.remove('hovering-interactive');
    });

    const slideDirection = (dir) => {
      if (isTransitioning) return;
      isTransitioning = true;
      catTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      const cWidth = getCardWidth();
      translation += dir * cWidth;
      
      const origWidth = originalWidth();
      if (translation <= -origWidth * 2) {
        translation += origWidth;
      } else if (translation >= -origWidth) {
        translation -= origWidth;
      }
      
      setSliderPosition();
      updateProgress();
      
      setTimeout(() => {
        catTrack.style.transition = 'none';
        isTransitioning = false;
      }, 600);
    };

    if (catPrevBtn) {
      catPrevBtn.addEventListener('click', () => slideDirection(1));
    }
    if (catNextBtn) {
      catNextBtn.addEventListener('click', () => slideDirection(-1));
    }

    window.addEventListener('resize', () => {
      const cWidth = getCardWidth();
      translation = -originalCount * cWidth;
      setSliderPosition();
      updateProgress();
    });

    animate();
  }

  // 6. Collections Section Slider (Infinite loop, Continuous Smooth Scrolling Marquee)
  const colContainer = document.querySelector('.collections-slider-container');
  // colTrack is already defined in DOMContentLoaded scope
  const colCards = document.querySelectorAll('.collections-track .collection-card');
  const colPrevBtn = document.querySelector('.col-slider-control.prev');
  const colNextBtn = document.querySelector('.col-slider-control.next');
  const colProgressFill = document.querySelector('.collections-progress-fill');

  if (colContainer && colTrack && colCards.length > 0) {
    const originalCount = colCards.length / 3; // 6 original items
    
    let isDragging = false;
    let isHovered = false;
    let startX = 0;
    let translation = 0;
    const speed = 0.8; // pixels per frame
    let animationFrameId = null;
    let isTransitioning = false;

    const getCardWidth = () => {
      if (colCards.length === 0) return 0;
      const card = colCards[0];
      const trackStyle = window.getComputedStyle(colTrack);
      const gap = parseFloat(trackStyle.gap) || 0;
      return card.offsetWidth + gap;
    };

    const originalWidth = () => {
      return originalCount * getCardWidth();
    };

    const setSliderPosition = () => {
      colTrack.style.transform = `translateX(${translation}px)`;
    };

    const updateProgress = () => {
      if (!colProgressFill) return;
      const origWidth = originalWidth();
      if (origWidth === 0) return;
      const normalizedTranslation = ((translation % origWidth) + origWidth) % origWidth;
      const pct = (1 - (normalizedTranslation / origWidth)) * 100;
      colProgressFill.style.width = `${pct}%`;
    };

    const animate = () => {
      if (!isDragging && !isHovered && !isTransitioning) {
        const origWidth = originalWidth();
        translation -= speed;
        
        if (translation <= -origWidth * 2) {
          translation += origWidth;
        } else if (translation >= -origWidth) {
          translation -= origWidth;
        }
        
        setSliderPosition();
        updateProgress();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const cardWidth = getCardWidth();
    translation = -originalCount * cardWidth;
    setSliderPosition();
    updateProgress();

    const dragStart = (event) => {
      if (isTransitioning) return;
      isDragging = true;
      startX = event.clientX || event.touches[0].clientX;
      colTrack.style.transition = 'none';
    };

    const dragMove = (event) => {
      if (!isDragging) return;
      const currentX = event.clientX || event.touches[0].clientX;
      const diffX = currentX - startX;
      startX = currentX;
      translation += diffX;
      
      const origWidth = originalWidth();
      if (translation <= -origWidth * 2) {
        translation += origWidth;
      } else if (translation >= -origWidth) {
        translation -= origWidth;
      }
      setSliderPosition();
      updateProgress();
    };

    const dragEnd = () => {
      isDragging = false;
    };

    colContainer.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    colContainer.addEventListener('touchstart', dragStart, { passive: true });
    window.addEventListener('touchmove', dragMove, { passive: true });
    window.addEventListener('touchend', dragEnd);

    colContainer.addEventListener('mouseenter', () => {
      isHovered = true;
      document.body.classList.add('hovering-interactive');
    });
    colContainer.addEventListener('mouseleave', () => {
      isHovered = false;
      document.body.classList.remove('hovering-interactive');
    });

    const slideDirection = (dir) => {
      if (isTransitioning) return;
      isTransitioning = true;
      colTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      const cWidth = getCardWidth();
      translation += dir * cWidth;
      
      const origWidth = originalWidth();
      if (translation <= -origWidth * 2) {
        translation += origWidth;
      } else if (translation >= -origWidth) {
        translation -= origWidth;
      }
      
      setSliderPosition();
      updateProgress();
      
      setTimeout(() => {
        colTrack.style.transition = 'none';
        isTransitioning = false;
      }, 600);
    };

    if (colPrevBtn) {
      colPrevBtn.addEventListener('click', () => slideDirection(1));
    }
    if (colNextBtn) {
      colNextBtn.addEventListener('click', () => slideDirection(-1));
    }

    window.addEventListener('resize', () => {
      const cWidth = getCardWidth();
      translation = -originalCount * cWidth;
      setSliderPosition();
      updateProgress();
    });

    animate();
  }
});
