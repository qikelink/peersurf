import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  fetchOrchestrators,
  fetchOrchestratorDetails,
  Orchestrator,
} from "../lib/orchestrators";

interface OrchestratorsContextType {
  orchestrators: Orchestrator[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
  getOrchestratorByAddress: (address: string) => Orchestrator | undefined;
  fetchOrchestratorDetails: (address: string) => Promise<Orchestrator | null>;
}

const OrchestratorsContext = createContext<
  OrchestratorsContextType | undefined
>(undefined);

export const OrchestratorsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orchestrators, setOrchestrators] = useState<Orchestrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchOrchestrators(15);
      setOrchestrators(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to fetch orchestrators");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []); // Remove fetchData dependency

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []); // Remove fetchData dependency

  const getOrchestratorByAddress = useCallback(
    (address: string) => {
      return orchestrators.find(
        (orch) => orch.address.toLowerCase() === address.toLowerCase()
      );
    },
    [orchestrators]
  );

  const fetchOrchestratorDetailsByAddress = useCallback(
    async (address: string) => {
      return await fetchOrchestratorDetails(address);
    },
    []
  );

  return (
    <OrchestratorsContext.Provider
      value={{
        orchestrators,
        loading,
        error,
        lastUpdated,
        refetch: fetchData,
        getOrchestratorByAddress,
        fetchOrchestratorDetails: fetchOrchestratorDetailsByAddress,
      }}
    >
      {children}
    </OrchestratorsContext.Provider>
  );
};

export const useOrchestratorsContext = () => {
  const ctx = useContext(OrchestratorsContext);
  if (!ctx)
    throw new Error(
      "useOrchestratorsContext must be used within an OrchestratorsProvider"
    );
  return ctx;
};
