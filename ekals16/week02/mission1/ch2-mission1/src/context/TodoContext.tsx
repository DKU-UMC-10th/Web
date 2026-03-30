/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { TTodo } from '../types/todo';

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    deleteTodo: (todo: TTodo) => void;
    completeTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
        const [doneTodos, setDoneTodos] = useState<TTodo[]>([
        ]);

    const addTodo = (text: string) => {
        const newTodo: TTodo = {
            id: Date.now(),
            text
        };
        setTodos((prevTodos) : TTodo[] => [...prevTodos, newTodo]);
    }

    const completeTodo = (todo: TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };
    
    const deleteTodo = (todo: TTodo) => {
        setDoneTodos((prevDoneTodos) => 
            prevDoneTodos.filter((t) => t.id !== todo.  id));
    }

    return (
        <TodoContext.Provider value={{ todos, doneTodos, addTodo, deleteTodo, completeTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    //컨텍스트가 없는 경우
    if (!context) {
        throw new Error('useTodoContext must be used within a TodoProvider');
    };
    //컨텍스트가 있는 경우
    return context;
};

export default TodoContext;