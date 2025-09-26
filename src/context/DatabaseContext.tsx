import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { startOrbitDB } from '../db-services';
import { startPinService, setPinWorkerOrbitDB } from '../background/pinWorker';
import BackgroundService from 'react-native-background-actions';

interface DatabaseContextType {
  orbitdb: any;
  isOnline: boolean;
  connectedPeers: number;
  discoveredPeers: number;
  storageUsedBytes: number;
  pinServiceRunning: boolean;
  loading: boolean;
  error: string | null;
  databases: any[];
  refreshDatabases: () => Promise<void>;
  createDatabase: (name: string, type: string) => Promise<any>;
  openDatabase: (address: string) => Promise<any>;
  refreshStorageUsage: () => Promise<void>;
  ensurePinService: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [orbitdb, setOrbitDB] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [connectedPeers, setConnectedPeers] = useState(0);
  const [discoveredPeers, setDiscoveredPeers] = useState(0);
  const discoveredSetRef = useRef<Set<string>>(new Set());
  const [storageUsedBytes, setStorageUsedBytes] = useState(0);
  const [pinServiceRunning, setPinServiceRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [databases, setDatabases] = useState<any[]>([]);

  useEffect(() => {
    initializeOrbitDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updatePinServiceStatus = useCallback(() => {
    try {
      const running = BackgroundService.isRunning();
      setPinServiceRunning(running);
    } catch (err) {
      console.warn('Failed to read pin service status:', err);
      setPinServiceRunning(false);
    }
  }, []);

  const ensurePinService = useCallback(async () => {
    if (!orbitdb) {
      return;
    }

    try {
      setPinWorkerOrbitDB(orbitdb);
      if (!BackgroundService.isRunning()) {
        await startPinService();
      }
    } catch (err) {
      console.warn('Failed to start pin service:', err);
    } finally {
      updatePinServiceStatus();
    }
  }, [orbitdb, updatePinServiceStatus]);

  const initializeOrbitDB = async () => {
    try {
      setLoading(true);
      const ob = await startOrbitDB();

      if (ob) {
        setOrbitDB(ob);
        setIsOnline(true);

        // Setup peer connection listeners
        try {
          ob.ipfs.libp2p.addEventListener('peer:connect', () =>
            setConnectedPeers((c: number) => c + 1)
          );
          ob.ipfs.libp2p.addEventListener('peer:disconnect', () =>
            setConnectedPeers((c: number) => Math.max(0, c - 1))
          );

          // Track discovered peers (unique by peer id)
          ob.ipfs.libp2p.addEventListener('peer:discovery', (evt: any) => {
            try {
              const id = evt?.detail?.id?.toString?.();
              if (id && !discoveredSetRef.current.has(id)) {
                discoveredSetRef.current.add(id);
                setDiscoveredPeers(discoveredSetRef.current.size);
              }
            } catch {}
          });
        } catch (err) {
          console.warn('Failed to setup peer listeners:', err);
        }

        // Setup background pinning service
        try {
          setPinWorkerOrbitDB(ob);
          if (!BackgroundService.isRunning()) {
            await startPinService();
          }
        } catch (err) {
          console.warn('Failed to start pin service:', err);
        }
        updatePinServiceStatus();

        // Refresh databases list and storage usage
        await refreshDatabases();
        await refreshStorageUsage();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize OrbitDB');
      console.error('OrbitDB initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDatabases = async () => {
    if (!orbitdb) {
      return;
    }

    try {
      // Get list of databases (this might need adjustment based on OrbitDB version)
      const dbList = await orbitdb.databases?.() || [];
      setDatabases(dbList);
    } catch (err) {
      console.warn('Failed to refresh databases:', err);
      setDatabases([]);
    }
  };

  const createDatabase = async (name: string, type: string = 'documents') => {
    if (!orbitdb) {
      throw new Error('OrbitDB not initialized');
    }

    try {
      let db;
      switch (type) {
        case 'documents':
          db = await orbitdb.open(name, { type: 'documents' });
          break;
        case 'keyvalue':
          db = await orbitdb.open(name, { type: 'keyvalue' });
          break;
        case 'events':
          db = await orbitdb.open(name, { type: 'events' });
          break;
        default:
          throw new Error(`Unsupported database type: ${type}`);
      }

      await refreshDatabases();
      return db;
    } catch (err) {
      throw new Error(`Failed to create database: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const openDatabase = async (address: string) => {
    if (!orbitdb) {
      throw new Error('OrbitDB not initialized');
    }

    try {
      const db = await orbitdb.open(address);
      await refreshDatabases();
      return db;
    } catch (err) {
      throw new Error(`Failed to open database: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const refreshStorageUsage = async () => {
    try {
      const bs = orbitdb?.ipfs?.blockstore;
      if (!bs || typeof bs.getAll !== 'function') {
        setStorageUsedBytes(0);
        return;
      }
      let total = 0;
      for await (const { block } of bs.getAll()) {
        if (block) {
          total += (block as Uint8Array).byteLength ?? (block as Uint8Array).length ?? 0;
        }
      }
      setStorageUsedBytes(total);
    } catch (err) {
      console.warn('Failed to compute storage usage:', err);
    }
  };

  useEffect(() => {
    if (orbitdb) {
      ensurePinService().catch(() => {});
    } else {
      updatePinServiceStatus();
    }
  }, [orbitdb, ensurePinService, updatePinServiceStatus]);

  const contextValue: DatabaseContextType = {
    orbitdb,
    isOnline,
    connectedPeers,
    discoveredPeers,
    storageUsedBytes,
    pinServiceRunning,
    loading,
    error,
    databases,
    refreshDatabases,
    createDatabase,
    openDatabase,
    refreshStorageUsage,
    ensurePinService,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
