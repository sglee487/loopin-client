import React, { useState, useEffect } from "react";
import {
  useGetMyStreamQuery,
  useCreateStreamKeyMutation,
  useUpdateStreamMetadataMutation,
  useRefreshStreamKeyMutation,
} from "../api/streamerApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { toast } from "react-toastify";
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const StreamManagementPage: React.FC = () => {
  const {
    data: streamInfo,
    isLoading,
    isError,
    error,
  } = useGetMyStreamQuery();

  // Check for 401 Unauthorized and redirect to login
  useEffect(() => {
    if (isError && error && "status" in error && error.status === 401) {
      console.error('401 에러 발생:', error);
      console.log('현재 쿠키:', document.cookie);
      toast.error("로그인이 필요합니다.");
      // 임시로 자동 리다이렉트 비활성화 - 디버깅용
      // window.location.href = `${API_BASE_URL}/oauth2/authorization/keycloak`;
    }
  }, [isError, error]);
  const [createStreamKey, { isLoading: isCreating }] =
    useCreateStreamKeyMutation();
  const [updateStreamMetadata, { isLoading: isUpdating }] =
    useUpdateStreamMetadataMutation();
  const [refreshStreamKey, { isLoading: isRefreshing }] =
    useRefreshStreamKeyMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    resolution: "720p",
    bitrate: 2500,
  });

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Initialize form when stream info is loaded
  useEffect(() => {
    if (streamInfo) {
      setEditForm({
        title: streamInfo.title,
        description: streamInfo.description || "",
        resolution: streamInfo.resolution,
        bitrate: streamInfo.bitrate,
      });
    }
  }, [streamInfo]);

  const handleCreateStream = async () => {
    try {
      await createStreamKey({
        title: "내 스트림",
        description: "",
        resolution: "720p",
        bitrate: 2500,
      }).unwrap();
      toast.success("스트림 키가 생성되었습니다!");
    } catch (err: any) {
      toast.error("스트림 키 생성에 실패했습니다.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStreamMetadata({
        title: editForm.title,
        description: editForm.description || undefined,
        resolution: editForm.resolution,
        bitrate: editForm.bitrate,
      }).unwrap();
      toast.success("스트림 정보가 업데이트되었습니다!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error("스트림 정보 업데이트에 실패했습니다.");
    }
  };

  const handleRefreshKey = async () => {
    if (
      !window.confirm(
        "스트림 키를 재생성하시겠습니까? 기존 키는 더 이상 사용할 수 없습니다."
      )
    ) {
      return;
    }
    try {
      await refreshStreamKey().unwrap();
      toast.success("스트림 키가 재생성되었습니다!");
    } catch (err: any) {
      toast.error("스트림 키 재생성에 실패했습니다.");
    }
  };

  const copyToClipboard = async (text: string, type: "key" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "key") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
      toast.success("클립보드에 복사되었습니다!");
    } catch (err) {
      toast.error("복사에 실패했습니다.");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      CREATED: { text: "생성됨", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
      LIVE: { text: "라이브", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      ENDED: { text: "종료됨", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
      ERROR: { text: "오류", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CREATED;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="로딩 중..." />
      </div>
    );
  }

  // If no stream exists yet, show creation UI
  if (isError && error && "status" in error && error.status === 404) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md p-8 border border-neutral-200 dark:border-neutral-700">
          <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
            스트리밍 방 만들기
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            아직 스트림이 생성되지 않았습니다. 스트림 키를 생성하여 라이브
            스트리밍을 시작하세요.
          </p>
          <button
            onClick={handleCreateStream}
            disabled={isCreating}
            className="bg-brand text-white px-6 py-3 rounded-md text-base font-medium hover:bg-brand/90 disabled:opacity-50"
          >
            {isCreating ? "생성 중..." : "스트림 키 생성"}
          </button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ErrorMessage message="스트림 정보를 불러오는 중 오류가 발생했습니다." />
      </div>
    );
  }

  if (!streamInfo) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            스트리밍 관리
          </h1>
          {getStatusBadge(streamInfo.status)}
        </div>

        {/* Stream Info Section */}
        <div className="space-y-4 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              스트림 정보
            </h2>
            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    제목
                  </label>
                  <p className="text-neutral-900 dark:text-neutral-100 text-lg">
                    {streamInfo.title}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    설명
                  </label>
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {streamInfo.description || "설명이 없습니다."}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      해상도
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {streamInfo.resolution}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      비트레이트
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {streamInfo.bitrate} kbps
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      시청자 수
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {streamInfo.viewersCount}명
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand/90"
                >
                  정보 수정
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    설명
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      해상도
                    </label>
                    <select
                      value={editForm.resolution}
                      onChange={(e) =>
                        setEditForm({ ...editForm, resolution: e.target.value })
                      }
                      className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      비트레이트 (kbps)
                    </label>
                    <input
                      type="number"
                      value={editForm.bitrate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          bitrate: parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      min={500}
                      max={10000}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
                  >
                    {isUpdating ? "저장 중..." : "저장"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RTMP Settings Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            스트리밍 설정
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                RTMP URL (OBS Server 필드에 입력)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={streamInfo.rtmpUrl}
                  readOnly
                  className="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(streamInfo.rtmpUrl, "url")}
                  className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                >
                  {copiedUrl ? (
                    <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                스트림 키 (OBS Stream Key 필드에 입력)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={streamInfo.streamKey}
                  readOnly
                  className="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-sm"
                />
                <button
                  onClick={() =>
                    copyToClipboard(streamInfo.streamKey, "key")
                  }
                  className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                >
                  {copiedKey ? (
                    <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                ⚠️ 스트림 키는 절대 공개하지 마세요!
              </p>
            </div>
            <button
              onClick={handleRefreshKey}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
            >
              <ArrowPathIcon className="h-5 w-5" />
              {isRefreshing ? "재생성 중..." : "스트림 키 재생성"}
            </button>
          </div>
        </div>

        {/* Stream URL Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            시청 URL
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              시청자들은 이 URL을 통해 스트림을 시청할 수 있습니다:
            </p>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md border border-neutral-300 dark:border-neutral-600">
              <code className="text-sm text-neutral-900 dark:text-neutral-100 break-all">
                {window.location.origin}/streams/{streamInfo.publicId}
              </code>
            </div>
          </div>
        </div>

        {/* OBS Setup Guide */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            OBS 설정 가이드
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-neutral-700 dark:text-neutral-300 text-sm">
            <li>OBS Studio를 실행합니다.</li>
            <li>설정 → 방송 메뉴로 이동합니다.</li>
            <li>서비스를 "사용자 지정"으로 선택합니다.</li>
            <li><strong>서버(Server)</strong> 필드에 위의 <strong>RTMP URL</strong>을 입력합니다.</li>
            <li><strong>스트림 키(Stream Key)</strong> 필드에 위의 <strong>스트림 키</strong>를 입력합니다.</li>
            <li>"방송 시작" 버튼을 클릭하여 라이브를 시작합니다.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StreamManagementPage;
