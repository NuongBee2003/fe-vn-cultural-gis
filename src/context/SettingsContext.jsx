import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingApi } from '@/api/settingApi';

const SettingsContext = createContext({
  appName: 'Di Sản Việt',
  appLogo: null,
  isLoading: true,
});

export const SettingsProvider = ({ children }) => {
  const [settingsData, setSettingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const result = await settingApi.getAllSettings();
        if (!active) return;
        setSettingsData(Array.isArray(result) ? result : (result.data || []));
      } catch (error) {
        console.error('Lỗi khi lấy cấu hình hệ thống:', error);
        if (!active) return;
        setSettingsData([]);
      } finally {
        if (!active) return;
        setIsLoading(false);
      }
    };

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  let appName = 'Di Sản Việt';
  let appLogo = null;

  if (settingsData && Array.isArray(settingsData)) {
    const nameSetting = settingsData.find(s => s.setting_key === 'APP_NAME');
    const logoSetting = settingsData.find(s => s.setting_key === 'LOGO');

    if (nameSetting && nameSetting.setting_value) {
      appName = nameSetting.setting_value;
    }
    if (logoSetting && logoSetting.setting_value) {
      appLogo = logoSetting.setting_value;
    }
  }

  return (
    <SettingsContext.Provider value={{ appName, appLogo, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
