const videos = [
  {
    id: 1,
    uri: 'https://fabkw.com/api/public/addVideos/65310bb74f405_video.mp4',
  },
  {
    id: 2,
    uri: 'https://fabkw.com/api/public/addVideos/65310bb74f405_video.mp4',
  },
  {
    id: 3,
    uri: 'https://fabkw.com/api/public/addVideos/65310bb74f405_video.mp4',
  },
  {
    id: 4,
    uri: 'https://fabkw.com/api/public/addVideos/65310bb74f405_video.mp4',
  },
];

import React, { useEffect, useRef, useState } from 'react';
import {  Text,View, StyleSheet, Dimensions, SafeAreaView, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { ImagebaseUrl } from '../services/apiConstant';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../theme/appTheme';
import { onfetchReels } from '../services';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VideoPlayer = ({ route, navigation }) => {
  const videoRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true);
  const [AdsReels, setAdsReels] = useState([]);
  const screenIsFocused = useIsFocused();

  // useEffect(() => {
  //   if (!videoRef.current) {
  //     videoRef.current.seek(0);
  //   }

  // }, [currentIndex])

  useEffect(() => {
    const fetchAdsReels = async () => {
      try {
        setLoading(true);

        // Fetch the initial reel if it exists
        if (route?.params?.item) {
          const { item } = route.params;
          const pushReel = {
            user_id: item?.user_id,
            user_name: item?.addPersonalInfo[0]?.user_name,
            video_url: item?.video_url,
            userPhoto: item?.addPersonalInfo[0]?.userPhoto,
            images : item?.images
          };
          setAdsReels([pushReel]);
        } else {
          setAdsReels([]); // Initialize with an empty array
        }
        const reelResponse = await onfetchReels('api/reels');
        const Ads = await reelResponse.json();
        // Merge the fetched items with the existing AdsReels
        setAdsReels((prevAdsReels) => [...prevAdsReels, ...Ads]);
      } catch (error) {
        console.error('Error fetching AdsReels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdsReels();
  }, [route?.params]);
  //
  const viewProfile = (item) => {
    navigation.navigate('ViewUserAdScreen', { user_id: item?.user_id });
    // setPause(true);
  }
  const renderItem = ({ item, index, }) => {
    return (
      <View style={{ flex: 1, height: height }}>
        <Video
          source={{ uri: `https://fabkw.com/api${item.video_url}` }}
          poster={`${ImagebaseUrl}${item?.images[0]?.image_name}`}
          posterResizeMode={'cover'}
          ref={videoRef}
          style={styles.video}
          resizeMode="cover"
          paused={currentIndex !== index || !screenIsFocused}
          // paused={true}
          repeat={true}
          onBuffer={() => {
            return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5733" />
              </View>
            );
          }}
        />
        <TouchableOpacity onPress={() => viewProfile(item)} activeOpacity={0.8} style={{ position: 'absolute', bottom: 34, paddingLeft: 30, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: item?.userPhoto }} style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 50 }} />
          <Text style={{ fontFamily: 'Poppins-Bold', lineHeight: 18, fontSize: 14, color: '#fff', paddingLeft: 10 }}>{item?.user_name}</Text>
        </TouchableOpacity>
      </View>
    )
  }

const onChangeIndex = ({ index }) => {
  setCurrentIndex(index)
}

return (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, Platform.OS == 'ios' && { top: 55 }]} activeOpacity={0.8}>
      <Icon name={'chevron-left'} size={22} color={THEME.black} />
    </TouchableOpacity>
    <SwiperFlatList
      vertical
      data={AdsReels}
      renderItem={renderItem}
      onChangeIndex={onChangeIndex}
    />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  video: {
    width: width,
    height: height,
    position: 'absolute'
  },
  backButton: {
    zIndex: 100,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: THEME.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 14,
  },
});

export default VideoPlayer;
