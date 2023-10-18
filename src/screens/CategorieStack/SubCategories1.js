import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { THEME, fontFamily } from '../../theme/appTheme'
import { SelectCategoryItem } from './CategoriesSelectionScreen'
import { subCategories } from '../../services'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SubCategories1 = ({ navigation, route }) => {

  let { mainCategory, res, } = route?.params;
  const [subCategoriesList, setSubCategoriesList] = useState(res);

  const onCategooryClick = async (item) => {
    let response = await subCategories(`api/subcategory?cid=${item?.cid}`);
    let res = await response.json();
    if (res == "empty") {
      navigation.navigate('AdsFormScreen');
    } else {
      navigation.navigate('SubCategories2', { mainCategory, res })
    }
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
                <TouchableOpacity onPress={() => onCategooryClick(item)} activeOpacity={0.7} index={index} style={styles.direction}>
                  <Text numberOfLines={2} style={styles.subCateTitle}>{item?.title}</Text>
                  <Icon name='chevron-right' size={20} color={THEME.black} />
                </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => item?.cid}
            style={{ paddingTop: 25 }}
            showsVerticalScrollIndicator={false}
          />
        </View>}
      </View>
    </SafeAreaView>
  )
}

export default SubCategories1

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
    fontSize: 17,
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
    fontSize: 14,
    lineHeight: 16,
    color: THEME.black,
  },
  subCateTitle: {
    fontSize: 16,
    color: THEME.black,
    lineHeight: 18,
    fontFamily: fontFamily.poppins_500,
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
})