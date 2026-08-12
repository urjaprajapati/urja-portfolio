/* =========================================================
   URJA PRAJAPATI — PORTFOLIO SCRIPT
   Handles: mobile nav, scroll-reveal motion, count-up stats,
   tech marquee, project data render + category filtering
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.body.classList.add('has-custom-cursor');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverSelector = 'a, button, .project-card, .why-card, .skill-card, .highlight-card, .tech-logo-card, .edu-card, .achieve-list li, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) cursorRing.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) cursorRing.classList.remove('hovering');
    });
  }


  /* ---------- Staggered headline word reveal ---------- */
  document.querySelectorAll('.section-title').forEach(heading => {
    const words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words.map(w => `<span class="word-reveal"><span>${w}</span></span>`).join(' ');
    heading.querySelectorAll('.word-reveal span').forEach((span, i) => {
      span.style.transitionDelay = `${i * 45}ms`;
    });
  });
  const headingObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('words-in');
            headingObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 })
    : null;
  document.querySelectorAll('.section-title').forEach(heading => {
    if (headingObserver) headingObserver.observe(heading);
    else heading.classList.add('words-in');
  });


  /* ---------- Magnetic buttons ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  const timelineEl = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timelineProgress');
  if (timelineEl && timelineProgress) {
    function updateTimelineProgress() {
      const rect = timelineEl.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(viewportH * 0.75 - rect.top, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      timelineProgress.style.height = `${pct}%`;
    }
    updateTimelineProgress();
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress);
  }

  const photoCard = document.querySelector('.profile-card');
  const photoWrap = document.querySelector('.profile-photo-wrap');
  if (photoCard && photoWrap && window.matchMedia('(hover: hover)').matches) {
    photoCard.addEventListener('mousemove', (e) => {
      const rect = photoWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      photoWrap.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg)`;
    });
    photoCard.addEventListener('mouseleave', () => {
      photoWrap.style.transform = '';
    });
  }

  /* ---------- Scroll reveal (motion) ---------- */
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.in-view)').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('in-view'); // fallback: no IO support
    });
  }
  observeReveals();

  /* ---------- Hero count-up (impact metrics + quick stats) ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  document.querySelectorAll('.count-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      animateCount(el); // already visible on load (hero stats)
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    } else {
      animateCount(el);
    }
  });

  /* ---------- Tech icon badges ----------
     Hand-drawn icon glyphs styled after each technology's familiar shape/
     colors (originals, not traced copies of official logo artwork) for the
     widely recognized core stack; niche builder/CRO tools use a colored
     monogram so the whole stack still reads clearly at a glance. */
  const TECH_ICONS = {
    'HTML5': `<svg viewBox="0 0 24 24"><path d="M3 2l1.6 18L12 22l7.4-2L21 2H3z" fill="#E44D26"/><path d="M12 4v16.4l6-1.7L19.3 4H12z" fill="#F16529"/><path d="M12 8H8.4l.2 2.3H12v2.2H8.8l.3 3.4L12 16.8v-2.3l-1.8-.5-.1-1.3H12V8z" fill="#fff"/><path d="M12 8h3.6l-.2 2.3H12V8zm0 4.5h1.7l-.2 1.9L12 15v2.3l3.3-1 .4-4.6H12v.8z" fill="#EBEBEB"/></svg>`,
    'CSS3': `<svg viewBox="0 0 24 24"><path d="M3 2l1.6 18L12 22l7.4-2L21 2H3z" fill="#264DE4"/><path d="M12 4v16.4l6-1.7L19.3 4H12z" fill="#2965F1"/><path d="M12 7.5H7.6l.2 2.2H12v2.1H8l.3 3.3 3.7 1v2.2l-5.8-1.6-.5-5.2H12V7.5z" fill="#fff"/><path d="M12 7.5h4.4l-.2 2.2H12V7.5zm0 4.3h2.2l-.3 3-1.9.5v2.2l3.7-1 .5-5.5H12v.6z" fill="#EBEBEB"/></svg>`,
    'JavaScript': `<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#F0DB4F"/><path d="M12.6 17.2c.3.6.7 1 1.5 1 .6 0 1-.3 1-.8 0-.6-.4-.8-1.2-1.1l-.4-.2c-1.2-.5-2-1.1-2-2.5 0-1.2.9-2.1 2.4-2.1 1 0 1.8.4 2.3 1.3l-1.3.8c-.3-.5-.6-.7-1-.7-.5 0-.8.3-.8.7 0 .5.3.7 1 1l.4.2c1.4.6 2.2 1.2 2.2 2.6 0 1.5-1.2 2.3-2.7 2.3-1.5 0-2.5-.7-3-1.7l1.3-.8zm-5.9.1c.2.4.5.8 1 .8.5 0 .8-.2.8-1v-5.4h1.6v5.5c0 1.7-1 2.5-2.4 2.5-1.3 0-2.1-.7-2.5-1.5l1.5-1z" fill="#111"/></svg>`,
    'React.js': `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><g fill="none" stroke="#61DAFB" stroke-width="1.4"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></g></svg>`,
    'Vue.js': `<svg viewBox="0 0 24 24"><path d="M2 3h4l6 10 6-10h4L12 21 2 3z" fill="#41B883"/><path d="M6 3h3.2L12 8l2.8-5H18l-6 10.4L6 3z" fill="#35495E"/></svg>`,
    'Angular': `<svg viewBox="0 0 24 24"><path d="M12 2l9 3.2-1.4 12L12 22l-7.6-4.8L3 5.2 12 2z" fill="#DD0031"/><path d="M12 2v20l7.6-4.8L21 5.2 12 2z" fill="#C3002F"/><path d="M12 6.3L7.3 17h1.8l1-2.4h3.8l1 2.4h1.8L12 6.3zm0 3.4l1.4 3.4h-2.8L12 9.7z" fill="#fff"/></svg>`,
    'jQuery': `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#0769AD"/><path d="M8 6c1.5 2 1.5 4-.5 6.5S6 17 8 18" fill="none" stroke="#fff" stroke-width="1.3"/><path d="M13 6c1.5 2 1.5 4-.5 6.5S11 17 13 18" fill="none" stroke="#9FD9F7" stroke-width="1.3"/><circle cx="17.3" cy="16.3" r="1.4" fill="#fff"/></svg>`,
    'Bootstrap': `<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#7952B3"/><path d="M8 6.5h4.6c2 0 3.1 1 3.1 2.7 0 1.2-.7 2-1.6 2.3 1.1.3 2 1.1 2 2.6 0 1.9-1.4 2.9-3.4 2.9H8v-10.5zm2 1.7v2.5h2.3c.9 0 1.5-.5 1.5-1.3s-.6-1.2-1.5-1.2H10zm0 4.1v2.9h2.5c1 0 1.6-.5 1.6-1.4s-.6-1.5-1.7-1.5H10z" fill="#fff"/></svg>`,
    'WordPress': `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#21759B"/><path d="M3.5 12a8.5 8.5 0 004.9 7.7L4.6 9.4a8.4 8.4 0 00-1.1 2.6zM12 3.5c-1.7 0-3.3.5-4.6 1.3.2 0 .4 0 .5 0 .8 0 1.4.7 1.4 1.5 0 .7-.4 1.3-.8 2-.4.6-.9 1.4-.9 2.6 0 .8.3 1.7.6 2.6l.8 2.6-2.9-8.3A8.5 8.5 0 0112 3.5zm6 2.7c0 .8-.3 1.7-.7 2.3l-1.2 3.7L12.7 20c1.7-.1 3.3-.7 4.5-1.7L15 12.5c.5-1.2.9-2.2.9-3.1 0-1.2-.4-2-.9-2.7.5.1 1 .4 1.5.7l.1-.2z" fill="#fff"/></svg>`,
    'Figma': `<svg viewBox="0 0 24 24"><path d="M9 2h3v5H9a2.5 2.5 0 010-5z" fill="#0ACF83"/><path d="M9 7h3v5H9a2.5 2.5 0 010-5z" fill="#A259FF"/><path d="M9 12h3v5H9a2.5 2.5 0 010-5z" fill="#F24E1E"/><path d="M12 2h2.5a2.5 2.5 0 010 5H12V2z" fill="#FF7262"/><circle cx="14.5" cy="9.5" r="2.5" fill="#1ABCFE"/></svg>`,
    'Webflow': `<svg viewBox="0 0 24 24"><path d="M2 6h3.6l1.5 7.4L9.8 6h3l1.9 7.4L16.2 6H20l-4.8 12h-3.4l-1.7-6.7L8.2 18H4.8L2 6z" fill="#4353FF"/></svg>`,
    'Squarespace': `<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#1B1B1B"/><path d="M6 9.5a2 2 0 012-2h8a2 2 0 012 2v1H8a2 2 0 00-2 2v-3zm0 5a2 2 0 012-2h8v1a2 2 0 01-2 2H6v-1z" fill="#fff"/></svg>`
  };

  const TECH = [
    { name: 'HTML5',          code: 'H5',  color: '#E44D26' },
    { name: 'CSS3',           code: 'C3',  color: '#2965F1' },
    { name: 'JavaScript',     code: 'JS',  color: '#F0DB4F', dark: true },
    { name: 'jQuery',         code: 'jQ',  color: '#0769AD' },
    { name: 'React.js',       code: 'Rx',  color: '#61DAFB', dark: true },
    { name: 'Vue.js',         code: 'Vu',  color: '#41B883' },
    { name: 'Angular',        code: 'Ag',  color: '#DD0031' },
    { name: 'Bootstrap',      code: 'Bs',  color: '#7952B3' },
    { name: 'WordPress',      code: 'Wp',  color: '#21759B' },
    { name: 'Elementor',      code: 'El',  color: '#FF5A5F' },
    { name: 'Divi',           code: 'Dv',  color: '#6C4EF0' },
    { name: 'Avada',          code: 'Av',  color: '#3AA9DC' },
    { name: 'WPBakery',       code: 'Wb',  color: '#37B96C' },
    { name: 'Oxygen',         code: 'Ox',  color: '#4A90D9' },
    { name: 'Squarespace',    code: 'Sq',  color: '#1B1B1B' },
    { name: 'Webflow',        code: 'Wf',  color: '#4353FF' },
    { name: 'VWO',            code: 'VW',  color: '#FF6E4A' },
    { name: 'Google Optimize',code: 'Go',  color: '#4285F4' },
    { name: 'Optimizely',     code: 'Op',  color: '#0033A0' },
    { name: 'Adobe Target',   code: 'At',  color: '#FA0F00' },
    { name: 'Mutiny',         code: 'Mu',  color: '#FF4F64' },
    { name: 'Marketo',        code: 'Mk',  color: '#5C4A9E' },
    { name: 'Figma',          code: 'Fg',  color: '#A259FF' }
  ];

  function techBadge(t) {
    if (TECH_ICONS[t.name]) {
      return `<span class="tech-badge tech-badge-svg">${TECH_ICONS[t.name]}</span>`;
    }
    return `<span class="tech-badge" style="--badge-color:${t.color}; color:${t.dark ? '#111' : '#fff'}">${t.code}</span>`;
  }

  const techTrack = document.getElementById('techTrack');
  if (techTrack) {
    const renderPills = () => TECH.map(t => `<span class="tech-pill">${techBadge(t)}${t.name}</span>`).join('');
    techTrack.innerHTML = renderPills() + renderPills(); // duplicate for seamless loop
  }

  const techLogoGrid = document.getElementById('techLogoGrid');
  if (techLogoGrid) {
    techLogoGrid.innerHTML = TECH.map(t => `
      <div class="tech-logo-card reveal">
        ${techBadge(t)}
        <span>${t.name}</span>
      </div>
    `).join('');
  }

  /* ---------- Project data ---------- */
  // category: 'cro' = CRO/SaaS product marketing sites (VWO / Optimize / Mutiny experiments)
  //           'wp'  = WordPress & page builders (Elementor, Divi, Avada, WPBakery, Oxygen)
  //           'ss'  = Squarespace & Webflow builds
  const PROJECTS = [
    { name: 'nTopology', url: 'https://ntopology.com/', cat: 'cro', tags: ['SaaS', 'CRO'], desc: 'Engineering-software marketing site with structured page hierarchy and conversion-focused UI for a technical buyer audience.' },
    { name: 'Socure', url: 'https://www.socure.com/request-a-demo-2', cat: 'cro', tags: ['SaaS', 'A/B Testing'], desc: 'Identity-verification platform demo-request flow, built and tested to lift qualified demo bookings.' },
    { name: 'Tenable', url: 'https://www.tenable.com/', cat: 'cro', tags: ['SaaS', 'CRO'], desc: 'Cybersecurity marketing pages with trust-forward modules and CRO-driven layout for enterprise buyers.' },
    { name: 'Splashtop', url: 'https://www.splashtop.com/', cat: 'cro', tags: ['SaaS'], desc: 'Remote-access software marketing UI focused on clear plan comparison and fast page performance.' },
    { name: 'GRIN', url: 'https://grin.co/', cat: 'cro', tags: ['SaaS'], desc: 'Creator-management platform pages built for scannability and lead-gen conversion.' },
    { name: 'RocketReach', url: 'https://rocketreach.co/', cat: 'cro', tags: ['JavaScript', 'VWO', 'A/B Testing'], desc: 'Prospecting SaaS platform with VWO-powered A/B tests on landing pages and CTA placement.' },
    { name: '7shifts', url: 'https://www.7shifts.com/', cat: 'cro', tags: ['SaaS'], desc: 'Restaurant workforce-management marketing site with ROI-forward, vertical-specific landing pages.' },
    { name: 'Downright Tile', url: 'https://www.downrighttile.com/', cat: 'wp', tags: ['Web Design'], desc: 'Home-services marketing site with responsive layouts optimized for local lead generation.' },
    { name: 'Rapid7', url: 'https://www.rapid7.com/', cat: 'cro', tags: ['SaaS'], desc: 'Cybersecurity SaaS marketing pages built with performance and conversion best practices.' },
    { name: 'FinQuery', url: 'https://finquery.com/', cat: 'cro', tags: ['WordPress', 'VWO', 'CRO'], desc: 'Lease-accounting SaaS site on WordPress with ongoing VWO A/B testing across key landing pages.' },
    { name: 'AWR USA', url: 'https://www.awrusa.com/', cat: 'wp', tags: ['Web Design'], desc: 'Corporate marketing site rebuilt for clarity, responsiveness and faster load times.' },
    { name: 'Ideal Image', url: 'https://www.idealimage.com/', cat: 'cro', tags: ['CRO'], desc: 'Aesthetics-industry marketing pages tuned for consultation-booking conversion.' },
    { name: 'Paycor', url: 'https://www.paycor.com/', cat: 'cro', tags: ['WordPress', 'Mutiny', 'Marketo', 'CRO'], desc: 'HR/payroll SaaS site on WordPress with Mutiny personalization, Marketo integration and continuous A/B testing.' },
    { name: 'SureFire Local', url: 'https://www.surefirelocal.com/', cat: 'cro', tags: ['WordPress', 'VWO', 'CRO'], desc: 'Local-marketing SaaS platform with VWO-driven CRO experiments across the WordPress front end.' },
    { name: 'FieldXperience', url: 'https://fieldxperience.com/', cat: 'wp', tags: ['Elementor'], desc: 'Field-service brand site built in Elementor with custom sections and responsive layouts.' },
    { name: 'Blooom', url: 'https://blooom.ae/', cat: 'wp', tags: ['Elementor'], desc: 'Lifestyle brand site designed and built in Elementor with pixel-perfect responsive sections.' },
    { name: 'Gusto', url: 'https://gusto.com/', cat: 'cro', tags: ['React.js', 'VWO', 'A/B Testing'], desc: 'Payroll & benefits platform with React-based marketing components and VWO A/B testing.' },
    { name: 'JetPressure', url: 'https://jetpressure.com.au/', cat: 'wp', tags: ['Web Design'], desc: 'Australian pressure-washing services site with a mobile-first booking-focused layout.' },
    { name: 'Hello Bar', url: 'https://www.hellobar.com/', cat: 'cro', tags: ['WordPress', 'CRO', 'A/B Testing'], desc: 'CRO-tool marketing site on WordPress, itself continuously A/B tested for sign-up conversion.' },
    { name: 'Gross Gruppe', url: 'https://www.gross-gruppe.com/', cat: 'wp', tags: ['WordPress', 'Avada'], desc: 'Corporate site built with the Avada builder, focused on multilingual, responsive delivery.' },
    { name: 'Leading Edge TAS', url: 'https://www.leadingedgetas.com/', cat: 'ss', tags: ['Squarespace'], desc: 'Professional-services site built on Squarespace with clean, credibility-first sections.' },
    { name: 'The Jones CC', url: 'https://www.thejonescc.com.au/', cat: 'ss', tags: ['Squarespace'], desc: 'Community-club site built on Squarespace with an events-forward, mobile-first layout.' },
    { name: 'Aus Innovate', url: 'https://ausinnovate.com.au/', cat: 'ss', tags: ['Squarespace'], desc: 'Innovation-consultancy site on Squarespace with a clear services-to-contact journey.' },
    { name: 'Bower Gardens', url: 'https://www.bowergardens.com.au/', cat: 'ss', tags: ['Squarespace'], desc: 'Landscape/garden business site on Squarespace styled around visual storytelling.' },
    { name: '22 Carrots', url: 'https://22carrots.com/', cat: 'wp', tags: ['Elementor'], desc: 'Creative-agency site built in Elementor with bold, image-forward sections.' },
    { name: 'Climatwin', url: 'https://climatwin.com/', cat: 'wp', tags: ['Divi'], desc: 'Climate/window-technology product site built with the Divi builder.' },
    { name: 'DetailXPerts', url: 'https://detailxperts.com/', cat: 'wp', tags: ['Elementor'], desc: 'Eco-friendly mobile detailing franchise site built in Elementor with a franchise-locator flow.' },
    { name: 'Legerly', url: 'https://legerly.com/', cat: 'wp', tags: ['Elementor'], desc: 'Legal-services brand site built in Elementor with a trust-forward, conversion-ready layout.' },
    { name: 'Twotap', url: 'https://twotap.art/', cat: 'wp', tags: ['Oxygen Builder'], desc: 'Art/creative platform built with the Oxygen builder for full design-level control.' },
    { name: 'Democracy Project', url: 'https://democracyproject.io/', cat: 'wp', tags: ['WPBakery'], desc: 'Civic-engagement nonprofit site built with WPBakery, focused on donation and sign-up flows.' },
    { name: 'Jon Smith Subs Franchise', url: 'https://jonsmithsubsfranchise.com/', cat: 'wp', tags: ['Divi'], desc: 'Franchise-recruitment site built with Divi, structured around lead-capture forms.' },
    { name: 'Simple Search Solution', url: 'https://www.simplesearchsolution.com/', cat: 'wp', tags: ['Elementor'], desc: 'SEO/marketing agency site built in Elementor with service-tier comparison sections.' },
    { name: 'Mediation Northwest', url: 'https://mediationnorthwest.com/', cat: 'wp', tags: ['WPBakery'], desc: 'Mediation-services site built with WPBakery, focused on a calm, trust-building visual tone.' },
    { name: 'Kit Homes Australia', url: 'https://www.kit-homes.com.au/', cat: 'wp', tags: ['Elementor'], desc: 'Prefab home-building company site built in Elementor with a gallery-driven layout.' },
    { name: 'Explore Imagineland', url: 'https://exploreimagineland.com/', cat: 'wp', tags: ['Custom Template'], desc: 'Entertainment/attraction site built on a custom WordPress page template for unique layout needs.' },
    { name: 'Zeffy', url: 'https://www.zeffy.com/', cat: 'ss', tags: ['Webflow'], desc: 'Nonprofit fundraising platform marketing site built on Webflow with donation-focused CTAs.' },
    { name: 'Hire Odesa', url: 'https://hireodesa.com/', cat: 'wp', tags: ['Elementor'], desc: 'Recruitment/outsourcing agency site built in Elementor with a services-and-talent showcase.' },
    { name: 'The Kev James', url: 'https://thekevjames.com/', cat: 'wp', tags: ['Elementor'], desc: 'Personal brand/portfolio site built in Elementor with a clean, content-first structure.' },
    { name: 'Xinthesys (Dev)', url: 'https://dev-website.xinthesys.com/', cat: 'cro', tags: ['Dev Build'], desc: 'Development-stage build for a technology brand, staged for QA and pre-launch review.' }
  ];

  const grid = document.getElementById('projectGrid');
  const filterRow = document.getElementById('filterRow');

  function initials(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  // Category accent used as a placeholder color behind the live screenshot
  // while it loads (and as a fallback if the screenshot fails to load).
  const CAT_GRADIENT = {
    cro: 'linear-gradient(135deg, #3D8BFF, #1a3a7a)',
    wp:  'linear-gradient(135deg, #FF9142, #7a3a1a)',
    ss:  'linear-gradient(135deg, #34D399, #135c3f)'
  };

  // Live homepage screenshot of the project's URL, via WordPress's free
  // mshots screenshot service (no API key required).
  function shotUrl(url) {
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=640&h=400`;
  }

  function renderProjects(list) {
    grid.innerHTML = list.map(p => `
      <article class="project-card" data-cat="${p.cat}">
        <a href="${p.url}" target="_blank" rel="noopener" class="project-thumb" style="background:${CAT_GRADIENT[p.cat]}">
          <img class="project-thumb-img" src="${shotUrl(p.url)}" alt="${p.name} homepage screenshot" loading="lazy" width="640" height="400" onerror="this.style.display='none'">
          <span class="project-thumb-chrome"><i></i><i></i><i></i></span>
        </a>
        <div class="project-top">
          <div class="project-avatar">${initials(p.name)}</div>
          <div>
            <div class="project-name">${p.name}</div>
            <div class="project-cat">${p.cat === 'cro' ? 'CRO & SaaS' : p.cat === 'wp' ? 'WordPress & Builders' : 'Squarespace & Webflow'}</div>
          </div>
        </div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <a href="${p.url}" target="_blank" rel="noopener" class="project-link">Visit live site →</a>
      </article>
    `).join('');
    observeReveals();
    // Slide the newly revealed cards down into place
    grid.querySelectorAll('.project-card').forEach((card, i) => {
      card.classList.add('slide-in');
      card.style.animationDelay = `${Math.min(i, 8) * 55}ms`;
    });
  }

  const PREVIEW_COUNT = 3;
  let currentList = PROJECTS;
  let expanded = false;
  const moreBtn = document.getElementById('projectMoreBtn');

  function refreshProjectView() {
    const toShow = expanded ? currentList : currentList.slice(0, PREVIEW_COUNT);
    renderProjects(toShow);
    if (moreBtn) {
      if (currentList.length <= PREVIEW_COUNT) {
        moreBtn.style.display = 'none';
      } else {
        moreBtn.style.display = '';
        moreBtn.textContent = expanded
          ? 'Show fewer projects ↑'
          : `Show all ${currentList.length} projects ↓`;
      }
    }
  }

  refreshProjectView();

  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      expanded = !expanded;
      refreshProjectView();
      if (!expanded) {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (filterRow) {
    filterRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      currentList = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === filter);
      expanded = false;
      refreshProjectView();
    });
  }

});
