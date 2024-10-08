import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Payment {
  type: string;
  cbu: string;
  alias: string;
  full_name: string;
  entity: string;
}
interface MarketContextType {
  logged: boolean;
  orderId: any;
  hideTab: boolean;
  payments: Payment[];
  username: string;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderId: React.Dispatch<React.SetStateAction<any>>;
  setHideTab: React.Dispatch<React.SetStateAction<boolean>>;
  addPayment: (payment: Payment) => void;
  removePayment: (cbu: string) => void;
  setUsername: (name: string) => void;
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
    const [orderId, setOrderId] = useState<any>(null);
    const [hideTab, setHideTab] = useState<boolean>(false)
    const [payments, setPayments] = useState<Payment[]>([]);
    const [username, setUsername] = useState<string>('');
    const addPayment = (payment: Payment) => {
      setPayments((prevPayments) => [...prevPayments, payment]);
    };
    const removePayment = (alias: string) => {
      setPayments((prevPayments) => prevPayments.filter(payment => payment.alias !== alias));
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
      <MarketContext.Provider value={{ logged, setLogged, hideTab, setHideTab, payments, addPayment, removePayment, orderId, setOrderId, username,setUsername }}>
        {children}
      </MarketContext.Provider>
    );
  };
  
  export default MarketProvider;