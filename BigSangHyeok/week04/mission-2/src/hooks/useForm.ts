import { useMemo, useState, type ChangeEvent } from "react";

interface useFormProps<T> {
    initialValue: T;
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({initialValue, validate}:useFormProps<T>){
    const [values, setValues] = useState(initialValue);
    
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = (name:keyof T, text:string) => {
        setValues((prev) => ({
            ...prev,
            [name]: text,
        }));
    };

    const handleBlur = (name:keyof T) => {
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }))
    }

    const getInputProps = (name: keyof T) => {
        const value : T[keyof T] = values[name];
        
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>
            handleChange(name, e.target.value);
        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur};
    };

    const errors = useMemo(() => validate(values), [validate, values]);

    return {values, errors, touched, getInputProps};
};

export default useForm;

