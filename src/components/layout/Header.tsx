import React from "react";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/api/authApi";
import { Bars3Icon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import AddPlaylistModal from "@/components/AddPlaylistModal";

const GATEWAY_URL = "http://localhost:59000";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { data: user } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();

  // modal state
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const handleLogin = () => {
    // 게이트웨이에서 OIDC 로그인 플로우를 시작합니다.
    window.location.href = `${GATEWAY_URL}/oauth2/authorization/keycloak`;
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      window.location.reload();
    }
  };

  const openAddModal = useCallback(() => setAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setAddModalOpen(false), []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 w-full">
        <div className="flex items-center gap-2">
          {/* Drawer toggle button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Banner / Logo that routes to home */}
          <Link to="/" className="flex items-center px-2">
            <img
              src="/logo_light.svg"
              alt="LoopIn logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* 우측 영역 – 로그인 / 로그아웃 및 플레이리스트 추가 버튼 */}
        <div className="flex items-center gap-4">
          {/* Add Playlist button with tooltip when disabled */}
          <div className="relative group">
            <button
              onClick={user ? openAddModal : undefined}
              disabled={!user}
              className={[
                "text-gray-700 px-2 py-2 rounded-md text-sm font-medium border flex items-center gap-1",
                user
                  ? "hover:text-gray-900 border-gray-300 hover:border-gray-400 cursor-pointer"
                  : "border-gray-200 opacity-50 cursor-not-allowed",
              ].join(" ")}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">플레이리스트 추가</span>
            </button>

            {/* Tooltip visible on hover when disabled */}
            {!user && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                로그인 후 이용 가능합니다
              </div>
            )}
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-gray-400"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand/90"
            >
              로그인
            </button>
          )}
        </div>
      </div>

      {/* Add Playlist Modal */}
      <AddPlaylistModal isOpen={isAddModalOpen} onClose={closeAddModal} />
    </header>
  );
};

export default Header;
