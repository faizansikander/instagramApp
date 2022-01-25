import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity ,Button ,Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';

export default function Add({navigation}) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const  cameraStatus  = await Camera.requestPermissionsAsync();
            console.log(cameraStatus);
            setHasCameraPermission(cameraStatus.status === 'granted');

           const  galleryStatus = await ImagePicker.requestCameraRollPermissionAsync();
           setHasGalleryPermission(galleryStatus.status === 'granted');

        })();
    }, []);

    const takePicture = async () => {
         // console.log(camera);

          if(camera) {
              const data = await camera.takePictureAsync(null);
              console.log(data.uri);
              setImage(data.uri);
          }


    }

    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


    if (hasCameraPermission === null || hasGalleryPermission === false) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera 
                ref= {ref => setCamera(ref)}
                style={styles.fixedRatio} 
                type={type} 
                ratio={'1:1'}
                />
            </View>

            <Button
                style={styles.button}
                title="Flip Image"
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
                <Text style={styles.text}> Flip </Text>
                </Button>
            
            <Button title="Take Picture" onPress={() => takePicture()} />

            <Button title="Pick Image From Gallery" onPress={() => pickImage()} />

            <Button title="Save" onPress={() => navigation.navigate('Save',{image})} />



            {image && <Image source={{uri: image}} style={{flex: 1 ,backgroundColor: 'red'}}/>}
            
        </View> 
    )};   

const styles = StyleSheet.create({
            container: {
                flex: 1,
            },
            camera: {
                flex: 1,
            },
            buttonContainer: {
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                margin: 20,
            },
            button: {
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
            },
            text: {
                fontSize: 18,
                color: 'white',
            },

            cameraContainer:{
                flex: 1        
            },
            fixedRatio: {
                flex: 1,
                aspectRatio: 1
            }
        });