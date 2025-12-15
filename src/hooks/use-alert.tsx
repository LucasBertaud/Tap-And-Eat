import { AlertButton, CustomAlert } from '@/src/components/ui/CustomAlert';
import { useState } from 'react';

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const useAlert = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    title: '',
    message: '',
    buttons: [],
    type: 'info',
  });

  const showAlert = (alertConfig: AlertConfig) => {
    setConfig(alertConfig);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  const AlertComponent = () => (
    <CustomAlert
      visible={visible}
      title={config.title}
      message={config.message}
      buttons={config.buttons}
      type={config.type}
      onDismiss={hideAlert}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};
