import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, StatusBar, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Platform } from 'react-native';
import { THEME, fontFamily } from '../theme/appTheme';
import LinearGradient from 'react-native-linear-gradient';
import { ImagebaseUrl } from '../services/apiConstant';
import { PhoneButton } from '../components/AdsComponent';
import MenuHeader from '../components/MenuHeader';
import { classifiedAds, onCallNow, onWhatsAppNow } from '../services/apiUtils';

const CommercialItem = ({ addHeadings, addVideos, addImage, addPersonalInfo, index, onWhatApp, onCall, onItemClick }) => {
    let videoReel = {
        "user_id": addHeadings?.user_id,
        "video_id": 14,
        addPersonalInfo: addPersonalInfo,
        video_url: addVideos?.video_url,
        images: addImage
    }
    return (
        <View style={styles.CommercialItemContainer}>
            <ImageBackground
                source={{ uri: `${ImagebaseUrl}/${addImage[0]?.image_name}` }}
                style={{ height: 150, width: 130, justifyContent: 'center', }}
            >
                <TouchableOpacity activeOpacity={0.8} onPress={() => onItemClick(videoReel)} style={styles.playButton2} >
                    <Image source={require('../assets/play-icon.png')} style={styles.playIcon2} />
                </TouchableOpacity>
            </ImageBackground>
            <View style={styles.spacing}>
                <PhoneButton onButtonPress={() => onWhatApp(addPersonalInfo[0]?.user_mob)} title={'Whatsapp'} icon={'whatsapp'} color={'green'} />
                <PhoneButton onButtonPress={() => onCall(addPersonalInfo[0]?.user_mob)} title={'Call Now'} icon={'phone'} color={'blue'} />
            </View>
        </View>

    )
}

const HomeScreen = ({ navigation }) => {

    const onPhoneContactHandler = () => { console.log('phone called') };
    const onMenuClick = () => { navigation.openDrawer() };
    const onNotificationClick = () => {
        navigation.navigate('OTP')
    };
    const [commercialAds, setCommercialAds] = useState([]);
    // 
    const fetchCommercialAds = async () => {
        let response = await classifiedAds('api/adds');
        let AdResponse = await response?.json();
        setCommercialAds(AdResponse.slice(0, 10));
        console.log('ccccc', AdResponse);
    };
    useEffect(() => {
        fetchCommercialAds();
    }, []);

    const onItemClick = (item) => {
        navigation.navigate('AdsReelScreen', { item });
    }
    const onCall = (phone) => {
        onCallNow(phone);
    };
    const onWhatsApp = (phone) => {
        onWhatsAppNow(phone);
    };
    const onMainBannerClick = () => {
        //   console.log('commercialAds at thirt place', commercialAds[3]);
        let { addHeadings, addPersonalInfo, addVideos, addImage } = commercialAds[0];
        let item = {
            "user_id": addHeadings?.user_id,
            addPersonalInfo: addPersonalInfo,
            video_url: addVideos?.video_url,
            images: addImage
        }
        navigation.navigate('AdsReelScreen', { item })
    }
    return (
        <ScrollView scrollEnabled={true} contentContainerStyle={styles.container}>
            <StatusBar backgroundColor={'rgba(255, 0, 0, 0.41)'} />
            <MenuHeader onMenuClick={onMenuClick} onNotificationClick={onNotificationClick} />
            <ImageBackground
                resizeMode='cover'
                source={{ uri: `${ImagebaseUrl}${commercialAds[0]?.addImage[0]?.image_name}` }}
                style={{ height: "62%", width: "100%", }}
            >
                {/* <TouchableOpacity onPress={() => onMainBannerClick()} style={styles.playButton} >
                    <Image source={require('../assets/play-icon.png')} style={styles.playIcon} />
                </TouchableOpacity> */}
                <LinearGradient colors={['rgba(255, 0, 0, 0.41)', 'rgba(255, 0, 0, 0.41)', 'rgba(255, 0, 0, 0.41)']} style={styles.linearGradient}>
                    <TouchableOpacity onPress={() => onMainBannerClick()} style={styles.playButton} >
                        <Image source={require('../assets/play-icon.png')} style={styles.playIcon} />
                    </TouchableOpacity>
                </LinearGradient>
            </ImageBackground>
            <View style={styles.CommercialAdsView}>
                <View>
                    <Text style={styles.title}>Commercial Ads</Text>
                    <Text style={styles.subtitle}>Most popular commercial Ads</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Listing')}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.padding}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={commercialAds}
                    renderItem={({ item, index }) => < CommercialItem onWhatApp={onWhatsApp} onCall={onCall} onButtonPress={onPhoneContactHandler} onItemClick={onItemClick} {...item} index={index} />}
                />
            </View>
        </ScrollView>

    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.white,
    },
    linearGradient: {
        height: "62%",
    },
    playIcon: {
        width: 40,
        height: 40,
    },
    playIcon2: {
        width: 30,
        height: 30,
    },
    playButton: {
        position: 'absolute',
        alignSelf: 'center',
        top: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.39)',
        padding: 14,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playButton2: {
        backgroundColor: 'rgba(255, 255, 255, 0.39)',
        width: 40,
        height: 40,
        alignSelf: 'center',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontFamily: fontFamily.poppins_600,
        lineHeight: 28,
        color: THEME.black,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: fontFamily.poppins_400,
        lineHeight: 20,
        color: THEME.lightGray,
    },
    CommercialAdsView: {
        bottom: Platform.OS == 'android' ? 120 : 170,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#fff"
    },
    viewAll: {
        fontSize: 11,
        color: THEME.primary,
        textDecorationLine: 'underline',
        lineHeight: 18,
        fontFamily: fontFamily.poppins_500
    },
    padding: {
        paddingHorizontal: 14,
        bottom: Platform.OS == 'android' ? 100 : 130,
        backgroundColor: "#fff",
        marginBottom: 30
    },
    CommercialItemContainer: {
        backgroundColor: THEME.grayRGBA,
        marginRight: 1.8,
        marginBottom: 4,
        // height: 190 
    },
    spacing: {
        marginVertical: 12,
        paddingHorizontal: 12,
    }

})