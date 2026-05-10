export type UserSigninInformation = {
    email: string;
    password: string;
};

function validateUser(values: UserSigninInformation) {
    const errors = {
        email: "",
        password: "",
    };

    const emailValue = values.email.trim();

    if (emailValue !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        errors.email = "유효하지 않은 이메일 형식입니다.";
    }

    if (values.password.length > 0 && values.password.length < 6) {
        errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    return errors;
}

function validateSignin(values: UserSigninInformation) {
    return validateUser(values);
}

export {validateSignin};