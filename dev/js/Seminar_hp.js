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

//ナビゲーション部分レンダリング
document.addEventListener('DOMContentLoaded', () => {
    // ヘッダーとナビゲーションを読み込む
    const headerContainer = document.createElement('div'); // コンテナを作成
    document.body.insertBefore(headerContainer, document.body.firstChild); // 最初に挿入

    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            headerContainer.innerHTML = html;

            // ナビゲーションリンクのクリックイベントを再設定
            const links = document.querySelectorAll('.nav-link');
            const contentDiv = document.getElementById('content');

            links.forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault(); // デフォルトのリンク動作を防ぐ
                    const page = link.dataset.page;

                    fetch(page)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(html => {
                            contentDiv.innerHTML = html; // 取得したHTMLを挿入
                        })
                        .catch(error => {
                            contentDiv.innerHTML = `<p>コンテンツを読み込めませんでした。</p>`;
                            console.error(error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('ヘッダーを読み込めませんでした:', error.message);
        });
});
