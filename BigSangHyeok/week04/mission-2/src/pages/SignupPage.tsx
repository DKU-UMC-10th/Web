import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { postSignin, postSignup } from "../apis/auth";
import useLocalStorage from "../hooks/useLocalStorage";
import type { SignupFormValues } from "../types/auth";

const signupSchema = z
    .object({
        email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
        password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
        passwordCheck: z.string().min(1, { message: "비밀번호를 다시 한 번 입력해주세요." }),
        nickname: z.string().min(1, { message: "닉네임을 입력해주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

type SignupStep = 1 | 2 | 3;

const EyeIcon = ({ open }: { open: boolean }) => {
    if (open) {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4.5 w-4.5">
                <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4.5 w-4.5">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" />
            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.2 0 10 7 10 7a17.9 17.9 0 0 1-4.1 4.9" />
            <path d="M6.2 6.2A17.8 17.8 0 0 0 2 12s3.8 7 10 7c1.4 0 2.8-.3 4-.8" />
        </svg>
    );
};

const isEmailStepValid = (email: string) => {
    const emailResult = signupSchema.shape.email.safeParse(email);
    return emailResult.success;
};

const isPasswordStepValid = (password: string, passwordCheck: string) => {
    const result = signupSchema.safeParse({
        email: "valid@email.com",
        password,
        passwordCheck,
        nickname: "temp",
    });

    return result.success;
};

const SignupPage = () => {
    const navigate = useNavigate();
    const { setValue: setAccessToken } = useLocalStorage<string>("accessToken");
    const { setValue: setRefreshToken } = useLocalStorage<string>("refreshToken");

    const [step, setStep] = useState<SignupStep>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        defaultValues: {
            email: "",
            password: "",
            passwordCheck: "",
            nickname: "",
        },
        resolver: zodResolver(signupSchema),
        mode: "onChange",
    });

    const values = watch();

    const handleNextFromEmail = async () => {
        const valid = await trigger("email");

        if (valid) {
            setStep(2);
        }
    };

    const handleNextFromPassword = async () => {
        const valid = await trigger(["password", "passwordCheck"]);

        if (valid) {
            setStep(3);
        }
    };

    const onSubmit = async (data: SignupFormValues) => {
        if (step !== 3) {
            return;
        }

        try {
            await postSignup({
                email: data.email,
                password: data.password,
                name: data.nickname,
            });

            const signinResponse = await postSignin({
                email: data.email,
                password: data.password,
            });

            setAccessToken(signinResponse.data.accessToken);
            setRefreshToken(signinResponse.data.refreshToken);
            navigate("/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;
                alert(serverMessage ?? "회원가입에 실패했습니다.");
                return;
            }

            alert("회원가입에 실패했습니다.");
        }
    };

    const emailStepButtonDisabled = !isEmailStepValid(values.email ?? "") || isSubmitting;
    const passwordStepButtonDisabled = !isPasswordStepValid(values.password ?? "", values.passwordCheck ?? "") || isSubmitting;
    const nicknameStepButtonDisabled = (values.nickname ?? "").trim().length === 0 || isSubmitting;

    return (
        <section className="min-h-[calc(100dvh-4rem)] px-4 flex items-start justify-center pt-20">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-105 text-[#f2f3f8]">
                <div className="flex items-center mb-6">
                    <button
                        type="button"
                        onClick={() => {
                            if (step === 1) {
                                navigate(-1);
                                return;
                            }

                            setStep((prev) => (prev === 3 ? 2 : 1));
                        }}
                        aria-label="이전 단계로 이동"
                        className="text-3xl leading-none text-white/90 hover:text-white transition-colors"
                    >
                        &lt;
                    </button>
                    <h1 className="flex-1 text-center text-3xl font-semibold tracking-tight pr-7">회원가입</h1>
                </div>

                {step > 1 && (
                    <div className="mb-3 text-sm text-[#cfd2da]">
                        <p className="flex items-center gap-2">
                            <span className="text-xs">@</span>
                            <span>{values.email}</span>
                        </p>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-3">
                        <div>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="이메일을 입력해주세요!"
                                className={`w-full h-11 px-3 rounded-md border bg-[#101217] outline-none transition-colors
                                ${errors?.email ? "border-red-500" : "border-[#5a5e69]"}
                                focus:border-[#d5d7df]`}
                            />
                            {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
                        </div>

                        <button
                            type="button"
                            onClick={handleNextFromEmail}
                            disabled={emailStepButtonDisabled}
                            className="w-full h-11 rounded-md bg-[#1e212a] hover:bg-[#2d313e] transition-colors disabled:bg-[#14161d] disabled:text-[#7c818f] disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        <div>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="비밀번호를 입력해주세요!"
                                    className={`w-full h-11 px-3 pr-11 rounded-md border bg-[#101217] outline-none transition-colors
                                    ${errors?.password ? "border-red-500" : "border-[#5a5e69]"}
                                    focus:border-[#d5d7df]`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ea3b1] hover:text-[#d8dbe4] transition-colors"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    {...register("passwordCheck")}
                                    type={showPasswordCheck ? "text" : "password"}
                                    placeholder="비밀번호를 다시 한 번 입력해주세요!"
                                    className={`w-full h-11 px-3 pr-11 rounded-md border bg-[#101217] outline-none transition-colors
                                    ${errors?.passwordCheck ? "border-red-500" : "border-[#5a5e69]"}
                                    focus:border-[#d5d7df]`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordCheck((prev) => !prev)}
                                    aria-label={showPasswordCheck ? "비밀번호 숨기기" : "비밀번호 보기"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ea3b1] hover:text-[#d8dbe4] transition-colors"
                                >
                                    <EyeIcon open={showPasswordCheck} />
                                </button>
                            </div>
                            {errors.passwordCheck && (
                                <p className="mt-1.5 text-sm text-red-400">{errors.passwordCheck.message}</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleNextFromPassword}
                            disabled={passwordStepButtonDisabled}
                            className="w-full h-11 rounded-md bg-[#1e212a] hover:bg-[#2d313e] transition-colors disabled:bg-[#14161d] disabled:text-[#7c818f] disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-3">
                        <div>
                            <input
                                {...register("nickname")}
                                type="text"
                                placeholder="닉네임을 입력해주세요!"
                                className={`w-full h-11 px-3 rounded-md border bg-[#101217] outline-none transition-colors
                                ${errors?.nickname ? "border-red-500" : "border-[#5a5e69]"}
                                focus:border-[#d5d7df]`}
                            />
                            {errors.nickname && <p className="mt-1.5 text-sm text-red-400">{errors.nickname.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={nicknameStepButtonDisabled}
                            className="w-full h-11 rounded-md bg-[#ff2ea3] hover:bg-[#e52593] transition-colors disabled:bg-[#14161d] disabled:text-[#7c818f] disabled:cursor-not-allowed"
                        >
                            회원가입 완료
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
};

export default SignupPage;
