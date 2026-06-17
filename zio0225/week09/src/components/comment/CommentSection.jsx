import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getComments, postComment } from '../../api/CommentApi'; // 👈 대소문자 확인!
import CommentItem from './CommentItem';

const CommentSection = ({ lpid }) => {
    const queryClient = useQueryClient();
    const [commentInput, setCommentInput] = useState('');
    
    // ✅ lpid를 문자열로 통일해서 관리하는 것이 QueryKey 일관성에 좋습니다.
    const commentQueryKey = ['comments', String(lpid)];

    // 1️⃣ [목록 불러오기] useQuery
    const { data: comments, isLoading, isError } = useQuery({
        queryKey: commentQueryKey,
        queryFn: () => getComments(lpid),
        enabled: !!lpid, // lpid가 있을 때만 실행
    });

    // 2️⃣ [댓글 작성하기] useMutation
    const createMutation = useMutation({
        mutationFn: (content) => postComment(lpid, { content }),
        onSuccess: () => {
            // ✅ 등록 성공 시 목록을 '무효화'하여 서버에서 최신 목록을 다시 가져옴
            queryClient.invalidateQueries({ queryKey: commentQueryKey });
            setCommentInput(''); // 입력창 초기화
            alert('댓글이 등록되었습니다! ✍️');
        },
        onError: (error) => {
            console.error(error);
            alert(`작성 실패: ${error.response?.data?.message || '에러 발생'}`);
        }
    });

    // 3️⃣ [핸들러] 등록 함수
    const handleAddComment = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        if (!commentInput.trim()) {
            alert('내용을 입력해주세요!');
            return;
        }
        createMutation.mutate(commentInput);
    };

    // 4️⃣ [핸들러] 엔터키 감지
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 px-4 pb-20">
            <h3 className="text-xl font-bold text-white mb-6">
                댓글 {comments?.length || 0}
            </h3>

            {/* --- 댓글 입력창 영역 --- */}
            <form onSubmit={handleAddComment} className="mb-10">
                <div className="relative group">
                    <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="음악에 대한 생각을 남겨주세요..."
                        className="w-full h-28 rounded-2xl bg-zinc-900 border border-zinc-800 p-4 text-white outline-none focus:border-pink-600 transition-all resize-none"
                    />
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="absolute bottom-4 right-4 px-6 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 disabled:opacity-50 transition-all"
                    >
                        {createMutation.isPending ? '등록 중...' : '댓글 등록'}
                    </button>
                </div>
            </form>

            {/* --- 댓글 목록 리스트 영역 --- */}
            <div className="flex flex-col gap-2">
                {isLoading && <p className="text-zinc-500 text-center py-10">댓글을 불러오는 중...</p>}
                {isError && <p className="text-red-500 text-center py-10">데이터를 가져오는데 실패했습니다. 🥊</p>}
                
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem 
                            key={comment.id} 
                            comment={comment} 
                            lpid={lpid} 
                        />
                    ))
                ) : (
                    !isLoading && (
                        <p className="text-zinc-500 text-center py-10 border-t border-zinc-900">
                            아직 댓글이 없습니다. 첫 마디를 남겨보세요! 🎹
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default CommentSection;