import { ThemeToggleButton } from '../context/ThemeToggleButton';
import './style.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-slate-900 dark:text-white transition-colors duration-500">
      <h1 className="text-3xl font-bold mb-6">YONG TODO</h1>
      
      <ThemeToggleButton />

      <div className="mt-8 p-6 border rounded-xl shadow-lg dark:bg-slate-800 w-80 text-center">
        <p>투두 리스트 내용이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}

export default App;