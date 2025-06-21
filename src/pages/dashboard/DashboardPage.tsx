import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { apiClient } from '../../lib/api';
import { DashboardData } from '../../types/media';
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
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          {isAuthenticated && user ? (
            <div className="text-sm text-gray-600">
              안녕하세요, {user.name}님!
            </div>
          ) : (
            <div className="text-sm text-gray-600 italic">
              게스트로 접속 중입니다
            </div>
          )}
        </div>

        {isAuthenticated && dashboardData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="총 사용자 수" className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {dashboardData.totalUsers.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 m-0">전체 등록된 사용자</p>
              </Card>

              <Card title="활성 사용자" className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {dashboardData.activeUsers.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 m-0">현재 활성 사용자</p>
              </Card>

              <Card title="활성률" className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {dashboardData.totalUsers > 0 
                    ? Math.round((dashboardData.activeUsers / dashboardData.totalUsers) * 100)
                    : 0}%
                </div>
                <p className="text-sm text-gray-600 m-0">활성 사용자 비율</p>
              </Card>
            </div>

            <Card title="최근 활동">
              {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 m-0">{activity.description}</p>
                        <p className="text-sm text-gray-600 m-0">{activity.type}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  최근 활동이 없습니다.
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card title="환영합니다" className="text-center py-12 px-6 text-red-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">LoopIn에 오신 것을 환영합니다!</h2>
            <p className="text-base text-gray-600 mb-8">
              로그인하시면 더 많은 기능을 이용하실 수 있습니다.
            </p>
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <div className="text-sm text-gray-700 text-left">📊 상세한 대시보드 통계</div>
              <div className="text-sm text-gray-700 text-left">📈 실시간 데이터 분석</div>
              <div className="text-sm text-gray-700 text-left">🔔 개인화된 알림</div>
              <div className="text-sm text-gray-700 text-left">⚙️ 고급 설정 옵션</div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage; 