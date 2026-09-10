import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchMyApplications } from '../services';
import { useAppSelector } from './useStore';

interface MyApplicationsContextValue {
  jobIds: string[];
  internshipIds: string[];
  loading: boolean;
  hasAppliedJob: (id: string) => boolean;
  hasAppliedInternship: (id: string) => boolean;
  markJobApplied: (id: string) => void;
  markInternshipApplied: (id: string) => void;
  refresh: () => Promise<void>;
}

const MyApplicationsContext = createContext<MyApplicationsContextValue | null>(
  null,
);

export function MyApplicationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [jobIds, setJobIds] = useState<string[]>([]);
  const [internshipIds, setInternshipIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setJobIds([]);
      setInternshipIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchMyApplications();
      setJobIds(data.jobIds ?? []);
      setInternshipIds(data.internshipIds ?? []);
    } catch {
      // Keep any optimistic marks from this session if the refresh fails.
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh, user?.id]);

  const hasAppliedJob = useCallback(
    (id: string) => Boolean(id) && jobIds.includes(id),
    [jobIds],
  );

  const hasAppliedInternship = useCallback(
    (id: string) => Boolean(id) && internshipIds.includes(id),
    [internshipIds],
  );

  const markJobApplied = useCallback((id: string) => {
    if (!id) return;
    setJobIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markInternshipApplied = useCallback((id: string) => {
    if (!id) return;
    setInternshipIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const value = useMemo(
    () => ({
      jobIds,
      internshipIds,
      loading,
      hasAppliedJob,
      hasAppliedInternship,
      markJobApplied,
      markInternshipApplied,
      refresh,
    }),
    [
      jobIds,
      internshipIds,
      loading,
      hasAppliedJob,
      hasAppliedInternship,
      markJobApplied,
      markInternshipApplied,
      refresh,
    ],
  );

  return (
    <MyApplicationsContext.Provider value={value}>
      {children}
    </MyApplicationsContext.Provider>
  );
}

export function useMyApplications(): MyApplicationsContextValue {
  const context = useContext(MyApplicationsContext);
  if (!context) {
    throw new Error('useMyApplications must be used within MyApplicationsProvider');
  }
  return context;
}
