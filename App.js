import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, Modal  } from 'react-native';
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {

  const [sound, setSound] = useState();
  const [volume, setVolume] = useState(1)
  const [cfgModalVisible, setCfgModalVisible] = useState(false)

  useEffect(() => {
    async function loadSound() {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('./assets/media/sound.mp3')
      );
      setSound(newSound);
      await newSound.setIsLoopingAsync(true);

      // Carrega o volume salvo do AsyncStorage
      const savedVolume = await AsyncStorage.getItem('volume');
      if (savedVolume !== null) {
        const volumeValue = parseFloat(savedVolume);
        setVolume(volumeValue);
        await newSound.setVolumeAsync(volumeValue); // Define o volume inicial
      } else {
        await newSound.setVolumeAsync(volume); // Usa o volume padrão se não houver valor salvo
      }

    }
    loadSound();

    // Descarrega o som ao desmontar o componente
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(volume);
      AsyncStorage.setItem('volume', volume.toString()); // Salva o valor no AsyncStorage
    }
  }, [volume])

  async function playSound() {
    if (sound) {
      await sound.playFromPositionAsync(0)
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync()
    }
  }

  const img_cfg = require("./assets/img/cfg.png")

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.btn_cfg} onPress={()=> setCfgModalVisible(true) }>
        <ImageBackground source={ img_cfg } style={{ width:'100%', height:'100%' }}></ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} activeOpacity={0.9} onPressIn={playSound} onPressOut={stopSound}></TouchableOpacity>

      <Modal visible={cfgModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalIn} activeOpacity={1} onPress={()=> setCfgModalVisible(false) }>
          <View style={styles.modalInContent} onStartShouldSetResponder={() => true}>
            <Text>volume:</Text>
            <View style={styles.sliderContainer}>
              <Slider minimumValue={0} maximumValue={1} value={volume} onValueChange={(value) => setVolume(value)}/>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      
    </View>
  );
}

const { width, height } = Dimensions.get('window')
function btnDim() {
  var val
  if(width > height) {
    val = height
  }else{
    val = width
  }
  return val * 0.55
}

var color_bg_light = '#d1cfcb'
var color_bg_dk = '#1f1e1e'

var color_btn_light = '#ed6b3b'
var color_btn_dk = '#b85632'

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: color_bg_light
  },
  button:{
    width: btnDim(),
    height:  btnDim(),
    backgroundColor: color_btn_light,
    borderRadius: 23,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
  },
  btn_cfg:{
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 40,
    right: 10,
  },
  modalIn:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInContent:{
    flex:0,
    padding:10,
    width: width * 0.8,
    backgroundColor:'whitesmoke',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderContainer:{
    width:'80%',
    height:40,
    justifyContent:'center'
  }
}) // cfg: sound tone, dark/light, volume, table with words an afphabet