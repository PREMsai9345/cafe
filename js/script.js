/* ==========================================================================
   BREW & BLOOM — script.js
   Vanilla JS only. No frameworks, no build step.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Page loader                                                        */
  /* ------------------------------------------------------------------ */
  window.addEventListener('load', function () {
    var loader = document.querySelector('.page-loader');
    if (loader) {
      setTimeout(function () { loader.classList.add('is-hidden'); }, 350);
    }
  });

  /* ------------------------------------------------------------------ */
  /*  Scroll progress bar                                                 */
  /* ------------------------------------------------------------------ */
  var progressBar = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ------------------------------------------------------------------ */
  /*  Navbar: scrolled state, mobile menu, active link                   */
  /* ------------------------------------------------------------------ */
  var navbar = document.querySelector('.navbar');
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  var navOverlay = document.querySelector('.nav-overlay');

  function setNavbarState() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', setNavbarState, { passive: true });
  setNavbarState();

  function closeMobileNav() {
    if (navLinks) navLinks.classList.remove('is-open');
    if (navOverlay) navOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function toggleMobileNav() {
    if (!navLinks) return;
    var open = navLinks.classList.toggle('is-open');
    if (navOverlay) navOverlay.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
  }

  // Active link highlighting based on section in view (index page only)
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href*="#"]');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            var hrefId = a.getAttribute('href').split('#')[1];
            a.classList.toggle('active', hrefId === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ------------------------------------------------------------------ */
  /*  Scroll reveal                                                       */
  /* ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------ */
  /*  Back to top                                                         */
  /* ------------------------------------------------------------------ */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Toast notifications                                                 */
  /* ------------------------------------------------------------------ */
  var toastStack = document.querySelector('.toast-stack');
  function showToast(message, icon) {
    if (!toastStack) return;
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<i class="fa-solid ' + (icon || 'fa-circle-check') + '"></i><span>' + message + '</span>';
    toastStack.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });
    setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.remove(); }, 400);
    }, 2600);
  }

  /* ------------------------------------------------------------------ */
  /*  Shopping cart (localStorage-backed)                                 */
  /* ------------------------------------------------------------------ */
  var CART_KEY = 'brewbloom_cart';

  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function writeCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
  }

  var cartDrawer = document.querySelector('.cart-drawer');
  var cartOverlay = document.querySelector('.cart-overlay');
  var cartItemsEl = document.querySelector('.cart-items');
  var cartCountEls = document.querySelectorAll('.cart-count');
  var cartTotalEl = document.querySelector('.cart-total-value');
  var cartToggles = document.querySelectorAll('.cart-toggle');
  var cartClose = document.querySelector('.cart-close');

  function money(n) { return '₹' + n.toLocaleString('en-IN'); }

  function renderCart() {
    var cart = readCart();
    var count = cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
    cartCountEls.forEach(function (el) { el.textContent = count; });

    if (!cartItemsEl) return;

    if (!cart.length) {
      cartItemsEl.innerHTML = '<div class="cart-empty"><i class="fa-solid fa-mug-hot"></i><p>Your cart is empty.<br>Add something delicious.</p></div>';
    } else {
      cartItemsEl.innerHTML = cart.map(function (item) {
        return (
          '<div class="cart-item" data-id="' + item.id + '">' +
            '<img src="' + item.img + '" alt="' + item.name + '">' +
            '<div class="cart-item-info">' +
              '<h4>' + item.name + '</h4>' +
              '<div class="cart-item-price">' + money(item.price * item.qty) + '</div>' +
              '<div class="cart-item-controls">' +
                '<button class="qty-btn" data-action="decrease" aria-label="Decrease quantity">−</button>' +
                '<span>' + item.qty + '</span>' +
                '<button class="qty-btn" data-action="increase" aria-label="Increase quantity">+</button>' +
                '<button class="cart-item-remove" data-action="remove" aria-label="Remove item"><i class="fa-solid fa-trash"></i></button>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    var total = cart.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
    if (cartTotalEl) cartTotalEl.textContent = money(total);
  }

  function addToCart(item) {
    var cart = readCart();
    var existing = cart.find(function (i) { return i.id === item.id; });
    if (existing) existing.qty += 1;
    else cart.push(Object.assign({}, item, { qty: 1 }));
    writeCart(cart);
    renderCart();
  }

  function changeQty(id, delta) {
    var cart = readCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    writeCart(cart);
    renderCart();
  }

  function removeFromCart(id) {
    var cart = readCart().filter(function (i) { return i.id !== id; });
    writeCart(cart);
    renderCart();
  }

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('is-open');
    if (cartOverlay) cartOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('is-open');
    if (cartOverlay) cartOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  cartToggles.forEach(function (btn) { btn.addEventListener('click', openCart); });
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;
      var itemEl = e.target.closest('.cart-item');
      var id = itemEl.getAttribute('data-id');
      var action = btn.getAttribute('data-action');
      if (action === 'increase') changeQty(id, 1);
      if (action === 'decrease') changeQty(id, -1);
      if (action === 'remove') removeFromCart(id);
    });
  }

  // Add-to-cart buttons on menu cards
  document.querySelectorAll('.menu-card-add').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.menu-card');
      var item = {
        id: card.getAttribute('data-id'),
        name: card.getAttribute('data-name'),
        price: parseFloat(card.getAttribute('data-price')),
        img: card.getAttribute('data-img')
      };
      addToCart(item);
      showToast(item.name + ' added to your cart', 'fa-mug-hot');
      btn.classList.add('is-added');
      var original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      setTimeout(function () {
        btn.classList.remove('is-added');
        btn.innerHTML = original;
      }, 1400);
    });
  });

  renderCart();

  /* ------------------------------------------------------------------ */
  /*  Menu filters                                                        */
  /* ------------------------------------------------------------------ */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var menuCards = document.querySelectorAll('.menu-card');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      menuCards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Gallery lightbox                                                    */
  /* ------------------------------------------------------------------ */
  var galleryItems = document.querySelectorAll('.gallery-item img');
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = document.querySelector('.lightbox img');
  var lightboxClose = document.querySelector('.lightbox-close');
  var lightboxPrev = document.querySelector('.lightbox-nav.prev');
  var lightboxNext = document.querySelector('.lightbox-nav.next');
  var currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    currentIndex = index;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function showRelative(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
  }
  galleryItems.forEach(function (img, i) {
    img.closest('.gallery-item').addEventListener('click', function () { openLightbox(i); });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { showRelative(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { showRelative(1); });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showRelative(1);
    if (e.key === 'ArrowLeft') showRelative(-1);
  });

  /* ------------------------------------------------------------------ */
  /*  Testimonial slider                                                  */
  /* ------------------------------------------------------------------ */
  var slides = document.querySelectorAll('.testimonial-slide');
  var dotsWrap = document.querySelector('.testimonial-dots');
  var slideIndex = 0;
  var slideTimer;

  function showSlide(i) {
    slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach(function (d, idx) {
        d.classList.toggle('is-active', idx === i);
      });
    }
    slideIndex = i;
  }
  function nextSlide() { showSlide((slideIndex + 1) % slides.length); }

  if (slides.length && dotsWrap) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        showSlide(i);
        resetSlideTimer();
      });
      dotsWrap.appendChild(dot);
    });
    showSlide(0);
    function resetSlideTimer() {
      clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, 5500);
    }
    resetSlideTimer();
  }

  /* ------------------------------------------------------------------ */
  /*  Animated stat counters                                              */
  /* ------------------------------------------------------------------ */
  var statEls = document.querySelectorAll('.stat-number');
  function animateCount(el) {
    var target = el.getAttribute('data-target');
    var suffix = el.getAttribute('data-suffix') || '';
    var numeric = parseFloat(target);
    var isDecimal = target.indexOf('.') !== -1;
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = numeric * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && statEls.length) {
    var statObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /*  Contact form validation                                             */
  /* ------------------------------------------------------------------ */
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    var successBox = contactForm.querySelector('.form-success');

    function validateField(field, rule) {
      var wrapper = field.closest('.field');
      var valid = rule(field.value.trim());
      wrapper.classList.toggle('has-error', !valid);
      return valid;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('#name');
      var email = contactForm.querySelector('#email');
      var phone = contactForm.querySelector('#phone');
      var message = contactForm.querySelector('#message');

      var validName = validateField(name, function (v) { return v.length >= 2; });
      var validEmail = validateField(email, function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
      var validPhone = validateField(phone, function (v) { return /^[0-9+\-\s()]{7,15}$/.test(v); });
      var validMessage = validateField(message, function (v) { return v.length >= 10; });

      if (validName && validEmail && validPhone && validMessage) {
        contactForm.querySelectorAll('input, textarea').forEach(function (f) { f.value = ''; });
        if (successBox) successBox.classList.add('is-visible');
        showToast('Message sent — we\'ll reply within a day', 'fa-envelope-circle-check');
        setTimeout(function () {
          if (successBox) successBox.classList.remove('is-visible');
        }, 5000);
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.closest('.field').classList.remove('has-error');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Floating hero coffee beans (generated once, index only)             */
  /* ------------------------------------------------------------------ */
  var beanField = document.querySelector('.hero-beans');
  if (beanField) {
    for (var b = 0; b < 14; b++) {
      var bean = document.createElement('span');
      bean.className = 'bean';
      bean.style.left = Math.random() * 100 + '%';
      bean.style.animationDelay = (Math.random() * 14) + 's';
      bean.style.animationDuration = (11 + Math.random() * 8) + 's';
      bean.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
      beanField.appendChild(bean);
    }
  }

})();
