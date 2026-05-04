import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignin } from "../apis/auth";
import axios from "axios";
import useLocalStorage from "../hooks/useLocalStorage";

const loginSchema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const navigate = useNavigate();
    const { setValue: setAccessToken } = useLocalStorage<string>("accessToken");
    const { setValue: setRefreshToken } = useLocalStorage<string>("refreshToken");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (values: LoginFormValues) => {

        try {
            const response = await postSignin(values);
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            console.log(response.data);
            navigate("/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;
                alert(serverMessage ?? "로그인에 실패했습니다.");
                return;
            }

            alert("로그인에 실패했습니다.");
        }
    };

    return (
        <section className="min-h-[calc(100dvh-4rem)] px-4 flex items-start justify-center pt-20">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="w-full max-w-105 text-[#f2f3f8]">
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
                            {...register("email")}
                            type="email"
                            autoComplete="off"
                            placeholder="이메일을 입력해주세요!"
                            className={`w-full h-11 px-3 rounded-md border bg-[#101217] outline-none transition-colors
                            ${errors?.email ? "border-red-500" : "border-[#5a5e69]"}
                            focus:border-[#d5d7df]`}
                        />
                        {errors?.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            autoComplete="new-password"
                            placeholder="비밀번호를 입력해주세요!"
                            className={`w-full h-11 px-3 rounded-md border bg-[#101217] outline-none transition-colors
                            ${errors?.password ? "border-red-500" : "border-[#5a5e69]"}
                            focus:border-[#d5d7df]`}
                        />
                        {errors?.password && (
                            <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
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
