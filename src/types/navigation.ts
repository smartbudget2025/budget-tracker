import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  Premium: undefined;
  Onboarding: undefined;
};

export type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budget: undefined;
  Insights: undefined;
  Profile: undefined;
  Goals: undefined;
  Bills: undefined;
  AddTransaction: undefined;
  ScanReceipt: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 