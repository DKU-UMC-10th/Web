import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchComment, deleteComment } from '../../api/commentApi';

const CommentItem = ({ comment, lpid }) => {
    const queryClient = useQueryClient();
    const commentQueryKey = ['comments', lpid];

    // 수정 모드 상태 관리
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    // 1️⃣ 댓글 수정 Mutation
    const updateMutation = useMutation({
        mutationFn: () => patchComment(comment.id, { content: editContent }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentQueryKey });
            setIsEditing(false); // 수정 완료 후 모드 해제
            alert('댓글이 수정되었습니다!');
        }
    });

    // 2️⃣ 댓글 삭제 Mutation
    const deleteMutation = useMutation({
        mutationFn: () => deleteComment(comment.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentQueryKey });
            alert('댓글이 삭제되었습니다!');
        }
    });

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            deleteMutation.mutate();
        }
    };

    return (
        <div className="border-b border-zinc-800 py-4">
            {isEditing ? (
                // --- 수정 모드 ---
                <div className="flex flex-col gap-2">
                    <textarea 
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-pink-600"
                    />
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(false)} className="text-sm text-zinc-400">취소</button>
                        <button 
                            onClick={() => updateMutation.mutate()} 
                            className="text-sm text-pink-500 font-bold"
                        >
                            저장
                        </button>
                    </div>
                </div>
            ) : (
                // --- 일반 모드 ---
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-white">{comment.content}</p>
                        <span className="text-xs text-zinc-500">{comment.createdAt}</span>
                    </div>
                    
                    {/* 본인 댓글일 때만 메뉴 노출 (서버 데이터에 따라 isMine 등 조건 활용) */}
                    {comment.isMine && (
                        <div className="flex gap-3 text-sm">
                            <button onClick={() => setIsEditing(true)} className="text-zinc-400 hover:text-white">수정</button>
                            <button onClick={handleDelete} className="text-zinc-400 hover:text-red-500">삭제</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;