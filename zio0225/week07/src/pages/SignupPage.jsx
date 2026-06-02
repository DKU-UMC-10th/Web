import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Camera, CheckCircle2, X } from 'lucide-react';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const email = watch('email', "");
  const password = watch('password', "");
  const passwordConfirm = watch('passwordConfirm', "");

  // 이미지 미리보기 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = async () => {
    let fields = step === 1 ? ['email'] : ['password', 'passwordConfirm'];
    const isStepValid = await trigger(fields);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const onSubmit = (data) => {
    console.log('최종 제출 데이터:', { ...data, profileImage: imagePreview });
    alert('🎉 회원가입이 완료되었습니다! 환영합니다.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white font-sans">
      <div className="w-full max-w-[400px] bg-[#121212] p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-500 tracking-tight">회원가입</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 상단 계정 정보 브리핑 */}
          {step >= 2 && (
            <div className="bg-blue-900/10 p-4 rounded-xl mb-6 border border-blue-900/30 animate-in fade-in slide-in-from-top-2 duration-500">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">진행 중인 계정</p>
              <p className="font-medium text-gray-200">{email}</p>
            </div>
          )}

          {/* STEP 1: 이메일 */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">이메일 주소</label>
              <input
                className={`w-full p-4 bg-gray-900 border rounded-xl focus:outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-800 focus:border-blue-500'}`}
                placeholder="example@email.com"
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                  pattern: { value: /^\S+@\S+$/i, message: '올바른 이메일 형식이 아닙니다.' }
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              <button type="button" disabled={!isValid} onClick={handleNextStep} className="w-full mt-4 bg-blue-600 p-4 rounded-xl font-bold disabled:opacity-20 hover:bg-blue-500 transition-all active:scale-[0.98]">다음 단계</button>
            </div>
          )}

          {/* STEP 2: 비밀번호 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-2">비밀번호</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full p-4 bg-gray-900 border rounded-xl focus:outline-none transition-all ${password.length >= 6 ? 'border-green-900/50' : 'border-gray-800 focus:border-blue-500'}`}
                  placeholder="6자 이상 입력"
                  {...register('password', { required: '비밀번호를 입력해주세요.', minLength: { value: 6, message: '6자 이상 입력해주세요.' } })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-11 text-gray-600 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {/* 실시간 비밀번호 강도 바 */}
                <div className="flex items-center gap-1 mt-2">
                  <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${password.length > 0 ? (password.length >= 6 ? 'bg-green-500' : 'bg-orange-500') : 'bg-gray-800'}`} />
                  <span className={`text-[10px] font-bold ${password.length >= 6 ? 'text-green-500' : 'text-gray-500'}`}>
                    {password.length >= 6 ? '보안 우수' : '6자 이상 필요'}
                  </span>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-2 text-right">비밀번호 재확인</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`w-full p-4 bg-gray-900 border rounded-xl focus:outline-none transition-all ${passwordConfirm && password === passwordConfirm ? 'border-blue-900/50' : 'border-gray-800 focus:border-blue-500'}`}
                  placeholder="다시 한 번 입력"
                  {...register('passwordConfirm', { required: true, validate: (v) => v === password || '비밀번호가 일치하지 않습니다.' })}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-11 text-gray-600 hover:text-white">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {passwordConfirm && password === passwordConfirm && (
                  <p className="text-blue-500 text-xs mt-2 flex items-center gap-1 animate-in zoom-in duration-300">
                    <CheckCircle2 size={12} /> 비밀번호가 일치합니다.
                  </p>
                )}
                {errors.passwordConfirm && <p className="text-red-500 text-xs mt-2">{errors.passwordConfirm.message}</p>}
              </div>
              <button type="button" disabled={!isValid || password !== passwordConfirm} onClick={handleNextStep} className="w-full mt-4 bg-blue-600 p-4 rounded-xl font-bold disabled:opacity-20 hover:bg-blue-500 transition-all">다음 단계</button>
            </div>
          )}

          {/* STEP 3: 프로필 및 닉네임 */}
          {step === 3 && (
            <div className="space-y-6 text-center animate-in fade-in duration-700">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden cursor-pointer hover:border-blue-500 transition-all group"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-500 group-hover:text-blue-500 flex flex-col items-center">
                        <Camera size={24} />
                        <span className="text-[10px] mt-1 font-bold">PHOTO</span>
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <button type="button" onClick={() => setImagePreview(null)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 border-2 border-[#121212] hover:bg-red-600">
                      <X size={12} />
                    </button>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-gray-400 mb-2">닉네임</label>
                <input
                  className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                  placeholder="사용하실 닉네임을 적어주세요"
                  {...register('nickname', { required: '닉네임은 필수입니다.' })}
                />
              </div>

              <button type="submit" disabled={!isValid} className="w-full bg-green-600 p-4 rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-900/20">회원가입 완료</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;