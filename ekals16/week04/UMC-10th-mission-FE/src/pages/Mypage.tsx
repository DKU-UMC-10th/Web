import { useEffect, useState } from "react"
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";


const Mypage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    useEffect(() => {
        const getData = async () => {
      const response = await getMyInfo();
            console.log(response);
            setData(response);
        };
    
        getData();
  }, [setData])

  if (!data) {
    return <div>내 정보를 불러오는 중입니다.</div>;
  }

  console.log(data.data.name);
  return (
    <div>
      {data.data.name}
    </div>
  )
}

export default Mypage
