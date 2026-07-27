import { motion, AnimatePresence } from 'motion/react';
import { useState, createContext, useContext } from 'react';

type NotificationContextType = {
  notify: (message: string, type?: 'success' | 'error') => void;
};
const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<{ id: number; text: string; type: 'success' | 'error' }[]>([]);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text, type }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '8px',
        zIndex: 9999
      }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              style={{
                background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(8px)',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
