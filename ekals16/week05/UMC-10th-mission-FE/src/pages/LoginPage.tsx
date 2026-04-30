import useForm from '../hooks/useForm';
import { type UserSignInformation, validateSignin } from '../../utils/validate';
import { useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(accessToken) {
            navigate("/my");
        }
    }, [accessToken, navigate]);

    const { values, errors, touched, getInputProps } =
        useForm<UserSignInformation>({
            initialValue: {
                email: "",
                password: "",
            },
            validate: validateSignin,
        })
    

    const handleSubmit = async () => {
        await login(values);
    };

    //오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
    const isDisabled = 
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="w-full max-w-[360px]">
            <div className="mb-7 flex items-center justify-center relative">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="absolute left-0 text-3xl leading-none text-zinc-300 hover:text-white transition-colors"
                    aria-label="뒤로 가기"
                >
                    ‹
                </button>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">로그인</h1>
            </div>

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
                    {...getInputProps('email')}
                    name="email"
                    className={`h-12 w-full rounded-lg border bg-zinc-900/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none ${
                        errors?.email && touched?.email ? 'border-red-500' : 'border-zinc-500 focus:border-zinc-300'
                    }`}
                    type={"email"}
                    placeholder={"이메일을 입력해주세요!"}
                />
                {errors?.email && touched?.email && (
                    <div className='text-red-400 text-xs'>{errors.email}</div>
                )}

                <input
                    {...getInputProps('password')}
                    className={`h-12 w-full rounded-lg border bg-zinc-900/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none ${
                        errors?.password && touched?.password ? 'border-red-500' : 'border-zinc-500 focus:border-zinc-300'
                    }`}
                    type={"password"}
                    placeholder={"비밀번호를 입력해주세요!"}
                />
                {errors?.password && touched?.password && (
                    <div className='text-red-400 text-xs'>{errors.password}</div>
                )}

                <button
                    type='button'
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="mt-2 h-12 w-full rounded-lg bg-zinc-800 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500"
                >
                    로그인
                </button>
            </div>
        </div>
    </div>
  )
}

export default LoginPage
