import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<LoginFormValues>({
        defaultValues: { email: "", password: "" },
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            await login(values);
            navigate(from, { replace: true });
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
        <section className="flex min-h-[calc(100dvh-5rem)] items-start justify-center px-4 pt-20">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md text-[#f2f3f8]">
                <div className="mb-6 flex items-center">
                    <button type="button" onClick={() => navigate(-1)} aria-label="이전 페이지로 이동" className="text-3xl text-white">
                        &lt;
                    </button>
                    <h1 className="flex-1 pr-7 text-center text-3xl font-semibold">로그인</h1>
                </div>

                <div className="space-y-3">
                    <GoogleLoginButton />
                    <div className="flex items-center gap-3 text-sm text-[#9ea3b1]">
                        <span className="h-px flex-1 bg-[#2b2d38]" />
                        <span>또는 이메일로 로그인</span>
                        <span className="h-px flex-1 bg-[#2b2d38]" />
                    </div>
                    <div>
                        <input
                            {...register("email")}
                            type="email"
                            autoComplete="off"
                            placeholder="이메일을 입력해주세요!"
                            className={`h-11 w-full rounded-md border bg-[#101217] px-3 outline-none ${errors.email ? "border-red-500" : "border-[#5a5e69]"}`}
                        />
                        {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
                    </div>
                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            autoComplete="new-password"
                            placeholder="비밀번호를 입력해주세요!"
                            className={`h-11 w-full rounded-md border bg-[#101217] px-3 outline-none ${errors.password ? "border-red-500" : "border-[#5a5e69]"}`}
                        />
                        {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="h-11 w-full rounded-md bg-[#ff2ea3] font-semibold transition-colors hover:bg-[#e52593] disabled:bg-[#14161d] disabled:text-[#7c818f]"
                    >
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default LoginPage;
