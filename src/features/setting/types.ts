import { ReactNode } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export interface SettingItemProps {
  title?: string;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
}

export interface HeaderItem {
  leftComponent?: ReactNode;
}

export enum SETTING_EVENT_TYPE {
  MANAGE_ACCOUNT = 'manage_account',
  LOG_OUT = 'log_out',
  DELETE_ACCOUNT = 'delete_account',
  SEND_FEEDBACK = 'send_feedback',
}

export const TEXTS = {
  pageTitle: '설정',
  guestTitle: '게스트',
  guestLabel: '기록한 내용을 저장하려면 로그인이 필요해요.',
  loginButton: '로그인 하기',
  accountManagement: '계정 관리',
  notificationSettings: '알림 설정',
  feedback: '의견 보내기',
  appVersionPrefix: '앱 버전 : ',
};
