// js/Seminar_header.js

document.addEventListener('DOMContentLoaded', () => {

    // ヘッダーの動的読み込み
    const headerContainer = document.createElement('div');
    document.body.insertBefore(headerContainer, document.body.firstChild);

    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            headerContainer.innerHTML = html;

            // ナビゲーションイベントを初期化
            initializeNavEvents();

            // ハンバーガーメニューの初期化
            initializeHamburgerMenu();

            // 初期コンテンツのロード
            loadInitialContent();

        })
        .catch(error => {
            console.error('ヘッダーを読み込めませんでした:', error);
        });

        // 戻る・進むボタン対応
        window.addEventListener('popstate', (event) => {
        const page = (event.state && event.state.page) || 'index.html';
        loadContent(page, false); // 履歴操作なので履歴を追加しない
        });
});

window.addEventListener('load', () => {
    // loading-overlayをフェードアウトさせる
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden'); // opacity: 0 が適用される
        
        // アニメーション完了後にDOMから削除する
        loadingOverlay.addEventListener('transitionend', () => {
            loadingOverlay.remove();
        }, { once: true });
    }

    // テーマ切り替えボタンの初期化（loading-overlayが消えるタイミングで実行）
    initializeThemeSwitcher();

    // 通常ロードしても、一番上にする。
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'; // スクロール位置の自動復元を無効化
    }
    window.scrollTo(0, 0); 
});

function loadInitialContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'index.html';

    const targetLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    loadContent(page, false); // 初期ロードでは履歴を追加しない
}

function initializeNavEvents() {
    document.addEventListener('click', event => {
        const target = event.target.closest('.nav-link');
        // ここを修正: target.dataset.page ではなく target.href を使用する
        if (target && target.href) { // target.href が存在するか確認
            event.preventDefault();

            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => link.classList.remove('active'));

            // active クラスの付与は data-page の値を使うか、別途ロジックを検討
            // 今回はハッシュ部分を含まない data-page を active クラス用に使うのが自然
            if (target.dataset.page) {
                const activeTarget = document.querySelector(`.nav-link[data-page="${target.dataset.page}"]`);
                if (activeTarget) {
                    activeTarget.classList.add('active');
                }
            }


            // 修正箇所：loadContentに渡す引数を target.href に変更
            loadContent(target.href); 
        }
    });
}

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
        console.error('ハンバーガーメニューまたはメニューが見つかりません');
    }
}

function loadContent(page, updateHistory = true) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('content要素が見つかりません');
        return;
    }

    // ★追加: ナビゲーションバーの要素を取得し、その高さを取得
    // header.html に読み込まれるヘッダー要素に適切なIDを付けてください (例: <header id="main-header">)
    const headerElement = document.querySelector('.navigation_bar'); // もしヘッダーが<header>タグなら
    // または、ヘッダーを読み込む際に作成した div (headerContainer) の子要素としてヘッダーがある場合
    // const headerElement = document.querySelector('#header-container .your-header-class'); // 例
    let headerHeight = 0;
    if (headerElement) {
        headerHeight = headerElement.offsetHeight; // ヘッダーの高さを取得
        // console.log("Header Height:", headerHeight); // デバッグ用
    } else {
        // ヘッダー要素が見つからない場合、適切なデフォルト値を設定するか警告
        console.warn("ヘッダー要素が見つかりません。スクロールオフセットが適用されない可能性があります。");
        // 例: デフォルトで60pxとする場合
        // headerHeight = 60; 
    }


    const repoName = location.pathname.split('/')[1] || '';
    const baseUrl = repoName ? `/${repoName}` : '';

    let url = new URL(page, window.location.origin);
    let targetPage = url.pathname.split('/').pop();
    let hash = url.hash;

    const fetchPage = targetPage; 

    fetch(fetchPage)
        .then(response => {
            if (!response.ok) {
                console.error(`コンテンツロード失敗: ${response.url} - HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('#content');

            if (newContent) {
                const elementsWithSrcOrHref = newContent.querySelectorAll('[src], [href]');
                elementsWithSrcOrHref.forEach(el => {
                    let attribute = el.getAttribute('src') || el.getAttribute('href');

                    if (attribute && !attribute.startsWith('http://') && !attribute.startsWith('https://')) {
                        if (attribute.startsWith('/')) {
                            const newPath = `${baseUrl}${attribute}`;
                            if (el.hasAttribute('src')) {
                                el.src = newPath;
                            } else {
                                el.href = newPath;
                            }
                        }
                    }
                });

                contentDiv.innerHTML = newContent.innerHTML;

                // ★修正: スクロールロジックを調整
                if (!hash) { 
                    window.scrollTo(0, 0);
                } else {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        // 要素のY座標を取得し、ヘッダーの高さを引く
                        const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                        window.scrollTo({
                            top: targetOffset,
                            behavior: 'smooth'
                        });
                    } else {
                        // ターゲット要素が見つからない場合、ページトップにスクロール
                        window.scrollTo(0, 0);
                    }
                }
                
                initializePageSpecificFeatures();

                if (document.body.classList.contains('light-mode')) {
                    applyLightModeToAll(); 
                } else {
                    removeLightModeFromAll();
                }

                if (updateHistory) {
                    history.pushState({ page: page }, '', `${baseUrl}/?page=${targetPage}${hash}`);
                }

            } else {
                console.error(`#content要素が読み込まれたHTML内に見つかりません: ${fetchPage}`);
            }
        })
        .catch(error => {
            contentDiv.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">コンテンツを読み込めませんでした。お手数ですが、後ほどもう一度お試しください。</p>`;
            console.error('コンテンツロードエラー:', error.message);
        });
}

