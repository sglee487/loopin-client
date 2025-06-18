// 공통 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userId: string;
}

// 컴포넌트 Props 타입
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
} 