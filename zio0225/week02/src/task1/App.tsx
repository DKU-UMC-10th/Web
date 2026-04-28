import React, { useState } from 'react';
import './style.css';

type Task = {
  id: number;
  text: string;
};

function App() {
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask: Task = { id: Date.now(), text: inputValue.trim() };
    setTodos([...todos, newTask]);
    setInputValue('');
  };

  const completeTask = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTasks([...doneTasks, task]);
  };

  const deleteTask = (task: Task) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>
      <form onSubmit={addTodo} className="todo-container__form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="todo-container__input"
          placeholder="할 일 입력"
          required
        />
        <button type="submit" className="todo-container__button">추가</button>
      </form>
      <div className="render-container">
        <div className="render-container__section">
          <h2>할 일</h2>
          <ul>
            {todos.map((task) => (
              <li key={task.id} className="render-container__item">
                <span>{task.text}</span>
                <button onClick={() => completeTask(task)}>완료</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="render-container__section">
          <h2>완료</h2>
          <ul>
            {doneTasks.map((task) => (
              <li key={task.id} className="render-container__item">
                <span>{task.text}</span>
                <button onClick={() => deleteTask(task)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;