document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const codeElement = document.getElementById(targetId);
            
            if (codeElement) {
                const codeToCopy = codeElement.textContent;
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    showNotification('Код скопирован!', 'success');
                    
                    // Добавляем класс для анимации
                    this.classList.add('copied');
                    setTimeout(() => {
                        this.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    showNotification('Ошибка при копировании', 'error');
                });
            }
        });
    });
});

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