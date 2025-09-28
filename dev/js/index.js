// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. トピックの「もっと見る」機能の初期化
    initializeTopicToggle();
    
    // ※ テーマ切り替えの初期化は Seminar_header.js に集約されました。
});

window.addEventListener('load', () => {
    // loading-overlayをフェードアウトさせる
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden'); 
        
        loadingOverlay.addEventListener('transitionend', () => {
             // loadingOverlay.remove(); 
        }, { once: true });
    }

    // ※ initializeThemeSwitcher の呼び出しを削除

    // スクロール位置の自動復元を無効化し、ページトップへ移動
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0); 
});

// ※ initializeThemeSwitcher 関数は削除
// ※ applyLightModeToAll 関数は削除
// ※ removeLightModeFromAll 関数は削除


// トピックの「もっと見る」機能を初期化（5件ずつ表示・全閉じる機能付き）
function initializeTopicToggle() {
    const moreButton = document.getElementById('toggleTopicsButton_more');
    const closeButton = document.getElementById('toggleTopicsButton_close');
    const allTopics = document.querySelectorAll('.extra-topic'); 
    const topicSectionTitle = document.querySelector('.home_topics .home_description_title'); 

    const displayCount = 5;
    let currentVisibleCount = 0;
    let initialMoreClickScrollY = null; 

    if (!moreButton || !closeButton || allTopics.length === 0) {
        return;
    }

    function hideAllTopics() {
        allTopics.forEach(topic => {
            topic.classList.remove('is-visible');
        });
        currentVisibleCount = 0;
        updateButtonVisibility();
    }

    function updateButtonVisibility() {
        if (currentVisibleCount >= allTopics.length) {
            moreButton.classList.add('is-hidden');
        } else {
            moreButton.classList.remove('is-hidden');
        }

        if (currentVisibleCount > 0) {
            closeButton.classList.remove('is-hidden');
        } else {
            closeButton.classList.add('is-hidden');
        }
    }

    hideAllTopics(); 

    moreButton.addEventListener('click', () => {
        if (initialMoreClickScrollY === null && topicSectionTitle) {
            initialMoreClickScrollY = topicSectionTitle.getBoundingClientRect().top + window.scrollY;
        } else if (initialMoreClickScrollY === null) {
            initialMoreClickScrollY = window.scrollY || window.pageYOffset;
        }
        
        const startIndex = currentVisibleCount;
        const endIndex = Math.min(currentVisibleCount + displayCount, allTopics.length);

        for (let i = startIndex; i < endIndex; i++) {
            allTopics[i].classList.add('is-visible');
        }

        currentVisibleCount = endIndex; 
        updateButtonVisibility(); 

        if (startIndex < endIndex && allTopics[startIndex]) {
            allTopics[startIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start' 
            });
        }
    });

    closeButton.addEventListener('click', () => {
        hideAllTopics(); 

        if (initialMoreClickScrollY !== null) {
            window.scrollTo({
                top: initialMoreClickScrollY,
                behavior: 'smooth' 
            });
            initialMoreClickScrollY = null;
        } else if (topicSectionTitle) {
            topicSectionTitle.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}