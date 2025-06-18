import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import Button from '../common/Button';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogin = () => {
    // OAuth2 로그인 페이지로 리다이렉트
    // 실제 OAuth2 서비스 URL로 변경 필요
    window.location.href = '/auth';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">LoopIn</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-700">
                  안녕하세요, {user.name}님
                </span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="small"
                onClick={handleLogin}
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 