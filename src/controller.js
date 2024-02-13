import { renderLists, renderTasks } from './view.js';

const API_URL = 'http://localhost:3000';

function getAllLists() {
    $.ajax({
        url: `${API_URL}/lists`,
        method: 'GET',
        success: function (lists) {
            renderLists(lists);
            if (lists.length > 0) {
                const firstListId = lists[0].id;
                getTasksAndRender(firstListId);
            }
        },
        error: handleAjaxError('Erro ao obter listas.')
    });
}

async function getTasksByList(listId) {
    try {
        const response = await $.ajax({
            url: `${API_URL}/tasks?listId=${listId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Erro ao obter tarefas.', error);
        throw error;
    }
}

async function getTaskDetails(taskId) {
    try {
        const response = await $.ajax({
            url: `${API_URL}/tasks/${taskId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function updateTask(taskDetails) {
    try {
        await $.ajax({
            url: `${API_URL}/tasks/${taskDetails.id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(taskDetails),
            success: () => console.log('Tarefa atualizada com sucesso.'),
            error: handleAjaxError('Erro ao atualizar a tarefa.')
        });
    } catch (error) {
        throw error;
    }
}

function updateTaskTitle(taskId, newTitle, listId) {
    return $.ajax({
        url: `${API_URL}/tasks/${taskId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ title: newTitle, listId }),
        success: getAllLists,
        error: handleAjaxError('Erro ao atualizar o título da tarefa.')
    });
}

function deleteTask(taskId) {
    return $.ajax({
        url: `${API_URL}/tasks/${taskId}`,
        method: 'DELETE',
        success: () => $(`.task-item-${taskId}`).remove(),
        error: handleAjaxError('Erro ao excluir a tarefa.')
    });
}

function addTask(newTaskTitle, newTaskListId) {
    return $.ajax({
        url: `${API_URL}/tasks`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ title: newTaskTitle, listId: newTaskListId }),
        success: async () => {
            const tasks = await getTasksByList(newTaskListId);
            renderTasks(tasks);
        },
        error: handleAjaxError('Erro ao adicionar uma nova tarefa.')
    });
}

function addList(newListTitle) {
    return $.ajax({
        url: `${API_URL}/lists`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ title: newListTitle }),
        success: () => {
            getAllLists();
        },
        error: handleAjaxError('Erro ao adicionar uma nova lista.')
    });
}

function handleAjaxError(errorMessage) {
    return function () {
        console.error(errorMessage);
    };
}

async function getTasksAndRender(listId) {
    try {
        const tasks = await getTasksByList(listId);
        $('#list-btn-' + listId).css('background-color', 'rgb(84 84 84)');
        $('#listId').val(listId);
        renderTasks(tasks);
    } catch (error) {
        console.error('Erro ao obter tarefas.', error);
        throw error;
    }
}

$(document).ready(function () {
    getAllLists();
});

$(document).on('click', '.list-btn', async function () {
    const listId = $(this).data('id');
    console.log('List ID:', listId);
    const tasks = await getTasksByList(listId);
    $('#listId').val(listId);
    $('.list-btn').css('background-color', '');
    $(this).css('background-color', 'rgb(84 84 84)');
    renderTasks(tasks);
});


$(document).on('click', ".edit-task", function () {
    const taskId = $(this).attr('data-id');
    const taskTitle = $(this).closest('tr').find('td:first').text();
    $('#taskId').val(taskId);
    $('#taskTitle').val(taskTitle);
    $('#editTaskModal').modal('show');
});

$('#editTaskForm').submit(async function (event) {
    event.preventDefault();

    const taskId = $('#taskId').val();
    const newTitle = $('#taskTitle').val();
    if (newTitle.trim() !== '') {
        const listId = $('#listId').val();
        await updateTaskTitle(taskId, newTitle, listId);
        $('#editTaskModal').modal('hide');
        $(`.task-title-${taskId}`).html(newTitle);
    } else {
        alert('Por favor, insira um título para a nova tarefa.');
    }
});

$(document).on('click', ".trash-task", function () {
    const taskId = $(this).attr('data-id');
    $('#deleteTaskModal').data('task-id', taskId);
    $('#deleteTaskModal').modal('show');
});

$('#deleteTaskForm').submit(function (event) {
    event.preventDefault();

    const taskId = $('#deleteTaskModal').data('task-id');
    deleteTask(taskId);
    $('#deleteTaskModal').modal('hide');
});

$('#addTaskForm').submit(function (event) {
    event.preventDefault();

    const newTaskTitle = $('#newTaskTitle').val();
    if (newTaskTitle.trim() !== '') {
        const newTaskListId = $('#listId').val();
        addTask(newTaskTitle, newTaskListId);
        $('#addTaskModal').modal('hide');
        $('#newTaskTitle').val('');
    } else {
        alert('Por favor, insira um título para a nova tarefa.');
    }
});


$('.btn-add-list').on('click', function () {
    $('#addListModal').modal('show');
});

$('#addListForm').submit(function (event) {
    event.preventDefault();

    const newListTitle = $('#newListTitle').val();
    if (newListTitle.trim() !== '') {
        addList(newListTitle);
        $('#addListModal').modal('hide');
        $('#newListTitle').val('');
    } else {
        alert('Por favor, insira um título para a nova lista.');
    }
});

$(document).on('click', ".status-task", async function () {
    const taskId = $(this).attr('data-id');
    const taskStatus = $(this).attr('data-status');
    const listId = $('#listId').val();
    try {
        const taskDetails = await getTaskDetails(taskId);
        taskDetails.status = taskStatus;
        await updateTask(taskDetails);
        const tasks = await getTasksByList(listId);
        renderTasks(tasks);
    } catch (error) {
        console.error('Erro ao atualizar o status da tarefa.', error);
    }
});

$(document).on('focusout', "#newTaskTitle, #newListTitle, #taskTitle", function () {
    let value = $(this).val();
    const newValue = value.trim();
    
   $(this).val(newValue);
});

