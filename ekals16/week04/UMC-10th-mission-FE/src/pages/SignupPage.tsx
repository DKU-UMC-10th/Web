import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { postSignup } from '../apis/auth';
import { useNavigate } from 'react-router-dom';
// validate.ts에서 유효성 검사 대체
// 이전에 미션2에서 만들었던 것보다 훨씬 코드가 간단해짐.

const schema = z.object({
    email: z.string().email({ message: "유효한 이메일 형식이 아닙니다." }),
    name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
    password: z
    .string()
    .min(8, {
        message: "비밀번호는 최소 8자 이상이어야 합니다." 
    })
    .max(20, { 
        message: "비밀번호는 최대 20자 이하여야 합니다." }),
    passwordCheck: z
    .string()
    .min(8, {
        message: "비밀번호 확인은 최소 8자 이상이어야 합니다."
    })
    .max(20, {
        message: "비밀번호 확인은 최대 20자 이하여야 합니다."
    }),
})
.refine((data)=>data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"], // 에러가 발생할 필드 지정
})

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const{
        control,
        register,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            email: "",
            name: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
        mode: "onBlur",
    })

    const emailValue = useWatch({ control, name: 'email' });
    const nameValue = useWatch({ control, name: 'name' });
    const passwordValue = useWatch({ control, name: 'password' });
    const passwordCheckValue = useWatch({ control, name: 'passwordCheck' });
    const isEmailValid = z.string().email().safeParse(emailValue).success;

    const handleEmailNext = async () => {
        const isEmailValid = await trigger('email');
        if (isEmailValid) {
            setStep(2);
        }
    };

    const handlePasswordNext = async () => {
        const isPasswordValid = await trigger(['password', 'passwordCheck']);
        if (isPasswordValid) {
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step === 1) {
            navigate(-1);
            return;
        }

        setStep((prev) => (prev === 3 ? 2 : 1));
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await postSignup({
                email: data.email,
                password: data.password,
                name: data.name,
            });

            if (!response.status) {
                alert(response.message || '회원가입에 실패했습니다.');
                return;
            }

            navigate('/');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('회원가입 중 오류가 발생했습니다.');
            }
        }
    } 

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="w-full max-w-[360px]">
            <div className="mb-7 flex items-center justify-center relative">
                <button
                    type="button"
                    onClick={handleBack}
                    className="absolute left-0 text-3xl leading-none text-zinc-300 hover:text-white transition-colors"
                    aria-label="뒤로 가기"
                >
                    ‹
                </button>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">회원가입</h1>
            </div>

            {step === 1 && (
                <>
                    <button
                        type="button"
                        className="mb-6 flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-zinc-500 bg-black text-sm font-semibold text-zinc-100"
                    >
                        <span className="text-xl font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,#4285F4_0%,#EA4335_35%,#FBBC05_70%,#34A853_100%)]">G</span>
                        구글 로그인
                    </button>

                    <div className="mb-5 flex items-center gap-3 text-zinc-400">
                        <div className="h-px flex-1 bg-zinc-600" />
                        <span className="text-xs font-semibold">OR</span>
                        <div className="h-px flex-1 bg-zinc-600" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            {...register('email')}
                            className={`h-12 w-full rounded-lg border bg-zinc-900/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none ${
                                errors?.email ? 'border-red-500' : 'border-zinc-500 focus:border-zinc-300'
                            }`}
                            type="email"
                            placeholder="이메일을 입력해주세요!"
                        />
                        {errors.email && (
                            <div className="text-red-400 text-xs">{errors.email.message}</div>
                        )}

                        <button
                            type="button"
                            onClick={handleEmailNext}
                            disabled={!isEmailValid}
                            className={`mt-2 h-12 w-full rounded-lg text-sm font-semibold transition-colors ${
                                isEmailValid
                                    ? 'bg-pink-500 text-white hover:bg-pink-400'
                                    : 'bg-zinc-900 text-zinc-500'
                            } disabled:cursor-not-allowed`}
                        >
                            다음
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-100">
                        <span className="text-zinc-300">@</span>
                        <span>{emailValue}</span>
                    </div>

                    <div className="relative">
                        <input
                            {...register('password')}
                            className={`h-12 w-full rounded-lg border bg-zinc-900/60 px-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none ${
                                errors?.password ? 'border-red-500' : 'border-zinc-500 focus:border-zinc-300'
                            }`}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="비밀번호를 입력해주세요!"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5 20 21M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.68 16.67A10.94 10.94 0 0 1 12 18c-5.2 0-9-6-9-6a16.5 16.5 0 0 1 4.19-4.97M9.88 5.1A11.2 11.2 0 0 1 12 5c5.2 0 9 7 9 7a17.8 17.8 0 0 1-2.14 2.99" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.05 12.32a1 1 0 0 1 0-.64C2.64 10.06 6.18 5 12 5s9.36 5.06 9.95 6.68a1 1 0 0 1 0 .64C21.36 13.94 17.82 19 12 19s-9.36-5.06-9.95-6.68Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="text-red-400 text-xs">{errors.password.message}</div>
                    )}

                    <div className="relative">
                        <input
                            {...register('passwordCheck')}
                            className={`h-12 w-full rounded-lg border bg-zinc-900/60 px-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none ${
                                errors?.passwordCheck ? 'border-red-500' : 'border-zinc-500 focus:border-zinc-300'
                            }`}
                            type={showPasswordCheck ? 'text' : 'password'}
                            placeholder="비밀번호를 다시 한번 입력해주세요!"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordCheck((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                            aria-label={showPasswordCheck ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                        >
                            {showPasswordCheck ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5 20 21M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.68 16.67A10.94 10.94 0 0 1 12 18c-5.2 0-9-6-9-6a16.5 16.5 0 0 1 4.19-4.97M9.88 5.1A11.2 11.2 0 0 1 12 5c5.2 0 9 7 9 7a17.8 17.8 0 0 1-2.14 2.99" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.05 12.32a1 1 0 0 1 0-.64C2.64 10.06 6.18 5 12 5s9.36 5.06 9.95 6.68a1 1 0 0 1 0 .64C21.36 13.94 17.82 19 12 19s-9.36-5.06-9.95-6.68Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.passwordCheck && (
                        <div className="text-red-400 text-xs">{errors.passwordCheck.message}</div>
                    )}

                    <button
                        type="button"
                        onClick={handlePasswordNext}
                        disabled={
                            isSubmitting ||
                            !passwordValue ||
                            !passwordCheckValue ||
                            Boolean(errors.password) ||
                            Boolean(errors.passwordCheck)
                        }
                        className="mt-2 h-12 w-full rounded-lg bg-pink-500 text-sm font-semibold text-white transition-colors hover:bg-pink-400 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500"
                    >
                        다음
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col gap-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-100">
                        <span className="text-zinc-300">@</span>
                        <span>{emailValue}</span>
                    </div>

                    <input
                        {...register('name')}
                        className={`h-12 w-full rounded-lg border bg-zinc-900/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none ${
                            errors?.name ? 'border-red-500' : 'border-zinc-500 focus:border-zinc-300'
                        }`}
                        type="text"
                        placeholder="닉네임을 입력해주세요!"
                    />
                    {errors.name && (
                        <div className="text-red-400 text-xs">{errors.name.message}</div>
                    )}

                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={
                            isSubmitting ||
                            !nameValue?.trim() ||
                            Boolean(errors.name)
                        }
                        className="mt-2 h-12 w-full rounded-lg bg-pink-500 text-sm font-semibold text-white transition-colors hover:bg-pink-400 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500"
                    >
                        회원가입 완료
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}

export default SignupPage