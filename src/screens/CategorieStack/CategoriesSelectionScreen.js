
import { SafeAreaView, StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { THEME, fontFamily } from '../../theme/appTheme'
import { ImageBasePath } from '../../services/apiConstant';
import { subCategories } from '../../services';
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
    fontFamily: fontFamily.poppins_500,
    fontSize: 16,
    lineHeight: 18,
    color: THEME.black,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    bottom: 60
  },
  categoryContantainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
    // padding: 16,
    margin: 8,
    width: 100,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cateGoryTitle: {
    fontFamily: fontFamily.poppins_400,
    fontSize: 12,
    lineHeight: 16,
    color: THEME.black,
  },
  categoryImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: THEME.lightGray,
  },
  subCateTitle: {
    fontSize: 16,
    color: THEME.black,
    lineHeight: 18,
    fontFamily: fontFamily.poppins_500,
  },
  selectedCategoryTitle: {
    borderWidth: 0.5,
    borderColor: THEME.primary,
    paddingLeft: 4,
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 8,
    marginTop: 10
  }
});


export function SelectCategoryItem({ title, category, selectCategory }) {
  // const [selectCategory, setSelectedCategory] = useState(selectCategory);
  const [mainCategory, setMaincategories] = useState(category?.title)

  // useEffect(() => {
  //   if (title) {
  //     console.log('item pushed');
  //     setSelectedCategory((prevSelectCategory) => [...prevSelectCategory, title]);
  //   }
  // }, [title]);
  // console.log('title', selectCategory) ;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
      <View style={styles.categoryContantainer}>
        <Image source={{ uri: `${ImageBasePath}/${category?.purl}` }} style={styles.categoryImage} />
        <Text numberOfLines={1} style={styles.cateGoryTitle}>{mainCategory}</Text>
      </View>
      {selectCategory?.length > 0 && selectCategory?.map((title, index) => (
        <View key={index} style={styles.selectedCategoryTitle}>
          <Text style={styles.cateGoryTitle}>{title}</Text>
        </View>
      ))}
    </View>

  )
}

const CategoriesSelectionScreen = ({ navigation, route }) => {
  let { mainCategory, res, } = route?.params;
  const [subCategoriesList, setSubCategoriesList] = useState(res);

  const onCategooryClick = async (item) => {
    let subCategory = item;
    let response = await subCategories(`api/subcategory?cid=${item?.cid}`);
    let res = await response.json();
      navigation.navigate('AdsFormScreen', { mainCategory, subCategory })
    // if (res == "empty") {
    //   navigation.navigate('AdsFormScreen');
    // } else {
    //   navigation.navigate('SubCategories1', { mainCategory, res })
    // }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/fab-logo.jpg')} style={styles.appLogo} />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Your Car Details</Text>
        <SelectCategoryItem category={mainCategory} />
        {subCategoriesList?.length > 0 && <View>
          <FlatList
            data={subCategoriesList}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity key={index} onPress={() => onCategooryClick(item)} activeOpacity={0.7} index={index} style={styles.direction}>
                  <Text style={styles.subCateTitle}>{item?.title}</Text>
                  <Icon name='chevron-right' size={20} color={THEME.black} />
                </TouchableOpacity>
              )
            }}
            style={{ paddingTop: 25 }}
            keyExtractor={(item, index) => item?.cid}
            showsVerticalScrollIndicator={false}
          />
        </View>}
      </View>
    </SafeAreaView>
  )
}

export default CategoriesSelectionScreen

