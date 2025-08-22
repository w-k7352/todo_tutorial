const TaskRepository = (() => {
    const STORAGE_KEY = 'todo_tasks_v1';

    /**
     * localStorageから全てのタスクを取得します。
     * @returns {Array} タスクの配列
     */
    const getAll = () => {
        try {
            const tasksJSON = localStorage.getItem(STORAGE_KEY);
            return tasksJSON ? JSON.parse(tasksJSON) : [];
        } catch (e) {
            console.error('Failed to parse tasks from localStorage', e);
            return [];
        }
    };

    /**
     * 全てのタスクをlocalStorageに保存します。
     * @param {Array} tasks - 保存するタスクの配列
     */
    const saveAll = (tasks) => {
        try {
            const tasksJSON = JSON.stringify(tasks);
            localStorage.setItem(STORAGE_KEY, tasksJSON);
        } catch (e) {
            console.error('Failed to save tasks to localStorage', e);
        }
    };

    /**
     * 新しいタスクを追加します。
     * @param {object} task - 追加するタスクオブジェクト
     */
    const add = (task) => {
        const tasks = getAll();
        tasks.push(task);
        saveAll(tasks);
    };

    /**
     * 既存のタスクを更新します。
     * @param {object} updatedTask - 更新するタスクオブジェクト
     */
    const update = (updatedTask) => {
        let tasks = getAll();
        tasks = tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
        );
        saveAll(tasks);
    };

    /**
     * 指定されたIDのタスクを削除します。
     * @param {string} taskId - 削除するタスクのID
     */
    const remove = (taskId) => {
        let tasks = getAll();
        tasks = tasks.filter(task => task.id !== taskId);
        saveAll(tasks);
    };

    return {
        getAll,
        saveAll,
        add,
        update,
        remove
    };
})();


module.exports = TaskRepository;