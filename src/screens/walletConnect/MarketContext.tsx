import React, { createContext, useContext, useState } from 'react';

interface MarketContextType {
  logged: boolean;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) {
      throw new Error('useMarket must be used within an MarketProvider');
    }
    return context;
  };

  export const MarketProvider: React.FC = ({ children }) => {
    const [logged, setLogged] = useState<boolean>(false);
  
    return (
      <MarketContext.Provider value={{ logged, setLogged }}>
        {children}
      </MarketContext.Provider>
    );
  };
  
  export default MarketProvider;