// src/utils/validate.js (반드시 .js여야 합니다!)
export const validateLogin = (values) => {
    const errors = {};

    if (!values.email) {
        errors.email = "이메일을 입력해주세요.";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "유효하지 않은 이메일 형식입니다.";
    }

    if (!values.password) {
        errors.password = "비밀번호를 입력해주세요.";
    } else if (values.password.length < 6) {
        errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    return errors;
};