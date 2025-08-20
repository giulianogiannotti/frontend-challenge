// src/context/ToastContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import "./ToastContext.css";

type Toast = {
  message: string;
  type?: "success" | "error" | "info";
};

type ToastContextType = {
  addToast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000); // desaparece después de 3s
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast, i) => (
          <div key={i} className={`toast ${toast.type || "info"}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
