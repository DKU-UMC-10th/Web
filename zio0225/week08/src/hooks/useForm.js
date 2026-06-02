import { useState, useEffect } from 'react';

const useForm = (initialValues, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    // 값이 변할 때마다 에러 상태 업데이트
    useEffect(() => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    }, [values, validate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return { values, errors, handleChange };
};

export default useForm;