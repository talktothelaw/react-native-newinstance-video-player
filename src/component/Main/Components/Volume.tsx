import React, { useState, useEffect } from 'react';
import Slider from '@react-native-assets/slider';
import styled from 'styled-components/native';
import { px } from '../utiles';
const AudioIcon = require('../../images/volume.png');
const MuteIcon = require('../../images/mute.png');

interface VolumeProps {
  volume: number;
  handleVolumeValueChange: (value: number) => void;
}

const Volume: React.FC<VolumeProps> = ({ volume, handleVolumeValueChange }) => {
  const [isMute, setIsMute] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);

  useEffect(() => {
    if (isMute) {
      handleVolumeValueChange(0);
    } else {
      handleVolumeValueChange(currentVolume);
    }
  }, [isMute, currentVolume]);

  const handleVolumeUpdate = (value: number) => {
    setCurrentVolume(value);
    if (isMute && value > 0) {
      setIsMute(false);
    }
    handleVolumeValueChange(value);
  };

  const handleMute = () => {
    setIsMute(!isMute);
  };

  return (
    <Container>
      <SliderContainer>
        <Slider
          inverted
          style={{ height: 70 }}
          minimumValue={0.0}
          maximumValue={1.0}
          slideOnTap
          vertical
          thumbTintColor="#fff"
          value={isMute ? 0 : currentVolume}
          onValueChange={handleVolumeUpdate}
          minimumTrackTintColor="#eaeaea"
          maximumTrackTintColor="#fff"
        />
      </SliderContainer>
      <IconContainer onPress={handleMute}>
        <Image source={isMute ? MuteIcon : AudioIcon} resizeMode="stretch" style={{ width: 20, height: 20 }} />
      </IconContainer>
    </Container>
  );
};

const Container = styled.View`
  width: ${px(10)}px;
  align-self: flex-end;
  align-items: center;
  padding: ${px(3)}px;
  padding-top: ${px(4)}px;
  justify-content: center;
  margin-right: ${px(5)}px;
  background-color: rgba(134, 134, 134, 0.80);
  border-radius: ${px(2)}px;
`;

const SliderContainer = styled.View``;

const IconContainer = styled.TouchableOpacity`
  margin-top: ${px(3)}px;
`;

const Image = styled.Image`
  margin-left: ${px(1)}px;
`;

export default Volume;
