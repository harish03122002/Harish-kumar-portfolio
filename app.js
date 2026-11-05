/* ====================================================================
   PORTFOLIO APP.JS — S. Harish Kumar
   ====================================================================
   Sections:
   1. Background Canvas (Particles)
   2. Motion Graphics Canvas (Geometric Shapes)
   3. Magnetic Custom Cursor
   4. Typewriter Role Cycler
   5. Stagger Entrance Animations
   6. Scroll Reveal
   7. Active Navigation Indicator
   8. Mobile Menu
   9. Contact Form (Web3Forms)
   10. Miscellaneous (year, nav scroll)
   ==================================================================== */

/* ====================================================================
   1. ANIMATED BACKGROUND CANVAS — Particles
   ==================================================================== */
(function () {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles, animFrame;

    const COLORS = [
        'rgba(0,212,255,',
        'rgba(123,47,255,',
        'rgba(255,47,255,',
        'rgba(200,220,255,',
    ];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createParticle() {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
            x: randomBetween(0, W),
            y: randomBetween(0, H),
            r: randomBetween(1, 2.8),
            alpha: randomBetween(0.3, 0.85),
            alphaDir: Math.random() < 0.5 ? 1 : -1,
            alphaSpeed: randomBetween(0.002, 0.007),
            vx: randomBetween(-0.25, 0.25),
            vy: randomBetween(-0.25, 0.25),
            color,
        };
    }

    function initParticles() {
        const count = Math.floor((W * H) / 9000);
        particles = Array.from({ length: Math.min(count, 120) }, createParticle);
    }

    function drawParticle(p) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, p.color + p.alpha + ')');
        grad.addColorStop(0.5, p.color + (p.alpha * 0.4) + ')');
        grad.addColorStop(1, p.color + '0)');
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
    }

    function drawConnections() {
        const MAX_DIST = 140;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function updateParticle(p) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir * p.alphaSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.15) p.alphaDir *= -1;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        particles.forEach(p => { updateParticle(p); drawParticle(p); });
        animFrame = requestAnimationFrame(loop);
    }

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return; // skip animations entirely

    resize();
    initParticles();
    loop();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animFrame);
        resize();
        initParticles();
        loop();
    });
}());

/* ====================================================================
   2. MOTION GRAPHICS CANVAS — Geometric Shapes
   ==================================================================== */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mc = document.getElementById('motionCanvas');
    if (!mc) return;
    const mctx = mc.getContext('2d');
    let MW, MH, shapes, mFrame;

    const SHAPE_COLORS = ['rgba(0,212,255,', 'rgba(123,47,255,', 'rgba(255,47,255,', 'rgba(80,180,255,'];
    const SHAPE_TYPES  = ['hexagon', 'triangle', 'ring', 'diamond', 'square'];

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function resizeMC() {
        MW = mc.width  = window.innerWidth;
        MH = mc.height = window.innerHeight;
    }

    function makeShape() {
        return {
            type:     SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
            x: rnd(-120, MW + 120),
            y: rnd(-120, MH + 120),
            size: rnd(28, 140),
            rot:  rnd(0, Math.PI * 2),
            rotSpd: rnd(-0.004, 0.004),
            vx:   rnd(-0.18, 0.18),
            vy:   rnd(-0.18, 0.18),
            alpha: rnd(0.025, 0.085),
            lw:   rnd(0.5, 1.4),
            color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
        };
    }

    function initShapes() {
        const n = Math.min(Math.floor(MW * MH / 48000), 18);
        shapes = Array.from({ length: n }, makeShape);
    }

    function hex(c, r)        { c.beginPath(); for (let i=0;i<6;i++){const a=(Math.PI/3)*i; i===0?c.moveTo(r*Math.cos(a),r*Math.sin(a)):c.lineTo(r*Math.cos(a),r*Math.sin(a));} c.closePath(); }
    function tri(c, r)        { c.beginPath(); for (let i=0;i<3;i++){const a=(Math.PI*2/3)*i-Math.PI/2; i===0?c.moveTo(r*Math.cos(a),r*Math.sin(a)):c.lineTo(r*Math.cos(a),r*Math.sin(a));} c.closePath(); }
    function ring(c, r)       { c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); }
    function diamond(c, r)    { c.beginPath(); c.moveTo(0,-r); c.lineTo(r*0.6,0); c.lineTo(0,r); c.lineTo(-r*0.6,0); c.closePath(); }
    function sq(c, r)         { const h=r*0.72; c.beginPath(); c.rect(-h,-h,h*2,h*2); }

    const DRAW = { hexagon: hex, triangle: tri, ring, diamond, square: sq };

    function drawShape(s) {
        mctx.save();
        mctx.translate(s.x, s.y);
        mctx.rotate(s.rot);
        mctx.strokeStyle = s.color + s.alpha + ')';
        mctx.lineWidth   = s.lw;
        (DRAW[s.type] || ring)(mctx, s.size);
        mctx.stroke();
        mctx.restore();
    }

    function stepShape(s) {
        s.x += s.vx; s.y += s.vy; s.rot += s.rotSpd;
        if (s.x < -200) s.x = MW + 200;
        if (s.x > MW + 200) s.x = -200;
        if (s.y < -200) s.y = MH + 200;
        if (s.y > MH + 200) s.y = -200;
    }

    function shapeLoop() {
        mctx.clearRect(0, 0, MW, MH);
        shapes.forEach(s => { stepShape(s); drawShape(s); });
        mFrame = requestAnimationFrame(shapeLoop);
    }

    resizeMC(); initShapes(); shapeLoop();
    window.addEventListener('resize', () => { cancelAnimationFrame(mFrame); resizeMC(); initShapes(); shapeLoop(); });
}());

