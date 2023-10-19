import React from 'react';
import {
  View
} from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...', 'Error: ...']);
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/ToastMsg';

function App(): JSX.Element {
  
  return (
    <View  style={{ flex: 1}}>
       <AppNavigation />
       <Toast config={toastConfig} />
    </View>
  );
}

export default App;