import { createContext, ReactNode, useContext, useState } from "react";
import Snackbar from "../components/Snackbar";

export enum AlertSeverity {
	ERROR = "error",
	WARNING = "warning",
	INFO = "info",
	SUCCESS = "success",
}

export interface Alert {
  message: string;
  severity: AlertSeverity;
}

interface SnackbarContextType {
  alert: Alert;
  showMessage: (message: string, severity: AlertSeverity) => void;
  hideMessage: () => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({
  alert: { message: "", severity: AlertSeverity.INFO },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showMessage: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hideMessage: () => {},
});

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [alert, setAlert] = useState<Alert>({
    message: "",
    severity: AlertSeverity.INFO,
  });

  const showMessage = (message: string, severity: AlertSeverity) => {
    setAlert({ message, severity });
  };

  const hideMessage = () => {
    setAlert({ message: "", severity: AlertSeverity.INFO });
  };

  return (
    <SnackbarContext.Provider value={{ alert, showMessage, hideMessage }}>
      {children}
      <Snackbar alert={alert} hideMessage={hideMessage} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};