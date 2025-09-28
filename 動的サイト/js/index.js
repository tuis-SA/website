// トピックの「もっと見る」機能を初期化（5件ずつ表示・全閉じる機能付き）
function initializeTopicToggle() {
    const moreButton = document.getElementById('toggleTopicsButton_more');
    const closeButton = document.getElementById('toggleTopicsButton_close');
    const allTopics = document.querySelectorAll('.extra-topic'); // 全ての「extra-topic」要素
    // 追加: スクロール先の要素。例えば「トピック」セクションのタイトルなど
    const topicSectionTitle = document.getElementById('newTopicStart'); 

    // 1回のクリックで表示する件数
    const displayCount = 5;
    // 現在表示されているトピックの数
    let currentVisibleCount = 0;
    // moreボタンが最初にクリックされた時のスクロール位置を記録する変数
    let initialMoreClickScrollY = null; // nullで初期化

    // ボタンが存在しない、またはトピックがない場合は処理しない
    if (!moreButton || !closeButton || allTopics.length === 0) {
        // console.warn("トピック切り替え機能に必要な要素が見つかりません。");
        return;
    }

    // 初期状態の設定（全てのトピックを非表示にし、ボタンの状態を更新）
    function hideAllTopics() {
        allTopics.forEach(topic => {
            topic.classList.remove('is-visible');
        });
        currentVisibleCount = 0;
        updateButtonVisibility();
    }

    // 指定された数のトピックを表示する関数
    function showTopics(count) {
        // まず全て非表示にしてから
        hideAllTopics(); // この関数内でcurrentVisibleCountもリセットされる

        // 指定された数だけ表示
        for (let i = 0; i < count; i++) {
            if (allTopics[i]) {
                allTopics[i].classList.add('is-visible');
            }
        }
        currentVisibleCount = count;
        updateButtonVisibility();
    }

    // ボタンの表示状態を更新する関数
    function updateButtonVisibility() {
        // moreボタン: 全てのトピックが表示されたら非表示にする
        if (currentVisibleCount >= allTopics.length) {
            moreButton.classList.add('is-hidden');
        } else {
            moreButton.classList.remove('is-hidden');
        }

        // closeボタン: 1件でも表示されているなら表示する
        if (currentVisibleCount > 0) {
            closeButton.classList.remove('is-hidden');
        } else {
            closeButton.classList.add('is-hidden');
        }
    }

    // initializePageSpecificFeatures から呼ばれる際に初期化
    // デフォルトで最初の数件（例: 0件または3件など）を表示したい場合はここで呼び出す
    // 例: 最初の3件を表示したい場合
    // showTopics(3); 
    // 現在のコードの動作 (初期は全て非表示) に合わせるため、以下を実行:
    hideAllTopics(); // すべて非表示からスタート

    // moreボタンのクリックイベント
    moreButton.addEventListener('click', () => {
        // moreボタンが初めてクリックされた時だけ、現在のスクロール位置を記録
        // ただし、もし `newTopicStart` にスクロールさせるなら、その要素の位置を記録した方が良い
        if (initialMoreClickScrollY === null && topicSectionTitle) {
            initialMoreClickScrollY = topicSectionTitle.getBoundingClientRect().top + window.scrollY;
            console.log(`Initial more click scroll Y recorded: ${initialMoreClickScrollY}`);
        } else if (initialMoreClickScrollY === null) {
            // newTopicStartElementがない場合は、クリック時の現在のスクロール位置を記録
            initialMoreClickScrollY = window.scrollY || window.pageYOffset;
            console.log(`Initial more click scroll Y (fallback) recorded: ${initialMoreClickScrollY}`);
        }
        

        const startIndex = currentVisibleCount;
        const endIndex = Math.min(currentVisibleCount + displayCount, allTopics.length);

        // 新たに表示するトピックに is-visible クラスを追加し、表示状態にする
        for (let i = startIndex; i < endIndex; i++) {
            allTopics[i].classList.add('is-visible');
        }

        currentVisibleCount = endIndex; // 表示件数を更新
        updateButtonVisibility(); // ボタンの表示を更新

        // ★追加: 新しく表示された最初の要素が見えるようにスクロールする
        // これにより、ユーザーが追加されたコンテンツを見つけやすくなる
        if (startIndex < endIndex && allTopics[startIndex]) {
            allTopics[startIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start' // または 'nearest'
            });
        }
    });

    // Close allボタンのクリックイベント
    closeButton.addEventListener('click', () => {
        hideAllTopics(); // 全て非表示に戻す (updateButtonVisibilityも内部で呼ばれる)

        // moreボタンが一度でもクリックされ、かつその時のスクロール位置が記録されている場合
        if (initialMoreClickScrollY !== null) {
            console.log(`Scrolling back to initial more click position: ${initialMoreClickScrollY}`);
            window.scrollTo({
                top: initialMoreClickScrollY,
                behavior: 'smooth' // スムーズにスクロール
            });
            // スクロール後、記録された位置をリセット（次の「more」クリックに備える）
            initialMoreClickScrollY = null;
        } else if (topicSectionTitle) {
            // moreボタンがクリックされておらず、スクロール先の要素が指定されている場合
            console.log('More button was not clicked. Scrolling to topicSectionTitle.');
            topicSectionTitle.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.log('No specific scroll back point or topicSectionTitle defined.');
            // どこにもスクロールしない、またはページトップにスクロールするなどの代替処理
            // window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    });
}