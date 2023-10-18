import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native'
import { THEME, fontFamily } from '../theme/appTheme'
import BackHeader from '../components/BackHeader'
import { ImageBasePath } from '../services/apiConstant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchCategories } from '../services';


const CategoryScreen = ({ navigation }) => {
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

  const renderItem = ({ item }) => (
    <TouchableOpacity  onPress={()=> console.log('render item')} activeOpacity={0.8} style={styles.categoryItem}>
      <Image source={{ uri: `${ImageBasePath}/${item.purl}` }} style={styles.categoryImage} />
      <Text numberOfLines={2} style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
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
    <View style={styles.container}>
      <StatusBar backgroundColor={THEME.primary} />
      <BackHeader title={'Categories'} goBack={goBack} />
      {loading ? <ActivityIndicator color={THEME.primary} /> : <View style={styles.container}>
        <Text style={styles.metaTitle}>What are you looking for?</Text>
        <FlatList
          data={categoriesToShow}
          renderItem={renderItem}
          keyExtractor={(item) => item.cid.toString()}
          // horizontal
          numColumns={3}
          contentContainerStyle={styles.categoryGrid}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => {
            console.log('loading')
          }}
        />
      </View>}
    </View>
  )
}

export default CategoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
  },
  categoryGrid: {
    flex:1,
    padding: 16,
    alignSelf: 'center',
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
  metaTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    paddingTop: 25,
    top: 2,
    fontFamily: fontFamily.poppins_500,
    color: THEME.black
  }
})