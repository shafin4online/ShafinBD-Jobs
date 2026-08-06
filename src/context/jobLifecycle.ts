import { Job } from '../types';

// Helper function to safely parse date string (supports YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, ISO, etc.)
export const parseToDate = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Handle YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    return new Date(y, m - 1, d, 23, 59, 59, 999);
  }

  // Handle DD/MM/YYYY or MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
    const parts = trimmed.split('/').map(Number);
    let day = parts[0];
    let month = parts[1];
    let year = parts[2];

    if (parts[1] > 12) {
      day = parts[1];
      month = parts[0];
    }
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    parsed.setHours(23, 59, 59, 999);
    return parsed;
  }

  return null;
};

// Helper function for automated job lifecycle management
export const processJobLifecycle = (jobList: Job[]): Job[] => {
  if (!Array.isArray(jobList)) return [];
  const now = new Date();
  const threeYearsAgoMs = now.getTime() - 3 * 365.25 * 24 * 60 * 60 * 1000;

  return jobList
    .filter((job) => {
      if (!job) return false;
      // 3-Year Retention Rule: Delete jobs whose deadline/createdAt is older than 3 years
      const deadlineDate = parseToDate(job.deadline);
      const createdDate = job.createdAt ? new Date(job.createdAt) : null;
      const refTime =
        deadlineDate && !isNaN(deadlineDate.getTime())
          ? deadlineDate.getTime()
          : createdDate && !isNaN(createdDate.getTime())
          ? createdDate.getTime()
          : null;

      if (refTime && refTime < threeYearsAgoMs) {
        return false;
      }
      return true;
    })
    .map((job) => {
      // Deadline Expiration Rule: Automatically mark as closed/inactive if past deadline
      if (job.deadline && job.status === 'active') {
        const deadlineDate = parseToDate(job.deadline);
        if (deadlineDate && !isNaN(deadlineDate.getTime())) {
          // Only close if deadline end-of-day is in the past compared to current time
          if (deadlineDate.getTime() < now.getTime()) {
            return { ...job, status: 'closed' as const };
          }
        }
      }
      return job;
    });
};

