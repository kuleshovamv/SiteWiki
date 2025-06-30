// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация базовых компонентов
    initMobileMenu();
    initScrollToTop();
    initMarquee();
    setActiveNavItem();
    
    // Подсветка кода
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Инициализация анимаций после полной загрузки страницы
    if (document.readyState === 'complete') {
        initScrollAnimations();
    } else {
        window.addEventListener('load', initScrollAnimations);
    }
});

function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.card, .tip, .article');
    
    // Сначала скрываем все элементы
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'none'; // Отключаем переходы на начальном этапе
    });

    // Даем браузеру время на отрисовку
    requestAnimationFrame(() => {
        // Включаем переходы
        animateElements.forEach(el => {
            el.style.transition = 'opacity 1.0s ease, transform 0.5s ease';
        });

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px 50px 0px' // Увеличиваем область наблюдения
            });
            
            animateElements.forEach(element => {
                observer.observe(element);
            });

            // ИСПРАВЛЕНИЕ: Сразу показываем элементы, которые уже в видимой области
            setTimeout(() => {
                animateElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        observer.unobserve(element);
                    }
                });
            }, 100);
            
        } else {
            // Fallback для старых браузеров
            animateElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    });
}

// Определение текущей страницы
function setActiveNavItem() {
    const navLinks = document.querySelectorAll('.nav__link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        let isActive = false;
        
        // Определяем активную ссылку
        if (linkHref === '../../index.html' || linkHref === 'index.html') {
            // Главная страница
            isActive = currentPath.endsWith('index.html') || 
                      currentPath === '/' || 
                      currentPath.endsWith('/');
        } else if (linkHref.includes('/basics/')) {
            // Раздел "Основы"
            isActive = currentPath.includes('/basics/');
        } else if (linkHref.includes('/functions/')) {
            // Раздел "Функции"
            isActive = currentPath.includes('/functions/');
        } else if (linkHref.includes('/pointers/')) {
            // Раздел "Указатели"
            isActive = currentPath.includes('/pointers/');
        }
        
        // Применяем или убираем класс active
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

/**
 * Инициализация кнопки "Наверх"
 */
function initScrollToTop() {
    // Создаем кнопку программно
    const toTopButton = document.createElement('button');
    toTopButton.id = 'to-top';
    toTopButton.className = 'to-top-btn';
    toTopButton.innerHTML = '↑';
    toTopButton.setAttribute('aria-label', 'Вернуться наверх');
    toTopButton.setAttribute('title', 'Вернуться наверх');
    
    // Добавляем кнопку в body
    document.body.appendChild(toTopButton);
    
    // Переменные для управления анимацией
    let isAnimating = false;
    let animationId = null;
    let lastUserInteraction = 0;
    
    // Обработчик прокрутки с throttling для лучшей производительности
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                
                // Показываем/скрываем кнопку
                if (scrollY > 100) {
                    toTopButton.classList.add('visible');
                } else {
                    toTopButton.classList.remove('visible');
                }
                
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    });
    
    // Функция остановки анимации
    function stopAnimation() {
        if (isAnimating && animationId) {
            cancelAnimationFrame(animationId);
            isAnimating = false;
            animationId = null;
        }
    }
    
    // Отслеживаем пользовательские действия
    window.addEventListener('wheel', function() {
        lastUserInteraction = Date.now();
        stopAnimation();
    }, { passive: true });
    
    window.addEventListener('touchstart', function() {
        lastUserInteraction = Date.now();
        stopAnimation();
    }, { passive: true });
    
    window.addEventListener('touchmove', function() {
        lastUserInteraction = Date.now();
        stopAnimation();
    }, { passive: true });
    
    window.addEventListener('keydown', function(e) {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'].includes(e.code)) {
            lastUserInteraction = Date.now();
            stopAnimation();
        }
    });
    
    // Обработчик клика на кнопку
    toTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Если анимация уже идет, не запускаем новую
        if (isAnimating) return;
        
        isAnimating = true;
        lastUserInteraction = 0; // Сбрасываем время последнего взаимодействия
        
        // Плавная прокрутка наверх
        const scrollToTop = () => {
            // Проверяем, не было ли пользовательского взаимодействия
            if (Date.now() - lastUserInteraction < 100 && lastUserInteraction > 0) {
                isAnimating = false;
                animationId = null;
                return;
            }
            
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll > 0) {
                const nextScroll = Math.max(0, currentScroll - (currentScroll / 30));
                window.scrollTo(0, nextScroll);
                
                if (nextScroll > 0) {
                    animationId = window.requestAnimationFrame(scrollToTop);
                } else {
                    // Анимация завершена
                    isAnimating = false;
                    animationId = null;
                }
            } else {
                // Анимация завершена
                isAnimating = false;
                animationId = null;
            }
        };
        
        scrollToTop();
    });
}

/**
 * Показ системного уведомления
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initMarquee() {
    const marqueeContainer = document.querySelector('.marquee-js');
    const marqueeInner = document.querySelector('.marquee-inner');
    
    if (!marqueeContainer || !marqueeInner) return;
    
    // Убираем CSS анимацию
    marqueeInner.style.animation = 'none';
    
    // Получаем скорость из data-атрибута
    const speed = parseFloat(marqueeContainer.dataset.speed) || 1;
    
    // Дублируем содержимое
    const originalContent = marqueeInner.innerHTML;
    marqueeInner.innerHTML = originalContent + originalContent;
    
    let translateX = 0;
    const contentWidth = marqueeInner.scrollWidth / 2;
    let isPaused = false;
    
    // Обработчики для паузы при наведении
    marqueeContainer.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    marqueeContainer.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    function animate() {
        if (!isPaused) {
            translateX -= speed;
            
            // Когда достигли половины контента, сбрасываем позицию
            if (Math.abs(translateX) >= contentWidth) {
                translateX = 0;
            }
            
            marqueeInner.style.transform = `translateX(${translateX}px)`;
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}