import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, TextInput, Platform } from 'react-native'
import React, { useState } from 'react'
import { THEME, fontFamily } from '../../theme/appTheme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { CarModel } from '../../services/constantData';
import { PosAds, listCarMakes, readUserInfo } from '../../services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white
  },
  title: {
    fontFamily: fontFamily.poppins_500,
    fontSize: 17,
    lineHeight: 18,
    color: THEME.black,
  },
  appLogo: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    bottom: 40
  },
  inputContainer: {
    bottom: 40,
    paddingHorizontal: 15
  },
  imageViewCongtainer: {
    borderStyle: 'dashed',
    borderColor: THEME.lightGray,
    width: '100%',
    // height: '100%',
    borderStyle: 'dashed',
    alignSelf: 'center',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  addText: {
    fontFamily: fontFamily.poppins_400,
    fontSize: 11,
    lineHeight: 18,
    color: THEME.black,
  },
  imageDirection: {
    flexDirection: 'row',
    alignItems: 'center',

  },

  dropDownContainer: {
    flex: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
  },
  dropDown: {
    borderBottomWidth: 0.5,
    borderBottomColor: THEME.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "84%",
  },
  iconView: {
    width: 40,
    height: 40,
    backgroundColor: THEME.backgroundColor,
    borderRadius: 100,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputTitle: {
    fontFamily: fontFamily.poppins_Light,
    color: THEME.black,
    fontSize: 12,
    lineHeight: 19
  },
  sheetContent: {
    backgroundColor: THEME.white,
  },
  searchInput: {
    backgroundColor: THEME.white,
    color: THEME.black,
    fontFamily: fontFamily.poppins_Light,
    fontSize: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: THEME.backgroundColor
  },
  modelItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.backgroundColor,
    fontSize: 14,
    color: THEME.black,
    fontFamily: fontFamily.poppins_400
  },
  dreiction: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    backgroundColor: THEME.white,
    marginHorizontal: 15
  },
  textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: THEME.lightGray,
    width: "84%",
    fontFamily: fontFamily.poppins_Light,
    color: THEME.black,
    fontSize: 14,
    lineHeight: 19,
    paddingVertical: Platform.OS == 'ios' ? 4 : 0
  },
  btn: {
    backgroundColor: THEME.primary,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    width: "90%",
    alignSelf: 'center',
    marginVertical: 30,
    borderRadius: 8
  },
  btnTitle: {
    fontSize: 14,
    fontFamily: fontFamily.poppins_500,
    color: THEME.white,
    lineHeight: 18,
  },
  additionalNotesContainer: {
    // paddingHorizontal: 14,
  },
  additionalNotesTitle: {
    fontSize: 18,
    fontFamily: fontFamily.poppins_600,
    color: THEME.black,
    lineHeight: 22,
    marginVertical: 30,
    paddingHorizontal: 22,
  },
  conditionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  conditionItem: {
    padding: 4,
    paddingHorizontal: 8,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: THEME.backgroundColor,
  },
  selectedCondition: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  conditionText: {
    fontSize: 12,
    fontFamily: fontFamily.poppins_400,
    lineHeight: 16,
    color: THEME.black,
  },
})

