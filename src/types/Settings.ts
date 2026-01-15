export type SettingsList = {
  value: string;
  rows: SettingsListItem[];
};

export type SettingsListItem = {
  title: string;
  iconName: string;
  navigationScreen?: string;
  color?: string;
  callback?: any;
};
