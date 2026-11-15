/**
 * SOUGHT CONSULT - Official Website Interactive Scripts
 * Ghanaian Construction & Property Solutions
 * Preserves all original interactive behaviors, animations, and modals.
 * Handles Direct WhatsApp Form Submissions (Professional Dynamic Formatting),
 * FAQ Accordions, Mobile Navigation, and Consultation Modal.
 */

function initWebsiteScripts() {
  if (window.__soughtConsultInitialized) return;
  window.__soughtConsultInitialized = true;

  // -------------------------------------------------------------------------
  // 0. Hero Service Showcase Carousel (Continuous 10s Auto-Slide)
  // -------------------------------------------------------------------------
  const heroSection = document.getElementById('hero');
  const heroSlides = Array.from(document.querySelectorAll('#heroSlides .hero-slide'));
  const heroDots = Array.from(document.querySelectorAll('#heroDots .hero-dot'));
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');

  if (heroSection && heroSlides.length > 1) {
    const SLIDE_INTERVAL_MS = 10000;
    const TRANSITION_DURATION_MS = 950;
    let currentIndex = 0;
    let autoSlideIntervalId = null;
    let exitCleanupTimerId = null;

    const setSlideTabbable = (slide, enabled) => {
      slide.querySelectorAll('a, button').forEach((el) => {
        if (enabled) {
          el.removeAttribute('tabindex');
        } else {
          el.setAttribute('tabindex', '-1');
        }
      });
    };

    const updateIndicators = (activeIdx) => {
      heroDots.forEach((dot, idx) => {
        const active = idx === activeIdx;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    const stopAutoSlide = () => {
      if (autoSlideIntervalId !== null) {
        window.clearInterval(autoSlideIntervalId);
        autoSlideIntervalId = null;
      }
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideIntervalId = window.setInterval(() => {
        goToSlide(currentIndex + 1, false);
      }, SLIDE_INTERVAL_MS);
    };

    const goToSlide = (targetIndex, resetTimer = true) => {
      const total = heroSlides.length;
      const nextIndex = ((targetIndex % total) + total) % total;

      if (nextIndex === currentIndex) {
        if (resetTimer) startAutoSlide();
        return;
      }

      const prevSlide = heroSlides[currentIndex];
      const nextSlide = heroSlides[nextIndex];

      if (exitCleanupTimerId !== null) {
        window.clearTimeout(exitCleanupTimerId);
        exitCleanupTimerId = null;
      }

      heroSlides.forEach((slide, idx) => {
        if (idx !== currentIndex && idx !== nextIndex) {
          slide.classList.remove('is-active', 'is-exiting', 'animate-in');
          slide.setAttribute('aria-hidden', 'true');
          setSlideTabbable(slide, false);
        }
      });

      // Transition out previous slide
      prevSlide.classList.remove('is-active', 'animate-in');
      prevSlide.classList.add('is-exiting');
      prevSlide.setAttribute('aria-hidden', 'true');
      setSlideTabbable(prevSlide, false);

      // Reset and replay entrance animations on next slide
      nextSlide.classList.remove('is-exiting', 'is-active', 'animate-in');
      void nextSlide.offsetWidth;
      nextSlide.classList.add('is-active', 'animate-in');
      nextSlide.setAttribute('aria-hidden', 'false');
      setSlideTabbable(nextSlide, true);

      currentIndex = nextIndex;
      updateIndicators(currentIndex);

      exitCleanupTimerId = window.setTimeout(() => {
        prevSlide.classList.remove('is-exiting');
        exitCleanupTimerId = null;
      }, TRANSITION_DURATION_MS);

      if (resetTimer) {
        startAutoSlide();
      }
    };

    // Initialize slides and start continuous 10-second automatic transitions
    heroSlides.forEach((slide, idx) => {
      const isInitial = idx === 0;
      slide.classList.toggle('is-active', isInitial);
      slide.classList.toggle('animate-in', isInitial);
      slide.classList.remove('is-exiting');
      slide.setAttribute('aria-hidden', isInitial ? 'false' : 'true');
      setSlideTabbable(slide, isInitial);
    });
    updateIndicators(0);
    startAutoSlide();

    // Navigation Arrow Controls (reset interval so user gets full 10s on chosen slide)
    heroPrevBtn?.addEventListener('click', () => {
      goToSlide(currentIndex - 1, true);
    });

    heroNextBtn?.addEventListener('click', () => {
      goToSlide(currentIndex + 1, true);
    });

    // Indicator Dot Controls
    heroDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.getAttribute('data-slide-to'));
        if (!Number.isNaN(idx)) {
          goToSlide(idx, true);
        }
      });
    });

    // Keyboard navigation (Left/Right arrows while interacting with carousel)
    heroSection.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentIndex - 1, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentIndex + 1, true);
      }
    });

    // Touch swipe support for mobile/tablet devices
    let touchStartX = 0;
    let touchStartY = 0;

    heroSection.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      if (e.changedTouches.length !== 1) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (deltaX < 0) {
          goToSlide(currentIndex + 1, true);
        } else {
          goToSlide(currentIndex - 1, true);
        }
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link:not(.has-sub)');

  function openMobileNav() {
    mobileNavDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNavDrawer?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openMobileNav);
  mobileNavClose?.addEventListener('click', closeMobileNav);

  mobileNavDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileNavDrawer) {
      closeMobileNav();
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Mobile Accordions
  const mobileAccordionTriggers = document.querySelectorAll('.mobile-nav-link.has-sub');
  mobileAccordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const subnav = trigger.nextElementSibling;
      const chevron = trigger.querySelector('.chevron-icon');
      if (subnav) {
        subnav.classList.toggle('open');
        if (chevron) {
          chevron.style.transform = subnav.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 2. Animated Counter for "100% Quality & Reliable Execution"
  // -------------------------------------------------------------------------
  const counterElement = document.getElementById('projectCounter');
  let hasAnimatedCounter = false;

  function animateCounter(el, target, duration = 1800) {
    let startTimestamp = null;
    const startValue = 0;
    
    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * (target - startValue) + startValue);
      el.textContent = currentValue.toLocaleString('en-US');
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-US');
      }
    }
    
    window.requestAnimationFrame(step);
  }

  if (counterElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedCounter) {
          hasAnimatedCounter = true;
          animateCounter(counterElement, 100, 1600);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counterElement);
  }

  // -------------------------------------------------------------------------
  // 3. Quick WhatsApp Enquiry Modal
  // -------------------------------------------------------------------------
  function ensureQuickQuoteModal() {
    let modal = document.getElementById('quickQuoteModal');
    if (modal) return modal;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="modal-backdrop" id="quickQuoteModal" aria-hidden="true">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="quickQuoteTitle">
          <div class="modal-header">
            <div class="modal-header-text">
              <span class="modal-kicker">Direct WhatsApp Enquiry</span>
              <h3 class="modal-title" id="quickQuoteTitle">Get in Touch with Sought Consult</h3>
              <p class="modal-subtitle">Send us a quick message directly on WhatsApp — tell us what you need in your own words.</p>
            </div>
            <button class="modal-close-btn" id="quickQuoteClose" aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" x2="6" y1="6" y2="18"></line>
                <line x1="6" x2="18" y1="6" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form class="contact-form" id="quickQuoteForm">
              <div class="form-group">
                <label class="form-label" for="qqFullName">Full Name *</label>
                <input type="text" id="qqFullName" name="fullName" class="form-input" placeholder="e.g. Kwame Mensah" required />
              </div>
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label" for="qqPhoneNumber">Phone / WhatsApp Number *</label>
                  <input type="tel" id="qqPhoneNumber" name="phoneNumber" class="form-input" placeholder="e.g. 0558231236" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="qqProjectLocation">Location (Optional)</label>
                  <input type="text" id="qqProjectLocation" name="projectLocation" class="form-input" placeholder="e.g. Teshei, Accra, Tema" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="qqEmailAddress">Email Address (Optional)</label>
                <input type="email" id="qqEmailAddress" name="emailAddress" class="form-input" placeholder="Optional email" />
              </div>
              <div class="form-group">
                <label class="form-label" for="qqProjectMessage">How Can We Help? *</label>
                <textarea id="qqProjectMessage" name="projectMessage" class="form-textarea" rows="3" placeholder="Briefly describe your project, land enquiry, construction needs, or aggregate order..." required></textarea>
              </div>
              <div class="form-submit-row">
                <button type="submit" class="btn-submit-whatsapp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                  </svg>
                  <span>Send Enquiry via WhatsApp</span>
                </button>
              </div>
              <div class="modal-quick-footer">
                <span>Prefer a direct call?</span>
                <a href="tel:0558231236">0558231236</a>
                <span>• Teshei, Ghana</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    modal = wrapper.firstElementChild;
    document.body.appendChild(modal);
    return modal;
  }

  const quickQuoteModal = ensureQuickQuoteModal();
  const quickQuoteClose = document.getElementById('quickQuoteClose');
  const appointmentBtns = document.querySelectorAll('[data-action="appointment"]');

  function openQuickQuoteModal() {
    closeMobileNav();
    if (quickQuoteModal) {
      quickQuoteModal.classList.add('active');
      quickQuoteModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const firstInput = quickQuoteModal.querySelector('[name="fullName"]');
      setTimeout(() => firstInput?.focus(), 80);
    }
  }

  function closeQuickQuoteModal() {
    if (quickQuoteModal) {
      quickQuoteModal.classList.remove('active');
      quickQuoteModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  appointmentBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuickQuoteModal();
    });
  });

  quickQuoteClose?.addEventListener('click', closeQuickQuoteModal);
  quickQuoteModal?.addEventListener('click', (e) => {
    if (e.target === quickQuoteModal) closeQuickQuoteModal();
  });

  // -------------------------------------------------------------------------
  // 4. Toast Notification
  // -------------------------------------------------------------------------
  function showToast(msg) {
    let toastNotice = document.getElementById('toastNotice');
    let toastMessage = document.getElementById('toastMessage');

    if (!toastNotice) {
      toastNotice = document.createElement('div');
      toastNotice.className = 'toast-notice';
      toastNotice.id = 'toastNotice';
      toastNotice.setAttribute('role', 'alert');
      toastNotice.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span id="toastMessage"></span>
      `;
      document.body.appendChild(toastNotice);
      toastMessage = document.getElementById('toastMessage');
    }

    if (toastMessage) {
      toastMessage.textContent = msg;
      toastNotice.classList.add('show');
      clearTimeout(window.__toastTimeout);
      window.__toastTimeout = setTimeout(() => {
        toastNotice.classList.remove('show');
      }, 4200);
    }
  }

  // -------------------------------------------------------------------------
  // 5. WhatsApp-Only Form Submission & Professional Message Formatting
  // -------------------------------------------------------------------------
  // Designated Business WhatsApp Number for Sought Consult:
  const WHATSAPP_PHONE_NUMBER = '233268339409'; // Ghana +233 268339409 (0268339409)

  function formatFormToWhatsApp(form) {
    const isModal = form.id === 'quickQuoteForm';
    const heading = isModal ? 'NEW QUICK ENQUIRY' : 'NEW WEBSITE ENQUIRY';
    const sourceName = isModal ? 'Website Quick Enquiry Modal' : 'Website Contact Form';

    const name = form.querySelector('[name="fullName"]')?.value?.trim() || '';
    const phone = form.querySelector('[name="phoneNumber"]')?.value?.trim() || '';
    const email = form.querySelector('[name="emailAddress"]')?.value?.trim() || '';
    const service = form.querySelector('[name="serviceRequired"]')?.value?.trim() || '';
    const location = form.querySelector('[name="projectLocation"]')?.value?.trim() || '';
    const message = form.querySelector('[name="projectMessage"]')?.value?.trim() || '';

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const divider = '━━━━━━━━━━━━━━━━━━';

    const lines = [];
    lines.push(heading);
    lines.push(divider);
    lines.push('CUSTOMER INFORMATION');
    lines.push(`Full Name: ${name}`);
    lines.push(`Phone Number: ${phone}`);
    if (email && email.toLowerCase() !== 'not provided') {
      lines.push(`Email Address: ${email}`);
    }
    lines.push(divider);
    lines.push('ENQUIRY DETAILS');
    if (service) {
      lines.push(`Service: ${service}`);
    }
    if (location) {
      lines.push(`Location: ${location}`);
    }
    lines.push('Message:');
    lines.push(message);
    lines.push(divider);
    lines.push('SUBMISSION DETAILS');
    lines.push(`Source: ${sourceName}`);
    lines.push(`Date: ${dateStr}`);
    lines.push(`Time: ${timeStr}`);
    lines.push(divider);
    lines.push('Please review this enquiry and follow up with the customer.');
    lines.push('Thank you.');

    return lines.join('\n');
  }

  function validateForm(form) {
    const nameInput = form.querySelector('[name="fullName"]');
    const phoneInput = form.querySelector('[name="phoneNumber"]');
    const locationInput = form.querySelector('[name="projectLocation"]');
    const messageInput = form.querySelector('[name="projectMessage"]');

    const name = nameInput?.value?.trim();
    const phone = phoneInput?.value?.trim();
    const location = locationInput?.value?.trim();
    const message = messageInput?.value?.trim();

    if (!name) {
      showToast('Please enter your full name.');
      nameInput?.focus();
      return false;
    }
    if (!phone) {
      showToast('Please enter your phone number.');
      phoneInput?.focus();
      return false;
    }
    if (locationInput && locationInput.hasAttribute('required') && !location) {
      showToast('Please enter your project location.');
      locationInput.focus();
      return false;
    }
    if (!message) {
      showToast('Please enter your message.');
      messageInput?.focus();
      return false;
    }

    return true;
  }

  function submitFormToWhatsApp(form) {
    if (!validateForm(form)) return false;

    const messageText = formatFormToWhatsApp(form);
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedText}`;

    showToast('Opening WhatsApp to send your enquiry...');

    try {
      const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      window.location.href = whatsappUrl;
    }

    if (form.id === 'quickQuoteForm') {
      form.reset();
      closeQuickQuoteModal();
    }
    return true;
  }

  // Pre-fill Service from URL Query Parameter if present on Contact page
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      document.querySelectorAll('[name="serviceRequired"]').forEach((select) => {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.toLowerCase() === serviceParam.toLowerCase()) {
            select.selectedIndex = i;
            break;
          }
        }
      });
    }
  } catch (err) {
    console.warn('Could not parse service parameter:', err);
  }

  // Wire all forms across the website (excluding the dedicated building materials request form)
  document.querySelectorAll('.contact-form:not(#materialRequestForm), #quickQuoteForm, #mainContactForm').forEach((form) => {
    if (form.id === 'materialRequestForm') return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitFormToWhatsApp(form);
    });

    const submitBtn = form.querySelector('.btn-submit-whatsapp, .btn-send-whatsapp, button[type="submit"]');
    submitBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      submitFormToWhatsApp(form);
    });
  });

  // -------------------------------------------------------------------------
  // 6. FAQ Accordion Functionality
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question-btn');
    button?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close other items
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. Video Tour / Presentation Modal
  // -------------------------------------------------------------------------
  const videoModal = document.getElementById('videoModal');
  const videoClose = document.getElementById('videoClose');
  const watchVideoBtn = document.getElementById('watchVideoBtn');

  function openVideoModal() {
    videoModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    videoModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  watchVideoBtn?.addEventListener('click', openVideoModal);
  videoClose?.addEventListener('click', closeVideoModal);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  // -------------------------------------------------------------------------
  // Building Materials Request Modal & Dynamic Pricing Logic
  // -------------------------------------------------------------------------
  const materialModal = document.getElementById('materialModal');
  const materialModalClose = document.getElementById('materialModalClose');
  const materialBtns = document.querySelectorAll('[data-action="material-modal"]');
  const materialRequestForm = document.getElementById('materialRequestForm');

  const modalTruckSize = document.getElementById('modalTruckSize');
  const modalBuildingMaterial = document.getElementById('modalBuildingMaterial');
  const modalMaterialSubcategory = document.getElementById('modalMaterialSubcategory');
  const modalRequestType = document.getElementById('modalRequestType');
  const scheduledFields = document.getElementById('scheduledFields');
  const priceBannerText = document.getElementById('priceBannerText');

  const pricingData = {
    "16 Cubic": {
      "Quarry Stones / Chippings": {
        "3/4 Inch (Three-Quarter Inch)": 4300,
        "1 Inch (One Inch)": 4300,
        "3/8 Inch (Three-Eighth Inch)": 4800,
        "5/8 Inch (Five-Eighth Inch)": 4800
      },
      "Quarry Dust": {
        "Quarry Dust": 5500
      },
      "Riversand": {
        "Smooth Sand": 4000,
        "Medium Sand": 4000,
        "Rough Sand": 4000
      },
      "Filling Sand": {
        "Grade 1": 2500,
        "Laterite": 2200
      },
      "Sand / Plastering Sand": {
        "Smooth": 3200,
        "Medium": 3200,
        "Rough": 3500
      }
    },
    "18 Cubic": {
      "Quarry Stones / Chippings": {
        "3/4 Inch (Three-Quarter Inch)": 4700,
        "1 Inch (One Inch)": 4700,
        "3/8 Inch (Three-Eighth Inch)": 5000,
        "5/8 Inch (Five-Eighth Inch)": 5000
      },
      "Quarry Dust": {
        "Quarry Dust": 5700
      },
      "Riversand": {
        "Smooth Sand": 4000,
        "Medium Sand": 4000,
        "Rough Sand": 4000
      },
      "Filling Sand": {
        "Grade 1": 2500,
        "Laterite": 2200
      },
      "Sand / Plastering Sand": {
        "Smooth": 3200,
        "Medium": 3200,
        "Rough": 3500
      }
    },
    "20 Cubic": {
      "Quarry Stones / Chippings": {
        "3/4 Inch (Three-Quarter Inch)": 5000,
        "1 Inch (One Inch)": 5000,
        "3/8 Inch (Three-Eighth Inch)": 5000,
        "5/8 Inch (Five-Eighth Inch)": 5000
      },
      "Quarry Dust": {
        "Quarry Dust": 6200
      },
      "Riversand": {
        "Smooth Sand": 4200,
        "Medium Sand": 4200,
        "Rough Sand": 4200
      },
      "Filling Sand": {
        "Grade 1": 2500,
        "Laterite": 2200
      },
      "Sand / Plastering Sand": {
        "Smooth": 3200,
        "Medium": 3200,
        "Rough": 3500
      }
    }
  };

  const subcategoriesMap = {
    "Quarry Stones / Chippings": [
      "3/4 Inch (Three-Quarter Inch)",
      "1 Inch (One Inch)",
      "3/8 Inch (Three-Eighth Inch)",
      "5/8 Inch (Five-Eighth Inch)"
    ],
    "Quarry Dust": [
      "Quarry Dust"
    ],
    "Riversand": [
      "Smooth Sand",
      "Medium Sand",
      "Rough Sand"
    ],
    "Filling Sand": [
      "Grade 1",
      "Laterite"
    ],
    "Sand / Plastering Sand": [
      "Smooth",
      "Medium",
      "Rough"
    ]
  };

  let currentSelectedPrice = null;

  function updateSubcategories(selectedMaterial, preselectSub = '') {
    if (!modalMaterialSubcategory) return;
    modalMaterialSubcategory.innerHTML = '<option value="">-- Select Material Type --</option>';
    const subs = subcategoriesMap[selectedMaterial] || [];
    subs.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      if (sub === preselectSub) {
        opt.selected = true;
      }
      modalMaterialSubcategory.appendChild(opt);
    });
    updatePriceDisplay();
  }

  function updatePriceDisplay() {
    if (!priceBannerText) return;
    const truck = modalTruckSize?.value || '16 Cubic';
    const mat = modalBuildingMaterial?.value;
    const sub = modalMaterialSubcategory?.value;

    if (mat && sub && pricingData[truck]?.[mat]?.[sub] !== undefined) {
      const price = pricingData[truck][mat][sub];
      currentSelectedPrice = price.toLocaleString('en-US');
      priceBannerText.textContent = `Estimated Material Price: GH₵ ${currentSelectedPrice}`;
    } else {
      currentSelectedPrice = null;
      priceBannerText.textContent = 'Select building material and type to view price.';
    }
  }

  materialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalTruckSize) {
        modalTruckSize.value = '';
      }
      if (modalBuildingMaterial) {
        modalBuildingMaterial.value = '';
      }
      updateSubcategories('');
      if (modalRequestType) {
        modalRequestType.value = '';
      }
      if (scheduledFields) {
        scheduledFields.style.display = 'none';
        const dateInput = scheduledFields.querySelector('[name="scheduledDate"]');
        const timeInput = scheduledFields.querySelector('[name="scheduledTime"]');
        if (dateInput) { dateInput.required = false; dateInput.value = ''; }
        if (timeInput) { timeInput.required = false; timeInput.value = ''; }
      }
      updatePriceDisplay();
      if (materialModal) {
        materialModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeMaterialModal() {
    if (materialModal) {
      materialModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  materialModalClose?.addEventListener('click', closeMaterialModal);
  materialModal?.addEventListener('click', (e) => {
    if (e.target === materialModal) closeMaterialModal();
  });

  modalBuildingMaterial?.addEventListener('change', (e) => {
    updateSubcategories(e.target.value);
  });

  modalTruckSize?.addEventListener('change', updatePriceDisplay);
  modalMaterialSubcategory?.addEventListener('change', updatePriceDisplay);

  modalRequestType?.addEventListener('change', (e) => {
    if (e.target.value === 'Scheduled Request') {
      if (scheduledFields) scheduledFields.style.display = 'block';
    } else {
      if (scheduledFields) scheduledFields.style.display = 'none';
      const dateInput = scheduledFields?.querySelector('[name="scheduledDate"]');
      const timeInput = scheduledFields?.querySelector('[name="scheduledTime"]');
      if (dateInput) dateInput.value = '';
      if (timeInput) timeInput.value = '';
    }
  });

  // Initialize subcategories as blank on load
  if (modalBuildingMaterial) {
    updateSubcategories(modalBuildingMaterial.value);
  }

  // Material Request WhatsApp Submission
  function submitMaterialToWhatsApp(form) {
    const name = form.querySelector('[name="fullName"]')?.value?.trim();
    const phone = form.querySelector('[name="phoneNumber"]')?.value?.trim();
    const whatsapp = form.querySelector('[name="whatsappNumber"]')?.value?.trim();
    const truck = modalTruckSize?.value;
    const material = modalBuildingMaterial?.value;
    const subcategory = modalMaterialSubcategory?.value;
    const destination = form.querySelector('[name="projectLocation"]')?.value?.trim();
    const requestType = modalRequestType?.value;
    const scheduledDate = form.querySelector('[name="scheduledDate"]')?.value?.trim();
    const scheduledTime = form.querySelector('[name="scheduledTime"]')?.value?.trim();
    const instructions = form.querySelector('[name="additionalInstructions"]')?.value?.trim();

    if (!name) {
      showToast('Please enter your name.');
      form.querySelector('[name="fullName"]')?.focus();
      return;
    }
    if (!phone) {
      showToast('Please enter your phone number.');
      form.querySelector('[name="phoneNumber"]')?.focus();
      return;
    }
    if (!material) {
      showToast('Please select a building material.');
      modalBuildingMaterial?.focus();
      return;
    }
    if (!subcategory) {
      showToast('Please select a material subcategory/type.');
      modalMaterialSubcategory?.focus();
      return;
    }

    const effectiveTruck = truck || '16 Cubic';
    const calculatedPrice = pricingData[effectiveTruck]?.[material]?.[subcategory];
    const displayPrice = calculatedPrice !== undefined
      ? calculatedPrice.toLocaleString('en-US')
      : currentSelectedPrice;

    const WHATSAPP_MATERIAL_NUMBER = WHATSAPP_PHONE_NUMBER; // Ghana +233 268339409 (0268339409)

    const lines = [];
    lines.push('BUILDING MATERIAL REQUEST');
    lines.push('');
    lines.push('Hello, I would like to make a building materials request.');
    lines.push('');
    lines.push('CUSTOMER INFORMATION');
    lines.push(`Name: ${name}`);
    lines.push(`Phone Number: ${phone}`);
    if (whatsapp) {
      lines.push(`WhatsApp Number: ${whatsapp}`);
    }
    lines.push('');
    lines.push('ORDER DETAILS');
    if (truck) lines.push(`Tipper Truck Bucket Size: ${truck}`);
    lines.push(`Building Material: ${material}`);
    lines.push(`Material Type: ${subcategory}`);
    if (displayPrice) lines.push(`Estimated Material Price: GH₵ ${displayPrice}`);
    if (destination || requestType || scheduledDate || scheduledTime) {
      lines.push('');
      lines.push('DELIVERY INFORMATION');
      if (destination) lines.push(`Destination: ${destination}`);
      if (requestType) lines.push(`Request Type: ${requestType}`);
      if (requestType === 'Scheduled Request') {
        if (scheduledDate) lines.push(`Scheduled Delivery Date: ${scheduledDate}`);
        if (scheduledTime) lines.push(`Preferred Delivery Time: ${scheduledTime}`);
      }
    }
    if (instructions) {
      lines.push('');
      lines.push(`Additional Instructions: ${instructions}`);
    }
    lines.push('');
    lines.push('Please confirm availability and provide any further information regarding this request.');
    lines.push('');
    lines.push('Thank you.');

    const messageText = lines.join('\n');
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_MATERIAL_NUMBER}?text=${encodedText}`;

    showToast('Opening WhatsApp to send your building material request...');

    try {
      const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      window.location.href = whatsappUrl;
    }

    closeMaterialModal();
  }

  if (materialRequestForm) {
    materialRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitMaterialToWhatsApp(materialRequestForm);
    });

    const materialSubmitBtn = materialRequestForm.querySelector('.btn-submit-whatsapp, .btn-send-whatsapp, button[type="submit"]');
    materialSubmitBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      submitMaterialToWhatsApp(materialRequestForm);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Global Escape Key Handler
  // -------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickQuoteModal();
      closeVideoModal();
      closeMobileNav();
      closeMaterialModal();
    }
  });

  console.log("Sought Consult website scripts initialized successfully.");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWebsiteScripts);
} else {
  initWebsiteScripts();
}
