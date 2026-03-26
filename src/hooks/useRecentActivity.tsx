import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/lib/api';

interface ActivityItem {
  id: string;
  type: 'resume_optimization' | 'interview_questions' | 'job_application';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export const useRecentActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchActivity = async () => {
      try {
        const data = await dashboardApi.getActivity();
        setActivities(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        setLoading(false);
      }
    };

    fetchActivity();

    // Poll every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return { activities, loading };
};
