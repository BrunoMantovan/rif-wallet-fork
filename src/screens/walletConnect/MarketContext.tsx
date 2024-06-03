import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Payment {
  cbu: string;
  alias: string;
  text: string;
}
interface MarketContextType {
  logged: boolean;
  hideTab: boolean;
  payments: Payment[];
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  setHideTab: React.Dispatch<React.SetStateAction<boolean>>;
  addPayment: (payment: Payment) => void;
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
    const [hideTab, setHideTab] = useState<boolean>(false)
    const [payments, setPayments] = useState<Payment[]>([]);
    const addPayment = (payment: Payment) => {
      setPayments((prevPayments) => [...prevPayments, payment]);
    };

    useEffect(() => {
      // Load payments from AsyncStorage when component mounts
      const loadPayments = async () => {
        try {
          const storedPayments = await AsyncStorage.getItem('payments');
          if (storedPayments) {
            setPayments(JSON.parse(storedPayments));
          }
        } catch (error) {
          console.error('Error loading payments from AsyncStorage:', error);
        }
      };
      loadPayments();
    }, []);
  
    useEffect(() => {
      // Save payments to AsyncStorage whenever payments state changes
      const savePayments = async () => {
        try {
          await AsyncStorage.setItem('payments', JSON.stringify(payments));
        } catch (error) {
          console.error('Error saving payments to AsyncStorage:', error);
        }
      };
      savePayments();
    }, [payments]);

    return (
      <MarketContext.Provider value={{ logged, setLogged, hideTab, setHideTab, payments, addPayment }}>
        {children}
      </MarketContext.Provider>
    );
  };
  
  export default MarketProvider;