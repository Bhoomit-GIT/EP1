/**
 * FREESTYLE — Swiss Event Management Portfolio
 * Interactive micro-behaviors, mobile menu drawer, and smooth states
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Drawer Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

      // Hamburger animation
      const bars = menuToggle.querySelectorAll('.bar');
      if (isOpen) {
        bars[0].style.transform = 'translateY(6px) rotate(45deg)';
        bars[1].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      }
    });

    // Close mobile drawer when clicking links
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link, .btn-pill');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        const bars = menuToggle.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      });
    });
  }

  // --- Active Nav Links State Management ---
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // --- Rotating Badge Interactive Speed Control ---
  const rotatingBadge = document.getElementById('rotatingBadge');
  const spinningSvg = document.querySelector('.spinning-circle-svg');

  if (rotatingBadge && spinningSvg) {
    rotatingBadge.addEventListener('mouseenter', () => {
      spinningSvg.style.animationDuration = '8s';
    });

    rotatingBadge.addEventListener('mouseleave', () => {
      spinningSvg.style.animationDuration = '22s';
    });
  }

  // --- Subtle Tilt/Parallax on Hero Feature Card ---
  const centerCard = document.getElementById('cardCenterFeature');
  if (centerCard && window.innerWidth > 1024) {
    centerCard.addEventListener('mousemove', (e) => {
      const rect = centerCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 4;
      const rotateY = (x / rect.width) * 4;

      centerCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    centerCard.addEventListener('mouseleave', () => {
      centerCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  // --- Subtle 3D Tilt on About Florist Card ---
  const floristCard = document.getElementById('aboutCardFlorist');
  if (floristCard && window.innerWidth > 1024) {
    floristCard.addEventListener('mousemove', (e) => {
      const rect = floristCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 6;
      const rotateY = (x / rect.width) * 6;

      floristCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
    });

    floristCard.addEventListener('mouseleave', () => {
      floristCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    });
  }

  // --- Scrollspy for Active Header Nav Links ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          matchingNavLink.classList.add('active');
        }
      }
    });
  }, { passive: true });
});

