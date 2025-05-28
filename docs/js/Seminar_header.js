document.addEventListener('DOMContentLoaded', () => {
  // フェードイン効果の設定
  document.body.classList.add('fade-in');

  // ページ読み込み完了時の処理
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

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

      // テーマ切り替えボタンの初期化
      initializeThemeSwitcher();
    })
    .catch(error => {
      console.error('ヘッダーを読み込めませんでした:', error);
    });
});

// 初期コンテンツのロード
function loadInitialContent() {
  const initialLink = document.querySelector('.nav-link[data-page="index.html"]');
  if (initialLink) {
    initialLink.classList.add('active');
  }
  loadContent('index.html');
}

// ナビゲーションリンクにイベントを設定
function initializeNavEvents() {
  document.addEventListener('click', event => {
    const target = event.target.closest('.nav-link');
    if (target && target.dataset.page) {
      event.preventDefault();

      // 他のリンクの "active" クラスを解除
      const links = document.querySelectorAll('.nav-link');
      links.forEach(link => link.classList.remove('active'));

      // 現在のリンクに "active" クラスを追加
      target.classList.add('active');

      // 動的にコンテンツをロード
      loadContent(target.dataset.page);
    }
  });
}

// ハンバーガーメニューの初期化
function initializeHamburgerMenu() {
  const hamburgerMenu = document.querySelector('.hamburger_menu');
  const menu = document.querySelector('.menu');
  const menuLinks = document.querySelectorAll('.menu li a'); // メニュー内の各リンク

  if (hamburgerMenu && menu) {
    // ハンバーガーメニューをクリックしたときにメニューの表示切替
    hamburgerMenu.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    // 各リンクをクリックしたときにメニューを閉じる
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    });
  } else {
    console.error('ハンバーガーメニューまたはメニューが見つかりません');
  }
}

// 動的コンテンツのロード
function loadContent(page) {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) {
    console.error('content要素が見つかりません');
    return;
  }

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
      const newContent = doc.querySelector('#content');

      if (newContent) {
        contentDiv.innerHTML = newContent.innerHTML;

        // ページの一番上にスクロール
        window.scrollTo(0, 0);

        // ページ固有の初期化処理を実行
        initializePageSpecificFeatures();
        
        // テーマを再適用
        if (document.body.classList.contains('light-mode')) {
          applyLightModeToAll();
        }
        
      } else {
        console.error(`#contentが見つかりません: ${page}`);
      }
    })
    .catch(error => {
      contentDiv.innerHTML = `<p>コンテンツを読み込めませんでした。</p>`;
      console.error('コンテンツエラー:', error.message);
    });
}

// ページごとの初期化処理
function initializePageSpecificFeatures() {
  if (typeof initializeContactForm === 'function') {
    initializeContactForm();
  }
}

// お問い合わせフォームの送信処理
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

  // 初期状態のテーマを適用
  const isLightMode = localStorage.getItem('theme') === 'light';
  if (isLightMode) {
    body.classList.add('light-mode');
    applyLightModeToAll();
    themeSwitcherButton.textContent = '現在：ライトモード';
  }

  // テーマ切り替え時の処理
  themeSwitcherButton.addEventListener('click', () => {
    const isCurrentlyLight = body.classList.contains('light-mode');

    if (isCurrentlyLight) {
      body.classList.remove('light-mode');
      removeLightModeFromAll();
      themeSwitcherButton.textContent = '現在：ダークモード';
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.add('light-mode');
      applyLightModeToAll();
      themeSwitcherButton.textContent = '現在：ライトモード';
      localStorage.setItem('theme', 'light');
    }
  });
}

// light-mode クラスを全要素に適用
function applyLightModeToAll() {
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => el.classList.add('light-mode'));
}

// light-mode クラスを全要素から削除
function removeLightModeFromAll() {
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => el.classList.remove('light-mode'));
}
