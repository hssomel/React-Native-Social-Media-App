import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import GradientButton from '../components/GradientButton';
import { uploadProfileVid } from '../actions/userProfileActions';
import YouTubeModal from '../components/YouTubeModal';
import YouTubeVideo from '../components/YouTubeVideo';

SetupProfileVideo = props => {
  //Initial State
  const [modalOpen, setModalOpen] = useState(false);
  const [userKey] = useState(props.navigation.getParam('userKey', null));
  const [youtubeURL, setYoutubeURL] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [finalURL, setFinalURL] = useState(null);
  const [allowYoutube, setAllowYoutube] = useState(false);
  const [fromSettings] = useState(true);

  const sliceString = () => {
    return new Promise((resolve, reject) => {
      const slice = youtubeURL.slice(-11);
      setFinalURL(slice);
      const time = Number(startTime);
      setStartTime(time);
      resolve(slice);
    });
  };

  const handlePress = () => {
    setModalOpen(false);
    sliceString()
      .then(res => {
        if (res) {
          setAllowYoutube(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const reUpload = () => {
    setModalOpen(true);
    setAllowYoutube(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const uploadVideo = () => {
    uploadProfileVid(userKey, finalURL, startTime);
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        {!allowYoutube ? (
          <View style={styles.containerOne}>
            <View style={{ alignItems: 'flex-start' }}>
              <Icon
                name="ios-arrow-round-back"
                size={36}
                color="orangered"
                onPress={goBack}
              />
            </View>
            <Text style={styles.titleText}>Upload a profile video</Text>
            <Text style={{ fontSize: 18 }}>
              Link to a youtube video of you performing! Then select a start
              time that showcases your best 15 seconds!
            </Text>
          </View>
        ) : (
          <View style={styles.containerTwo}>
            <Text style={{ fontSize: 32, marginBottom: 5, color: '#424949' }}>
              Preview Video
            </Text>
            <YouTubeVideo
              style={{ height: '75%', width: '100%' }}
              newURL={finalURL}
              newStartTime={startTime}
              userKey={userKey}
              fromSettings={fromSettings}
            />
          </View>
        )}
      </View>
      <View style={styles.bottomContainer}>
        {startTime && finalURL && allowYoutube && (
          <Button
            onPress={() => uploadVideo()}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            title="Confirm profile video"
            titleStyle={styles.buttonText}
          />
        )}
        {allowYoutube ? (
          <GradientButton onPress={reUpload} title="Reupload youtube link" />
        ) : (
          <Avatar
            size="large"
            icon={{
              name: 'md-camera',
              type: 'ionicon',
              size: 72,
              color: 'orangered',
            }}
            containerStyle={{
              height: '50%',
              width: '50%',
            }}
            onPress={() => setModalOpen(true)}
            overlayContainerStyle={styles.cameraIcon}
          />
        )}
      </View>
      <YouTubeModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        handlePress={handlePress}
        setYoutubeURL={setYoutubeURL}
        setStartTime={setStartTime}
      />
    </View>
  );
};

export default SetupProfileVideo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  topContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flex: 1,
    paddingTop: 10,
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  containerOne: {
    paddingTop: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingRight: 15,
    paddingLeft: 15,
  },
  containerTwo: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: '5%',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  buttonStyle: {
    height: 50,
    width: '85%',
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'orangered',
  },
  buttonText: {
    color: 'orangered',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
  },
  titleText: {
    fontSize: 32,
    marginBottom: 15,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 15,
  },
  cameraIcon: {
    borderColor: 'orangered',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
});