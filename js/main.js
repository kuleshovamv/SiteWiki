// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    initMobileMenu();
    
    // Кнопка "Наверх"
    initScrollToTop();
    
    // Анимации при прокрутке
    initScrollAnimations();

     // Инициализация бегущей строки
     initMarquee();

    // Инициализация подсветки кода
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});

// Определение текущей страницы
function setActiveNavItem() {
    const navLinks = document.querySelectorAll('.nav__link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        
        // Сравниваем имена файлов
        if (currentPath === linkPath || 
            (currentPath === '' && linkPath === 'index.html') ||
            (currentPath === 'index.html' && linkPath === 'index.html')) {
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
    
    // Обработчик прокрутки с throttling для лучшей производительности
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                
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
    
    // Обработчик клика
    toTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Плавная прокрутка наверх
        const scrollToTop = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        };
        
        scrollToTop();
    });
}

/**
 * Анимации элементов при прокрутке
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.card, .tip');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback для браузеров без IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('animate');
        });
    }
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