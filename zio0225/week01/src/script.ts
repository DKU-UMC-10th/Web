const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

type Todo = { id: number; text: string; };

let todos: Todo[] = [];
let doneTodos: Todo[] = [];

function render() {
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  todos.forEach(todo => todoList.appendChild(createLi(todo, false)));
  doneTodos.forEach(todo => doneList.appendChild(createLi(todo, true)));
}

function createLi(todo: Todo, isDone: boolean): HTMLLIElement {
  const li = document.createElement('li');
  li.classList.add('render-container__item');

  const span = document.createElement('span');
  span.classList.add('render-container__item-text');
  span.textContent = todo.text;

  const btn = document.createElement('button');
  btn.textContent = isDone ? '삭제' : '완료';
  btn.classList.add('render-container__item-button', isDone ? 'delete' : 'complete');

  btn.addEventListener('click', () => {
    if (isDone) {
      doneTodos = doneTodos.filter(t => t.id !== todo.id);
    } else {
      todos = todos.filter(t => t.id !== todo.id);
      doneTodos.push(todo);
    }
    render();
  });

  li.appendChild(span);
  li.appendChild(btn);
  return li;
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text });
  todoInput.value = '';
  render();
});

render();