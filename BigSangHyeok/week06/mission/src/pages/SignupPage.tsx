import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";

const signupSchema = z
    .object({
        email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
        password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
        passwordCheck: z.string().min(1, { message: "비밀번호를 다시 입력해주세요." }),
        nickname: z.string().min(1, { message: "닉네임을 입력해주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<SignupFormValues>({
        defaultValues: { email: "", password: "", passwordCheck: "", nickname: "" },
        resolver: zodResolver(signupSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: SignupFormValues) => {
        try {
            await postSignup({ email: data.email, password: data.password, name: data.nickname });
            await login({ email: data.email, password: data.password });
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

    return (
        <section className="flex min-h-[calc(100dvh-5rem)] items-start justify-center px-4 pt-20">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md text-[#f2f3f8]">
                <div className="mb-6 flex items-center">
                    <button type="button" onClick={() => navigate(-1)} aria-label="이전 페이지로 이동" className="text-3xl text-white">
                        &lt;
                    </button>
                    <h1 className="flex-1 pr-7 text-center text-3xl font-semibold">회원가입</h1>
                </div>

                <div className="space-y-3">
                    <GoogleLoginButton />
                    <div>
                        <input {...register("email")} type="email" placeholder="이메일을 입력해주세요!" className="h-11 w-full rounded-md border border-[#5a5e69] bg-[#101217] px-3 outline-none" />
                        {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
                    </div>
                    <div>
                        <input {...register("password")} type="password" placeholder="비밀번호를 입력해주세요!" className="h-11 w-full rounded-md border border-[#5a5e69] bg-[#101217] px-3 outline-none" />
                        {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
                    </div>
                    <div>
                        <input {...register("passwordCheck")} type="password" placeholder="비밀번호를 다시 입력해주세요!" className="h-11 w-full rounded-md border border-[#5a5e69] bg-[#101217] px-3 outline-none" />
                        {errors.passwordCheck && <p className="mt-1.5 text-sm text-red-400">{errors.passwordCheck.message}</p>}
                    </div>
                    <div>
                        <input {...register("nickname")} type="text" placeholder="닉네임을 입력해주세요!" className="h-11 w-full rounded-md border border-[#5a5e69] bg-[#101217] px-3 outline-none" />
                        {errors.nickname && <p className="mt-1.5 text-sm text-red-400">{errors.nickname.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="h-11 w-full rounded-md bg-[#ff2ea3] font-semibold transition-colors hover:bg-[#e52593] disabled:bg-[#14161d] disabled:text-[#7c818f]"
                    >
                        {isSubmitting ? "가입 중..." : "회원가입 완료"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default SignupPage;
