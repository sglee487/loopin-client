import React from "react";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/api/authApi";

const GATEWAY_URL = "http://localhost:59000";

const Header: React.FC = () => {
  const { data: user } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();

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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">LoopIn</h1>
          </div>

          {/* 우측 영역 – 로그인 / 로그아웃 버튼 */}
          <div>
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
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
