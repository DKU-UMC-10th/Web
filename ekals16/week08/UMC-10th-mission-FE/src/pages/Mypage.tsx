import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyInfo, updateMyInfo } from "../apis/auth";
import { AUTH_REDIRECT_PATH_KEY } from "../constants/authRedirect";
import { useAuth } from "../context/useAuth";
import type { RequestUpdateMyInfoDto, ResponseMyInfoDto } from "../types/auth";

const MY_INFO_QUERY_KEY = ["me"];

const Mypage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: MY_INFO_QUERY_KEY,
    queryFn: getMyInfo,
    staleTime: 1000 * 60,
  });

  const updateMyInfoMutation = useMutation({
    mutationFn: updateMyInfo,
    onMutate: async (nextProfile: RequestUpdateMyInfoDto) => {
      await queryClient.cancelQueries({ queryKey: MY_INFO_QUERY_KEY });

      const previousMyInfo =
        queryClient.getQueryData<ResponseMyInfoDto>(MY_INFO_QUERY_KEY);

      if (previousMyInfo) {
        queryClient.setQueryData<ResponseMyInfoDto>(MY_INFO_QUERY_KEY, {
          ...previousMyInfo,
          data: {
            ...previousMyInfo.data,
            name: nextProfile.name,
            bio: nextProfile.bio ?? null,
            avatar: nextProfile.avatar ?? null,
          },
        });
      }

      setIsEditing(false);

      return { previousMyInfo };
    },
    onError: (_error, _nextProfile, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData(MY_INFO_QUERY_KEY, context.previousMyInfo);
      }
      setIsEditing(true);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: MY_INFO_QUERY_KEY });
    },
  });

  useEffect(() => {
    const redirectPath =
      sessionStorage.getItem(AUTH_REDIRECT_PATH_KEY) ??
      localStorage.getItem(AUTH_REDIRECT_PATH_KEY);

    if (
      redirectPath &&
      redirectPath !== "/my" &&
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//")
    ) {
      sessionStorage.removeItem(AUTH_REDIRECT_PATH_KEY);
      localStorage.removeItem(AUTH_REDIRECT_PATH_KEY);
      sessionStorage.removeItem(`auth-alert:${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!data?.data || updateMyInfoMutation.isPending) {
      return;
    }

    setName(data.data.name);
    setBio(data.data.bio ?? "");
    setAvatar(data.data.avatar ?? "");
  }, [data, updateMyInfoMutation.isPending]);

  const handleChangeAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = name.trim();

    if (!nextName) {
      return;
    }

    updateMyInfoMutation.mutate({
      name: nextName,
      bio: bio.trim() || undefined,
      avatar: avatar || undefined,
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isPending) {
    return (
      <div className="flex min-h-60 items-center justify-center text-sm text-white/60">
        내 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-red-400">내 정보를 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const myInfo = data.data;

  return (
    <section className="mx-auto max-w-4xl text-white">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">마이 페이지</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            설정
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="mt-8 rounded bg-black px-6 py-10 ring-1 ring-white/10 sm:px-12">
        {isEditing ? (
          <form
            className="flex flex-col gap-8 sm:flex-row sm:items-center"
            onSubmit={handleSubmitProfile}
          >
            <label className="group relative mx-auto flex h-48 w-48 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-zinc-200 sm:mx-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt="프로필 사진 미리보기"
                  className="h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeAvatar}
                className="sr-only"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                사진 변경
              </span>
            </label>

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="이름"
                    className="h-14 rounded border border-white/70 bg-black px-4 text-2xl font-bold text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                  <input
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Bio"
                    className="h-12 rounded border border-white/70 bg-black px-4 text-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={updateMyInfoMutation.isPending || !name.trim()}
                  className="mt-3 rounded px-3 py-2 text-3xl font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/30"
                  aria-label="프로필 수정 저장"
                >
                  ✓
                </button>
              </div>
              <p className="text-2xl font-semibold text-white">
                {myInfo.email}
              </p>
              {updateMyInfoMutation.isError && (
                <p className="text-sm text-red-400">
                  프로필 수정에 실패했습니다. 이전 정보로 되돌렸습니다.
                </p>
              )}
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="mx-auto flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 sm:mx-0">
              {myInfo.avatar ? (
                <img
                  src={myInfo.avatar}
                  alt="프로필 사진"
                  className="h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
              <p className="text-3xl font-bold">{myInfo.name}</p>
              <p className="text-xl text-white/80">
                {myInfo.bio || "소개가 없습니다."}
              </p>
              <p className="break-all text-2xl font-semibold">
                {myInfo.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const DefaultAvatar = () => (
  <div className="relative h-full w-full bg-zinc-200">
    <div className="absolute left-1/2 top-10 h-16 w-16 -translate-x-1/2 rounded-full bg-zinc-50" />
    <div className="absolute bottom-0 left-1/2 h-24 w-36 -translate-x-1/2 rounded-t-full bg-zinc-50" />
  </div>
);

export default Mypage;
