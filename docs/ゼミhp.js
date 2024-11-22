//ss　ゼミjs仮
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

