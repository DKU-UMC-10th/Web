const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;
const doneList = document.getElementById("doneList") as HTMLUListElement;

function createTodoItem(text: string): HTMLLIElement {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "완료";

  completeBtn.addEventListener("click", () => {
    moveToDone(li, span);
  });

  li.appendChild(span);
  li.appendChild(completeBtn);

  return li;
}

function moveToDone(li: HTMLLIElement, span: HTMLSpanElement): void {
  li.innerHTML = "";

  span.classList.add("done-text");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";

  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  doneList.appendChild(li);
}

function addTodo(): void {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("할 일을 입력하세요.");
    return;
  }

  const todoItem = createTodoItem(text);
  todoList.appendChild(todoItem);
  todoInput.value = "";
  todoInput.focus();
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    addTodo();
  }
});