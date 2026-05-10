import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios'; 

// 1. 서버 데이터 구조에 맞춘 인터페이스
interface UserInfo {
    name: string;
    email: string;
    bio?: string;
    avatar?: string; // profilePic 대신 avatar 사용
}

const MyPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // UI 상태 관리
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', bio: '', avatar: '' });

    // 2. 내 정보 조회 (useQuery)
    const { data: userInfo, isLoading, isError } = useQuery<UserInfo>({
        queryKey: ['userInfo'],
        queryFn: async () => {
            const response = await api.get('/v1/users/me');
            // 서버 응답 구조(data.data 또는 data.result)에 맞춰 파싱
            return response.data.data || response.data.result || response.data;
        },
        retry: 1,
    });

    // 3. 프로필 수정 Mutation
    const updateMutation = useMutation({
        mutationFn: (updateData: Partial<UserInfo>) => api.patch('/v1/users', updateData),
        onSuccess: () => {
            // 캐시 무효화로 화면 즉시 갱신
            queryClient.invalidateQueries({ queryKey: ['userInfo'] });
            setIsEditing(false);
            alert('프로필이 성공적으로 수정되었습니다! ✨');
        },
        onError: (error: any) => {
            console.error("수정 실패:", error.response?.data);
            alert(`수정 중 오류가 발생했습니다: ${error.response?.data?.message || '알 수 없는 에러'}`);
        }
    });

    // 4. 로그아웃 Mutation
    const logoutMutation = useMutation({
        mutationFn: () => api.post('/v1/auth/logout'),
        onSuccess: () => {
            localStorage.clear();
            navigate('/login');
        }
    });

    // 편집 모드 진입 시 기존 데이터 세팅
    const handleEditClick = () => {
        if (userInfo) {
            setEditForm({
                name: userInfo.name || '',
                bio: userInfo.bio || '',
                avatar: userInfo.avatar || ''
            });
            setIsEditing(true);
        }
    };

    // 저장 버튼 클릭
    const handleSave = () => {
        if (!editForm.name.trim()) {
            alert('이름은 필수 입력 항목입니다.');
            return;
        }
        
        // 요구사항: Bio와 Avatar는 비어있어도 전송 가능하도록 처리
        updateMutation.mutate({
            name: editForm.name,
            bio: editForm.bio || "",     // 없으면 빈 문자열
            avatar: editForm.avatar || "" // 없으면 빈 문자열 혹은 null
        });
    };

    if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold text-xl animate-pulse">데이터를 불러오는 중... 🚀</div>;
    
    if (isError || !userInfo) return <div className="min-h-screen bg-black text-white flex items-center justify-center">정보를 불러오지 못했습니다. 🥊</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center font-sans">
            <header className="w-full max-w-md mt-10 mb-8">
                <div className="flex justify-between items-end mb-6">
                    <h1 className="text-3xl font-bold text-zinc-100">마이페이지</h1>
                    {!isEditing && (
                        <button 
                            onClick={handleEditClick}
                            className="text-sm font-semibold text-pink-500 hover:text-pink-400 transition-colors border border-pink-500/30 px-3 py-1 rounded-full"
                        >
                            설정
                        </button>
                    )}
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
                    {isEditing ? (
                        /* --- 📝 수정 모드 UI --- */
                        <div className="space-y-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Name</label>
                                <input 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-sm outline-none focus:border-pink-500 transition-all"
                                    value={editForm.name} 
                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Bio</label>
                                <textarea 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-sm outline-none focus:border-pink-500 transition-all resize-none"
                                    rows={3}
                                    placeholder="자기소개를 입력해 주세요 (옵션)"
                                    value={editForm.bio} 
                                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Avatar URL</label>
                                <input 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-sm outline-none focus:border-pink-500 transition-all"
                                    placeholder="이미지 URL을 입력해 주세요 (옵션)"
                                    value={editForm.avatar} 
                                    onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 py-4 bg-pink-600 hover:bg-pink-700 rounded-2xl font-bold transition-all disabled:bg-zinc-700"
                                >
                                    {updateMutation.isPending ? '저장 중...' : '저장하기'}
                                </button>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-bold transition-all"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* --- 👤 조회 모드 UI --- */
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 mb-6 relative">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-pink-500/20">
                                    {userInfo.avatar ? (
                                        <img src={userInfo.avatar} alt="profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                                            {userInfo.name?.[0]}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="text-center mb-8">
                                <p className="text-2xl font-bold text-white mb-1">{userInfo.name}</p>
                                <p className="text-zinc-400 text-sm mb-4">{userInfo.email}</p>
                                <p className="text-zinc-500 text-sm leading-relaxed px-4">
                                    {userInfo.bio || "아직 자기소개가 없습니다."}
                                </p>
                            </div>

                            <button 
                                onClick={() => {
                                    if(window.confirm("로그아웃 하시겠습니까?")) logoutMutation.mutate();
                                }}
                                className="w-full py-4 bg-zinc-800/50 hover:bg-red-900/20 hover:text-red-500 text-zinc-500 rounded-2xl text-sm font-bold transition-all"
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* 미션 체크리스트 (지오님 디자인 유지) */}
            <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4 px-2">
                    <h2 className="text-lg font-bold text-pink-500">✅ 미션 체크리스트</h2>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-3xl text-sm text-zinc-500 text-center italic">
                    프로필 수정 기능 (Mutation) 구현 완료 🥊
                </div>
            </div>
        </div>
    );
};

export default MyPage;