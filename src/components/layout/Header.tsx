import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
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
    <StyledHeader>
      <HeaderContainer>
        <HeaderContent>
          <Logo>
            <LogoText>LoopIn</LogoText>
          </Logo>
          
          <UserSection>
            {isAuthenticated && user ? (
              <>
                <UserGreeting>
                  안녕하세요, {user.name}님
                </UserGreeting>
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
          </UserSection>
        </HeaderContent>
      </HeaderContainer>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.header`
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 640px) {
    padding: 0 24px;
  }

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserGreeting = styled.span`
  font-size: 14px;
  color: #374151;
`; 