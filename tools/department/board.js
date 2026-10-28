'use strict';

const statuses = {
    'in-progress': 'В работе', review: 'На просмотре', ready: 'Готово к старту',
    blocked: 'Нужны входные данные', backlog: 'В очереди', done: 'Закрыто',
};
const roleNames = {
    coordinator: 'Координатор', 'product-owner': 'Владелец продукта', 'business-analyst': 'Бизнес-аналитик',
    designer: 'Дизайнер', 'content-manager': 'Контент-менеджер', architect: 'Архитектор',
    planner: 'Планировщик', coder: 'Разработчик', 'integration-engineer': 'Инженер интеграций',
    qa: 'Тестировщик', reviewer: 'Ревьюер', devops: 'DevOps', marketing: 'Маркетолог',
    sales: 'Продажи', 'bi-analyst': 'BI-аналитик',
};
const $ = (selector) => document.querySelector(selector);
let snapshot;
const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
};
const plain = (text) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '');

function openTask(id) {
    const task = snapshot.tasks.find((entry) => entry.id === id);
    if (!task) return;
    $('#detail-id').textContent = task.id;
    $('#detail-title').textContent = task.title;
    $('#detail-meta').textContent = `${statuses[task.status]} · ${task.priority} · ${roleNames[task.owner] || task.owner} · ${task.phase === 'current' ? 'Сейчас' : 'Будущий магазин'}`;
    $('#detail-assignment').textContent = plain(task.assignment);
    $('#detail-deps').replaceChildren(node('strong', 'Зависимости: '));
    if (!task.dependencies.length) $('#detail-deps').append('нет');
    for (const dependency of task.dependencies) {
        const button = node('button', dependency);
        button.type = 'button';
        button.addEventListener('click', () => openTask(dependency));
        $('#detail-deps').append(button);
    }
    const sections = task.record.split(/^## \d+\. /m).slice(2);
    $('#detail-body').replaceChildren();
    for (const section of sections) {
        const [heading, ...lines] = section.trim().split('\n');
        $('#detail-body').append(node('h3', heading), node('p', plain(lines.join('\n').trim()), 'record-text'));
    }
    $('#source').href = `/records/${encodeURIComponent(task.id)}`;
    if (!$('#detail').open) $('#detail').showModal();
}

function render() {
    const search = $('#search').value.trim().toLocaleLowerCase('ru');
    const tasks = snapshot.tasks.filter((task) =>
        ($('#phase').value === 'all' || task.phase === $('#phase').value) &&
        ($('#owner').value === 'all' || task.owner === $('#owner').value) &&
        ($('#priority').value === 'all' || task.priority === $('#priority').value) &&
        (!search || task.record.toLocaleLowerCase('ru').includes(search))
    ).sort((a, b) => a.priority.localeCompare(b.priority) || a.title.localeCompare(b.title, 'ru'));
    $('#result-count').textContent = `Показано ${tasks.length} из ${snapshot.tasks.length} задач. Нажмите на карточку, чтобы увидеть план и результат.`;
    $('#board').replaceChildren();
    for (const [status, label] of Object.entries(statuses)) {
        const group = tasks.filter((task) => task.status === status);
        if (status === 'done' && !group.length) continue;
        const column = node('section', undefined, `column ${status}`);
        const heading = node('h2', label);
        heading.append(node('span', group.length));
        column.append(heading);
        if (!group.length) column.append(node('p', 'Нет задач по этим фильтрам', 'empty'));
        for (const task of group) {
            const card = node('button', undefined, 'card');
            card.type = 'button';
            card.append(node('span', `${task.priority} · ${roleNames[task.owner] || task.owner}`, 'card-meta'), node('strong', task.title), node('span', task.id, 'task-id'));
            card.addEventListener('click', () => openTask(task.id));
            column.append(card);
        }
        $('#board').append(column);
    }
}

async function refresh() {
    $('#refresh').disabled = true;
    try {
        const response = await fetch('/api/tasks', { cache: 'no-store' });
        if (!response.ok) throw new Error();
        snapshot = await response.json();
        const currentOwner = $('#owner').value;
        $('#owner').replaceChildren(new Option('Все роли', 'all'));
        $('#roles').replaceChildren();
        for (const role of snapshot.roles) {
            $('#owner').append(new Option(roleNames[role] || role, role));
            const assigned = snapshot.tasks.filter((task) => task.owner === role);
            const active = assigned.filter((task) => task.status === 'in-progress').length;
            const item = node('div');
            item.append(node('strong', roleNames[role] || role), node('span', `${assigned.length} задач · ${active} в работе`));
            $('#roles').append(item);
        }
        if ([...$('#owner').options].some((option) => option.value === currentOwner)) $('#owner').value = currentOwner;
        $('#role-count').textContent = `· ${snapshot.roles.length} ролей`;
        $('#summary').replaceChildren();
        for (const [label, value] of [
            ['Всего задач', snapshot.tasks.length],
            ['Текущий этап', snapshot.tasks.filter((task) => task.phase === 'current').length],
            ['В работе', snapshot.tasks.filter((task) => task.status === 'in-progress').length],
            ['Нужны входные данные', snapshot.tasks.filter((task) => task.status === 'blocked').length],
        ]) {
            const item = node('div');
            item.append(node('strong', value), node('span', label));
            $('#summary').append(item);
        }
        $('#message').textContent = `Файлы прочитаны: ${new Date(snapshot.readAt).toLocaleString('ru-RU')}. Автоматический фоновый запуск сотрудников не настроен.`;
        render();
    } catch {
        snapshot = undefined;
        $('#board').replaceChildren();
        $('#summary').replaceChildren();
        $('#roles').replaceChildren();
        $('#result-count').textContent = '';
        $('#message').textContent = 'Не удалось обновить задачи. Проверьте, что локальный сервер работает, и выполните npm run check:tasks в его рабочей папке.';
    } finally { $('#refresh').disabled = false; }
}

$('#filters').addEventListener('submit', (event) => event.preventDefault());
$('#filters').addEventListener('input', () => { if (snapshot) render(); });
$('#refresh').addEventListener('click', refresh);
$('#close').addEventListener('click', () => $('#detail').close());
refresh();
