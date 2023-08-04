import NetInfo from '@react-native-community/netinfo';

export const isInternetConnected = async (): Promise<boolean> => {
  let networkConnection: boolean | null;
  try {
    let state = await NetInfo.fetch();
    networkConnection = state.isConnected && state.isInternetReachable;
  } catch (err: any) {
    networkConnection = false;
  }

  return !!networkConnection;
};
