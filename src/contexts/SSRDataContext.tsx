import { createContext, useContext, ReactNode } from 'react';
import { TideData, MonthKey } from '../types/tide';

interface SSRDataContextType {
  initialData: Map<MonthKey, TideData>;
}

const SSRDataContext = createContext<SSRDataContextType>({
  initialData: new Map(),
});

interface SSRDataProviderProps {
  children: ReactNode;
  initialData?: Map<MonthKey, TideData>;
}

export function SSRDataProvider({ children, initialData = new Map() }: SSRDataProviderProps) {
  return (
    <SSRDataContext.Provider value={{ initialData }}>
      {children}
    </SSRDataContext.Provider>
  );
}

export function useSSRData() {
  return useContext(SSRDataContext);
}
