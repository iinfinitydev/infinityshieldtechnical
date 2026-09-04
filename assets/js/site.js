(function () {
  var btn = document.getElementById("mobile-menu-btn");
  var menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".has-hover-anim").forEach(function (card) {
    var clip = card.querySelector("video");
    if (!clip) return;
    function play() {
      var run = clip.play();
      if (run && run.catch) run.catch(function () {});
    }
    function stop() {
      clip.pause();
      clip.currentTime = 0;
    }
    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", stop);
    card.addEventListener("focusin", play);
    card.addEventListener("focusout", function (e) {
      if (!card.contains(e.relatedTarget)) stop();
    });
  });

  var params = new URLSearchParams(window.location.search);
  var wanted = params.get("service");
  var select = document.getElementById("service");
  if (wanted && select) {
    var match = Array.prototype.find.call(select.options, function (opt) {
      return opt.value === wanted;
    });
    if (match) select.value = wanted;
  }

  var form = document.getElementById("technical-form");
  if (!form) return;

  function showModal(title, text) {
    var wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML =
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="thanks-title">' +
      '<div class="check" aria-hidden="true">✓</div>' +
      "<h3 id=\"thanks-title\">" + title + "</h3>" +
      '<p class="muted">' + text + "</p>" +
      '<button class="btn btn-gold btn-block" type="button">Return to website</button>' +
      "</div>";
    document.body.appendChild(wrap);
    wrap.querySelector("button").addEventListener("click", function () {
      wrap.remove();
    });
    wrap.addEventListener("click", function (ev) {
      if (ev.target === wrap) wrap.remove();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var submit = form.querySelector('button[type="submit"]');
    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;
    submit.disabled = true;
    fetch("https://formsubmit.co/ajax/jay@infinityshieldtechnical.ae", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (result) {
        if (result.ok) {
          showModal(
            "Thank you.",
            "Your request has been emailed to the technical team. We typically respond within four hours on a UAE business day."
          );
          form.reset();
          if (wanted && select) select.value = wanted;
        } else {
          showModal(
            "Send us an email instead.",
            'The form could not be delivered just then. Please write to <a href="mailto:jay@infinityshieldtechnical.ae">info@infinityshieldtechnical.ae</a>.'
          );
        }
      })
      .catch(function () {
        showModal(
          "Send us an email instead.",
          'The form could not be delivered just then. Please write to <a href="mailto:jay@infinityshieldtechnical.ae">info@infinityshieldtechnical.ae</a>.'
        );
      })
      .then(function () {
        submit.disabled = false;
      });
  });
})();
