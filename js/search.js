document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице поиска
    if (document.querySelector('.search-page')) {
        initSearchPage();
    } else {
        initSearchForm();
    }
});

/**
 * Инициализация поисковой формы на всех страницах
 */
function initSearchForm() {
    const searchForm = document.querySelector('.search__form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input').value.trim();
            
            if (query) {
                // Перенаправляем на страницу поиска с параметром
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

/**
 * Инициализация страницы поиска
 */
function initSearchPage() {
    // Получаем поисковый запрос из URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (!query) {
        displayNoResults('Введите поисковый запрос');
        return;
    }
    
    // Устанавливаем запрос в поле поиска
    const searchInput = document.querySelector('.search__input');
    if (searchInput) {
        searchInput.value = query;
    }
    
    // Выполняем поиск
    performSearch(query);
}

/**
 * Выполнение поиска
 */
function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    const searchQueryElement = document.getElementById('search-query');
    
    if (searchQueryElement) {
        searchQueryElement.textContent = query;
    }
    
    if (!searchResults) return;
    
    // Показываем индикатор загрузки
    searchResults.innerHTML = '<div class="loading">Поиск...</div>';
    
    // Имитация задержки поиска (в реальном проекте будет поиск по индексу)
    setTimeout(() => {
        // Поиск по данным (search-data.js должен быть подключен)
        if (typeof searchData === 'undefined') {
            displayNoResults('Ошибка загрузки поискового индекса');
            return;
        }
        
        const results = searchData.filter(item => {
            // Простой поиск по вхождению строки
            return item.title.toLowerCase().includes(query.toLowerCase()) || 
                   item.content.toLowerCase().includes(query.toLowerCase());
        });
        
        // Отображение результатов
        displaySearchResults(results, query);
    }, 300);
}

/**
 * Отображение результатов поиска
 */
function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    
    if (!results.length) {
        displayNoResults(`Ничего не найдено по запросу "${query}"`);
        return;
    }
    
    let html = `
        <div class="search-results__count">
            Найдено ${results.length} ${pluralize(results.length, ['результат', 'результата', 'результатов'])}
        </div>
        <div class="search-results__list">
    `;
    
    results.forEach(item => {
        // Подсветка совпадений в тексте
        const highlightedTitle = highlightText(item.title, query);
        const highlightedContent = highlightText(truncate(item.content, 200), query);
        
        html += `
            <article class="search-result">
                <h3 class="search-result__title">
                    <a href="${item.url}">${highlightedTitle}</a>
                </h3>
                <div class="search-result__url">${item.url}</div>
                <div class="search-result__content">${highlightedContent}</div>
                <div class="search-result__category">${getCategoryName(item.category)}</div>
            </article>
        `;
    });
    
    html += '</div>';
    searchResults.innerHTML = html;
}

/**
 * Отображение сообщения об отсутствии результатов
 */
function displayNoResults(message) {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.innerHTML = `
            <div class="no-results">
                <svg viewBox="0 0 24 24" class="no-results__icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div class="no-results__message">${message}</div>
            </div>
        `;
    }
}

/**
 * Подсветка текста в результатах поиска
 */
function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Обрезание текста с добавлением многоточия
 */
function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Получение отображаемого имени категории
 */
function getCategoryName(category) {
    const categories = {
        'basics': 'Основы C++',
        'functions': 'Функции',
        'pointers': 'Указатели',
        'oop': 'ООП',
        'stl': 'STL'
    };
    
    return categories[category] || category;
}

/**
 * Склонение слов после числительных
 */
function pluralize(number, words) {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[
        number % 100 > 4 && number % 100 < 20 ? 2 : cases[Math.min(number % 10, 5)]
    ];
}

/**
 * Экранирование спецсимволов для RegExp
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}