import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME, fontFamily } from '../theme/appTheme';
import Video from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';

export function AdFileUploadScreen({ route, navigation }) {

  let { add_id, user_id } = route?.params;
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enabledButton, setEnabledButton] = useState(true);

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };
  const removeVideo = () => {
    setSelectedVideo(null)
  };

  const handleImagePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true
      });
      if (result) {
        // `result.uri` contains the URI of the selected image
        console.log('Selected image:', result);
        setSelectedImages([...selectedImages, ...result]);

        // You can now use the selected image in your app
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        console.error('DocumentPicker Error:', error);
        // Handle other errors that may occur during the selection process
      }
    }
  };

  const handleAddMorePhotos = async () => {
    // // Open the image picker for the user to select additional images
    // ImagePicker.openPicker({
    //   multiple: true,
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    //   mediaType: 'photo',
    //   maxFiles: '12',
    // })
    //   .then(newImages => {
    //     // Append the new images to the existing selectedImages array
    //     setSelectedImages([...selectedImages, ...newImages]);
    //   })
    //   .catch(error => {
    //     if (error.message !== 'User cancelled image selection') {
    //       console.error('Error selecting images:', error);
    //       // Handle other errors that may occur during the selection process
    //     }
    //   });
    //   ///========//

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true
      });
      if (result) {
        // `result.uri` contains the URI of the selected image
        console.log('Selected image:', result);
        setSelectedImages([...selectedImages, ...result]);
        // You can now use the selected image in your app
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        console.error('DocumentPicker Error:', error);
        // Handle other errors that may occur during the selection process
      }
    }
  };

  const handleVideoPicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
        allowMultiSelection: false
      });
      if (result) {
        setSelectedVideo(result[0]);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        console.error('DocumentPicker Error:', error);
        // Handle other errors that may occur during the selection process
      }
    }
  };
  // on submit
  const onUploadFile = async () => {
    setLoading(true)
    const formData = new FormData();
    for (const image of selectedImages) {
      formData.append('image[]', {
        uri: image.uri,
        name: 'image.jpg',
        type: image.type,
      });
    }
    formData.append('add_id', add_id);
    formData.append('user_id', user_id);
    formData.append('video', {
      uri: selectedVideo.uri,
      name: 'video.mp4',
      type: selectedVideo.type,
    })
    try {
      const imgResponse = await axios.post('https://fabkw.com/api/storeImg', formData, {
        headers: {
          "Accept": 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false)
      navigation.replace('DrawerMenu', { screen: 'ProfileScreen' })
    } catch (error) {
      console.error('image upload error:', error);
    }
  }
  const AddImagesView = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => handleImagePicker()} style={styles.imageViewCongtainer} activeOpacity={0.8} >
          <Icon name={'camera-plus-outline'} size={24} color={THEME.black} />
          <Text style={styles.addText}>Upload Images</Text>
        </TouchableOpacity>
        <Text style={[styles.addText, { fontSize: 10, color: THEME.primary, textAlign: 'left', paddingTop: 4 }]}>*You can add upto 12 photos</Text>
      </View>
    )
  }
  const AddVideoView = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => handleVideoPicker()} style={[styles.imageViewCongtainer, { marginTop: 12 }]} activeOpacity={0.8} >
          <Icon name={'video-plus-outline'} size={30} color={THEME.black} />
          <Text style={styles.addText}>Upload video of your Ad</Text>
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    if (selectedImages && selectedVideo) {
      setEnabledButton(false);
    } else {
      setEnabledButton(true);
    }

  }, [selectedImages, selectedVideo])


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 60, justifyContent: 'center' }}>
        <Text style={[styles.title, { textAlign: 'center' }]}>Add Gallery</Text>
      </View>
      <View style={{ paddingTop: 25, paddingHorizontal: 15 }}>
        <View style={styles.imageContainer}>
          <FlatList
            data={selectedImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.imageDirection}>
                <Image
                  source={{ uri: item?.uri }}
                  style={styles.imageSource}
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.closeIcon} onPress={() => removeImage(index)}>
                  <Icon name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
          {selectedImages?.length !== 0 && <Text style={[styles.addText, { fontSize: 10, color: THEME.primary, textAlign: 'left', paddingTop: 4 }]}>*You can add upto 12 photos</Text>}
        </View>
        <View style={styles.inputContainer}>
          {selectedImages?.length > 0 ?
            <TouchableOpacity onPress={() => handleAddMorePhotos()} activeOpacity={0.8} style={{ paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
              <Icon name={'camera-plus-outline'} size={20} color={THEME.lightGray} />
              <Text style={[styles.addText, { paddingLeft: 10, color: '#58adfc' }]}>Add mpre photos</Text>
            </TouchableOpacity>
            :
            <AddImagesView />
          }
          {selectedVideo !== null ?
            <View style={selectedVideo && { paddingHorizontal: 12 }}>
              <View style={styles.videoContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.closeVideoIcon}
                  onPress={() => removeVideo()}
                >
                  <Icon name="close" size={16} color="white" />
                </TouchableOpacity>
                <Video source={{ uri: selectedVideo?.uri }}
                  style={styles.videoSource}
                />
              </View>
            </View> :
            <AddVideoView />}
        </View>
      </View>
      <TouchableOpacity disabled={loading || enabledButton} onPress={() => onUploadFile()} style={[styles.btn, (loading || enabledButton) && { backgroundColor: THEME.lightGray }]} activeOpacity={0.8} >
        <Text style={styles.btnTitle}>{loading ? 'Please wait' : 'Submit'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

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
  btn: {
    backgroundColor: THEME.primary,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    width: "90%",
    alignSelf: 'center',
    marginVertical: 30,
    borderRadius: 8,
    position: 'absolute',
    bottom: 15
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
  imageContainer: {
    width: "100%",
    marginVertical: 4
  },
  imageSource: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginHorizontal: 4,
    borderRadius: 4
  },
  videoSource: {
    width: 120,
    height: 120,
    marginHorizontal: 4,
    borderRadius: 4
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    backgroundColor: THEME.primary, // Background color of the close icon
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    // position: 'relative',
  },
  closeVideoIcon: {
    position: 'absolute',
    top: 0,
    left: 110,
    width: 15,
    height: 15,
    backgroundColor: THEME.primary, // Background color of the close icon
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  btnTitle: {
    fontSize: 14,
    fontFamily: fontFamily.poppins_500,
    color: THEME.white,
    lineHeight: 18,
  },
})
