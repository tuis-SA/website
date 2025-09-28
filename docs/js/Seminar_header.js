// js/Seminar_header.js (全ページ共通のUI・デザイン制御)

// ------------------------------------
// --- DOMContentLoadedでUIと要素を初期化 ---
// ------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. ハンバーガーメニューの初期化
    initializeHamburgerMenu();

    // 2. セミナー記録ドロップダウンの初期化
    initializeSeminarRecordDropdowns(); 
    
    // 3. 連絡フォームの初期化
    initializeContactForm(); 
    
    // 4. テーマ切り替え要素の取得と初期化 (永続化ロジック)
    initializeThemeSwitcherLogic(); 

    // 5. 💡 ナビゲーションのアクティブ状態の初期化を追加
    initializeActiveNavLink(); 
    
    // スクロール位置の自動復元を無効化し、ページトップへ移動（遷移直後の挙動統一）
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
});

// ------------------------------------
// --- Loadイベント ---
// ------------------------------------
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        
        loadingOverlay.addEventListener('transitionend', () => {
             loadingOverlay.remove();
        }, { once: true });
    }
    window.scrollTo(0, 0); 
});

// ------------------------------------
// --- テーマ切り替え関連関数 (確定版ロジック) ---
// ------------------------------------

function applyLightModeToAll() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        el.classList.add('light-mode');
    });
}

function removeLightModeFromAll() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        el.classList.remove('light-mode');
    });
}

function initializeThemeSwitcherLogic() {
    const themeSwitcher = document.getElementById('themeSwitch'); 
    const body = document.body;

    if (!themeSwitcher || !body) {
        console.warn('テーマ切り替えボタン(#themeSwitch)またはbody要素が見つかりません。');
        return;
    }

    // --- 1. 初期テーマのロードと適用 ---
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = (savedTheme === 'dark'); 
    
    // 全要素のクラスをリセット（念のため）
    body.classList.remove('light-mode');
    removeLightModeFromAll();

    if (isDarkMode) { // ダークモードでロード
        themeSwitcher.checked = true; 
    } else { // ライトモードでロード
        body.classList.add('light-mode');     
        applyLightModeToAll();                 
        themeSwitcher.checked = false;         
    }
    
    // --- 2. スイッチ操作時のイベントリスナーを設定 ---
    themeSwitcher.addEventListener('change', () => { 
        if (themeSwitcher.checked) {
            // スイッチON -> ダークモード
            body.classList.remove('light-mode');
            removeLightModeFromAll(); 
            localStorage.setItem('theme', 'dark');
        } else {
            // スイッチOFF -> ライトモード
            body.classList.add('light-mode');
            applyLightModeToAll(); 
            localStorage.setItem('theme', 'light');
        }
    });
}

// ------------------------------------
// --- ナビゲーションのアクティブ状態設定関数 (新規追加) ---
// ------------------------------------

/**
 * 現在のページのURLに基づいて、ナビゲーションリンクにアクティブスタイルを適用します。
 * (適用するクラス名を 'active' に変更)
 */
function initializeActiveNavLink() {
    // 現在のページのパス名を取得し、ファイル名部分のみを抽出（例: /path/to/index.html -> index.html）
    let currentFile = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    
    // ルートパス（/）の場合、ファイル名が空になるため、index.htmlと見なす
    if (currentFile === '') {
        currentFile = 'index.html';
    }

    // ナビゲーションリンクを全て取得
    const navLinks = document.querySelectorAll('.nav-link'); 

    navLinks.forEach(link => {
        const linkFile = link.getAttribute('href');

        // リンクのhref属性が現在のファイル名と完全に一致する場合
        if (linkFile === currentFile) {
            // 💡 アクティブクラスを付与 (active に変更)
            link.classList.add('active'); 
        } else {
            // 念のため、一致しない場合は削除 (active に変更)
            link.classList.remove('active');
        }
    });
}

// ------------------------------------
// --- その他 UI 操作関数 (変更なし) ---
// ------------------------------------

function initializeHamburgerMenu() { 
    const hamburgerMenu = document.querySelector('.hamburger_menu');
    const menu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu li a');
    if (hamburgerMenu && menu) {
        hamburgerMenu.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    } else {
        console.warn('ハンバーガーメニューが見つかりませんでした。');
    }
}

function initializeSeminarRecordDropdowns() { 
    const seminarYears = document.querySelectorAll('.seminar_record_year');
    seminarYears.forEach(seminarYearDiv => {
        const dropdownButton = seminarYearDiv.querySelector('.seminar_record_year_dropdown-toggle');
        const dropdownContent = seminarYearDiv.querySelector('.seminar_record_year_content'); 
        const arrow = seminarYearDiv.querySelector('.seminar_record_year_arrow');
        if (dropdownButton && dropdownContent && arrow) {
            dropdownContent.style.display = "none";
            arrow.textContent = "◀";
            const items = dropdownContent.querySelectorAll('.seminar_record_item');
            items.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
            });
            dropdownButton.addEventListener('click', () => {
                toggleDropdownLogic(dropdownContent, arrow);
            });
        }
    });
}

function toggleDropdownLogic(content, arrow) { 
    const items = content.querySelectorAll('.seminar_record_item'); 
    if (content.style.display === "block") {
        arrow.textContent = "◀";
        content.style.display = "none";
    } else {
        content.style.display = "block";
        arrow.textContent = "▼";
        items.forEach((item, index) => {
            item.style.transition = 'none';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            item.offsetWidth; 
            setTimeout(() => {
                item.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 80); 
        });
    }
}

function initializeContactForm() { 
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();
            const responseMessage = document.getElementById('responseMessage');
            if (responseMessage) {
                // これはフォーム送信をシミュレーションしているため、実際にはここでサーバーへのPOSTリクエストを実行します。
                responseMessage.textContent = 'メッセージが送信されました。ありがとうございます！';
                responseMessage.style.color = 'green';
            }
            contactForm.reset();
        });
    }
}