import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import { apiClient } from '../../lib/api';
import { DashboardData } from '../../types';
import Card from '../../components/common/Card';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.getDashboardData() as { data: DashboardData };
        setDashboardData(response.data);
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <LoadingContainer>
          <LoadingText>로딩 중...</LoadingText>
        </LoadingContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardContainer>
        <DashboardHeader>
          <DashboardTitle>대시보드</DashboardTitle>
          {isAuthenticated && user ? (
            <UserGreeting>
              안녕하세요, {user.name}님!
            </UserGreeting>
          ) : (
            <GuestMessage>
              게스트로 접속 중입니다
            </GuestMessage>
          )}
        </DashboardHeader>

        {isAuthenticated && dashboardData ? (
          <>
            <StatsGrid>
              <StatCard title="총 사용자 수">
                <StatNumber color="#2563eb">
                  {dashboardData.totalUsers.toLocaleString()}
                </StatNumber>
                <StatLabel>전체 등록된 사용자</StatLabel>
              </StatCard>

              <StatCard title="활성 사용자">
                <StatNumber color="#059669">
                  {dashboardData.activeUsers.toLocaleString()}
                </StatNumber>
                <StatLabel>현재 활성 사용자</StatLabel>
              </StatCard>

              <StatCard title="활성률">
                <StatNumber color="#7c3aed">
                  {dashboardData.totalUsers > 0 
                    ? Math.round((dashboardData.activeUsers / dashboardData.totalUsers) * 100)
                    : 0}%
                </StatNumber>
                <StatLabel>활성 사용자 비율</StatLabel>
              </StatCard>
            </StatsGrid>

            <Card title="최근 활동">
              {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                <ActivityList>
                  {dashboardData.recentActivity.map((activity) => (
                    <ActivityItem key={activity.id}>
                      <ActivityContent>
                        <ActivityDescription>{activity.description}</ActivityDescription>
                        <ActivityType>{activity.type}</ActivityType>
                      </ActivityContent>
                      <ActivityDate>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </ActivityDate>
                    </ActivityItem>
                  ))}
                </ActivityList>
              ) : (
                <EmptyState>
                  최근 활동이 없습니다.
                </EmptyState>
              )}
            </Card>
          </>
        ) : (
          <GuestWelcomeCard title="환영합니다">
            <WelcomeTitle>LoopIn에 오신 것을 환영합니다!</WelcomeTitle>
            <WelcomeDescription>
              로그인하시면 더 많은 기능을 이용하실 수 있습니다.
            </WelcomeDescription>
            <FeatureList>
              <FeatureItem>📊 상세한 대시보드 통계</FeatureItem>
              <FeatureItem>📈 실시간 데이터 분석</FeatureItem>
              <FeatureItem>🔔 개인화된 알림</FeatureItem>
              <FeatureItem>⚙️ 고급 설정 옵션</FeatureItem>
            </FeatureList>
          </GuestWelcomeCard>
        )}
      </DashboardContainer>
    </Layout>
  );
};

export default DashboardPage;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DashboardTitle = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: #111827;
`;

const UserGreeting = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const GuestMessage = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatNumber = styled.div<{ color: string }>`
  font-size: 30px;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 8px;
`;

const StatLabel = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const ActivityContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActivityDescription = styled.p`
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const ActivityType = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const ActivityDate = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: #6b7280;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 256px;
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: #6b7280;
`;

const GuestWelcomeCard = styled(Card)`
  text-align: center;
  padding: 48px 24px;
`;

const WelcomeTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const WelcomeDescription = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
`;

const FeatureItem = styled.div`
  font-size: 14px;
  color: #374151;
  text-align: left;
`; 