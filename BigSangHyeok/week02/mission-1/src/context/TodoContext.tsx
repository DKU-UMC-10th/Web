import type{TTodo} from '../types/todo'
import {createContext, useState, useContext, type PropsWithChildren} from 'react'

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text:string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({children}:PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string) => {
        const newTodo: TTodo = {id:Date.now(), text};
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const completeTodo = (todo:TTodo) => {
        setTodos(prevTodos => prevTodos.filter(t=>t.id!==todo.id));
        setDoneTodos(prevDoneTodos => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo:TTodo) => {
        setDoneTodos(prevDoneTodos => prevDoneTodos.filter(t=>t.id!==todo.id));
    };

    return (
        <TodoContext.Provider value = {{todos, doneTodos, addTodo, 
            completeTodo, deleteTodo}}>{children}
        </TodoContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTodo = () => {
    const context = useContext(TodoContext);
    if(!context){
        throw new Error(
            'useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야 합니다.');
    }
    return context;
}