import React from 'react';
import {
  View
} from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...', 'Error: ...']);

function App(): JSX.Element {
  
  return (
    <View  style={{ flex: 1}}>
       <AppNavigation />
    </View>
  );
}

export default App;