import { useEffect, useState } from "react"
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AUTH_REDIRECT_PATH_KEY } from "../constants/authRedirect";


const Mypage = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const redirectPath =
      sessionStorage.getItem(AUTH_REDIRECT_PATH_KEY) ??
      localStorage.getItem(AUTH_REDIRECT_PATH_KEY);

    if (
      redirectPath &&
      redirectPath !== "/my" &&
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//")
    ) {
      sessionStorage.removeItem(AUTH_REDIRECT_PATH_KEY);
      localStorage.removeItem(AUTH_REDIRECT_PATH_KEY);
      sessionStorage.removeItem(`auth-alert:${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

    useEffect(() => {
        const getData = async () => {
      const response = await getMyInfo();
            console.log(response);
            setData(response);
        };
    
        getData();
  }, [setData])

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!data) {
    return <div>내 정보를 불러오는 중입니다.</div>;
  }

  console.log(data.data.name);
  return (
    <div>
      <h1>내 정보</h1>
      <p>이름: {data.data?.name}</p>
      <img src={data.data?.avatar as string} alt="프로필 이미지" />
      <h1>{data.data?.email}</h1>
      <button className = "cursor-pointer bg-blue-500 text-white py-2 px-4 rounded"
      onClick={handleLogout}>로그아웃</button>
    </div>
  )
}

export default Mypage
