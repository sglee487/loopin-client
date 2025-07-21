import React, { useState, useEffect } from "react";
import { useCreatePlaylistFromYoutubeMutation } from "@/features/playlists/api/playlistsApi";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { toast } from "react-toastify";

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [resourceId, setResourceId] = useState<string | null>(null);

  const [createPlaylist, { isLoading, isError, data: created, reset }] =
    useCreatePlaylistFromYoutubeMutation();

  // parse input whenever it changes
  useEffect(() => {
    if (!inputValue) {
      setResourceId(null);
      return;
    }
    // Try to parse as URL first
    try {
      const url = new URL(inputValue);
      const listParam = url.searchParams.get("list");
      if (listParam) {
        setResourceId(listParam);
        return;
      }
    } catch (e) {
      // Not a valid URL, fallthrough
    }
    setResourceId(inputValue.trim());
  }, [inputValue]);

  // Navigate to playlist detail once created
  useEffect(() => {
    if (created?.id) {
      navigate(`/playlists/${created.id}`);
      onClose();

      // Reset mutation state so that future navigations
      // do not keep redirecting back to this playlist page
      reset();
    }
    // We intentionally omit `reset` from dependencies to avoid
    // re-creating the effect when it changes between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [created, navigate, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceId) return;

    try {
      await createPlaylist({ type: "youtube", resourceId }).unwrap();
    } catch (err: any) {
      if (err && typeof err === "object" && "status" in err) {
        const status = (err as { status?: number }).status;
        if (status === 409) {
          toast.info("이미 등록된 플레이리스트입니다.");
        } else {
          toast.error("플레이리스트를 추가하는 중 오류가 발생했습니다.");
        }
      } else {
        toast.error("플레이리스트를 추가하는 중 오류가 발생했습니다.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Stop click propagation inside modal content */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-brand">플레이리스트 추가</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="YouTube 플레이리스트 URL 또는 ID 입력"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            required
          />
          {isError && (
            <ErrorMessage
              message="플레이리스트를 추가하는 중 오류가 발생했습니다."
              className="text-sm"
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!resourceId || isLoading}
              className="bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
            >
              {isLoading ? "추가 중…" : "추가"}
            </button>
          </div>
        </form>
        {isLoading && (
          <LoadingSpinner
            message="플레이리스트를 불러오는 중…"
            className="h-auto mt-4"
          />
        )}
      </div>
    </div>
  );
};

export default AddPlaylistModal;
