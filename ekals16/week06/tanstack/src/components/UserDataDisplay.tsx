import { useState } from 'react';
import { useCustomFetch } from '../hooks/useCustomFetch';

interface WelcomeDataResponse {
  id: number;
  name: string;
  email: string;
}

interface UserDataDisplayProps {
  userId: number;
}

export const WelcomeData = () => {
  const [userId, setUserId] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleChangeUser}>
          다른 사용자 불러오기 (AbortController 테스트)
        </button>
        <button onClick={() => setIsVisible((prev) => !prev)}>
          컴포넌트 토글 (언마운트 테스트)
        </button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
};

export const UserDataDisplay = ({ userId }: UserDataDisplayProps) => {
  const { data, isPending, isError } = useCustomFetch<WelcomeDataResponse>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) {
    return <div>Loading... (User ID: {userId})</div>;
  }

  if (isError) {
    return <div>Error Occurred</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
      <p style={{ fontSize: '12px', color: '#666' }}>User ID: {data.id}</p>
    </div>
  );
};