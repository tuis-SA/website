//ss　Seminarjs仮
// ページタイトルの更新関数
function updateTitle(title) {
    document.getElementById('page-title').textContent = title;
}

// お問い合わせフォームの送信処理
document.addEventListener('DOMContentLoaded', function() {
  // ページタイトルの更新関数
  function updateTitle(title) {
    document.getElementById('page-title').textContent = title;
  }

// お問い合わせフォームの送信処理
const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // フォームのデフォルト動作をキャンセル
            // フォームのデータを取得
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
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
});
// ナビゲーション部分レンダリング
document.addEventListener('DOMContentLoaded', () => {
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

            // ヘッダーがロードされた後でリンクにイベントリスナーを設定
            initializeNavEvents();

            // 初期コンテンツを読み込む
            loadInitialContent();
        })
        .catch(error => {
            console.error('ヘッダーを読み込めませんでした:', error.message);
        });
});

function initializeNavEvents() {
    const links = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');

    // 初期状態でホームリンクをアクティブ化
    if (links.length > 0) {
        links[0].classList.add('active');  // ホームをアクティブ化
        loadContent(links[0].dataset.page);  // 初期コンテンツを読み込む
    }

    // リンクがクリックされた時のイベント
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();  // デフォルトの動作を防ぐ

            // すべてのリンクからactiveクラスを削除
            links.forEach(l => l.classList.remove('active'));

            // クリックされたリンクをアクティブ化
            link.classList.add('active');

            // 対応するページを読み込む
            loadContent(link.dataset.page);
        });
    });
}

function loadInitialContent() {
    const contentDiv = document.getElementById('content');
    fetch('index.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
        })
        .catch(error => {
            contentDiv.innerHTML = `<p>初期コンテンツを読み込めませんでした。</p>`;
            console.error(error);
        });
}

function loadContent(page) {
    const contentDiv = document.getElementById('content');
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
        })
        .catch(error => {
            contentDiv.innerHTML = `<p>コンテンツを読み込めませんでした。</p>`;
            console.error(error);
        });
}