/* ====================================================================
   DOM-DEPENDENT FEATURES
   ==================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------
       3. MAGNETIC CUSTOM CURSOR
    ------------------------------------------------------------------ */
    const dot          = document.getElementById('cursorDot');
    const cursorRingEl = document.getElementById('cursorRing');
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (dot && cursorRingEl && isHoverDevice && !reducedMotion) {
        dot.style.display          = 'block';
        cursorRingEl.style.display = 'block';

        let mx = -200, my = -200, rx = -200, ry = -200;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
        });

        (function animRing() {
            rx += (mx - rx) * 0.10;
            ry += (my - ry) * 0.10;
            cursorRingEl.style.left = rx + 'px';
            cursorRingEl.style.top  = ry + 'px';
            requestAnimationFrame(animRing);
        }());

        const interactEls = 'a, button, .project-card, .skill-category, .highlight-item, .resume-item, .btn, .tag';
        document.querySelectorAll(interactEls).forEach(el => {
            el.addEventListener('mouseenter', () => { cursorRingEl.classList.add('cursor-expanded'); dot.classList.add('cursor-hidden'); });
            el.addEventListener('mouseleave', () => { cursorRingEl.classList.remove('cursor-expanded'); dot.classList.remove('cursor-hidden'); });
        });

        document.addEventListener('mouseleave', () => { dot.style.opacity='0'; cursorRingEl.style.opacity='0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity='1'; cursorRingEl.style.opacity='1'; });
        document.addEventListener('mousedown', () => { cursorRingEl.style.transform = 'translate(-50%,-50%) scale(0.75)'; });
        document.addEventListener('mouseup',   () => { cursorRingEl.style.transform = 'translate(-50%,-50%) scale(1)'; });
    }

    /* ------------------------------------------------------------------
       4. TYPEWRITER ROLE CYCLER
    ------------------------------------------------------------------ */
    const typeEl = document.getElementById('heroRoleText');
    if (typeEl && !reducedMotion) {
        const roles = [
            'Java Full Stack Developer',
            'UI / UX Designer',
            'Web Developer',
        ];
        let ri = 0, ci = 0, deleting = false;

        function type() {
            const role = roles[ri];
            typeEl.textContent = deleting ? role.slice(0, ci--) : role.slice(0, ++ci);

            let delay = deleting ? 50 : 90;
            if (!deleting && ci === role.length) { delay = 2000; deleting = true; }
            else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }

            setTimeout(type, delay);
        }
        setTimeout(type, 800);
    } else if (typeEl) {
        typeEl.textContent = 'Java Full Stack Developer';
    }

    /* ------------------------------------------------------------------
       5. STAGGER ENTRANCE FOR GRID CHILDREN
    ------------------------------------------------------------------ */
    const STAGGER_GRIDS = ['.skills-grid', '.projects-grid', '.about-highlights'];

    STAGGER_GRIDS.forEach(sel => {
        const grid = document.querySelector(sel);
        if (!grid) return;

        Array.from(grid.children).forEach(child => child.classList.add('stagger-child'));

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                Array.from(entry.target.children).forEach((child, i) => {
                    const delay = reducedMotion ? 0 : i * 110;
                    setTimeout(() => child.classList.add('stagger-in'), delay);
                });
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.08 });

        obs.observe(grid);
    });

    /* ------------------------------------------------------------------
       6. SCROLL REVEAL
    ------------------------------------------------------------------ */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ------------------------------------------------------------------
       7. ACTIVE NAVIGATION INDICATOR (scroll spy)
    ------------------------------------------------------------------ */
    const sections     = document.querySelectorAll('section[id]');
    const navLinks     = document.querySelectorAll('.nav-links .nav-link');
    const mobileLinks  = document.querySelectorAll('.mobile-dropdown a');
    const navBar       = document.querySelector('.nav-bar');

    function updateActiveNav() {
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            if (window.scrollY >= sectionTop) currentId = section.getAttribute('id');
        });
        [...navLinks, ...mobileLinks].forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) link.classList.add('active');
        });

        // Frosted nav on scroll
        if (navBar) navBar.classList.toggle('scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* ------------------------------------------------------------------
       8. MOBILE MENU
    ------------------------------------------------------------------ */
    const mobileBtn      = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');

    if (mobileBtn && mobileDropdown) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = mobileDropdown.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', isOpen);
            mobileDropdown.setAttribute('aria-hidden', !isOpen);
        });

        mobileDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDropdown.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileDropdown.setAttribute('aria-hidden', 'true');
            });
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (!mobileBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
                mobileDropdown.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileDropdown.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /* ------------------------------------------------------------------
       9. CONTACT FORM — Web3Forms Integration
    ------------------------------------------------------------------ */

    /*
     * =====================================================================
     * WEB3FORMS CONFIGURATION — EDIT THIS OBJECT ONLY
     * =====================================================================
     * Step 1: Go to  https://web3forms.com/
     * Step 2: Enter  harishshankaran2002@gmail.com  and click "Create Access Key"
     * Step 3: Paste the key as the value of  W3F_ACCESS_KEY  below.
     *         Leave it as 'YOUR_ACCESS_KEY_HERE' until you have a real key.
     * =====================================================================
     */
    const W3F_CONFIG = {
        W3F_ACCESS_KEY:   '5db626cc-a76b-417c-813b-6ba43181fb24',   // <-- paste your key here
        W3F_ENDPOINT:     'https://api.web3forms.com/submit',
        FALLBACK_EMAIL:   'harishshankaran2002@gmail.com',
        STATUS_HIDE_MS:   8000,   // ms before the status message auto-hides
    };

    /* Inject the key into the hidden field so it never lives in HTML */
    const w3fKeyInput = document.getElementById('w3fAccessKey');
    if (w3fKeyInput) w3fKeyInput.value = W3F_CONFIG.W3F_ACCESS_KEY;

    const contactForm  = document.getElementById('contactForm');
    const formStatus   = document.getElementById('formStatus');
    const submitBtn    = document.getElementById('submitBtn');

    if (!contactForm || !formStatus || !submitBtn) return; // guard: elements must exist

    /* ---- DOM refs ---- */
    const nameInput    = document.getElementById('contactName');
    const emailInput   = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const nameError    = document.getElementById('nameError');
    const emailError   = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    /* ---- Helpers ---- */
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(input, errorEl, msg) {
        input.classList.add('error');
        input.classList.remove('success');
        if (errorEl) errorEl.textContent = msg;
    }

    function clearFieldError(input, errorEl) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorEl) errorEl.textContent = '';
    }

    function validateForm() {
        let valid = true;

        const name = nameInput.value.trim();
        if (!name || name.length < 2) {
            showFieldError(nameInput, nameError, 'Please enter your name (at least 2 characters).');
            valid = false;
        } else {
            clearFieldError(nameInput, nameError);
        }

        const email = emailInput.value.trim();
        if (!email) {
            showFieldError(emailInput, emailError, 'Please enter your email address.');
            valid = false;
        } else if (!validateEmail(email)) {
            showFieldError(emailInput, emailError, 'Please enter a valid email address.');
            valid = false;
        } else {
            clearFieldError(emailInput, emailError);
        }

        const message = messageInput.value.trim();
        if (!message || message.length < 10) {
            showFieldError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
            valid = false;
        } else {
            clearFieldError(messageInput, messageError);
        }

        return valid;
    }

    /* ---- Inline validation on blur (shows AND clears errors) ---- */
    nameInput.addEventListener('blur', () => {
        const v = nameInput.value.trim();
        if (v.length === 0) return; // don't nag on empty-then-tab
        v.length >= 2
            ? clearFieldError(nameInput, nameError)
            : showFieldError(nameInput, nameError, 'Please enter your name (at least 2 characters).');
    });

    emailInput.addEventListener('blur', () => {
        const v = emailInput.value.trim();
        if (v.length === 0) return;
        validateEmail(v)
            ? clearFieldError(emailInput, emailError)
            : showFieldError(emailInput, emailError, 'Please enter a valid email address.');
    });

    messageInput.addEventListener('blur', () => {
        const v = messageInput.value.trim();
        if (v.length === 0) return;
        v.length >= 10
            ? clearFieldError(messageInput, messageError)
            : showFieldError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
    });

    /* ---- Status helpers ---- */
    let statusTimer = null;

    function showStatus(type, msg) {
        clearTimeout(statusTimer);
        formStatus.className = 'form-status ' + type;  // 'success' | 'error-msg'
        formStatus.textContent = msg;
        statusTimer = setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }, W3F_CONFIG.STATUS_HIDE_MS);
    }

    function setSubmitting(on) {
        submitBtn.disabled = on;
        submitBtn.textContent = on ? 'Sending...' : 'Send Message';
    }

    /* ---- Form submission ---- */
    let isSubmitting = false;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isSubmitting) return;           // block duplicate clicks
        if (!validateForm()) return;        // stop on validation failure

        /* Key guard — surface a clear message if key was never configured */
        const currentKey = w3fKeyInput ? w3fKeyInput.value : '';
        if (!currentKey || currentKey === 'YOUR_ACCESS_KEY_HERE') {
            showStatus('error-msg',
                'Contact form not yet configured. ' +
                'Please email me directly at ' + W3F_CONFIG.FALLBACK_EMAIL);
            return;
        }

        isSubmitting = true;
        setSubmitting(true);

        try {
            const formData = new FormData(contactForm);

            const response = await fetch(W3F_CONFIG.W3F_ENDPOINT, {
                method: 'POST',
                body:   formData,
            });

            const data = await response.json();

            if (data.success) {
                showStatus('success', 'Message sent successfully! Thank you for reaching out.');
                contactForm.reset();
                /* Clear visual states left after reset */
                [nameInput, emailInput, messageInput].forEach(el =>
                    el.classList.remove('success', 'error'));
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (err) {
            console.error('[Web3Forms] Submission error:', err);
            showStatus('error-msg',
                'Something went wrong. Please try again or email me at ' +
                W3F_CONFIG.FALLBACK_EMAIL + '.');
        } finally {
            isSubmitting = false;
            setSubmitting(false);
        }
    });

    /* ------------------------------------------------------------------
       10. MISCELLANEOUS
    ------------------------------------------------------------------ */
    // Footer year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 3D Tilt Effect on Cards (desktop only)
    if (isHoverDevice && !reducedMotion) {
        document.querySelectorAll('.tilt-card, .tilt-element').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotX = ((y - cy) / cy) * -8;
                const rotY = ((x - cx) / cx) * 8;
                el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
            el.addEventListener('mouseenter', () => { el.style.transition = 'none'; });
        });
    }
});
