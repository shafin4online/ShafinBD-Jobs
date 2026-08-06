import { Job } from '../types';

// Helper function for automated job lifecycle management
export const processJobLifecycle = (jobList: Job[]): Job[] => {
  if (!Array.isArray(jobList)) return [];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; // e.g. '2026-08-05'
  const threeYearsAgoMs = now.getTime() - 3 * 365.25 * 24 * 60 * 60 * 1000;

  return jobList
    .filter((job) => {
      if (!job) return false;
      // 3-Year Retention Rule: Delete jobs whose deadline/createdAt is older than 3 years (1095 days)
      const deadlineDate = job.deadline ? new Date(job.deadline) : null;
      const createdDate = job.createdAt ? new Date(job.createdAt) : null;
      const refTime =
        deadlineDate && !isNaN(deadlineDate.getTime())
          ? deadlineDate.getTime()
          : createdDate && !isNaN(createdDate.getTime())
          ? createdDate.getTime()
          : null;

      if (refTime && refTime < threeYearsAgoMs) {
        // Automatically deleted after 3 years
        return false;
      }
      return true;
    })
    .map((job) => {
      // Deadline Expiration Rule: Automatically mark as closed/inactive if past deadline
      if (job.deadline && job.status === 'active') {
        if (todayStr > job.deadline) {
          return { ...job, status: 'closed' as const };
        }
      }
      return job;
    });
};
