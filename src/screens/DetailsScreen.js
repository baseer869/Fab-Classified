import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { ImagebaseUrl } from '../services/apiConstant';
import { THEME, fontFamily } from '../theme/appTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SliderBox } from 'react-native-image-slider-box';
import { onCallNow, onWhatsAppNow } from '../services/apiUtils';


export default function DetailsScreen({ navigation, route }) {
    const { addImage, addData, addHeadings, addPersonalInfo } = route?.params?.itemDetails;
    const [activeSlide, setActiveSlide] = React.useState(0); // Store the active slide index

    // Extract image URLs from the data
    const imageUrls = addImage?.map((image) => ({
        uri: `${ImagebaseUrl}/${image.image_name}`,
    }));
    const onCall = () => {
        onCallNow(addPersonalInfo[0]?.user_mob);
    };
    const onWhatsApp = () => {
        onWhatsAppNow(addPersonalInfo[0]?.user_mob);
    };

    return (
        <View style={[styles.container, { paddingTop: 15 }]}>
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
                    <Icon name={'chevron-left'} size={22} color={THEME.black} />
                </TouchableOpacity>
                {imageUrls && <SliderBox
                    images={imageUrls}
                    sliderBoxHeight={300}
                    onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                    dotColor={THEME.primary}
                    inactiveDotColor="#90A4AE"
                    dotStyle={{
                        width: 12,
                        height: 12,
                        borderRadius: 15,
                    }}
                />}
                <View style={styles.AdsDetailContainer}>
                    <View style={styles.direction}>
                        <Text style={styles.title}>{addHeadings?.add_title}</Text>
                        <Text style={styles.price}>{addHeadings?.price}</Text>
                    </View>
                    <Text style={[styles.title, { fontSize: 12, fontFamily: fontFamily.poppins_400, fontStyle: 'italic' }]}>{addPersonalInfo?.city}</Text>
                    <Text style={styles.AdsFeatures}>{"Features"}</Text>
                    <View style={styles.featureContainer}>
                        {addHeadings?.year && <View style={styles.column}>
                            <Text style={styles.label}>{'Year of make'}</Text>
                            <Text style={styles.value}>{addHeadings?.year}</Text>
                        </View>}

                        {addHeadings?.car_condition && <View style={styles.column}>
                            <Text style={styles.label}>{'Condition'}</Text>
                            <Text style={styles.value}>{addHeadings?.car_condition == 1 ? 'Used' : 'New'}</Text>
                        </View>}
                    </View>
                    <Text style={styles.AdsFeatures}>{"Descriptions"}</Text>
                    <Text style={styles.description}>{addHeadings?.add_detail}</Text>
                </View>
            </ScrollView>
            <View style={styles.btnContainer}>
                <TouchableOpacity onPress={() => onCall()} activeOpacity={0.8} style={[styles.btn, { borderColor: 'blue' }]}>
                    <Icon name={'phone'} size={20} color={'blue'} />
                    <Text style={styles.btnTitle}>{'Call Now'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onWhatsApp()} activeOpacity={0.8} style={[styles.btn, { borderColor: 'green' }]}>
                    <Icon name={'whatsapp'} size={20} color={'green'} />
                    <Text style={styles.btnTitle}>{'Whatsapp'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.white,
    },
    image: {
        resizeMode: 'contain',
        height: "40%",
        width: Dimensions.get('window').width,
    },
    direction: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between'
    },
    backButton: {
        zIndex: 100,
        top: 40,
        width: 40,
        height: 40,
        borderRadius: 100,
        backgroundColor: THEME.lightGray,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 14
    },
    paginationContainer: {
        top: 290,
        position: 'absolute',
        alignSelf: 'center',
        paddingVertical: 8,
        zIndex: 100,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: THEME.primary, // Customize the dot color
    },
    AdsDetailContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 15
    },
    featureContainer: {
        paddingTop: 20
    },
    column: {
        flexDirection: 'row', // Arrange label and value in a row
        justifyContent: 'space-between', // Put space between label and value
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontFamily: fontFamily.poppins_400,
        lineHeight: 16,
        color: THEME.lightGray
    },
    value: {
        flex: 1, // Make the value take up remaining space in the row
        textAlign: 'right', // Align the value to the right
        fontSize: 16,
        fontFamily: fontFamily.poppins_500,
        lineHeight: 20,
        color: THEME.black
    },
    AdsFeatures: {
        fontSize: 22,
        fontFamily: fontFamily.poppins_600,
        lineHeight: 26,
        color: THEME.black,
        paddingTop: 18
    },
    title: {
        fontSize: 16,
        fontFamily: fontFamily.poppins_500,
        lineHeight: 24,
        color: THEME.black,
        paddingVertical: 2,
        width: "50%"
    },
    price: {
        fontSize: 20,
        fontFamily: fontFamily.poppins_700,
        lineHeight: 30,
        color: THEME.black,
    },
    description: {
        fontSize: 15,
        fontFamily: fontFamily.poppins_400,
        lineHeight: 19,
        color: THEME.black,
        paddingTop: 8,
        opacity: 0.7,
        paddingBottom: 30
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    btn: {
        borderWidth: 0.5,
        borderColor: THEME.lightGray,
        borderRadius: 8,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: "40%",
        height: 56,
        flexDirection: 'row',
        paddingHorizontal: 14
    }
});
