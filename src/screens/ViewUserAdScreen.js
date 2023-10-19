import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { THEME, fontFamily } from '../theme/appTheme';
import { fetchUserAds } from '../services';
import { ImagebaseUrl } from '../services/apiConstant';
import { CarAdsDetails } from './AdsListingScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.backgroundColor,
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: THEME.white,
    marginTop: 6,
    paddingHorizontal: 15,
    backgroundColor: THEME.white
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
    textAlign: 'left',
    width: "100%"
  },
  profileDirec: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  phone: {
    fontSize: 15,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 22,
    color: THEME.lightGray,
  },
  image: {
    width: 154,
    height: 103,
    resizeMode: 'contain'
  },
  itemContainer: {
    elevation: 2,
    borderRadius: 10,
    marginRight: 12,
    marginVertical: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    width: "47%",
    shadowColor: THEME.lightGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // Android shadow (elevation),
    marginLeft: 4
  },
  Adtitle: {
    fontSize: 13,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 15,
    color: THEME.black,
    paddingVertical: 2,
    // width: "50%"
  },
  featureText: {
    fontSize: 12,
    color: THEME.lightGray,
    fontFamily: fontFamily.poppins_400,
    lineHeight: 17,
  },
  price: {
    fontSize: 16,
    fontFamily: fontFamily.poppins_600,
    lineHeight: 30,
    color: THEME.black,
  },
  text: {
    fontSize: 18,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 30,
    color: THEME.black,
    alignSelf: 'center'
  },
  flexDirection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "60%"
  },
  AdsListContainer: {
    paddingHorizontal: 15
  }
});
const ClassifiedItem = (item, index) => {
  let { addHeadings, addImage, addPersonalInfo, fav, addData } = item;
  let itemDetails = { addData, addHeadings, addImage, addPersonalInfo };
  return (
    <TouchableOpacity onPress={() => item?.navigation.navigate('DetailsScreen', { itemDetails })} activeOpacity={0.7} style={[styles.itemContainer, {}]}>
      <Image source={{ uri: `${ImagebaseUrl}/${addImage[0]?.image_name}` }} style={styles.image} />
      <View style={styles.direction}>
        <View style={{ paddingVertical: 6 }}>
          <Text numberOfLines={1} style={styles.Adtitle} >{addHeadings?.add_title}</Text>
          {/* <Text style={styles.featureText}>{`${addHeadings?.km_driven} km - ${addHeadings?.fuel_type} - ${addHeadings?.location}`}</Text> */}
          <CarAdsDetails addHeadings={addHeadings} />
          <Text style={styles.price}>{`${addHeadings?.price}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const ViewUserAdScreen = ({ route, navigation }) => {

  let { user_id } = route?.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUserAds(`api/adds?uid=${user_id}`)
      .then(async (resopnse) => {
        let userInfo = await resopnse.json();
        if (userInfo) {
          setProfile(userInfo);
          setLoading(false);
        } else {
          setLoading(false);
          console.log('User Information not found.');
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile View */}
      {loading ? <ActivityIndicator animating={loading} />
        :
        <>
          {profile !== null && <View style={styles.profileContainer}>
            <View style={styles.profileDirec}>
              <TouchableOpacity activeOpacity={0.8} style={styles.usernameContainer}>
                {profile !== null ? <Image source={{ uri: profile[0]?.addPersonalInfo[0]?.userPhoto }} style={{ width: 60, height: 60, borderRadius: 100 }} /> :
                  <Text style={styles.username}>{profile[0]?.addPersonalInfo[0]?.user_name?.charAt(0)}</Text>
                }
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 8, paddingTop: 10, }}>
                <Text style={[styles.username, { color: THEME.black, fontFamily: fontFamily.poppins_500 }]}>{`${profile[0]?.addPersonalInfo[0]?.user_name}`}</Text>
                {profile && profile[0]?.addPersonalInfo[0]?.user_mob !== null && <Text style={styles.phone}>{`+${profile[0]?.addPersonalInfo[0]?.user_mob}`}</Text>
                }
              </View>
            </View>
          </View>
          }
          <View style={styles.AdsListContainer}>
            <TouchableOpacity style={{ top: 10, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', height: 30, width: 60, borderRadius: 100, }}>
              <Text style={[styles.text, { fontSize: 16, color: THEME.white }]}>All Ads</Text>
            </TouchableOpacity>
            <FlatList
              numColumns={2}
              data={profile}
              renderItem={({ item, index }) => <ClassifiedItem  {...item} index={index} navigation={navigation} />}
              contentContainerStyle={{ marginTop: "4%" }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>

      }
    </SafeAreaView>
  )
}

export default ViewUserAdScreen
