document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // 1. Sticky Header scroll handler
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

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
    const interactiveElements = document.querySelectorAll('a, button, .grid-item, .detail-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering-interactive');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering-interactive');
      });
    });
  }



  // 4. Entrance & Scroll GSAP Animations
  const tl = gsap.timeline();
  
  tl.fromTo('.header',
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
  )
  .fromTo('.reveal-text',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' },
    '-=0.7'
  )
  .fromTo('.hero-image-wrapper',
    { scale: 0.96, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' },
    '-=0.8'
  )
  .fromTo('.stagger-fade',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' },
    '-=0.7'
  );

  // Gallery items fade-in on scroll using IntersectionObserver
  const gridItems = document.querySelectorAll('.grid-item');
  if (gridItems.length > 0) {
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

    gridItems.forEach(item => {
      gsap.set(item, { opacity: 0 });
      observer.observe(item);
    });
  }
});
