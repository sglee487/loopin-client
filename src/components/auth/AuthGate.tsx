import React from "react";
import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface AuthGateProps {
  children: React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { data: user, isLoading, isError } = useGetCurrentUserQuery();

  if (isLoading) {
    return <LoadingSpinner message="로그인 상태 확인 중…" />;
  }

  // 로그인하지 않은 경우에도 앱은 접근 가능해야 하므로,
  // 로딩이 끝났다면 에러 유무와 관계없이 자식 컴포넌트를 렌더링합니다.
  return <>{children}</>;
};

export default AuthGate;
