// Playwrightのテストモジュールから、testとexpectをインポートします。
const { test, expect } = require('playwright/test');
const path = require('path');

// テストスイートを定義します。E2Eテストはファイルごとに実行されます。
test.describe('ToDo App E2E Test', () => {

    // 個別のテストケースを定義します。
    test('should allow a user to add a task', async ({ page }) => {
        // 'page'オブジェクトは、ブラウザの単一のタブを表現します。
        // これを使ってブラウザを操作します。

        // 1. 準備 (Arrange)
        // アプリケーションのページに移動します。
        //ローカルのHTMLファイルを開くために、`file://`プロトコルを使います。
        const filePath = path.resolve(__dirname, '../index.html');
        await page.goto(`file://${filePath}`);

        // 2. 実行 (Act)
        const taskTitle = '新しいE2Eタスク';

        // ページ上の要素を検索します。
        // プレースホルダーのテキストを元に入力欄を見つけます。
        const input = page.getByPlaceholder('タスクのタイトル (必須)');

        // ボタンを、その役割（role）と表示名（name）で見つけます。
        const addButton = page.getByRole('button', { name: '追加' });

        // ユーザー操作を実行します。
        // 入力欄にタスク名を入力します。
        await input.fill(taskTitle);
        // 追加ボタンをクリックします。
        await addButton.click();

        // 3. 確認 (Assert)
        // 画面上に、追加したタスクのタイトルが表示されていることを確認します。
        // `expect(locator).toBeVisible()` は、要素が画面に表示されているかをチェックします。
        const newTaskInList = page.locator(`#task-list-body .task-title:text("${taskTitle}")`);
        await expect(newTaskInList).toBeVisible();
    });
});
