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
    var countdownDate = new Date(2026, 6, 23, 19, 0, 0).getTime();
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
    var carouselTrack = document.querySelector('.carousel-track');
    var carouselItems = carouselTrack ? Array.from(carouselTrack.querySelectorAll('.carousel-item')) : [];
    var prevButton = document.querySelector('.carousel-control.prev');
    var nextButton = document.querySelector('.carousel-control.next');
    var indicatorsContainer = document.querySelector('.carousel-indicators');
    var currentCenterIndex = 0;

    function updateCarousel(index) {
        if (!carouselTrack || carouselItems.length === 0) {
            return;
        }

        var trackWrapper = document.querySelector('.carousel-track-wrapper');
        var itemWidth = carouselItems[0].getBoundingClientRect().width;
        var wrapperWidth = trackWrapper ? trackWrapper.clientWidth : itemWidth;
        var gap = 20;

        if (index < 0) {
            index = carouselItems.length - 1;
        }

        if (index >= carouselItems.length) {
            index = 0;
        }

        currentCenterIndex = index;
        var targetItem = carouselItems[index];
        var offset = targetItem.offsetLeft - (wrapperWidth - itemWidth) / 2;
        var maxOffset = carouselTrack.scrollWidth - wrapperWidth;
        offset = Math.max(0, Math.min(offset, maxOffset));

        carouselTrack.style.transform = 'translateX(-' + offset + 'px)';

        carouselItems.forEach(function (item, itemIndex) {
            item.classList.toggle('center-item', itemIndex === currentCenterIndex);
        });

        if (indicatorsContainer) {
            var dots = Array.from(indicatorsContainer.querySelectorAll('.carousel-dot'));
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === currentCenterIndex);
            });
        }
    }

    if (carouselItems.length > 0 && indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        carouselItems.forEach(function (_, itemIndex) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot' + (itemIndex === currentCenterIndex ? ' active' : '');
            dot.setAttribute('aria-label', 'Ir para depoimento ' + (itemIndex + 1));
            dot.addEventListener('click', function () {
                updateCarousel(itemIndex);
            });
            indicatorsContainer.appendChild(dot);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            updateCarousel(currentCenterIndex - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            updateCarousel(currentCenterIndex + 1);
        });
    }

    if (carouselItems.length > 0) {
        updateCarousel(currentCenterIndex);
    }

    window.addEventListener('resize', function () {
        if (carouselItems.length > 0) {
            updateCarousel(currentCenterIndex);
        }
    });

});