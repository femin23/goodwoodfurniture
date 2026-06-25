document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // 0. Clone Category Cards for Infinite Slider
  const catTrack = document.querySelector('.categories-track');
  const initialCards = document.querySelectorAll('.category-card');
  if (catTrack && initialCards.length > 0) {
    const originalCount = initialCards.length;
    // Clone end items and append
    initialCards.forEach(card => {
      const clone = card.cloneNode(true);
      catTrack.appendChild(clone);
    });
    // Clone start items and prepend
    Array.from(initialCards).slice().reverse().forEach(card => {
      const clone = card.cloneNode(true);
      catTrack.insertBefore(clone, catTrack.firstChild);
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
    const interactiveElements = document.querySelectorAll('a, button, .category-card, .collection-card, .detail-card, .dot, .slider-control, .cat-slider-control, .view-all-link');
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
  const autoplayInterval = 6000; // 6 seconds

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

  // 5. Categories Section Slider (Infinite loop, Touch/Drag + Nav Buttons)
  const catContainer = document.querySelector('.categories-slider-container');
  // catTrack is already defined in DOMContentLoaded scope
  const catCards = document.querySelectorAll('.category-card');
  const catPrevBtn = document.querySelector('.cat-slider-control.prev');
  const catNextBtn = document.querySelector('.cat-slider-control.next');
  const catProgressFill = document.querySelector('.categories-progress-fill');

  if (catContainer && catTrack && catCards.length > 0) {
    const originalCount = catCards.length / 3; // 5 original items
    
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let currentIndex = originalCount; // Start at the first original card (index 5)
    let isTransitioning = false;

    function getCardWidth() {
      if (catCards.length === 0) return 0;
      const card = catCards[0];
      const trackStyle = window.getComputedStyle(catTrack);
      const gap = parseFloat(trackStyle.gap) || 0;
      return card.offsetWidth + gap;
    }

    function setSliderPosition() {
      catTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function updateSliderPositionInstant(index) {
      const cardWidth = getCardWidth();
      currentIndex = index;
      currentTranslate = -currentIndex * cardWidth;
      prevTranslate = currentTranslate;
      catTrack.style.transition = 'none';
      setSliderPosition();
    }

    function updateDimensions() {
      const cardWidth = getCardWidth();
      currentTranslate = -currentIndex * cardWidth;
      prevTranslate = currentTranslate;
      setSliderPosition();
      updateProgress();
    }

    window.addEventListener('resize', updateDimensions);

    // Touch events
    catContainer.addEventListener('touchstart', touchStart, { passive: true });
    catContainer.addEventListener('touchend', touchEnd);
    catContainer.addEventListener('touchmove', touchMove, { passive: true });

    // Mouse events
    catContainer.addEventListener('mousedown', dragStart);
    catContainer.addEventListener('mouseup', dragEnd);
    catContainer.addEventListener('mouseleave', dragEnd);
    catContainer.addEventListener('mousemove', dragMove);

    function dragStart(event) {
      if (isTransitioning) return;
      isDragging = true;
      startX = event.clientX;
      catContainer.classList.add('grabbing');
      catTrack.style.transition = 'none';
    }

    function dragMove(event) {
      if (!isDragging) return;
      const currentX = event.clientX;
      const diffX = currentX - startX;
      currentTranslate = prevTranslate + diffX;
      setSliderPosition();
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      catContainer.classList.remove('grabbing');
      
      const cardWidth = getCardWidth();
      if (cardWidth > 0) {
        currentIndex = Math.round(-currentTranslate / cardWidth);
        const maxIndex = catCards.length - 1;
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        currentTranslate = -currentIndex * cardWidth;
      }
      
      prevTranslate = currentTranslate;
      
      isTransitioning = true;
      catTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      setSliderPosition();
      updateProgress();
    }

    // Transition end handler to loop seamlessly
    catTrack.addEventListener('transitionend', () => {
      isTransitioning = false;
      catTrack.style.transition = 'none';
      
      if (currentIndex >= originalCount * 2) {
        updateSliderPositionInstant(currentIndex - originalCount);
      } else if (currentIndex < originalCount) {
        updateSliderPositionInstant(currentIndex + originalCount);
      }
      
      updateProgress();
    });

    catContainer.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-interactive');
    });
    catContainer.addEventListener('mouseleave', () => {
      if (!isDragging) {
        document.body.classList.remove('hovering-interactive');
      }
    });

    function touchStart(event) {
      if (isTransitioning) return;
      isDragging = true;
      startX = event.touches[0].clientX;
      catTrack.style.transition = 'none';
    }

    function touchMove(event) {
      if (!isDragging) return;
      const currentX = event.touches[0].clientX;
      const diffX = currentX - startX;
      currentTranslate = prevTranslate + diffX;
      setSliderPosition();
    }

    function touchEnd() {
      dragEnd();
    }

    function updateProgress() {
      if (!catProgressFill) return;
      let activeOriginalIndex = (currentIndex - originalCount + originalCount) % originalCount;
      let pct = (activeOriginalIndex / (originalCount - 1)) * 100;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      catProgressFill.style.width = `${pct}%`;
    }

    // Button controls
    if (catPrevBtn) {
      catPrevBtn.style.opacity = '1';
      catPrevBtn.style.pointerEvents = 'auto';
      catPrevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        const cardWidth = getCardWidth();
        currentTranslate = -currentIndex * cardWidth;
        prevTranslate = currentTranslate;
        
        catTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        setSliderPosition();
        updateProgress();
      });
    }

    if (catNextBtn) {
      catNextBtn.style.opacity = '1';
      catNextBtn.style.pointerEvents = 'auto';
      catNextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        const cardWidth = getCardWidth();
        currentTranslate = -currentIndex * cardWidth;
        prevTranslate = currentTranslate;
        
        catTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        setSliderPosition();
        updateProgress();
      });
    }

    // Initial position setup (instantly go to index 5)
    updateSliderPositionInstant(originalCount);
    // Initial setup
    updateDimensions();
  }
});
