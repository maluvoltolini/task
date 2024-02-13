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
        listsContainer.append(`
                            <tr class="task-item-${task.id}">
                                <td class="task-title-${task.id}">${task.title}</td>
                                <td class="flex-center">
                                    <a data-id="${task.id}" id="edit-task-${task.id}"  class="btn btn-primary edit-task"><i class="fas fa-pencil"></i></a>
                                    <a  data-id="${task.id}" id="trash-task-${task.id}" class="btn btn-danger trash-task"><i class="fas fa-trash"></i></a>
                                </td>
                            </tr>`);


    });
}