function initializePageSpecificFeatures() {
    if (typeof initializeContactForm === 'function') {
        initializeContactForm();
    }

    if (typeof initializeTopicToggle === 'function') {
        initializeTopicToggle();
    }
    
    // ★修正: ドロップダウンメニューの初期化関数を呼び出す
    initializeSeminarRecordDropdowns(); 
}
 
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
        event.preventDefault();

            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const message = document.getElementById('message')?.value || '';

            const responseMessage = document.getElementById('responseMessage');
            if (responseMessage) {
                responseMessage.textContent = 'メッセージが送信されました。ありがとうございます！';
                responseMessage.style.color = 'green';
            }

            contactForm.reset();
        });
    }
}

function initializeThemeSwitcher() {
    const themeSwitcherButton = document.getElementById('themeSwitch');
    const body = document.body;

    if (!themeSwitcherButton) {
        console.warn('テーマ切り替えボタンが見つかりません (#themeSwitch)。');
        return;
    }

    body.classList.add('light-mode');
    applyLightModeToAll();
    themeSwitcherButton.textContent = '現在：ライトモード';

    themeSwitcherButton.addEventListener('click', () => {
        const isCurrentlyLight = body.classList.contains('light-mode');

        if (isCurrentlyLight) {
                body.classList.remove('light-mode');
                removeLightModeFromAll();
                themeSwitcherButton.textContent = '現在：ダークモード';
        } else {
                body.classList.add('light-mode');
                applyLightModeToAll();
                themeSwitcherButton.textContent = '現在：ライトモード';
        }
    });
}

function applyLightModeToAll() {
    if (!document.body.classList.contains('light-mode')) {
        console.warn("applyLightModeToAll が呼ばれましたが、bodyにlight-modeクラスがありません。");
        return;
    }
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => el.classList.add('light-mode'));
}

function removeLightModeFromAll() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => el.classList.remove('light-mode'));
}

// セミナー記録のドロップダウンメニューの初期化とトグルのロジック
function initializeSeminarRecordDropdowns() {
    const seminarYears = document.querySelectorAll('.seminar_record_year');

    seminarYears.forEach(seminarYearDiv => {
        const dropdownButton = seminarYearDiv.querySelector('.seminar_record_year_dropdown-toggle');
        const dropdownContent = seminarYearDiv.querySelector('.seminar_record_year_content'); 
        const arrow = seminarYearDiv.querySelector('.seminar_record_year_arrow');

        if (dropdownButton && dropdownContent && arrow) {
            // 初期状態を設定 (閉じている状態)
            dropdownContent.style.display = "none";
            arrow.textContent = "◀";

            // 初期化時に、内部のアイテムも非表示状態（opacity:0, transform:Y(-10px)）にする
            const items = dropdownContent.querySelectorAll('.seminar_record_item');
            items.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
            });

            // ボタンにイベントリスナーを追加
            dropdownButton.addEventListener('click', () => {
                toggleDropdownLogic(dropdownContent, arrow);
            });
        }
    });
}

// ドロップダウンの表示/非表示を切り替える内部ロジック
function toggleDropdownLogic(content, arrow) {
    const items = content.querySelectorAll('.seminar_record_item'); // 中身のアイテムを取得

    if (content.style.display === "block") {
        // 非表示
        arrow.textContent = "◀";
        content.style.display = "none";
    } else {
        // 現在非表示の場合、表示してフェードイン・ドロップダウンさせる
        content.style.display = "block"; // まず全体をすぐに表示
        arrow.textContent = "▼";

        // アイテムを順次フェードイン・スライドダウンさせる
        items.forEach((item, index) => {
            // アニメーションを開始する前に、transitionをリセットする（念のため）
            item.style.transition = 'none';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            item.offsetWidth; // 強制的にリフローさせる

            // 実際の表示アニメーションを開始
            setTimeout(() => {
                item.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 80); // 各アイテムを80msずつ遅延させて表示
        });
    }
}