const TaskRepository = require('./taskRepository');

// 偽物のlocalStorage（モック）を定義します。
// 実際のブラウザのlocalStorageの代わりに、このオブジェクトを使います。
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

// Jestのグローバル空間にあるlocalStorageを、私たちのモックに置き換えます。
// これにより、TaskRepository内のコードが'localStorage'を呼び出すと、
// 実際には我々の作った偽物が使われるようになります。
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('TaskRepository', () => {

    // 'beforeEach'は、このdescribeブロック内の各テストが実行される前に毎回呼ばれます。
    // ここでlocalStorageをクリアすることで、テスト同士が互いに影響しないようにします。
    beforeEach(() => {
        localStorage.clear();
    });

    test('should add a task and get all tasks', () => {
        // 1. 準備 (Arrange)
        const newTask = { id: '1', title: 'Test Task', status: 'todo' };

        // 2. 実行 (Act)
        TaskRepository.add(newTask);

        // 3. 確認 (Assert)
        const tasks = TaskRepository.getAll();
        expect(tasks.length).toBe(1);
        // 'toEqual'はオブジェクトや配列の中身が等しいかをチェックします。
        expect(tasks[0]).toEqual(newTask);
    });

    test('should remove a task by id', () => {
        // 1. 準備 (Arrange)
        const task1 = { id: '1', title: 'Task 1' };
        const task2 = { id: '2', title: 'Task 2' };
        TaskRepository.add(task1);
        TaskRepository.add(task2);

        // 2. 実行 (Act)
        TaskRepository.remove('1'); // id '1' のタスクを削除

        // 3. 確認 (Assert)
        const tasks = TaskRepository.getAll();
        expect(tasks.length).toBe(1);
        expect(tasks[0].id).toBe('2');
    });

    test('getAll should return an empty array when storage is empty', () => {
        // 1. 準備 (Arrange) - 何もしない（localStorageは空のはず）
        
        // 2. 実行 (Act)
        const tasks = TaskRepository.getAll();

        // 3. 確認 (Assert)
        expect(tasks.length).toBe(0);
        expect(tasks).toEqual([]);
    });
});
