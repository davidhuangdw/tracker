import React, { createContext, useState, useCallback, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'info' | 'warning' | 'error';
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  open: boolean;
  onConfirm?: () => void;
}

interface ConfirmDialogContextType {
  showConfirm: (
    message: string,
    onConfirm: () => void,
    options?: Omit<ConfirmDialogOptions, 'message'>
  ) => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const ConfirmDialogProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    open: false,
    message: '',
    title: 'Confirm Action',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    severity: 'warning'
  });

  const showConfirm = useCallback((
    message: string, 
    onConfirm: () => void,
    options: Omit<ConfirmDialogOptions, 'message'> = {}
  ) => {
    setDialogState({
      open: true,
      message,
      onConfirm,
      title: options.title || 'Confirm Action',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      severity: options.severity || 'warning'
    });
  }, []);

  const handleConfirm = () => {
    dialogState?.onConfirm?.();
    setDialogState(prev => ({ ...prev, open: false }));
  };

  const handleCancel = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  const getConfirmButtonColor = () => {
    switch (dialogState.severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}
      <Dialog
        open={dialogState.open}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="confirm-dialog-title">
          {dialogState.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {dialogState.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            {dialogState.cancelText}
          </Button>
          <Button 
            onClick={handleConfirm} 
            color={getConfirmButtonColor()}
            variant="contained"
            autoFocus
          >
            {dialogState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
};

export default ConfirmDialogContext;