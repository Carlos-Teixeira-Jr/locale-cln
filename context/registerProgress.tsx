import React, { createContext, ReactNode, useContext, useState } from 'react';

type RegisterProgress = {
  progress: number;
  updateProgress: (newProgress: number) => void;
};

const ProgressContext = createContext<RegisterProgress | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<number>(1);

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  const value = { progress, updateProgress };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = (): RegisterProgress => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
