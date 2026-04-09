import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValue: T
    // 값이 올바른지 검증하는 함수
    validate: (values:T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
    // 상태를 객체로 관리
    const [values, setValues] = useState<T>(initialValue)
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values,
            [name]: text,
        })
    }

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        })
    }

    // 이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는 것
    const getInputProps = (name: keyof T) => {
        const value = values[name]

        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            handleChange(name, e.target.value)
        }

        const onBlur = () => handleBlur(name);

        return {
            value,
            onChange,
            onBlur
        }
    }

    // value가 변경될 때 마다 에러 검증 로직이 실행됨.
    // { email: '"}

    useEffect(() => {
        const newErrors = validate(values);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setErrors(newErrors);
    }, [validate, values]);

    return {values, errors, touched, getInputProps}
}

export default useForm