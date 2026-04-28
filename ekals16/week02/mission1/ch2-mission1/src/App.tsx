import './App.css';
// components안에 Todo.tsx파일을 만든 후 App()함수에서 <Todo/>를 다시 치면 import 문구가 자동으로 완성된다.
import Todo from './components/Todo';
import { TodoProvider } from './context/TodoContext';

function App() {
  return (
  <TodoProvider>
    <Todo/>
  </TodoProvider>
  );
}

export default App
