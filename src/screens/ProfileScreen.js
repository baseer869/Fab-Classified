import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { THEME, fontFamily } from '../theme/appTheme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TermsCondition from '../components/TermsCondition';
import { readUserInfo, removeUserToken } from '../services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: THEME.white,
    justifyContent: 'center'
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
    alignItems: 'center',
  },
  referText: {
    fontSize: 15,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 22,
    color: THEME.lightGray,
    textAlign: 'center'
  },
  phone: {
    fontSize: 15,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 22,
    color: THEME.lightGray,
  },
  referalContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME.white,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  referCode: {
    marginHorizontal: 8,
    fontSize: 14,
    color: THEME.lightGray,
    lineHeight: 22,
    fontStyle: 'italic'
  },
  tabsView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME.white,
    marginTop: 10,
  },
  itemMenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  menuTitle: {
    fontSize: 15,
    fontFamily: fontFamily.poppins_400,
    lineHeight: 22,
    color: THEME.black,
    marginHorizontal: 12
  },
  inappSupport: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME.white,
    marginTop: 16,
  },
  logout: {
    paddingVertical: 12,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 70,
    backgroundColor: THEME.white,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  logoutText: {
    fontSize: 13,
    color: THEME.seconday,
    lineHeight: 17,
    fontFamily: fontFamily.poppins_500,
    paddingHorizontal: 8
  },
  versionContainer: {
    bottom: 40,
    alignSelf: 'center',
  },
  appVersionTitle: {
    fontSize: 10,
    fontFamily: fontFamily.poppins_Light,
    lineHeight: 13,
    color: THEME.black,
    opacity: 0.6
  }
})

const MenuItem = ({ title, icon, onMenuPress }) => {
  return (
    <TouchableOpacity onPress={() => onMenuPress()} activeOpacity={0.8} style={styles.itemMenuContainer}>
      <View style={styles.flexDirection}>
        <Icon name={icon} size={22} color={THEME.black} />
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <Icon name={'chevron-right'} size={26} color={THEME.lightGray} />
    </TouchableOpacity>
  )
}


const ProfileScreen = ({ navigation }) => {

  const termRef = useRef();
  const [profile, setProfile] = useState(null)

  const onCloseterms = () => {
    termRef?.current.close();
  }
  //  Logout
  const logoutHandler = async () => {
    removeUserToken();
    navigation.replace('AuthStack')
  }
  useEffect(() => {
    readUserInfo()
      .then((userInfo) => {
        if (userInfo) {
          console.log('User Information:', userInfo);
          setProfile(userInfo?.data);
        } else {
          console.log('User Information not found.');
        }
      });
  }, []);
  return (
    <View style={{ flex: 1, }}>
      <StatusBar backgroundColor={THEME.white} />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.text}>{'My Account'}</Text>
        </View>
        <View style={styles.innerContainer}>
          {/* Profile View */}
          <View style={styles.profileContainer}>
            <View style={styles.flexDirection}>
              <TouchableOpacity activeOpacity={0.8} style={styles.usernameContainer}>
                {profile && profile?.userPhoto ? <Image source={{ uri: profile?.userPhoto }} style={{ width:60, height:60, borderRadius:100}} /> :
                  <Text style={styles.username}>{profile?.user_name?.charAt(0)}</Text>}
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 8 }}>
                <Text style={[styles.username, { color: THEME.black, fontFamily: fontFamily.poppins_500 }]}>{`Welcome ${profile?.user_name}`}</Text>
                {profile?.user_mob ? <Text style={styles.phone}>{`+${profile?.phonecode} ${profile?.user_mob}`}</Text>
                  :
                  <Text style={styles.phone}>{`${profile?.email}`}</Text>
                }
              </View>
            </View>
          </View>
          <View style={styles.referalContainer}>
            <Text style={[styles.text, { fontSize: 16 }]}>{`Refer Friends`}</Text>
            <TouchableOpacity disabled={profile?.referral == null ? true : false} activeOpacity={0.8} style={styles.flexDirection}>
              <Text style={styles.referCode}>{`${profile?.referral == null ? 'No referral' : profile?.referral}`}</Text>
              <Icon name={'share-variant-outline'} size={22} color={THEME.lightGray} />
            </TouchableOpacity>
          </View>
          {/* tabs View */}
          <View style={styles.tabsView}>
            <MenuItem title={'My Ads'} icon={'format-list-bulleted'} onMenuPress={() => navigation.navigate('UserAdScreen', { user_id: profile?.user_id })} />
            {/* <MenuItem title={'My Favourites'} icon={'cards-heart-outline'} onMenuPress={() => navigation.navigate('UserFavouriteScreen')} /> */}
          </View>
          <View style={styles.inappSupport}>
            <MenuItem title={'Terms and Condition'} icon={'police-badge-outline'} onMenuPress={() => termRef?.current?.open()} />
            <MenuItem title={'Support'} icon={'help-circle-outline'} onMenuPress={() => navigation.navigate('Support')} />
          </View>
        </View>

        <TermsCondition termRef={termRef} onCloseterms={onCloseterms} />
        <TouchableOpacity onPress={() => logoutHandler()} activeOpacity={1} style={styles.logout}>
          <Icon name={'logout-variant'} size={18} color={THEME.black} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.versionContainer}>
        <Text style={styles.appVersionTitle}>APP VERSION</Text>
        <Text style={[styles.appVersionTitle, { textAlign: 'center', color: THEME.primary, fontSize: 9 }]}>1.0.0</Text>
      </View>
    </View>

  )
}

export default ProfileScreen
