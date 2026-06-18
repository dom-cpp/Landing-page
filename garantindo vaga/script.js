(function () {
  var TOTAL = 10 * 60;
  var remaining = TOTAL;

  var elCount = document.getElementById('countdown');
  var elFill  = document.getElementById('progressFill');
  var elBuy   = document.getElementById('buyNow');

  function fmt(s) {
    var m = Math.floor(s / 60), sec = s % 60;
    return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }

  function render() {
    var pct = Math.max(0, remaining) / TOTAL * 100;
    if (elCount) elCount.textContent = fmt(Math.max(0, remaining));
    if (elFill)  elFill.style.width  = pct + '%';

    // urgência nos últimos 2 minutos
    var urgent = remaining <= 120 && remaining > 0;
    if (elCount) {
      elCount.classList.toggle('urgent', urgent);
      elCount.classList.toggle('urgent-pulse', remaining <= 30 && remaining > 0);
    }
    if (elFill) elFill.classList.toggle('urgent', urgent);
  }

  render();

  var timer = setInterval(function () {
    remaining--;

    if (remaining < 0) {
      clearInterval(timer);
      if (elCount) { elCount.textContent = 'Oferta encerrada'; elCount.classList.remove('urgent-pulse'); }
      if (elFill)  { elFill.style.width = '0%'; }
      if (elBuy)   { elBuy.classList.add('disabled'); elBuy.setAttribute('aria-disabled', 'true'); elBuy.removeAttribute('href'); }
      return;
    }

    render();
  }, 1000);

  if (elBuy) {
    elBuy.addEventListener('click', function (e) {
      if (elBuy.classList.contains('disabled')) { e.preventDefault(); }
      // dataLayer.push({ event: 'startCheckout' });
    });
  }
})();
