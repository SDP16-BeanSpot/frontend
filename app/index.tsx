import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, Href } from 'expo-router';

import { getAccessToken, isAutoLoginEnabled } from '../features/shared/apiClient';

export default function Index() {
  const [target, setTarget] = useState<Href | null>(null);

  useEffect(() => {
    (async () => {
      const [token, autoLogin] = await Promise.all([getAccessToken(), isAutoLoginEnabled()]);
      setTarget(token && autoLogin ? '/home' : '/onBoarding');
    })();
  }, []);

  if (!target) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00D664" />
      </View>
    );
  }

  return <Redirect href={target} />;
}
