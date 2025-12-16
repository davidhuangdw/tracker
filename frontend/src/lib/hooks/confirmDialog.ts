import {useContext} from "react";
import ConfirmDialogContext from "@/lib/contexts/ConfirmDialogContext.tsx";

export const useConfirm = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }
  return context;
};

export default useConfirm;
