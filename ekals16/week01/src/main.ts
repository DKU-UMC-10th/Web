type Todo = {
  id: number;
  text: string;
  isCompleted: boolean;
};

const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

let todos: Todo[] = [];

function renderTodos(): void {
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');

    li.className = 'todo__item';
    span.className = 'todo__text';

    span.textContent = todo.text;

    li.appendChild(span);
    li.appendChild(button);

    if (todo.isCompleted) {
      button.textContent = '삭제';
      button.className = 'todo__button todo__button--delete';
      button.addEventListener('click', () => {
        deleteTodo(todo.id);
      });
      doneList.appendChild(li);
    } else {
      button.textContent = '완료';
      button.className = 'todo__button todo__button--complete';
      button.addEventListener('click', () => {
        completeTodo(todo.id);
      });
      todoList.appendChild(li);
    }
  });
}

function addTodo(text: string): void {
  const newTodo: Todo = {
    id: Date.now(),
    text: text,
    isCompleted: false,
  };

  todos.push(newTodo);
  renderTodos();
}

function completeTodo(id: number): void {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, isCompleted: true };
    }
    return todo;
  });

  renderTodos();
}

function deleteTodo(id: number): void {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (text === '') {
    return;
  }

  addTodo(text);
  todoInput.value = '';
});