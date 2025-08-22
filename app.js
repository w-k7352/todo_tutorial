document.addEventListener('DOMContentLoaded', () => {
    const App = (() => {
        // ViewモジュールのDOM要素を初期化
        View.init();

        const state = {
            tasks: [],
            filter: {
                keyword: '',
                tag: '',
                dueStart: '',
                dueEnd: '',
                status: 'all'
            },
            sort: 'created_at_desc'
        };

        const ui = View.elements;

        const render = () => {
            let filteredTasks = [...state.tasks];

            // Filter
            if (state.filter.keyword) {
                const keyword = state.filter.keyword.toLowerCase();
                filteredTasks = filteredTasks.filter(t => 
                    t.title.toLowerCase().includes(keyword) || 
                    t.tags.some(tag => tag.toLowerCase().includes(keyword))
                );
            }
            if (state.filter.tag) {
                filteredTasks = filteredTasks.filter(t => t.tags.includes(state.filter.tag));
            }
            if (state.filter.status !== 'all') {
                filteredTasks = filteredTasks.filter(t => t.status === state.filter.status);
            }
            if (state.filter.dueStart) {
                filteredTasks = filteredTasks.filter(t => t.due && t.due >= state.filter.dueStart);
            }
            if (state.filter.dueEnd) {
                filteredTasks = filteredTasks.filter(t => t.due && t.due <= state.filter.dueEnd);
            }

            // Sort
            filteredTasks.sort((a, b) => {
                switch (state.sort) {
                    case 'title_asc':
                        return a.title.localeCompare(b.title);
                    case 'due_date_asc':
                        if (!a.due) return 1; if (!b.due) return -1;
                        return new Date(a.due) - new Date(b.due);
                    case 'created_at_asc':
                        return new Date(a.created_at) - new Date(b.created_at);
                    case 'created_at_desc':
                    default:
                        return new Date(b.created_at) - new Date(a.created_at);
                }
            });

            View.renderTasks(filteredTasks);
            View.updateCounters(state.tasks);
        };

        const handleAddTask = (e) => {
            e.preventDefault();
            const title = ui.taskTitleInput.value.trim();
            if (!title) {
                View.showToast('タスクのタイトルは必須です。');
                return;
            }
            const now = Utils.getCurrentISOTime();
            const newTask = {
                id: Utils.generateUUID(),
                title: title,
                due: ui.taskDueDateInput.value || null,
                tags: ui.taskTagsInput.value.split(',').map(t => t.trim()).filter(Boolean),
                status: 'todo',
                created_at: now,
                updated_at: now
            };
            TaskRepository.add(newTask);
            state.tasks.push(newTask);
            View.clearNewTaskForm();
            View.showToast('タスクを追加しました。');
            render();
        };

        const handleTaskListClick = (e) => {
            const target = e.target;
            const taskRow = target.closest('tr');
            if (!taskRow) return;
            const taskId = taskRow.dataset.taskId;

            if (target.classList.contains('delete-button')) {
                if (confirm('本当にこのタスクを削除しますか？')) {
                    TaskRepository.remove(taskId);
                    state.tasks = state.tasks.filter(t => t.id !== taskId);
                    View.showToast('タスクを削除しました。');
                    render();
                }
            } else if (target.classList.contains('edit-button')) {
                const task = state.tasks.find(t => t.id === taskId);
                if (task) View.showEditModal(task);
            } else if (target.classList.contains('toggle-status')) {
                const task = state.tasks.find(t => t.id === taskId);
                if (task) {
                    task.status = task.status === 'done' ? 'todo' : 'done';
                    task.updated_at = Utils.getCurrentISOTime();
                    TaskRepository.update(task);
                    View.showToast('ステータスを更新しました。');
                    render();
                }
            }
        };

        const handleEditFormSubmit = (e) => {
            e.preventDefault();
            const id = ui.editTaskId.value;
            const updatedTask = {
                ...state.tasks.find(t => t.id === id),
                title: ui.editTaskTitle.value.trim(),
                due: ui.editTaskDue.value || null,
                tags: ui.editTaskTags.value.split(',').map(t => t.trim()).filter(Boolean),
                status: ui.editTaskStatus.value,
                updated_at: Utils.getCurrentISOTime()
            };
            TaskRepository.update(updatedTask);
            state.tasks = state.tasks.map(t => t.id === id ? updatedTask : t);
            View.hideEditModal();
            View.showToast('タスクを更新しました。');
            render();
        };

        const handleFilterAndSortChange = () => {
            state.filter.keyword = document.getElementById('search-keyword').value;
            state.filter.tag = document.getElementById('filter-tag').value;
            state.filter.dueStart = document.getElementById('filter-due-start').value;
            state.filter.dueEnd = document.getElementById('filter-due-end').value;
            state.filter.status = document.getElementById('filter-status').value;
            state.sort = document.getElementById('sort-by').value;
            render();
        };

        const handleClearFilters = () => {
            document.getElementById('search-keyword').value = '';
            document.getElementById('filter-tag').value = '';
            document.getElementById('filter-due-start').value = '';
            document.getElementById('filter-due-end').value = '';
            document.getElementById('filter-status').value = 'all';
            handleFilterAndSortChange();
        };

        const handleExportCSV = () => {
            const headers = ['id', 'title', 'due', 'tags', 'status', 'created_at', 'updated_at'];
            const tasksToExport = TaskRepository.getAll(); // 全件エクスポート
            let csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += headers.map(h => Utils.escapeCSV(h)).join(',') + '\r\n';

            tasksToExport.forEach(task => {
                const row = headers.map(header => {
                    const value = header === 'tags' ? task.tags.join(' ') : task[header];
                    return Utils.escapeCSV(value);
                });
                csvContent += row.join(',') + '\r\n';
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'tasks.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            View.showToast('CSVをエクスポートしました。');
        };

        const init = () => {
            // Load initial data
            state.tasks = TaskRepository.getAll();

            // Setup event listeners
            ui.addTaskForm.addEventListener('submit', handleAddTask);
            ui.taskListBody.addEventListener('click', handleTaskListClick);
            ui.editTaskForm.addEventListener('submit', handleEditFormSubmit);
            ui.modalCloseButton.addEventListener('click', View.hideEditModal);
            
            // Filters and Sorts
            const controls = ['search-keyword', 'filter-tag', 'filter-due-start', 'filter-due-end', 'filter-status', 'sort-by'];
            controls.forEach(id => document.getElementById(id).addEventListener('change', handleFilterAndSortChange));
            document.getElementById('clear-filters-button').addEventListener('click', handleClearFilters);
            document.getElementById('export-csv-button').addEventListener('click', handleExportCSV);

            // Initial render
            render();
        };

        return { init };
    })();

    App.init();
});