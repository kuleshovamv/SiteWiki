class HTMLIncludes {
    static async load() {
        const includes = document.querySelectorAll('[data-include]');
        
        for (let element of includes) {
            const file = element.getAttribute('data-include');
            try {
                const response = await fetch(file);
                if (!response.ok) continue;
                
                const html = await response.text();
                
                // Создаем временный элемент для парсинга
                const temp = document.createElement('div');
                temp.innerHTML = html;
                
                // Извлекаем только содержимое body или весь HTML, если body нет
                const content = temp.querySelector('body')?.innerHTML || html;
                element.innerHTML = content;
                
                // Если это header, вызываем setActiveNavItem после загрузки
                if (file.includes('header.html')) {
                    setActiveNavItem();
                }
            } catch (error) {
                console.error(`Ошибка загрузки ${file}:`, error);
            }
        }
    }
}

// Автоматическая загрузка при загрузке страницы
document.addEventListener('DOMContentLoaded', HTMLIncludes.load);