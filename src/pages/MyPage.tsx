import { useEffect, useState } from 'react';
import axios from 'axios';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 1. 로컬 스토리지에서 토큰 가져오기
                const token = localStorage.getItem('accessToken');

                // 2. Swagger 확인 후 토큰이 필요한 API 호출 (예시 경로: /user/me)
                const response = await axios.get('https://주소/user/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserInfo(response.data);
            } catch (error) {
                console.error("내 정보를 불러오는데 실패했습니다.", error);
            }
        };

        fetchUserInfo();
    }, []);

    if (!userInfo) return <div>로딩 중...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>마이페이지</h1>
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <p><strong>이름:</strong> {userInfo.name}</p>
                <p><strong>이메일:</strong> {userInfo.email}</p>
                {/* Swagger 응답 데이터에 따라 항목을 추가하세요! */}
            </div>
        </div>
    );
};

export default MyPage;