const AdsFornScreen = ({ navigation, route }) => {
  let { mainCategory, subCategory, } = route?.params;
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchText, setSearchText] = useState('');
  //
  const [carMakes, setCarMakes] = useState([]);
  const [carMake, setcarMake] = useState(null);
  const [carMakeName, setcarMakeName] = useState(null);
  const [carYear, setcarYear] = useState(null);
  const [kmDriven, setKmDriven] = useState(null);
  //
  const [carModels, setCarModels] = useState(CarModel);
  const [carModel, setCarModel] = useState(null)
  const [carModelName, setCarModelName] = useState(null)
  //
  const [selectedCondition, setSelectedCondition] = useState(null);
  //
  const [loading, setLoading] = useState(false);
  //
  const CarMakebottomSheetRef = React.useRef();
  const CarModelbottomSheetRef = React.useRef();

  const handleConditionSelect = (conditionId) => {
    setSelectedCondition(conditionId);
  };

  const filterCarMake = () => {
    return carMakes.filter((make) => {
      return make?.make_name.toLowerCase().includes(searchText.toLowerCase())
    }
    );
  };
  const filterCarModels = () => {
    return carModels.filter((model) =>
      model?.make_name.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  const onSelectCarMake = (car) => {
    setcarMake(car?.make_id);
    setcarMakeName(car?.make_name)
    CarMakebottomSheetRef.current.close();
    fetchCarModels(car?.make_id);
    setTimeout(() => {
      CarModelbottomSheetRef.current.open();
    }, 300);
  }
  const onSelectCarModel = (car) => {
    setCarModel(car?.make_id);
    setCarModelName(car?.model_name)
    CarModelbottomSheetRef.current.close();
  }

  const InputTitle = ({ title, carMakeName, carModelName }) => {
    return (
      <View>
        <Text style={styles.inputTitle}>{title}</Text>
        <View style={styles.dreiction}>
          {carMakeName && <Text style={[styles.inputTitle, { paddingVertical: 2, fontFamily: fontFamily.poppins_500 }]}>{`${carMakeName} `}</Text>}
          {carModelName && <Text style={[styles.inputTitle, { paddingVertical: 2, fontFamily: fontFamily.poppins_500 }]}>{`${carModelName} `}</Text>}
        </View>
      </View>
    )
  }

  //--------------------//
  const fetchCarMake = async () => {
    let response = await listCarMakes('api/car-make')
    let carMakeDetails = await response.json();
    setCarMakes(carMakeDetails);
  }
  // 
  const fetchCarModels = async (make_id) => {
    let response = await listCarMakes(`api/car-models?make_id=${make_id}`)
    let carModelDetails = await response.json();
    setCarModels(carModelDetails);
  }
  // 
  React.useEffect(() => {
    fetchCarMake();
  }, [])
  ///
  const handleSubmit = async () => {
    let user_id = null
    setLoading(true)
    readUserInfo()
      .then((userInfo) => {
        if (userInfo) {
          // console.log('User Information:', userInfo);
          user_id = userInfo?.data?.user_id
          console.log('user_id', user_id);
        } else {
          console.log('User Information not found.');
        }
      });


    setTimeout(async () => {
      const AdsPayload = {
        user_id: user_id,
        main_cat_id: mainCategory?.cid,
        cat_id: subCategory?.cid,
        make_id: carMake,
        model_id: carModel,
        year: carYear,
        fuel_type: null,
        km_driven: kmDriven,
        price: price,
        car_condition: selectedCondition,
        title: title,
        add_details: description,
        location: null,
        latitude: null,
        longitude: null,
        color: null,
      };
      console.log('payload===>', AdsPayload);
      let response = await PosAds('api/saveadd', AdsPayload);
      let AdResponse = await response?.json();
      console.log('response of post Ads', AdResponse);
      if (AdResponse && AdResponse?.status == 200) {
        setLoading(false);
        navigation.navigate('AdFileUploadScreen', { add_id: AdResponse?.add_id, user_id: AdResponse?.user_id })
      } else {
        setLoading(false);
        console.log('please  try again, ')
      }
    }, 300);


  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Image source={require('../../assets/fab-logo.jpg')} style={styles.appLogo} />
        <View style={{ flex: 1, bottom: 40 }}>
          <Text style={[styles.title, { fontFamily: fontFamily.poppins_500, paddingHorizontal: 17 }]}>Enter your Ad details to continue</Text>
          <View style={[styles.dropDownContainer, { paddingTop: 30 }]}>
            <View style={styles.iconView}>
              <Icon name={'car-outline'} size={20} color={THEME.black} />
            </View>
            <TouchableOpacity onPress={() => CarMakebottomSheetRef.current.open()} activeOpacity={0.8} style={styles.dropDown}>
              <InputTitle title={'Car Model'} carMakeName={carMakeName} carModelName={carModelName} />
              <Icon name='chevron-down' size={20} color={THEME.black} />
            </TouchableOpacity>
          </View>
          {/* Year */}
          <View style={[styles.dropDownContainer, { alignItems: 'center', marginTop: 15 }]}>
            <View style={styles.iconView}>
              <Icon name={'calendar'} size={20} color={THEME.black} />
            </View>
            <TextInput
              placeholder="Year"
              value={carYear}
              onChangeText={(text) => setcarYear(text)}
              style={styles.textInput}
              placeholderTextColor={THEME.black
              }
            />
          </View>
          {/* description */}
          <View style={[styles.dropDownContainer, { alignItems: 'center', marginTop: 15 }]}>
            <View style={styles.iconView}>
              <Icon name={'speedometer'} size={20} color={THEME.black} />
            </View>
            <TextInput
              placeholder="KMs Driven"
              value={kmDriven}
              onChangeText={(text) => setKmDriven(text)}
              style={styles.textInput}
              placeholderTextColor={THEME.black
              }
            />
          </View>
          {/* price */}
          <View style={[styles.dropDownContainer, { alignItems: 'center', marginTop: 15 }]}>
            <View style={styles.iconView}>
              <Icon name={'currency-usd'} size={20} color={THEME.black} />
            </View>
            <TextInput
              placeholder="Set a price"
              value={price}
              onChangeText={(text) => setPrice(text)}
              style={styles.textInput}
              placeholderTextColor={THEME.black
              }
            />
          </View>
          {/* Title */}
          <View style={[styles.dropDownContainer, { alignItems: 'center', marginTop: 15 }]}>
            <View style={styles.iconView}>
              <Icon name={'card-text-outline'} size={20} color={THEME.black} />
            </View>
            <TextInput
              placeholder="Ad Title"
              value={title}
              onChangeText={(text) => setTitle(text)}
              style={styles.textInput}
              placeholderTextColor={THEME.black
              }
            />
          </View>
          {/* description */}
          <View style={[styles.dropDownContainer, { alignItems: 'center', marginTop: 15 }]}>
            <View style={styles.iconView}>
              <Icon name={'card-text-outline'} size={20} color={THEME.black} />
            </View>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
              style={styles.textInput}
              placeholderTextColor={THEME.black
              }
            />
          </View>
          {/* Additional Notes  */}
          <View style={styles.additionalNotesContainer}>
            <Text style={styles.additionalNotesTitle}>{'Additional notes'}</Text>
            {/* Conditions */}
            <View style={styles.dropDownContainer}>
              <View style={styles.iconView}>
                <Icon name={'car-outline'} size={20} color={THEME.black} />
              </View>
              <View>
                <Text style={styles.inputTitle}>{'Condition'}</Text>
                <View style={styles.conditionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.conditionItem,
                      selectedCondition === '1' ? styles.selectedCondition : null,
                    ]}
                    onPress={() => handleConditionSelect('1')}
                  >
                    <Text style={[styles.conditionText, selectedCondition == '1' && { color: THEME.white, fontFamily: fontFamily.poppins_600 }]}>New</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.conditionItem,
                      selectedCondition === '2' ? styles.selectedCondition : null,
                    ]}
                    onPress={() => handleConditionSelect('2')}
                  >
                    <Text style={[styles.conditionText, selectedCondition === '2' && { color: THEME.white, fontFamily: fontFamily.poppins_600 }]}>Used</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity disabled={loading}  onPress={() => handleSubmit()} style={[styles.btn, loading && { backgroundColor: THEME.lightGray }]} activeOpacity={0.8} >
            <Text style={styles.btnTitle}>{loading ? 'Please wait' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Car make */}
      <RBSheet
        ref={CarMakebottomSheetRef}
        height={Dimensions.get('window').height}
        customStyles={{
          container: {
            paddingHorizontal: 14,
          },
        }}
      >
        <SafeAreaView style={styles.sheetContent}>
          <TextInput
            placeholder="Search Car Make"
            onChangeText={(text) => setSearchText(text)}
            style={styles.searchInput}
          />
          <FlatList
            data={filterCarMake()}
            keyExtractor={(item) => item?.make_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => onSelectCarMake(item)} activeOpacity={0.8} style={styles.modelItem}>
                  <Text>{item?.make_name}</Text>
                </TouchableOpacity>
              )
            }
            }
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 20 }}
          />
        </SafeAreaView>
      </RBSheet>
      {/* Car Model */}
      <RBSheet
        ref={CarModelbottomSheetRef}
        height={Dimensions.get('window').height}
        customStyles={{
          container: {
            paddingHorizontal: 14
          },
        }}
      >
        {/* Cars Model */}
        <View style={styles.sheetContent}>
          <TextInput
            placeholder="Search Car Models"
            onChangeText={(text) => setSearchText(text)}
            style={styles.searchInput}
          />
          <FlatList
            data={filterCarModels()}
            keyExtractor={({ item }) => item?.model_id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelectCarModel(item)} activeOpacity={0.8} style={styles.modelItem}>
                <Text>{item?.model_name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 20 }}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  )
}

export default AdsFornScreen
