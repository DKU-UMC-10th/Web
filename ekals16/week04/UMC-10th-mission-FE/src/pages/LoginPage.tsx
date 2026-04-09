import useForm from '../hooks/useForm';
import { type UserSignInformation, validateSignin } from '../../utils/validate';

const LoginPage = () => {

    const { values, errors, touched, getInputProps } =
        useForm<UserSignInformation>({
            initialValue: {
                email: "",
                password: "",
            },
            validate: validateSignin,
        })
    

    const handleSubmit = () => {
        console.log(values);
    };

    //오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
    const isDisabled = 
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있으면 True

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex flex-col gap-3">
            <input
                {...getInputProps('email')}
                name="email"
                className={`border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
                    errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-[#ccc]"
                }`}
                type={"email"}
                placeholder={"이메일"}
            />
            {errors?.email && touched?.email && (
                <div className='text-red-500 text-sm'>{errors.email}</div>
            )}
            <input
                {...getInputProps('password')}
                className={`border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
                    errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-[#ccc]"
                }`}
                type={"password"}
                placeholder={"비밀번호"}
            />
            {errors?.password && touched?.password && (
                <div className='text-red-500 text-sm'>{errors.password}</div>
            )}
            <button type='button' onClick={handleSubmit} disabled={isDisabled} className="bg-blue-600 text-white w-full py-3 text-lg font-medium rounded-sm hover:bg-blue-700 cursor-pointer transition-colors disabled:bg-gray-300">
                로그인
            </button>
        </div>
      
    </div>
  )
}

export default LoginPage
