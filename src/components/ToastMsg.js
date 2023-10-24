// App.jsx
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import {View, Text, StyleSheet} from 'react-native';
import { THEME, fontFamily } from '../theme/appTheme';
/*
  1. Create the config
*/
export  const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ msg, props }) => (
    <View style={{  paddingVertical:2, justifyContent:'center', height: 40, width: '60%', backgroundColor: props.color }}>
      {/* <Text>{msg}</Text> */}
      <Text style={styles.msg} >{props.msg}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  msg :{
    fontSize:11,
    color: THEME.white,
    fontFamily: fontFamily.poppins_500,
    textAlign:'center'
  }
})