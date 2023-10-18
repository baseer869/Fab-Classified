import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { THEME, fontFamily } from '../theme/appTheme';
import { fetchCategories, subCategories } from '../services';
import { ImageBasePath } from '../services/apiConstant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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
    fontSize: 18,
    fontFamily: fontFamily.poppins_500,
    lineHeight: 22,
    paddingHorizontal: 16,
    color: THEME.black,
    paddingVertical: 15
  },
  categoryItem: {
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
    // padding: 16,
    margin: 8,
    width: 117,
    height: 77,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  categoryTitle: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fontFamily.poppins_500,
    color: THEME.black,
    padding: 4

  },
  showMoreButton: {
    alignSelf: 'center',
    marginVertical: 16,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  showMoreButtonText: {
    color: THEME.primary, // Change the color as desired
    fontSize: 13,
    fontFamily: fontFamily.poppins_400
  },
  buttonContainer: {
    alignItems: 'center', // Center the buttons horizontally
    justifyContent: 'center', // Center the buttons vertically
  },
})

const AddAdsScreen = ({ navigation }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [Categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false)
  const initialCategoryCount = 9;
  const categoriesToShow = showAllCategories ? Categories : Categories?.slice(0, initialCategoryCount);
  const goBack = () => navigation.goBack();

  const fetch = async () => {
    setLoading(true);
    let response = await fetchCategories('api/category');
    let cate = await response.json();
    setLoading(false);
    setCategories(cate)
  }
  useEffect(() => {
    fetch();
  }, []);
  const fetchSubCategories = async (category) => {
    let response = await subCategories(`api/subcategory?cid=${category?.cid}`);
    let res = await response.json();
    if (res == "empty") {
      navigation.navigate('AdsFormScreen');
    } else {
      let mainCategory = category;
      navigation.navigate('CategorySelectionScreen', { mainCategory, res })
    }
  }
  const RenderItem = (item) => {
    let category = { title: item.title, purl: item.purl, cid: item.cid };
    return (
      <TouchableOpacity onPress={() => fetchSubCategories(category)} activeOpacity={0.8} style={styles.categoryItem}>
        <Image source={{ uri: `${ImageBasePath}/${item?.purl}` }} style={styles.categoryImage} />
        <Text numberOfLines={2} style={styles.categoryTitle}>{item.title}</Text>
      </TouchableOpacity>
    )
  };
  const renderFooter = () => (
    <View style={styles.buttonContainer}>
      {!showAllCategories && Categories?.length > initialCategoryCount && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowAllCategories(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.showMoreButtonText}>Show More</Text>
          <Icon name={'menu-down'} size={22} color={THEME.black} />
        </TouchableOpacity>
      )}
      {showAllCategories && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowAllCategories(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.showMoreButtonText}>Show Less</Text>
          <Icon name={'menu-up'} size={22} color={THEME.black} />
        </TouchableOpacity>
      )}
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.white} />
      <Image source={require('../assets/fab-logo.jpg')} style={styles.appLogo} />
      {loading ? <ActivityIndicator color={THEME.primary} size={22} /> :
        <View style={{ bottom: 40 }}>
          <Text style={styles.title}>{'What do you want to sell?'}</Text>
          <View style={{ alignSelf: 'center' }}>
            <FlatList
              data={categoriesToShow}
              renderItem={({ item, index }) => <RenderItem {...item} index={index} navigation={navigation} />}
              keyExtractor={(item) => item.cid.toString()}
              // horizontal
              numColumns={3}
              contentContainerStyle={styles.categoryGrid}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={() => {
                console.log('loading')
              }}
            showsVerticalScrollIndicator={false}
            />
          </View>
        </View>}
    </SafeAreaView>
  )
}

export default AddAdsScreen

