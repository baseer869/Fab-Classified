import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { THEME, fontFamily } from '../theme/appTheme'
import { ImagebaseUrl } from '../services/apiConstant';
import { classifiedAds } from '../services/apiUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CarAdsDetails } from './AdsListingScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white
  },
  appLogo: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    bottom: 40
  },
  title: {
    fontSize: 16,
    color: THEME.black,
    fontFamily: 'Poppins-Medium',
    paddingVertical: 15
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    top: 15
  },
  input: {
    backgroundColor: '#f0f0f0', // Light gray background color
    borderRadius: 5,
    fontSize: 16,
    height: 56,
    fontFamily: 'Montserrat-Light',
    color: THEME.black,
    paddingHorizontal: 12
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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

const AdsListingScreen = ({ navigation, route }) => {
  let { user_id } = route?.params;
  const [ClassifiedAds, setClassified] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    const fetchClassifiedAds = async () => {
      let response = await classifiedAds(`api/adds?uid=${user_id}`);
      let Ads = await response?.json();
      setClassified(Ads);
      setLoading(false);
    };
    fetchClassifiedAds();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.white} />
      <View style={styles.flexDirection}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{ padding: 10 }}  >
          <Icon name={'chevron-left'} size={20} color={THEME.black} />
        </TouchableOpacity>
        <Text style={styles.text}>My Ads</Text>
      </View>
      {loading ? <ActivityIndicator color={THEME.primary} animating={loading} /> : <View style={styles.innerContainer}>
        <FlatList
          numColumns={2}
          data={ClassifiedAds}
          renderItem={({ item, index }) => <ClassifiedItem  {...item} index={index} navigation={navigation} />}
          contentContainerStyle={{ marginTop: "4%" }}
          showsVerticalScrollIndicator={false}
        />
      </View>}
    </SafeAreaView>
  )
}

export default AdsListingScreen;