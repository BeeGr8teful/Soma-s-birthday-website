/* ═══════════════════════════════════════════════════════════
   SOMA'S BIRTHDAY WEBSITE — Interactive JavaScript
   Handles: modal, smooth scroll, guestbook, scroll reveal,
            nav highlighting, and floating star interactions.
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────── SMOOTH SCROLL FOR NAV ─────────────── */
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const headerOffset = 70;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ─────────────── NAV SCROLL STATE ─────────────── */
    const header = document.querySelector('header');

    const updateNavState = () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateNavState, { passive: true });
    updateNavState(); // Initial check


    /* ─────────────── ACTIVE NAV LINK HIGHLIGHTING ─────────────── */
    const sections = document.querySelectorAll('section[id]');

    const highlightActiveNav = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`nav a[href="#${id}"]`);

            if (navLink) {
                if (scrollPos >= top && scrollPos < top + height) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav, { passive: true });
    highlightActiveNav();


    /* ─────────────── WISH MODAL ─────────────── */
    const modal = document.getElementById('wish-modal');
    const modalText = document.getElementById('modal-wish-text');
    const modalClose = modal.querySelector('.modal__close');
    const modalBackdrop = modal.querySelector('.modal__backdrop');
    const wishStars = document.querySelectorAll('.wish-star');

    // Open modal with wish text
    wishStars.forEach(star => {
        star.addEventListener('click', () => {
            const wish = star.getAttribute('data-wish');
            modalText.textContent = wish;
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            modalClose.focus();
        });
    });

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });


    /* ─────────────── FLOATING STAR CLICK INTERACTION ─────────────── */
    const floatingStars = document.querySelectorAll('.floating-star');
    const starWishes = [
        "May every star that shines tonight whisper a birthday blessing just for you. ✨",
        "The universe painted these stars to celebrate the wonder that is you. 🌟",
        "Like these stars, your light reaches far and touches hearts everywhere. 💫"
    ];

    floatingStars.forEach((star, index) => {
        star.style.cursor = 'pointer';
        star.addEventListener('click', () => {
            const wish = starWishes[index % starWishes.length];
            modalText.textContent = wish;
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });


    /* ─────────────── GUESTBOOK FORM ─────────────── */
    const guestForm = document.getElementById('guestbook-form');
    const guestEntries = document.getElementById('guestbook-entries');

    guestForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('guest-name');
        const messageInput = document.getElementById('guest-message');
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) return;

        // Create a new guestbook entry element
        const entry = document.createElement('div');
        entry.className = 'guestbook-entry';

        const now = new Date();
        const timeStr = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        entry.innerHTML = `
            <div class="guestbook-entry__header">
                <span class="guestbook-entry__name">✦ ${escapeHTML(name)}</span>
                <span class="guestbook-entry__time">${timeStr}</span>
            </div>
            <p class="guestbook-entry__message">"${escapeHTML(message)}"</p>
        `;

        // Prepend the new entry (newest first)
        guestEntries.insertBefore(entry, guestEntries.firstChild);

        // Reset form
        guestForm.reset();
        nameInput.focus();
    });

    // Simple HTML escaping to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }


    /* ─────────────── SCROLL REVEAL (Intersection Observer) ─────────────── */
    const revealCards = document.querySelectorAll('.glass-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealCards.forEach(card => {
        revealObserver.observe(card);
    });


    /* ─────────────── SUBTLE PARALLAX FOR FLOATING STARS ─────────────── */
    const parallaxStars = document.querySelectorAll('.floating-star');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        parallaxStars.forEach((star, i) => {
            const speed = (i + 1) * 4;
            star.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

});