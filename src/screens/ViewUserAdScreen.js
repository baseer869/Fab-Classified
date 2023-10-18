import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { THEME, fontFamily } from '../theme/appTheme';
import { SignUp, fetchUserAds } from '../services';

const styles = StyleSheet.create({
 container :{
    flex:1,
    backgroundColor: THEME.white,
 },
 profileContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: THEME.white,
    marginTop: 6
  },
  usernameContainer: {
    height: 60,
    width: 60,
    backgroundColor: '#004D40',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  username: {
    fontSize: 18,
    fontFamily: fontFamily.poppins_600,
    lineHeight: 22,
    color: THEME.white,
    textAlign: 'center'
  },
  flexDirection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  phone: {
    fontSize: 15,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 22,
    color: THEME.lightGray,
  },
});

const ViewUserAdScreen = ({route}) => {

    let {user_id} = route?.params;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserAds(`api/adds?uid=${user_id}`)
          .then(async (resopnse) => {
            let userInfo = await resopnse.json();
            if (userInfo) {
              setProfile(userInfo);
            } else {
              console.log('User Information not found.');
            }
          });
      }, []);

console.log('profile==>///', profile[0]?.addPersonalInfo[0]?.userPhoto);

  return (
    <SafeAreaView style={styles.container}>
        {/* Profile View */}
      <View style={styles.profileContainer}>
            <View style={styles.flexDirection}>
              <TouchableOpacity activeOpacity={0.8} style={styles.usernameContainer}>
                {profile ? <Image source={{ uri: profile[0]?.addPersonalInfo[0]?.userPhoto }} style={{ width:60, height:60, borderRadius:100}} /> :
                  <Text style={styles.username}>{profile[0]?.addPersonalInfo[0]?.user_name?.charAt(0)}</Text>}
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 8, paddingTop:10, }}>
                <Text style={[styles.username, { color: THEME.black, fontFamily: fontFamily.poppins_500 }]}>{`Welcome ${profile[0]?.addPersonalInfo[0]?.user_name }`}</Text>
                {profile[0]?.addPersonalInfo[0]?.user_mob  !== null && <Text style={styles.phone}>{`+${profile[0]?.addPersonalInfo[0]?.user_mob}`}</Text>
                }
              </View>
            </View>
          </View> 
    </SafeAreaView>
  )
}

export default ViewUserAdScreen
