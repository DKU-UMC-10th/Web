import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { validateLogin } from '../utils/validate';

const LoginPage = () => {
    const navigate = useNavigate();

    const { 
        values = { email: '', password: '' }, 
        errors = {}, 
        handleChange 
    } = useForm(
        { email: '', password: '' },
        validateLogin
    );

    const isFormValid = 
        Object.keys(errors).length === 0 && 
        values?.email?.trim() !== '' && 
        values?.password?.trim() !== '';

    return (
        <div className="min-h-screen bg-black text-white w-full font-sans">
            
            {/* 1. 상단 헤더: 돌려돌려LP판 */}
            <header className="w-full flex justify-between items-center p-4 border-b border-zinc-900">
                <h1 className="text-xl font-bold text-pink-500">돌려돌려LP판</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-zinc-800 hover:bg-zinc-700 transition-colors">로그인</button>
                    {/* ✅ 여기에 navigate 추가! */}
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="px-4 py-1.5 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition-colors"
                    >
                        회원가입
                    </button>
                </div>
            </header>

            <main className="flex flex-col items-center justify-center p-6 mt-16">
                <div className="w-full max-w-[360px]">
                    
                    {/* 뒤로 가기 & 타이틀 */}
                    <div className="flex items-center mb-12 relative">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="absolute left-0 text-2xl text-zinc-400 hover:text-white transition-colors"
                        >
                            &lt;
                        </button>
                        <h2 className="text-2xl font-bold text-center w-full">로그인</h2>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        
                        {/* 2. 구글 로그인 버튼 */}
                        <button className="w-full p-3.5 bg-transparent border border-zinc-700 rounded-xl flex items-center justify-center gap-3 text-white font-medium hover:bg-zinc-900 transition-all">
                            <img 
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                alt="Google" 
                                className="w-5 h-5" 
                            />
                            구글 로그인
                        </button>

                        {/* 3. OR 구분선 */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-grow h-[1px] bg-zinc-800"></div>
                            <span className="text-xs font-bold text-zinc-500">OR</span>
                            <div className="flex-grow h-[1px] bg-zinc-800"></div>
                        </div>

                        {/* 4. 이메일 입력 필드 */}
                        <div className="space-y-1.5">
                            <input
                                name="email"
                                type="email"
                                placeholder="이메일을 입력해주세요!"
                                value={values?.email || ''}
                                className={`w-full p-4 bg-zinc-950 border rounded-xl outline-none text-white placeholder:text-zinc-600 transition-all ${
                                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                                }`}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 text-[11px] px-1 font-medium">{errors.email}</p>}
                        </div>

                        {/* 5. 비밀번호 입력 필드 */}
                        <div className="space-y-1.5">
                            <input
                                name="password"
                                type="password"
                                placeholder="비밀번호를 입력해주세요!"
                                value={values?.password || ''}
                                className={`w-full p-4 bg-zinc-950 border rounded-xl outline-none text-white placeholder:text-zinc-600 transition-all ${
                                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                                }`}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="text-red-500 text-[11px] px-1 font-medium">{errors.password}</p>}
                        </div>

                        {/* 6. 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full p-4 mt-4 rounded-xl font-bold text-lg transition-all ${
                                isFormValid 
                                    ? 'bg-pink-600 text-white cursor-pointer hover:bg-pink-700 active:scale-[0.98]' 
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                            }`}
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;