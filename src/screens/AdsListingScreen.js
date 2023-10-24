import { SafeAreaView, StatusBar, StyleSheet, ScrollView, Text, View, Image, TextInput, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { THEME, fontFamily } from '../theme/appTheme'
import { ImagebaseUrl } from '../services/apiConstant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { classifiedAds, onAddToFavourite } from '../services/apiUtils';
import FastImage from 'react-native-fast-image'

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
    bottom: 50
  },
  input: {
    backgroundColor: '#f0f0f0', // Light gray background color
    borderRadius: 5,
    fontSize: 12,
    height: 56,
    fontFamily: 'Montserrat-Medium',
    color: THEME.grayRGBA,
    paddingHorizontal: 12
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: "100%",
    height: 103,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  itemContainer: {
    borderRadius: 10,
    marginRight: 12,
    marginVertical: 12,
    backgroundColor: '#fff',
    // paddingHorizontal: 8,
    width: "47%",
    shadowColor: THEME.lightGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // Android shadow (elevation)
    marginLeft: 4
  },
  Adtitle: {
    fontSize: 13,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 15,
    color: THEME.black,
    paddingVertical: 2,
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

  }

})
const SearchInput = ({ onSearchClick }) => {
  return (
    <TextInput
      placeholder="Search Anything on Fab Classified"
      style={styles.input}
      editable={false} // Make the TextInput disabled
      onPressOut={()=> onSearchClick()}
      placeholderTextColor={THEME.black}
    />
  );
};

export const CarAdsDetails = ({ addHeadings }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {addHeadings?.km_driven && <Text style={styles.featureText}>{`${addHeadings?.km_driven} km`}</Text>}
      {addHeadings?.fuel_type && <Text style={styles.featureText}>{`- ${addHeadings?.fuel_type}`}</Text>}
      {addHeadings?.location && <Text style={styles.featureText}>{`- ${addHeadings?.location}`}</Text>}
    </View>
  )
}

const ClassifiedItem = (item, index, addToFavourite) => {
  let { addHeadings, addImage, addPersonalInfo, fav, addData } = item;
  let itemDetails = { addData, addHeadings, addPersonalInfo, addImage };
  let addToFavPaylooad = { add_id: addHeadings?.add_id, user_id: 'logged user id ' };
  return (
    <TouchableOpacity onPress={() => item?.navigation.navigate('DetailsScreen', { itemDetails })} activeOpacity={0.7} style={[styles.itemContainer, {}]}>
      <FastImage source={{ uri: `${ImagebaseUrl}/${addImage[0]?.image_name}` }} style={styles.image} />
      <View style={styles.direction}>
        <View style={{ paddingVertical: 6, paddingHorizontal: 8, alignItems: 'flex-start' }}>
          <Text numberOfLines={1} style={styles.Adtitle} >{addHeadings?.add_title}</Text>
          <CarAdsDetails addHeadings={addHeadings} />
          <Text style={styles.price}>{`${addHeadings?.price}`}</Text>
        </View>
        {/* <TouchableOpacity onPress={()=> item.addToFavourite(addToFavPaylooad)} activeOpacity={0.8} style={{ padding: 4, position: 'absolute', right: 0 }}>
          <Icon name={'heart-outline'} size={22} color={fav?.heartRedVisible == true ? THEME.primary : THEME.lightGray} />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  )
}

const AdsListingScreen = ({ navigation }) => {

  const [ClassifiedAds, setClassified] = useState([]);
  const [loading, setLoading] = useState(false);

  // On Search 
  const onSearchClick = () => {
    navigation.navigate('DrawerMenu', { screen: 'CategoriesScreen' })
  }
  // Add to Favourite
  const addToFavourite = async (item) => {
    console.log('item to fav', item);
    // let FavResponse = await onAddToFavourite(item);
    console.log('respnse of fav', FavResponse);
  }
  // Load Ads
  React.useEffect(() => {
    setLoading(true);
    const fetchClassifiedAds = async () => {
      let response = await classifiedAds('api/adds');
      let Ads = await response?.json();
      setClassified(Ads);
      setLoading(false);
    };
    fetchClassifiedAds();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.white} />
      <FastImage source={require('../assets/fab-logo.jpg')} style={styles.appLogo} />
      {loading ? <ActivityIndicator animating={loading} size={26} /> :
        <ScrollView style={styles.innerContainer}>
            <SearchInput  onSearchClick={onSearchClick} />
          <Text style={styles.title}>{`${ClassifiedAds?.length} products found`}</Text>
          <FlatList
            numColumns={2}
            data={ClassifiedAds}
            renderItem={({ item, index }) => <ClassifiedItem  {...item} index={index} navigation={navigation} addToFavourite={addToFavourite} />}
            contentContainerStyle={{ marginTop: "4%" }}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      }
    </SafeAreaView>
  )
}

export default AdsListingScreen
