import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');
  const email = watch('email');

  const handleNextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['email'];
    if (step === 2) fieldsToValidate = ['password', 'passwordConfirm'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const onSubmit = (data) => {
    console.log('회원가입 데이터:', data);
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white font-sans">
      <div className="w-full max-w-[400px] bg-[#121212] p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-500">회원가입</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {step >= 2 && (
            <div className="bg-gray-800/50 p-4 rounded-xl mb-6 border border-gray-700 animate-in fade-in duration-500">
              <p className="text-xs text-gray-400 mb-1">입력 중인 계정</p>
              <p className="font-medium text-blue-400">{email}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">이메일 주소</label>
              <input
                type="text"
                className={`w-full p-4 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                }`}
                placeholder="example@email.com"
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: '올바른 이메일 형식을 입력해주세요.',
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              <button
                type="button"
                disabled={!isValid}
                onClick={handleNextStep}
                className="w-full mt-4 bg-blue-600 text-white p-4 rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
              >
                다음
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full p-4 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                    }`}
                    placeholder="6자 이상 입력"
                    {...register('password', {
                      required: '비밀번호를 입력해주세요.',
                      minLength: { value: 6, message: '비밀번호는 6자 이상이어야 합니다.' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">비밀번호 재확인</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full p-4 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.passwordConfirm ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                    }`}
                    placeholder="비밀번호 다시 입력"
                    {...register('passwordConfirm', {
                      required: '비밀번호를 한 번 더 입력해주세요.',
                      validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.passwordConfirm && <p className="text-red-500 text-xs mt-2">{errors.passwordConfirm.message}</p>}
              </div>

              <button
                type="button"
                disabled={!isValid || password !== passwordConfirm}
                onClick={handleNextStep}
                className="w-full mt-4 bg-blue-600 text-white p-4 rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
              >
                다음
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 mb-4 hover:border-blue-500 transition-colors group">
                  <span className="text-gray-500 text-xs text-center group-hover:text-blue-500">프로필<br/>이미지</span>
                </div>
              </div>
              
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-300 mb-2">닉네임</label>
                <input
                  type="text"
                  className={`w-full p-4 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.nickname ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                  }`}
                  placeholder="멋진 닉네임을 지어주세요"
                  {...register('nickname', { required: '닉네임을 입력해주세요.' })}
                />
                {errors.nickname && <p className="text-red-500 text-xs mt-2">{errors.nickname.message}</p>}
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-green-600 text-white p-4 rounded-xl font-bold disabled:opacity-30 hover:bg-green-700 active:scale-95 transition-all"
              >
                회원가입 완료
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;