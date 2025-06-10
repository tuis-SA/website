// トピックの「もっと見る」機能を初期化（5件ずつ表示・全閉じる機能付き）
function initializeTopicToggle() {
    const moreButton = document.getElementById('toggleTopicsButton_more');
    const closeButton = document.getElementById('toggleTopicsButton_close');
    const allTopics = document.querySelectorAll('.extra-topic'); // 全ての「extra-topic」要素
    const newTopicStartElement = document.getElementById('newTopicStart'); // 追加: スクロール先の要素

    // 1回のクリックで表示する件数
    const displayCount = 5;
    // 現在表示されているトピックの数
    let currentVisibleCount = 0;
    // moreボタンが最初にクリックされた時のスクロール位置を記録する変数
    let initialMoreClickScrollY = null; // nullで初期化

    // ボタンが存在しない、またはトピックがない場合は処理しない
    if (!moreButton || !closeButton || allTopics.length === 0) return;

    // 初期状態の設定
    function resetTopics() {
        // 全てのトピックから is-visible クラスを削除し、非表示にする
        allTopics.forEach(topic => {
            topic.classList.remove('is-visible');
        });
        currentVisibleCount = 0; // すべて非表示なので0件
        updateButtonVisibility(); // moreボタンの表示を更新
    }

    // ボタンの表示状態を更新する関数
    function updateButtonVisibility() {
        // moreボタン: 全てのトピックが表示されたら非表示にする
        if (currentVisibleCount >= allTopics.length) {
            moreButton.classList.add('is-hidden'); // CSSで非表示にするクラスを追加
        } else {
            moreButton.classList.remove('is-hidden'); // CSSで表示するクラスを削除
        }

        // closeボタン: 1件でも表示されているなら表示する
        if (currentVisibleCount > 0) {
            closeButton.classList.remove('is-hidden'); // CSSで表示するクラスを削除
        } else {
            closeButton.classList.add('is-hidden'); // CSSで非表示にするクラスを追加
        }
    }

    // 初期化時にリセット（何も表示されていない状態にする）
    resetTopics();

    // moreボタンのクリックイベント
    moreButton.addEventListener('click', () => {
        // moreボタンが初めてクリックされた時だけ、現在のスクロール位置を記録
        if (initialMoreClickScrollY === null) {
            initialMoreClickScrollY = window.scrollY || window.pageYOffset;
            console.log(`Initial more click scroll Y recorded: ${initialMoreClickScrollY}`);
        }

        const startIndex = currentVisibleCount;
        const endIndex = Math.min(currentVisibleCount + displayCount, allTopics.length);

        // 新たに表示するトピックに is-visible クラスを追加し、表示状態にする
        for (let i = startIndex; i < endIndex; i++) {
            allTopics[i].classList.add('is-visible');
        }

        currentVisibleCount = endIndex; // 表示件数を更新
        updateButtonVisibility(); // ボタンの表示を更新
    });

    // Close allボタンのクリックイベント
    closeButton.addEventListener('click', () => {
        resetTopics(); // 全て非表示に戻す
        updateButtonVisibility(); // ボタンの表示を更新

        // moreボタンが一度でもクリックされ、かつその時のスクロール位置が記録されている場合
        if (initialMoreClickScrollY !== null) {
            console.log(`Scrolling back to initial more click position: ${initialMoreClickScrollY}`);
            window.scrollTo({
                top: initialMoreClickScrollY,
                behavior: 'smooth' // スムーズにスクロール
            });
            // スクロール後、記録された位置をリセット（次の「more」クリックに備える）
            initialMoreClickScrollY = null;
        } else {
            // スクロール先の要素が指定されている場合
            if (newTopicStartElement) {
                console.log('More button was not clicked. Scrolling to newTopicStartElement.');
                newTopicStartElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.log('No specific scroll back point or newTopicStartElement defined.');
            }
        }
    });

    // 初期ロード時にもボタンの表示状態を更新
    updateButtonVisibility();
}