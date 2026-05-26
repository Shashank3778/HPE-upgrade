import { useState, useEffect } from 'react';
import { getCourseProgress } from 'data/services/lms/api';

interface CompletionSummary {
  complete_count: number;
  incomplete_count: number;
  locked_count: number;
}

interface CourseProgressData {
  completionSummary: CompletionSummary | null;
  percentComplete: number;
  isLoading: boolean;
  error: string | null;
}

const useCourseProgress = (courseId: string): CourseProgressData => {
  const [completionSummary, setCompletionSummary] = useState<CompletionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseProgress(courseId);
        setCompletionSummary(data.completion_summary);
      } catch (err) {
        setError('Failed to fetch progress');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  const percentComplete = completionSummary
    ? Math.round(
      (completionSummary.complete_count
        / (completionSummary.complete_count + completionSummary.incomplete_count || 1))
      * 100,
    )
    : 0;

  return {
    completionSummary,
    percentComplete,
    isLoading,
    error,
  };
};

export default useCourseProgress;