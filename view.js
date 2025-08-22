const View = (() => {
    // DOM要素のキャッシュ（初期化は後で行う）
    const elements = {};

    // DOM要素を検索してキャッシュに格納する
    const initializeDOMElements = () => {
        // Counters
        elements.counterTodo = document.getElementById('counter-todo');
        elements.counterDoing = document.getElementById('counter-doing');
        elements.counterDone = document.getElementById('counter-done');
        // New Task Form
        elements.addTaskForm = document.getElementById('add-task-form');
        elements.taskTitleInput = document.getElementById('task-title-input');
        elements.taskDueDateInput = document.getElementById('task-due-date-input');
        elements.taskTagsInput = document.getElementById('task-tags-input');
        // Task List
        elements.taskListBody = document.getElementById('task-list-body');
        // Edit Modal
        elements.editModal = document.getElementById('edit-modal');
        elements.editTaskForm = document.getElementById('edit-task-form');
        elements.editTaskId = document.getElementById('edit-task-id');
        elements.editTaskTitle = document.getElementById('edit-task-title');
        elements.editTaskDue = document.getElementById('edit-task-due');
        elements.editTaskTags = document.getElementById('edit-task-tags');
        elements.editTaskStatus = document.getElementById('edit-task-status');
        elements.modalCloseButton = document.getElementById('modal-close-button');
        // Toast
        elements.toast = document.getElementById('toast-notification');
    };

    const getStatusText = (status) => {
        const map = { todo: '未着手', doing: '進行中', done: '完了' };
        return map[status] || '';
    };

    const getDueDateBadge = (due) => {
        if (!due) return '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(due);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) return '<span class="due-badge due-overdue">期限切れ</span>';
        if (dueDate.getTime() === today.getTime()) return '<span class="due-badge due-today">本日期限</span>';
        return ''; // 未来の期限はバッジなし
    };

    const renderTasks = (tasks) => {
        elements.taskListBody.innerHTML = '';
        if (tasks.length === 0) {
            elements.taskListBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">タスクはありません</td></tr>';
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.dataset.taskId = task.id;
            row.className = task.status === 'done' ? 'task-item--done' : '';

            const escapedTitle = Utils.escapeForHTML(task.title);
            const escapedTags = Utils.escapeForHTML(task.tags.join(', '));

            row.innerHTML = `
                <td class="col-toggle"><input type="checkbox" class="toggle-status" ${task.status === 'done' ? 'checked' : ''}></td>
                <td class="col-title task-title">${escapedTitle}</td>
                <td class="col-status"><span class="status-badge status-${task.status}">${getStatusText(task.status)}</span></td>
                <td class="col-due">${task.due || ''} ${getDueDateBadge(task.due)}</td>
                <td class="col-tags">${escapedTags}</td>
                <td class="col-dates">
                    作成: ${Utils.formatDateTime(task.created_at)}<br>
                    更新: ${Utils.formatDateTime(task.updated_at)}
                </td>
                <td class="col-actions">
                    <button class="action-button edit-button">編集</button>
                    <button class="action-button delete-button">削除</button>
                </td>
            `;
            elements.taskListBody.appendChild(row);
        });
    };

    const updateCounters = (tasks) => {
        const counts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, { todo: 0, doing: 0, done: 0 });

        elements.counterTodo.textContent = counts.todo;
        elements.counterDoing.textContent = counts.doing;
        elements.counterDone.textContent = counts.done;
    };

    const clearNewTaskForm = () => {
        elements.addTaskForm.reset();
    };

    const showEditModal = (task) => {
        elements.editTaskId.value = task.id;
        elements.editTaskTitle.value = task.title;
        elements.editTaskDue.value = task.due || '';
        elements.editTaskTags.value = task.tags.join(', ');
        elements.editTaskStatus.value = task.status;
        elements.editModal.classList.add('is-visible');
    };

    const hideEditModal = () => {
        elements.editModal.classList.remove('is-visible');
    };

    let toastTimer;
    const showToast = (message) => {
        if (toastTimer) clearTimeout(toastTimer);
        elements.toast.textContent = message;
        elements.toast.classList.add('show');
        toastTimer = setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    };

    return {
        init: initializeDOMElements, // initという名前で関数を公開
        elements,
        renderTasks,
        updateCounters,
        clearNewTaskForm,
        showEditModal,
        hideEditModal,
        showToast
    };
})();

module.exports = View;