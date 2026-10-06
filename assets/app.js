
    (function() {
      const form = document.getElementById('waitlist-form');
      const emailInput = document.getElementById('email');
      const submitBtn = document.getElementById('submit-btn');
      const messageEl = document.getElementById('form-message');
      const honeypot = document.getElementById('website');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Honeypot check
        if (honeypot.value) return;

        // Validate email
        if (!emailRegex.test(emailInput.value)) {
          showMessage('Veuillez entrer une adresse e-mail valide.', 'error');
          return;
        }

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi…';
        messageEl.textContent = '';
        messageEl.className = 'form-message';

        try {
          const response = await fetch('https://app.sezaam.me/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value })
          });

          const data = await response.json();

          if (data.success) {
            if (window._paq) {
              window._paq.push(['trackEvent', 'Waitlist', 'Submit']);
            }
            form.innerHTML = '<p class="form-message success" style="font-size:1.3rem;">Merci ! On vous contacte bientôt.</p>';
          } else {
            showMessage(data.error || 'Une erreur est survenue. Réessayez.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Me contacter';
          }
        } catch (err) {
          showMessage('Une erreur est survenue. Réessayez.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Me contacter';
        }
      });

      function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = 'form-message ' + type;
      }
    })();

    (function() {
      var carousel = document.getElementById('reviews-carousel');
      if (!carousel) return;

      var uniqueItems = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-item'));
      if (uniqueItems.length < 2) return;

      var frag = document.createDocumentFragment();
      for (var i = 0; i < uniqueItems.length; i++) {
        var clone = uniqueItems[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        frag.appendChild(clone);
      }
      carousel.appendChild(frag);

      var items = carousel.querySelectorAll('.carousel-item');
      var uniqueCount = uniqueItems.length;
      var step = items[1].offsetLeft - items[0].offsetLeft;
      var loopLength = step * uniqueCount;
      var scrollPosition = 0;
      var scrollSpeed = 0.5;
      var animId;
      var paused = false;

      carousel.scrollLeft = scrollPosition;

      function scroll() {
        if (!paused) {
          scrollPosition -= scrollSpeed;
          if (scrollPosition <= 0) {
            scrollPosition += loopLength;
          }
          carousel.scrollLeft = scrollPosition;
        }
        animId = requestAnimationFrame(scroll);
      }

      animId = requestAnimationFrame(scroll);

      carousel.addEventListener('mouseenter', function() { paused = true; });
      carousel.addEventListener('mouseleave', function() { paused = false; });
    })();

    (function() {
      var gallery = document.getElementById('reviews-gallery');
      var track = document.getElementById('reviews-gallery-track');
      var dotsContainer = document.getElementById('reviews-dots');
      if (!gallery || !track || !dotsContainer) return;

      var items = track.querySelectorAll('.reviews-gallery-item');
      var total = items.length;
      var current = 0;
      var autoTimer;
      var isUserScrolling = false;
      var scrollTimeout;
      var inView = false;
      var pageVisible = !document.hidden;

      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Avis ' + (i + 1));
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
      }

      var dots = dotsContainer.querySelectorAll('.reviews-dot');

      function updateDots(index) {
        for (var j = 0; j < dots.length; j++) {
          dots[j].classList.toggle('active', j === index);
        }
      }

      // Scroll only the track horizontally — never the page itself.
      function scrollToItem(item) {
        var trackRect = track.getBoundingClientRect();
        var itemRect = item.getBoundingClientRect();
        var delta = itemRect.left - trackRect.left;
        var left = track.scrollLeft + delta - (track.clientWidth - itemRect.width) / 2;
        var maxScroll = track.scrollWidth - track.clientWidth;
        if (left < 0) left = 0;
        if (left > maxScroll) left = maxScroll;
        track.scrollTo({ left: left, behavior: 'smooth' });
      }

      function nearestIndex() {
        var trackRect = track.getBoundingClientRect();
        var center = trackRect.left + trackRect.width / 2;
        var best = 0;
        var bestDist = Infinity;
        for (var j = 0; j < total; j++) {
          var r = items[j].getBoundingClientRect();
          var dist = Math.abs(r.left + r.width / 2 - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = j;
          }
        }
        return best;
      }

      function goTo(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;
        scrollToItem(items[current]);
        updateDots(current);
      }

      function startAuto() {
        clearTimeout(autoTimer);
        if (!inView || !pageVisible) return;
        autoTimer = setTimeout(function() {
          if (!isUserScrolling && inView && pageVisible) {
            goTo(current + 1);
          }
          startAuto();
        }, 4000);
      }

      function resetAuto() {
        clearTimeout(autoTimer);
        startAuto();
      }

      dotsContainer.addEventListener('click', function(e) {
        var dot = e.target.closest('.reviews-dot');
        if (!dot) return;
        goTo(parseInt(dot.getAttribute('data-index'), 10));
        resetAuto();
      });

      track.addEventListener('scroll', function() {
        isUserScrolling = true;
        clearTimeout(scrollTimeout);
        clearTimeout(autoTimer);
        scrollTimeout = setTimeout(function() {
          isUserScrolling = false;
          var nearest = nearestIndex();
          if (nearest !== current) {
            current = nearest;
            updateDots(current);
          }
          resetAuto();
        }, 100);
      });

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          inView = entries[0].isIntersecting;
          if (inView) {
            startAuto();
          } else {
            clearTimeout(autoTimer);
          }
        }, { threshold: 0 });
        observer.observe(gallery);
      } else {
        inView = true;
      }

      document.addEventListener('visibilitychange', function() {
        pageVisible = !document.hidden;
        if (pageVisible) {
          startAuto();
        } else {
          clearTimeout(autoTimer);
        }
      });

      startAuto();
    })();

    (function() {
      var phrases = [
        'récupéré les clés ?',
        'brouillé le code ?',
        'remis les clés ?'
      ];

      var el = document.getElementById('painpoint-display');
      if (!el || !phrases.length) return;

      var index = 0;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduce) {
        el.textContent = phrases[0];
        setInterval(function() {
          index = (index + 1) % phrases.length;
          el.textContent = phrases[index];
        }, 3000);
        return;
      }

      var TYPE_MS = 70;
      var HOLD_MS = 2400;
      var DELETE_MS = 30;
      var GAP_MS = 300;

      function typePhrase() {
        var phrase = phrases[index];
        var i = 0;
        el.textContent = '';

        function typeChar() {
          if (i <= phrase.length) {
            el.textContent = phrase.slice(0, i);
            i++;
            setTimeout(typeChar, TYPE_MS);
          } else {
            setTimeout(deleteChars, HOLD_MS);
          }
        }

        function deleteChars() {
          var current = el.textContent;
          if (current.length > 0) {
            el.textContent = current.slice(0, -1);
            setTimeout(deleteChars, DELETE_MS);
          } else {
            index = (index + 1) % phrases.length;
            setTimeout(typePhrase, GAP_MS);
          }
        }

        typeChar();
      }

      typePhrase();
    })();
  