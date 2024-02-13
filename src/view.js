export function renderLists(lists) {
    const listsContainer = $('#lists');
    listsContainer.empty();
    lists.forEach(list => {
        listsContainer.append(`<div class="col-md-3 mt-2">
                                    <button class="btn btn-secondary list-btn" id="list-btn-${list.id}" data-id=${list.id}>${list.title}</button>
                             </div>`);
    });
}

export function renderTasks(tasks) {
    const listsContainer = $('#insert-jobs');
    listsContainer.empty();
    tasks.forEach(task => {
        const status = task.status == 1 ? 'Realizado' : 'Pendente';
        listsContainer.append(`
            <tr class="task-item-${task.id}">
                <td class="task-title-${task.id}">${task.title}</td>
                <td>${status}</td>
                <td class="flex-center">
                    <a data-id="${task.id}" id="edit-task-${task.id}" class="btn btn-primary edit-task"><i class="fas fa-pencil"></i></a>
                    <a data-id="${task.id}" id="trash-task-${task.id}" class="btn btn-danger trash-task"><i class="fas fa-trash"></i></a>
                    ${task.status == 1 ? `<a data-id="${task.id}" id="status-task-${task.id}" data-status="0" class="btn btn-warning status-task"><i class="fa fa-clock"></i></a>` : `<a data-id="${task.id}" id="status-task-${task.id}" data-status="1" class="btn btn-success status-task"><i class="fas fa-check"></i></a>`}
                </td>
            </tr>
        `);
    });
}