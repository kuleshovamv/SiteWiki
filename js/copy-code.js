document.addEventListener('DOMContentLoaded', function() {
    // Инициализация кнопок копирования кода
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            let codeElement;
            
            if (targetId) {
                codeElement = document.getElementById(targetId);
            } else {
                codeElement = this.closest('.card').querySelector('code');
            }
            
            if (codeElement) {
                const codeToCopy = codeElement.textContent;
                const textarea = document.createElement('textarea');
                
                textarea.value = codeToCopy;
                textarea.style.position = 'fixed'; // Prevent scrolling to bottom
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    const message = successful ? 'Код скопирован!' : 'Не удалось скопировать';
                    showNotification(message, successful ? 'success' : 'error');
                } catch (err) {
                    showNotification('Ошибка при копировании', 'error');
                }
                
                document.body.removeChild(textarea);
                
                // Анимация кнопки
                this.textContent = 'Скопировано!';
                setTimeout(() => {
                    this.textContent = 'Копировать код';
                }, 2000);
            }
        });
    });
});

// Функция показа уведомления (дублируется из main.js для независимости модуля)
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