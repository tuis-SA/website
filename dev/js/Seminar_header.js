document.addEventListener('DOMContentLoaded', () => {
  // フェードイン効果の設定
  document.body.classList.add('fade-in');

  // ページ読み込み完了時の処理
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  // 通常ロードしても、一番上にする。
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // スクロール位置の自動復元を無効化
  }
    window.scrollTo(0, 0); 
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

    // 戻る・進むボタン対応
    window.addEventListener('popstate', (event) => {
    const page = (event.state && event.state.page) || 'index.html';
    loadContent(page, false); // 履歴操作なので履歴を追加しない
    });
});

// 初期コンテンツのロード
function loadInitialContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 'index.html';

  const targetLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (targetLink) {
    targetLink.classList.add('active');
  }
  loadContent(page, false); // 初期ロードでは履歴を追加しない
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
function loadContent(page, updateHistory = true) {
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

        // スクロール、初期化処理など
        window.scrollTo(0, 0);
        initializePageSpecificFeatures();

        if (document.body.classList.contains('light-mode')) {
          applyLightModeToAll();
        }

        // URL を変更（履歴に追加）
        if (updateHistory) {
          history.pushState({ page }, '', `?page=${page}`);
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

  // トピック切り替えの初期化 index.js
  if (typeof initializeTopicToggle === 'function') {
    initializeTopicToggle();
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

    // ボタンが存在しない場合は処理しない
    if (!themeSwitcherButton) return;

    // 初期状態：常にダークモード（light-modeクラスがない状態）
    // 以前のlocalStorageからテーマを読み込む処理は削除しました
    body.classList.remove('light-mode'); // bodyからlight-modeクラスを削除
    removeLightModeFromAll(); // 全要素からlight-modeクラスを削除
    themeSwitcherButton.textContent = '現在：ダークモード'; // ボタンのテキストもダークモードに設定

    // テーマ切り替え時の処理
    themeSwitcherButton.addEventListener('click', () => {
        const isCurrentlyLight = body.classList.contains('light-mode');

        if (isCurrentlyLight) {
            // 現在ライトモードなので、ダークモードに切り替える
            body.classList.remove('light-mode');
            removeLightModeFromAll();
            themeSwitcherButton.textContent = '現在：ダークモード';
            // localStorage.setItem('theme', 'dark'); // localStorageへの保存も不要
        } else {
            // 現在ダークモードなので、ライトモードに切り替える
            body.classList.add('light-mode');
            applyLightModeToAll();
            themeSwitcherButton.textContent = '現在：ライトモード';
            // localStorage.setItem('theme', 'light'); // localStorageへの保存も不要
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