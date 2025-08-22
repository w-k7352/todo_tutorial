const Utils = require('./utils');

// 'describe' は、関連するテストをグループにまとめるためのものです。
// ここでは「Utilsオブジェクトのテスト」というグループを作っています。
describe('Utils', () => {

    // 'test' または 'it' は、個々のテストケースを定義します。
    // ここでは「formatDateTime関数がISO文字列を正しくフォーマットすること」をテストします。
    test('formatDateTime should format an ISO string correctly', () => {
        // 1. 準備 (Arrange)
        // テストに使うデータ（ISO形式の日付文字列）を用意します。
        const isoString = '2023-10-27T10:00:00.000Z';
        // 期待される結果（YYYY-MM-DD HH:mm形式の文字列）を定義します。
        const expected = '2023-10-27 19:00'; // JST（日本標準時）での時刻

        // 2. 実行 (Act)
        // 実際にテストしたい関数を呼び出して、結果を取得します。
        const result = Utils.formatDateTime(isoString);

        // 3. 確認 (Assert)
        // 'expect(結果).toBe(期待する値)' の形で、結果が期待通りかを確認します。
        // もし結果が期待と違えば、テストは「失敗」したと報告されます。
        expect(result).toBe(expected);
    });

    // ここに、他のUtils関数のテストケースも追加していくことができます。
});
