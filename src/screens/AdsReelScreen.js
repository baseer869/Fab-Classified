import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, Dimensions, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { THEME, fontFamily } from '../theme/appTheme';
import { onfetchReels } from '../services';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdsReelScreen = ({ route, navigation }) => {
  const [AdsReels, setAdsReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRefs = useRef(AdsReels.map(() => React.createRef()));
  const screenIsFocused = useIsFocused();
  const [pause, setPause] = useState(false);

  // useEffect(() => {
  //   const fetchAdsReels = async () => {
  //     try {
  //       setLoading(true);
  //       const reelResponse = await onfetchReels('api/reels');
  //       const Ads = await reelResponse.json();
  //       if (route?.params?.item) {
  //         const { item } = route?.params;
  //         const pushReel = {
  //           user_id: item?.user_id,
  //           user_name: item?.addPersonalInfo[0]?.user_name,
  //           video_url: item?.video_url,
  //           userPhoto: item?.addPersonalInfo[0]?.userPhoto,
  //         };
  //         setAdsReels([pushReel, ...Ads]);
  //       } else {
  //         setAdsReels(Ads);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching AdsReels:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAdsReels();
  // }, [route?.params]);

  //=========//
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
          };
          setAdsReels([pushReel]);
        } else {
          setAdsReels([]); // Initialize with an empty array
        }
        // Fetch additional items from the server
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


  //========//
  const playVideo = (index) => {
    if (videoRefs.current && videoRefs.current[index]) {
      videoRefs.current[index].presentFullscreenPlayer();
    }
  };
  const onEnd = (index) => {
    if (index + 1 < AdsReels.length) {
      playVideo(index + 1);
    }
  };
  const onVideoError = (e, index) => {
    if (index + 1 < AdsReels.length) {
      playVideo(index + 1);
    } else {
      console.error(`Video error for index ${index}: ${e}`);
      // You can display an error message to the user or take other appropriate actions here.
    }
  };
  const viewProfile = (item) => {
    navigation.navigate('ViewUserAdScreen', { user_id: item?.user_id });
    setPause(true);
  }
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator style={{ alignSelf: 'center', flex: 1, }} size={25} animating={loading} color="#FF5733" />
      ) : (
        // <>
        //   <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
        //     <Icon name={'chevron-left'} size={22} color={THEME.black} />
        //   </TouchableOpacity>
          <FlatList
            pagingEnabled
            onScroll={(e) => {
              const newIndex = Math.floor(
                e.nativeEvent.contentOffset.y / Dimensions.get('window').height
              );
              if (newIndex !== selectedIndex) {
                setSelectedIndex(newIndex);
                playVideo(newIndex);
              }
            }}
            data={AdsReels}
            renderItem={({ item, index }) => (
              // <View>
                <Video
                  source={{ uri: `https://fabkw.com/api${item.video_url}` }}
                  // source={require('../assets/videos/3bhk.mp4')}
                 
                  resizeMode="cover"
                  paused={index !== selectedIndex || !screenIsFocused || pause == true}
                  onEnd={() => onEnd(index)}
                  repeat={true}
                  onError={(e) => onVideoError()}
                  ref={videoRefs.current[index]}
                  // style={{ height: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                  style={{ flex: 1, }}
                // bufferConfig={{
                //   minBufferMs: 15000,
                //   maxBufferMs: 50000,
                //   bufferForPlaybackMs: 2500,
                //   bufferForPlaybackAfterRebufferMs: 5000
                // }}
                onBuffer={() => {
                  return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color="#FF5733" />
                    </View>
                  );
                }}
                />
              //  <TouchableOpacity onPress={() => viewProfile(item)} activeOpacity={0.8} style={{ position: 'absolute', bottom: 34, paddingLeft: 30, flexDirection: 'row', alignItems: 'center' }}>
              //     <Image source={{ uri: item?.userPhoto }} style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 50 }} />
              //     <Text style={{ fontFamily: 'Poppins-Bold', lineHeight: 18, fontSize: 14, color: '#fff', paddingLeft: 10 }}>{item?.user_name}</Text>
              //   </TouchableOpacity>
              // </View>
            )}
          />
        // </>
      )}
    </View>
  );
};

export default AdsReelScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: THEME.backgroundColor
  },
  videoPlayer: {
    height: "100%",
    width: "100%",
  },
  userProfile: {
    position: 'absolute',
    bottom: 30,
    paddingLeft: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 50
  },
  userName: {
    fontFamily: fontFamily.poppins_700,
    lineHeight: 18,
    fontSize: 14,
    color: '#fff',
    paddingLeft: 10
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    zIndex: 100,
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: THEME.lightGray,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 14,
    zIndex: 100,
    position: 'absolute'
  },
})