import { ReactNode, createContext, useContext, useState } from 'react';

type RegisterProgress = {
  progress: number
  updateProgress: (newProgress: number) => void
}

const ProgressContext = createContext({} as RegisterProgress);

export const ProgressProvider = ({ children }: any) => {
  const [progress, setProgress] = useState(1);

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  return useContext(ProgressContext);
};
