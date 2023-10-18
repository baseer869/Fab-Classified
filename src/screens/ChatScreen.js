import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { THEME, fontFamily } from '../theme/appTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AskSupport, LoadAskSupportMessages, readUserInfo } from '../services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.backgroundColor,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 5,
    padding: 14,
    marginVertical: 12,
    backgroundColor: THEME.white,
    elevation: 3,
    alignSelf: 'center',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sendButton: {
    position: 'absolute',
    right: 20,
    elevation: 3
  },
  text: {
    fontSize: 20,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 28,
    color: THEME.black,
    textAlign: 'center'
  },
  headerContainer: {
    height: 45,
    // backgroundColor: THEME.white
  },
});


const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSent, setMessageSent] = useState(false);
  const [user_id, setUser] = useState(null);
  const flatListRef = useRef();

  // Send Message
  const omSendMsg = async () => {


    let response = await AskSupport(`api/admin/send-message?uid=${5}&msg=${inputMessage}`)
    let data = await response.json();
    console.log('response support==>', data);
    if (isSent == 'sent') {
      setMessageSent(true);
    }
    if (inputMessage) {
      const newMessage = {
        sender: 'user',
        message: inputMessage,
        status: 'sent', // Assuming the message is sent
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      flatListRef.current.scrollToEnd();
    }
  };
  const fetchSupprtMessages = async (user_id) => {
    let response = await LoadAskSupportMessages(`api/admin/load-message?uid=${user_id}`)
    let data = await response?.json();
    setMessages(data);
    console.log('response of load admin msg', data);
  }

  // Load messages
  React.useEffect(() => {
    readUserInfo()
      .then((userInfo) => {
        if (userInfo) {
          console.log('User Information:', userInfo?.data?.user_id);
          if (userInfo) {
            setUser(userInfo?.data?.user_id)
            fetchSupprtMessages(userInfo?.data?.user_id);
          } 
        } else {
          console.log('User Information not found.');
        }
      });
  }, []);

  // render method
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>{'Support'}</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          ref={flatListRef}
          // inverted={true} // Reverse the order of the list
          keyExtractor={(message, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <View
                style={{
                  backgroundColor: item.sender === 'user' ? '#DCF8C6' : 'lightgray',
                  borderRadius: 5,
                  padding: 10,
                  margin: 5,
                  maxWidth: '80%',
                }}
              >
                <Text>{item.message}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={()=>{
            return (
              <View style={{ flex:1, justifyContent:'center', alignItems:'center', alignSelf:'center', top:"100%"}}>
                <Icon name={'headset-dock'} size={60} color={'green'} />
                <Text style={{
                  fontSize:18,
                  fontFamily :fontFamily.poppins_700,
                  lineHeight:22,
                  color: THEME.black,
                  textAlign:'center'
                }}>{'How can we help\nyou?'}</Text>
              </View>
            )
          }}
        />
        <View style={{ marginHorizontal: 15, marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={styles.inputContainer}
            placeholder="Type your message"
            value={inputMessage}
            onChangeText={(text) => setInputMessage(text)}
          />
          <TouchableOpacity onPress={() => omSendMsg()} activeOpacity={0.8} style={styles.sendButton} >
            <Icon name={'send'} size={25} color={THEME.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default ChatScreen;