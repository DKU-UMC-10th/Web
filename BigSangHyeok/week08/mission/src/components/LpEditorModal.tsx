import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLp, postLp, uploadImage } from "../apis/lp";
import type { Lp } from "../types/lp";

type LpEditorModalProps = {
    initialLp?: Lp;
    mode?: "create" | "edit";
    onClose: () => void;
};

const CloseIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
);

const LpEditorModal = ({ initialLp, mode = "create", onClose }: LpEditorModalProps) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(initialLp?.title ?? "");
    const [content, setContent] = useState(initialLp?.content ?? "");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(initialLp?.tags.map((tag) => tag.name) ?? []);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailUrl] = useState(initialLp?.thumbnail ?? "");

    const previewUrl = useMemo(() => {
        if (!thumbnailFile) {
            return thumbnailUrl;
        }

        return URL.createObjectURL(thumbnailFile);
    }, [thumbnailFile, thumbnailUrl]);

    useEffect(() => {
        return () => {
            if (previewUrl && thumbnailFile) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, thumbnailFile]);

    const lpMutation = useMutation({
        mutationFn: async () => {
            const uploadedImage = thumbnailFile ? await uploadImage(thumbnailFile) : null;
            const nextThumbnail = uploadedImage?.data.imageUrl ?? thumbnailUrl;
            const body = {
                title: title.trim(),
                content: content.trim(),
                thumbnail: nextThumbnail || undefined,
                tags,
                published: true,
            };

            if (mode === "edit" && initialLp) {
                return patchLp({ lpid: String(initialLp.id), body });
            }

            return postLp(body);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["lps"] });
            if (initialLp) {
                await queryClient.invalidateQueries({ queryKey: ["lp", String(initialLp.id)] });
            }
            onClose();
        },
    });

    const addTag = () => {
        const nextTag = tagInput.trim().replace(/^#/, "");

        if (!nextTag || tags.includes(nextTag)) {
            setTagInput("");
            return;
        }

        setTags((prev) => [...prev, nextTag]);
        setTagInput("");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        lpMutation.mutate();
    };

    const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const isDisabled = !title.trim() || !content.trim() || tags.length === 0 || lpMutation.isPending;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="LP 작성 모달 닫기"
            onClick={onClose}
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    onClose();
                }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={stopPropagation}
                className="relative w-full max-w-[590px] rounded-[22px] bg-[#282a31] px-7 pb-8 pt-20 text-white shadow-2xl"
            >
                <button type="button" onClick={onClose} aria-label="닫기" className="absolute right-8 top-8 text-white hover:text-[#ff2ea3]">
                    <CloseIcon />
                </button>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="mx-auto block h-72 w-72 cursor-pointer overflow-hidden rounded-full" title="LP 사진 선택">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => setThumbnailFile(event.target.files?.[0] ?? null)}
                            className="sr-only"
                        />
                        {previewUrl ? (
                            <img src={previewUrl} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <span
                                aria-hidden="true"
                                className="block h-full w-full rounded-full border border-black/40"
                                style={{
                                    background:
                                        "radial-gradient(circle at 50% 50%, #f4f4f4 0 16%, #111 16.5% 26%, #050505 26.5% 52%, #1c1c1c 53% 55%, #080808 56% 100%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,.2) 0 1px, transparent 1px 5px)",
                                    boxShadow: "inset 38px 18px 54px rgba(255,255,255,.16), inset -30px -20px 45px rgba(0,0,0,.8)",
                                }}
                            />
                        )}
                    </label>

                    <div className="space-y-4">
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="LP Name"
                            className="h-[58px] w-full rounded-md border border-[#5c6678] bg-[#282a31] px-4 text-2xl font-semibold text-white outline-none placeholder:text-[#9aa0aa] focus:border-white"
                        />
                        <input
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="LP Content"
                            className="h-[58px] w-full rounded-md border border-[#5c6678] bg-[#282a31] px-4 text-2xl font-semibold text-white outline-none placeholder:text-[#9aa0aa] focus:border-white"
                        />
                        <div className="flex gap-3">
                            <input
                                value={tagInput}
                                onChange={(event) => setTagInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        addTag();
                                    }
                                }}
                                placeholder="LP Tag"
                                className="h-[58px] min-w-0 flex-1 rounded-md border border-[#5c6678] bg-[#282a31] px-4 text-2xl font-semibold text-white outline-none placeholder:text-[#9aa0aa] focus:border-white"
                            />
                            <button type="button" onClick={addTag} className="h-[58px] w-[98px] rounded-md bg-[#a6afbd] text-2xl font-bold text-white hover:bg-[#b7bfca]">
                                Add
                            </button>
                        </div>
                    </div>

                    {tags.length > 0 && (
                        <ul className="flex flex-wrap gap-3">
                            {tags.map((tag) => (
                                <li key={tag} className="inline-flex h-[60px] items-center gap-3 rounded-md border border-[#5c6678] px-3 text-xl font-semibold text-white">
                                    {tag}
                                    <button type="button" onClick={() => setTags((prev) => prev.filter((item) => item !== tag))} aria-label={`${tag} 태그 삭제`} className="text-2xl leading-none">
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {lpMutation.isError && <p className="text-sm text-red-400">LP 저장에 실패했습니다. 입력값을 확인해주세요.</p>}

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="h-[58px] w-full rounded-md bg-[#ff2ea3] text-2xl font-bold text-white transition-colors hover:bg-[#e52593] disabled:bg-[#a6afbd] disabled:text-white"
                    >
                        {lpMutation.isPending ? "저장 중..." : mode === "edit" ? "Save LP" : "Add LP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LpEditorModal;
