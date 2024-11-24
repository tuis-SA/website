// ヘッダーとナビゲーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.createElement('div');
    document.body.insertBefore(headerContainer, document.body.firstChild);

    // ヘッダーをロード
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            headerContainer.innerHTML = html;

            // ナビゲーションイベントを設定
            initializeNavEvents();

            // 初期コンテンツをロード
            loadInitialContent();
        })
        .catch(error => {
            console.error('ヘッダーを読み込めませんでした:', error.message);
        });
});

// 初期コンテンツを読み込む
function loadInitialContent() {
    loadContent('index.html'); // 初期ページとして`index.html`をロード
}

// ナビゲーションリンクにイベントを設定
function initializeNavEvents() {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault(); // デフォルトの動作を防ぐ

            // すべてのリンクからactiveクラスを削除
            links.forEach(l => l.classList.remove('active'));

            // クリックされたリンクをアクティブ化
            link.classList.add('active');

            // 対応するページを読み込む
            const page = link.dataset.page;
            if (page) {
                loadContent(page);
            }
        });
    });
}

// 指定したHTMLファイルから`#content`部分を動的に取得して置き換える
function loadContent(page) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('content要素が見つかりません');
        return;
    }
    console.log(`Loading content for: ${page}`); // デバッグ用ログ
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 新しいコンテンツの#contentを取得
            const newContent = doc.querySelector('#content');
            if (newContent) {
                // 現在の#contentを新しい#contentで置き換え
                contentDiv.innerHTML = newContent.innerHTML;

                // 必要に応じて動的初期化を実行
                initializePageSpecificFeatures();
            } else {
                console.error(`#contentが見つかりません: ${page}`);
            }
        })
        .catch(error => {
            contentDiv.innerHTML = `<p>コンテンツを読み込めませんでした。</p>`;
            console.error('コンテンツエラー:', error.message);
        });
}

// ページごとの機能を初期化（例: フォーム処理など）
function initializePageSpecificFeatures() {
    if (typeof initializeContactForm === 'function') {
        initializeContactForm(); // お問い合わせフォームの初期化
    } else {
        console.warn('initializeContactForm が見つかりません。');
    }
}

// お問い合わせフォームの送信処理
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // フォームのデフォルト動作をキャンセル

            // フォームのデータを取得
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const message = document.getElementById('message')?.value || '';

            // メッセージ送信完了表示
            const responseMessage = document.getElementById('responseMessage');
            if (responseMessage) {
                responseMessage.textContent = 'メッセージが送信されました。ありがとうございます！';
                responseMessage.style.color = 'green';
            }

            // フォームの内容をクリア
            contactForm.reset();
        });
    }
}
