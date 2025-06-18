import React from 'react';
import styled from 'styled-components';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px;

  @media (min-width: 640px) {
    padding: 32px 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`; 