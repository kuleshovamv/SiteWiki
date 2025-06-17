class HTMLIncludes {
    static async load() {
        const includes = document.querySelectorAll('[data-include]');
        
        for (let element of includes) {
            const file = element.getAttribute('data-include');
            try {
                const response = await fetch(file);
                const html = await response.text();
                element.innerHTML = html;
            } catch (error) {
                console.error(`Ошибка загрузки ${file}:`, error);
            }
        }
    }
}

// Автоматическая загрузка при загрузке страницы
document.addEventListener('DOMContentLoaded', HTMLIncludes.load);