(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.journey-tab'));
  var copies = Array.prototype.slice.call(document.querySelectorAll('.journey-copy'));
  if (!tabs.length) return;

  function show(step) {
    tabs.forEach(function (tab, i) {
      var on = i === step;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    copies.forEach(function (el) {
      var on = String(el.getAttribute('data-copy')) === String(step);
      el.hidden = !on;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      show(Number(tab.getAttribute('data-step')) || 0);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (!e.target.classList.contains('journey-tab')) return;
    var idx = tabs.indexOf(e.target);
    if (idx < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      var next = Math.min(tabs.length - 1, idx + 1);
      tabs[next].focus();
      show(next);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      var prev = Math.max(0, idx - 1);
      tabs[prev].focus();
      show(prev);
    }
  });
})();
