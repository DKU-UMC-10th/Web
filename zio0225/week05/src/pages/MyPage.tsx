import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

interface UserInfo {
    name: string;
    email: string;
    nickname?: string;
}

interface MissionTask {
    id: number;
    text: string;
    completed: boolean;
}

const MyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [tasks, setTasks] = useState<MissionTask[]>([
        { id: 1, text: "AccessToken 이해하기", completed: true },
        { id: 2, text: "RefreshToken으로 토큰 재발급 구현", completed: false },
        { id: 3, text: "Axios Interceptor 설정하기", completed: false },
        { id: 4, text: "마이페이지 내 정보 불러오기", completed: true },
    ]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await api.get('/v1/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }); 
                
                const result = response.data;
                const finalData = result.data || result.result || result;
                
                setUserInfo(finalData);
            } catch (error) {
                console.error(error);
                setUserInfo({
                    name: "지오",
                    email: "데이터 구조 확인 필요"
                });
            }
        };
        fetchUserInfo();
    }, [navigate]);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (!userInfo) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold">
            데이터를 불러오는 중... 🚀
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center font-sans">
            <header className="w-full max-w-md mt-10 mb-8">
                <h1 className="text-2xl font-bold mb-6 text-zinc-100">마이페이지</h1>
                
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                            {(userInfo.name || userInfo.nickname || "U")[0]}
                        </div>
                        <div>
                            <p className="text-xl font-bold">{userInfo.name || userInfo.nickname}</p>
                            <p className="text-zinc-500 text-sm">{userInfo.email}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full py-3 bg-zinc-800 hover:bg-red-900/20 hover:text-red-500 text-zinc-400 rounded-2xl text-sm font-semibold transition-all"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-pink-500">✅ 미션 체크리스트</h2>
                    <span className="text-xs text-zinc-500">
                        {tasks.filter(t => t.completed).length} / {tasks.length} 완료
                    </span>
                </div>
                
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                                task.completed 
                                ? 'bg-pink-900/10 border-pink-500/30 text-pink-100' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed ? 'bg-pink-500 border-pink-500' : 'border-zinc-600'
                            }`}>
                                {task.completed && <span className="text-[10px] text-white">✓</span>}
                            </div>
                            <span className={`text-sm font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                                {task.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPage;