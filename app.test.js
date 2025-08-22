const { screen, fireEvent } = require('@testing-library/dom');
const fs = require('fs');
const path = require('path');

// HTMLファイルを読み込み、テスト環境のDOMにセットアップします
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('App Integration Tests', () => {

    let addSpy;

    beforeEach(() => {
        // 1. 準備 (Arrange)
        // テストの前に、毎回HTMLの構造をDOMに設定します
        document.body.innerHTML = html;

        // 2. 依存関係のセットアップ
        // ブラウザ環境ではスクリプトがグローバル変数（window.Utilsなど）を定義することを想定しているため、
        // テスト環境でも同様にグローバルにセットします。
        global.Utils = require('./utils');
        global.TaskRepository = require('./taskRepository');
        global.View = require('./view');

        // 3. スパイの作成
        // TaskRepository.add関数が呼ばれたかを監視する「スパイ」を作成します。
        addSpy = jest.spyOn(global.TaskRepository, 'add').mockImplementation(() => {});

        // 4. アプリケーションのメインスクリプトを実行
        require('./app.js');
        // app.js内のDOMContentLoadedイベントを手動で発火させ、App.init()を呼び出します。
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
    });

    afterEach(() => {
        // 各テストの後にスパイを解放（元に戻）します。
        addSpy.mockRestore();
    });

    test('should add a task when user types and clicks the add button', () => {
        // 1. 準備 (Arrange) - beforeEachで完了

        // 2. 実行 (Act)
        // screenオブジェクトは、現在のDOMから要素を検索するのに役立ちます。
        const input = screen.getByPlaceholderText('タスクのタイトル (必須)');
        const addButton = screen.getByText('追加');

        // ユーザーの操作をシミュレートします。
        fireEvent.change(input, { target: { value: 'Test Task 1' } });
        fireEvent.click(addButton);

        // 3. 確認 (Assert)
        // TaskRepository.add関数が1回呼ばれたことを確認します。
        expect(addSpy).toHaveBeenCalledTimes(1);

        // add関数が呼ばれた時の引数をチェックします。
        expect(addSpy).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Test Task 1'
        }));
    });
});
