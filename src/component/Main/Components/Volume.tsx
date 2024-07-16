import React from 'react';
import Slider from '@react-native-assets/slider';
import styled from 'styled-components/native';
import { px } from '../utiles';
const AudioIcon = require('../../images/volume.png');
interface VolumeProps {
  volume: number;
  handleVolumeValueChange: (value: number) => void;
}

const Volume: React.FC<VolumeProps> = ({ volume, handleVolumeValueChange }) => {
  return (
    <Container>
      <Image source={AudioIcon} resizeMode="stretch" style={{ width:20, height:20 }} />
      <Slider
        style={{ width:60 }}
        minimumValue={0.0}
        maximumValue={1.0}
        slideOnTap
        thumbTintColor="rgba(211,211,211,.8)"
        value={volume}
        onValueChange={handleVolumeValueChange}
        minimumTrackTintColor="rgba(211,211,211,.8)"
        maximumTrackTintColor="rgba(211,211,211,0.44)"
      />
    </Container>
  );
};
const Container = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;

`
const Image = styled.Image`
  margin-right: ${px(1)}px;
`

export default Volume;
