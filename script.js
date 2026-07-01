document.addEventListener("DOMContentLoaded", function () {

    var phoneNumber = "5582999999999";




    // FAQ
    var faqButtons = document.querySelectorAll(".fq");

    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var item = this.closest(".fi");
            if (item) {
                item.classList.toggle("op");
            }
        });
    });

    // URGÊNCIA
    var container = document.querySelector(".hero");

    if (container) {
        var urgencyText = document.createElement("p");
        urgencyText.textContent = "Restam poucas vagas disponíveis";
        urgencyText.style.color = "#ffc400";
        urgencyText.style.fontWeight = "700";
        urgencyText.style.marginTop = "18px";

        container.appendChild(urgencyText);
    }

    // CONTADOR
    var countdownDate = new Date(2026, 7, 20, 19, 0, 0).getTime();
    var countdownEl = document.getElementById("cd");

    if (countdownEl) {
        var interval = setInterval(function () {
            var now = new Date().getTime();
            var distance = countdownDate - now;

            if (distance <= 0) {
                clearInterval(interval);
                countdownEl.innerHTML = "Turma iniciando agora";
                return;
            }

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            var minutes = Math.floor((distance / (1000 * 60)) % 60);

            countdownEl.innerHTML =
                days + "d : " + hours + "h : " + minutes + "m";
        }, 1000);
    }

    // ANIMAÇÃO GERAL POR ROLAGEM
    function revealOnScroll() {
        var pageItems = Array.from(document.querySelectorAll(
            '.hero .wrap > *, .sec .wrap > *, .ctaf .wrap > *, footer'
        ));

        pageItems.forEach(function (item, index) {
            item.classList.add('reveal');
            var delay = Math.min(index * 35, 180);
            item.style.transitionDelay = delay + 'ms';
        });

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries, observerRef) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observerRef.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2
            });

            pageItems.forEach(function (item) {
                observer.observe(item);
            });
        } else {
            pageItems.forEach(function (item) {
                item.classList.add('visible');
            });
        }
    }

    revealOnScroll();

    // ANIMAÇÃO DOS NÚMEROS
    function animateCounter(el, duration) {
        var originalText = el.textContent.trim();
        var prefixMatch = originalText.match(/^[+\-]/);
        var prefix = prefixMatch ? prefixMatch[0] : '';
        var suffix = originalText.replace(/^[+\-]?\s*[0-9][0-9.,]*/g, '').trim();
        var digits = originalText.replace(/[^0-9]/g, '');
        var target = parseInt(digits, 10) || 0;
        var start = 0;
        var startTime = null;

        function formatValue(value) {
            var formatted = value.toLocaleString('pt-BR');
            if (suffix) {
                if (suffix.startsWith('%')) {
                    return prefix + formatted + suffix;
                }
                return prefix + formatted + ' ' + suffix;
            }
            return prefix + formatted;
        }

        function easeOutQuint(t) {
            return 1 - Math.pow(1 - t, 5);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = easeOutQuint(progress);
            var current = Math.floor(eased * (target - start) + start);
            el.textContent = formatValue(current);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    var counters = Array.from(document.querySelectorAll('.sc .n'));
    if (counters.length > 0) {
        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        if (!el.dataset.animated) {
                            animateCounter(el, 1800);
                            el.dataset.animated = 'true';
                        }
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.4 });

            counters.forEach(function (counter) {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(function (counter) {
                animateCounter(counter, 1800);
            });
        }
    }

    // CARROSSEL DE VÍDEOS
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = carouselTrack
    ? [...carouselTrack.querySelectorAll('.carousel-item')]
    : [];

const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
const indicatorsContainer = document.querySelector('.carousel-indicators');
const trackWrapper = document.querySelector('.carousel-track-wrapper');

let currentIndex = 0;

function updateCarousel(index) {
    if (!carouselTrack || !carouselItems.length) return;

    const totalItems = carouselItems.length;

    currentIndex = (index + totalItems) % totalItems;

    const targetItem = carouselItems[currentIndex];

    const wrapperWidth = trackWrapper.clientWidth;
    const itemWidth = targetItem.offsetWidth;

    let offset =
        targetItem.offsetLeft -
        (wrapperWidth / 2) +
        (itemWidth / 2);

    const maxOffset = Math.max(
        0,
        carouselTrack.scrollWidth - wrapperWidth
    );

    offset = Math.max(0, Math.min(offset));

    carouselTrack.style.transform = `translateX(-${offset}px)`;

    carouselItems.forEach((item, i) => {
        item.classList.toggle('center-item', i === currentIndex);
    });

    document
        .querySelectorAll('.carousel-dot')
        .forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
}

function createIndicators() {
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    carouselItems.forEach((_, index) => {
        const dot = document.createElement('button');

        dot.className =
            `carousel-dot${index === 0 ? ' active' : ''}`;

        dot.type = 'button';
        dot.setAttribute(
            'aria-label',
            `Ir para depoimento ${index + 1}`
        );

        dot.addEventListener('click', () => {
            updateCarousel(index);
        });

        indicatorsContainer.appendChild(dot);
    });
}

function initCarousel() {
    if (!carouselItems.length) return;

    createIndicators();

    prevButton?.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
    });

    nextButton?.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
    });

    window.addEventListener('resize', () => {
        updateCarousel(currentIndex);
    });

    updateCarousel(0);
}

initCarousel();});