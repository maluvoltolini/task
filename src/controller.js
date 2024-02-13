import { renderLists, renderTasks } from './view.js';

const API_URL = 'http://localhost:3000';

function getAllLists() {
    $.ajax({
        url: `${API_URL}/lists`,
        method: 'GET',
        success: renderLists,
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

async function getTask(taskId) {
    try {
        const response = await $.ajax({
            url: `${API_URL}/tasks/${taskId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Erro ao obter tarefa.', error);
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

$(document).ready(function () {
    getAllLists();
});

$(document).on('click', '.list-btn', async function () {
    const listId = $(this).data('id');
    console.log('List ID:', listId); // Verificar se o ID está correto
    const tasks = await getTasksByList(listId);
    $('#listId').val(listId);
    $('#add-task-button').css('display', 'block');
    $('.list-btn').css('background-color', '');
    $(this).css('background-color', '#a49f9f');
    renderTasks(tasks);
});


$(document).on('click', ".edit-task", function () {
    const taskId = $(this).attr('data-id');
    const taskTitle = $(this).closest('tr').find('td:first').text();
    $('#taskId').val(taskId);
    $('#taskTitle').val(taskTitle);
    $('#editTaskModal').modal('show');
});

$('#saveChangesBtn').on('click', async function () {
    const taskId = $('#taskId').val();
    const newTitle = $('#taskTitle').val();
    const listId = $('#listId').val();
    await updateTaskTitle(taskId, newTitle, listId);
    $('#editTaskModal').modal('hide');
    $(`.task-title-${taskId}`).html(newTitle);
});

$(document).on('click', ".trash-task", function () {
    const taskId = $(this).attr('data-id');
    $('#deleteTaskModal').data('task-id', taskId);
    $('#deleteTaskModal').modal('show');
});

$('#confirmDeleteBtn').on('click', function () {
    const taskId = $('#deleteTaskModal').data('task-id');
    deleteTask(taskId);
    $('#deleteTaskModal').modal('hide');
});

$('#addTaskBtn').on('click', function () {
    const newTaskTitle = $('#newTaskTitle').val();
    const newTaskListId = $('#listId').val();
    addTask(newTaskTitle, newTaskListId);
    $('#addTaskModal').modal('hide');
});

$('.btn-add-list').on('click', function () {
    $('#addListModal').modal('show');
});

$('#addListBtn').on('click', function () {
    const newListTitle = $('#newListTitle').val();
    if (newListTitle.trim() !== '') {
        addList(newListTitle);
        $('#addListModal').modal('hide');
    } else {
        alert('Por favor, insira um título para a nova lista.');
    }
});

