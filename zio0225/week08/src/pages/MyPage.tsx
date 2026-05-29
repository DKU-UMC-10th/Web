import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios'; 

interface UserInfo {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
}

const MyPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', bio: '', avatar: '' });

    // 1. 내 정보 조회
    const { data: userInfo, isLoading, isError } = useQuery<UserInfo>({
        queryKey: ['userInfo'],
        queryFn: async () => {
            const response = await api.get('/v1/users/me');
            return response.data.data || response.data.result || response.data;
        },
        retry: 1,
    });

    // 2. 프로필 수정 Mutation (낙관적 업데이트 적용 🥊)
    const updateMutation = useMutation({
        mutationFn: (updateData: Partial<UserInfo>) => api.patch('/v1/users', updateData),
        
        // 🥊 단계 1: Mutation 발생 직전 (즉시 반영)
        onMutate: async (newUserInfo) => {
            // 진행 중인 refetch 취소 (데이터 꼬임 방지)
            await queryClient.cancelQueries({ queryKey: ['userInfo'] });

            // 기존 데이터 스냅샷 (실패 시 복구용)
            const previousUserInfo = queryClient.getQueryData(['userInfo']);

            // 캐시를 새 데이터로 미리 업데이트
            queryClient.setQueryData(['userInfo'], (old: any) => ({
                ...old,
                ...newUserInfo,
            }));

            // 저장 모드 종료
            setIsEditing(false);

            // 실패 시 복구할 수 있도록 context 반환
            return { previousUserInfo };
        },

        // 🥊 단계 2: 에러 발생 시 (복구)
        onError: (err, _newUserInfo, context) => {
            // 에러 시 스냅샷으로 롤백
            if (context?.previousUserInfo) {
                queryClient.setQueryData(['userInfo'], context.previousUserInfo);
            }
            console.error("수정 실패:", err);
            alert('수정에 실패하여 원래 정보로 되돌립니다. 🥊');
        },

        // 🥊 단계 3: 완료 후 (검증)
        onSettled: () => {
            // 성공하든 실패하든 서버 데이터와 최종 동기화
            queryClient.invalidateQueries({ queryKey: ['userInfo'] });
        },

        onSuccess: () => {
            alert('프로필이 즉시 업데이트되었습니다! ✨');
        }
    });

    const logoutMutation = useMutation({
        mutationFn: () => api.post('/v1/auth/logout'),
        onSuccess: () => {
            localStorage.clear();
            navigate('/login');
        }
    });

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

    const handleSave = () => {
        if (!editForm.name.trim()) {
            alert('이름은 필수 입력 항목입니다.');
            return;
        }
        
        updateMutation.mutate({
            name: editForm.name,
            bio: editForm.bio || "",
            avatar: editForm.avatar || ""
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
                            className="text-sm font-semibold text-pink-500 hover:text-pink-400 transition-colors border border-pink-500/30 px-4 py-1.5 rounded-full"
                        >
                            프로필 편집
                        </button>
                    )}
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50 transition-all">
                    {isEditing ? (
                        /* --- 📝 수정 모드 UI --- */
                        <div className="space-y-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Name</label>
                                <input 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-sm outline-none focus:border-pink-500 transition-all text-white"
                                    value={editForm.name} 
                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Bio</label>
                                <textarea 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-sm outline-none focus:border-pink-500 transition-all resize-none text-white"
                                    rows={3}
                                    value={editForm.bio} 
                                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Avatar URL</label>
                                <input 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-sm outline-none focus:border-pink-500 transition-all text-white"
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
                                    {updateMutation.isPending ? '처리 중...' : '저장하기'}
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
                            <div className="w-24 h-24 mb-6 relative group">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-pink-500/20 shadow-lg shadow-pink-500/10">
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
                                <p className="text-zinc-500 text-sm mb-4">{userInfo.email}</p>
                                <div className="bg-zinc-800/30 p-4 rounded-2xl min-w-[240px]">
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {userInfo.bio || "아직 자기소개가 없습니다."}
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    if(window.confirm("로그아웃 하시겠습니까?")) logoutMutation.mutate();
                                }}
                                className="w-full py-4 text-zinc-600 hover:text-red-400 text-xs font-bold transition-all"
                            >
                                로그아웃 하러가기
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* --- 🥊 미션 체크리스트 (낙관적 업데이트 확인용) --- */}
            <div className="w-full max-w-md">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
                    <h2 className="text-pink-500 font-bold mb-4 flex items-center gap-2 text-sm">
                        <span>✅</span> Optimistic Update Status
                    </h2>
                    <ul className="space-y-3 text-[13px]">
                        <li className="flex items-center gap-3 text-zinc-300">
                            <div className={`w-2 h-2 rounded-full ${userInfo.name ? 'bg-green-500' : 'bg-zinc-700'}`}></div>
                            Nav-Bar 동기화: <span className="text-zinc-500">['userInfo'] 키 공유 완료</span>
                        </li>
                        <li className="flex items-center gap-3 text-zinc-300">
                            <div className={`w-2 h-2 rounded-full ${updateMutation.isPending ? 'bg-pink-500 animate-pulse' : 'bg-green-500'}`}></div>
                            onMutate 즉시 변경: <span className="text-zinc-500">적용됨</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyPage;