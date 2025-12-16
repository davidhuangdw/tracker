import { useContext } from 'react';
import ToastContext from "@/lib/contexts/ToastContext.tsx";

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export const useQuickToast = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo
  };
};