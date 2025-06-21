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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    initMobileMenu();
    
    // Кнопка "Наверх"
    initScrollToTop();
    
    // Анимации при прокрутке
    initScrollAnimations();
    
    // Инициализация подсветки кода
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});

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
    const toTopButton = document.getElementById('to-top');
    
    if (toTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                toTopButton.style.opacity = '1';
                toTopButton.style.visibility = 'visible';
            } else {
                toTopButton.style.opacity = '0';
                toTopButton.style.visibility = 'hidden';
            }
        });
        
        toTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
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

// УДАЛЕН проблемный обработчик кликов для навигации
// Оставляем стандартную навигацию браузера