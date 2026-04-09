import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useNavigate } from "react-router-dom";
import { type FormEvent } from "react";

const LoginPage = () => {
    const navigate = useNavigate();
    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(values);
    };

    const isDisabled =
        Object.values(errors || {}).some((error: string) => error.length > 0) ||
        Object.values(values).some((value: string) => value.trim() === "");

    return (
        <section className="min-h-[calc(100dvh-4rem)] px-4 flex items-start justify-center pt-20">
            <form onSubmit={handleSubmit} className="w-full max-w-105 text-[#f2f3f8]">
                <div className="flex items-center mb-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="이전 페이지로 이동"
                        className="text-3xl leading-none text-white/90 hover:text-white transition-colors"
                    >
                        &lt;
                    </button>
                    <h1 className="flex-1 text-center text-3xl font-semibold tracking-tight pr-7">로그인</h1>
                </div>

                <div className="space-y-3">
                    <div>
                        <input
                            {...getInputProps("email")}
                            name="email"
                            type="email"
                            placeholder="이메일을 입력해주세요!"
                            className={`w-full h-11 px-3 rounded-md border bg-[#101217] outline-none transition-colors
                            ${errors?.email && touched?.email ? "border-red-500" : "border-[#5a5e69]"}
                            focus:border-[#d5d7df]`}
                        />
                        {errors?.email && touched?.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            {...getInputProps("password")}
                            type="password"
                            placeholder="비밀번호를 입력해주세요!"
                            className={`w-full h-11 px-3 rounded-md border bg-[#101217] outline-none transition-colors
                            ${errors?.password && touched?.password ? "border-red-500" : "border-[#5a5e69]"}
                            focus:border-[#d5d7df]`}
                        />
                        {errors?.password && touched?.password && (
                            <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full h-11 rounded-md bg-[#1e212a] hover:bg-[#2d313e] transition-colors disabled:bg-[#14161d] disabled:text-[#7c818f] disabled:cursor-not-allowed"
                    >
                        로그인
                    </button>
                </div>
            </form>
        </section>
    );
};

export default LoginPage;
