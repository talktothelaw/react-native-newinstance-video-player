import styled from 'styled-components/native';
import { Image, TouchableOpacity } from 'react-native';
import { px } from '../utiles';

const Play = require('../../images/play.png');
const Pause = require('../../images/pause.png');

interface Props {
  togglePlayPause: () => void;
  paused: boolean
}


const PlayPauseButtonCustom = ({togglePlayPause, paused}:Props) => {
  return (
    <PlayPauseButtonContainer>
      <PlayPauseButton onPress={togglePlayPause}>
        <PlayPauseIcon resizeMode="stretch" source={paused ? Play : Pause} />
      </PlayPauseButton>
    </PlayPauseButtonContainer>
  );
};

export default PlayPauseButtonCustom;

const PlayPauseButtonContainer = styled.View`
  justify-content: center;
`;

const PlayPauseButton = styled(TouchableOpacity)`
  padding: ${px(2)}px;
`;

const PlayPauseIcon = styled(Image)`
  width: ${px(10)}px;
  height: ${px(10)}px;
`;
