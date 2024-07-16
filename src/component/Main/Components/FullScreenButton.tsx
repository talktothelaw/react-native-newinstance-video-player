import React from 'react';
import styled from 'styled-components/native';
import { px } from '../utiles';

interface Props {
  onPress: () => void
  isFullScreen: boolean
}

const fullscreen = require('../../images/fullscreen.png');
const exitFullscreen = require('../../images/exit-fullscreen.png');
const FullScreenButton: React.FC<Props> = ({onPress, isFullScreen}) => {


  return (
    <ButtonContainer onPress={onPress}>
      <ButtonImage source={isFullScreen ? exitFullscreen  : fullscreen} />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.TouchableOpacity`
  background-color: rgba(0, 0, 0, 0.5);
`;

const ButtonImage = styled.Image`
  width: ${px(7)}px;
  height: ${px(7)}px;
`;

export default FullScreenButton;
