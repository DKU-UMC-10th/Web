import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLP } from '../../api/lpApi'; // 👈 지오님 프로젝트의 API 경로 확인!

const CreateLpModal = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // --- [1. useMutation을 이용한 LP 등록 및 자동 새로고침] ---
    const { mutate, isPending } = useMutation({
        mutationFn: createLP,
        onSuccess: () => {
            // ✅ POST 요청 성공 시 'lps' 키를 가진 모든 쿼리를 무효화 -> 자동 fetch
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            
            alert('LP가 등록되었습니다! 💿');
            
            // ✅ 모달 닫기 및 상태 초기화
            onClose();
            setTags([]);
            setTagInput('');
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || '서버 에러가 발생했습니다.';
            alert(`등록 실패: ${errorMsg} 🥊`);
        }
    });

    // --- [2. 태그 추가 로직] ---
    const addTag = (e) => {
        e.preventDefault(); 
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    // --- [3. 태그 즉시 삭제 로직] ---
    const removeTag = (tagToRemove) => {
        // filter를 사용하여 클릭한 태그만 제외한 새 배열 생성
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // --- [4. 폼 제출 로직] ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        // form 필드에서 직접 값 추출
        formData.append('title', e.target.title.value);
        formData.append('content', e.target.content.value);
        
        if (e.target.image.files[0]) {
            formData.append('image', e.target.image.files[0]);
        }
        
        // 태그 배열은 서버가 받을 수 있게 문자열화해서 전달 (서버 명세에 따라 조절 가능)
        formData.append('tags', JSON.stringify(tags));

        mutate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 shadow-2xl text-white">
                <button 
                    onClick={onClose}
                    className="absolute right-6 top-6 text-zinc-400 hover:text-white text-2xl transition"
                >
                    ✕
                </button>

                <h2 className="mb-6 text-2xl font-bold text-pink-500">새 LP 등록하기</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        name="title" 
                        placeholder="LP 제목을 입력하세요" 
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-pink-600 transition"
                        required 
                    />
                    <textarea 
                        name="content" 
                        placeholder="음악에 대한 설명을 적어주세요" 
                        className="w-full h-32 rounded-xl border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-pink-600 resize-none transition"
                        required 
                    />
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400 font-medium">커버 이미지 업로드</label>
                        <input 
                            name="image" 
                            type="file" 
                            accept="image/*"
                            className="text-sm text-zinc-400 file:mr-4 file:rounded-full file:border-0 file:bg-pink-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-pink-700 transition file:cursor-pointer"
                            required 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400 font-medium">태그</label>
                        <div className="flex gap-2">
                            <input 
                                value={tagInput} 
                                onChange={(e) => setTagInput(e.target.value)} 
                                onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                                placeholder="태그 입력"
                                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm outline-none focus:border-pink-600 transition"
                            />
                            <button 
                                type="button" 
                                onClick={addTag}
                                className="rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700 transition font-semibold"
                            >
                                추가
                            </button>
                        </div>
                        
                        {/* 태그 리스트 & 삭제 버튼 */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 rounded-full bg-pink-600/20 px-3 py-1 text-sm text-pink-500 border border-pink-600/30">
                                    #{tag}
                                    <button 
                                        type="button" 
                                        onClick={() => removeTag(tag)} // 👈 x 버튼 클릭 시 삭제 로직
                                        className="ml-1 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="mt-4 w-full rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-600/20"
                    >
                        {isPending ? 'LP 굽는 중...' : 'Add LP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLpModal;