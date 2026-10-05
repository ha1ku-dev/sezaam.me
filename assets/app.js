
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

      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Avis ' + (i + 1));
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
      }

      var dots = dotsContainer.querySelectorAll('.reviews-dot');

      function goTo(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;
        items[current].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        for (var j = 0; j < dots.length; j++) {
          dots[j].classList.toggle('active', j === current);
        }
      }

      function startAuto() {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(function() {
          if (!isUserScrolling) {
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
          var scrollLeft = track.scrollLeft;
          var itemWidth = items[0].offsetWidth + 4;
          var nearest = Math.round(scrollLeft / itemWidth);
          if (nearest !== current) {
            current = nearest;
            for (var j = 0; j < dots.length; j++) {
              dots[j].classList.toggle('active', j === current);
            }
          }
          resetAuto();
        }, 100);
      });

      startAuto();
    })();

    (function() {
      var painPoints = [
        '« Ils n\'ont pas envoyé de message… Est-ce qu\'ils sont bien entrés ? »',
        '« J\'espère qu\'ils ont bien refermé la boîte à clés et brouillé le code, pour que personne ne puisse simplement partir avec. »',
        '« Et si la ville l\'avait retirée juste avant l\'arrivée de mes voyageurs ? »'
      ];

      var painPoints2 = [
        "Est-ce qu\'ils sont bien entrés ? »'",
        "Est-ce qu'ils ont refermé la boîte à clés et brouillé le code",
        "Est-ce qu'ils ont recupere le cadenas ?",
        "Est-ce que les cles ont ete remis dans la boite ?"
      ]

      var track = document.getElementById('pain-track');
      if (!track) return;

      if (!painPoints.length) {
        track.style.display = 'none';
        return;
      }

      var frag = document.createDocumentFragment();
      for (var set = 0; set < 2; set++) {
        for (var i = 0; i < painPoints.length; i++) {
          var p = document.createElement('p');
          p.className = 'pain-slide';
          p.textContent = painPoints[i];
          if (set === 1) p.setAttribute('aria-hidden', 'true');
          frag.appendChild(p);
        }
      }
      track.appendChild(frag);
    })();
  