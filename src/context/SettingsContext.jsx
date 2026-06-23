import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingApi } from '@/api/settingApi';

const SettingsContext = createContext({
  appName: 'Di Sản Việt',
  appLogo: null,
  isLoading: true,
});

export const SettingsProvider = ({ children }) => {
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['appSettings'],
    queryFn: settingApi.getAllSettings,
    staleTime: 5 * 60 * 1000, // Cache trong 5 phút
    retry: 1,
  });

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
