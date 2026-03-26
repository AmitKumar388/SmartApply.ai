import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/lib/api';

interface DashboardStats {
  applicationsTracked: number;
  interviewsPracticed: number;
  resumesOptimized: number;
  averageMatchScore: number;
  loading: boolean;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    applicationsTracked: 0,
    interviewsPracticed: 0,
    resumesOptimized: 0,
    averageMatchScore: 0,
    loading: true
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats({
          applicationsTracked: data.applicationsTracked || 0,
          interviewsPracticed: data.interviewsPracticed || 0,
          resumesOptimized: data.resumesOptimized || 0,
          averageMatchScore: data.averageMatchScore || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    // Poll every 30 seconds instead of realtime subscriptions
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return stats;
};
