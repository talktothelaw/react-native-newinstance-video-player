import React, { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  type ViewStyle,
} from 'react-native';
import Video, { type VideoRef, type ReactVideoProps } from 'react-native-video';
import styled from 'styled-components/native';
import { enterFullScreen, exitFullScreen, px } from '../utiles';
import colors from '../colors';


export interface VideoPlayerComponentProps extends ReactVideoProps {
  isFullScreen?: boolean;
  hideSeekBar?: boolean;
  hidePlayButton?: boolean;
  LeftCustomComponent?: React.ComponentType;
  RightCustomComponent?: React.ComponentType;
  Header?: React.ComponentType;
  leftCustomComponentContainerStyle?: ViewStyle;
  rightCustomComponentContainerStyle?: ViewStyle;
  streamUrl: string;
}

const AndroidPlayer: React.FC<VideoPlayerComponentProps> = ({
                                                                     source,
                                                                     streamUrl,
                                                                     onError,
                                                                     onLoad,
                                                                     onProgress,
                                                                     paused: initialPaused = false,
                                                                     muted = false,
                                                                     resizeMode,
                                                                     Header,
                                                                     leftCustomComponentContainerStyle,
                                                                     rightCustomComponentContainerStyle,
                                                                     LeftCustomComponent,
                                                                     RightCustomComponent,
                                                                   }) => {
  const mediaPlayerRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(initialPaused);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true)
  useEffect(() => {
    setPaused(initialPaused);
  }, [initialPaused]);

  const handleBuffering = (buffering: boolean) => {
    setIsBuffering(buffering);
  };

  const handleFullScreen = (isFullScreen: boolean) => {
    if (isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };


  return (
    <Container>
      {Header && <Header />}
      <VideoPlayerWrapper>
        <Video
          fullscreenAutorotate={false}
          onFullscreenPlayerWillPresent={() => handleFullScreen(true)}
          onFullscreenPlayerDidDismiss={() => handleFullScreen(false)}
          ref={mediaPlayerRef}
          onControlsVisibilityChange={({isVisible})=> setShowControls(isVisible) }
          source={source ? source : { uri: streamUrl }}
          paused={paused}
          muted={muted}
          resizeMode={resizeMode}
          onBuffer={({ isBuffering }) => handleBuffering(isBuffering)}
          onError={onError}
          onLoad={onLoad}
          onProgress={onProgress}
          controls
          style={{ backgroundColor: '#000', flex: 1 }}
        />
        {isBuffering && (
          <BufferingOverlay>
            <ActivityIndicator size="large" color="#fff" />
            <BufferingText>Loading...</BufferingText>
          </BufferingOverlay>
        )}
        {showControls &&<OverlayContainer>
          {LeftCustomComponent && (
            <LeftComponentContainer style={leftCustomComponentContainerStyle}>
              <LeftCustomComponent />
            </LeftComponentContainer>
          )}
          {RightCustomComponent && (
            <RightComponentContainer style={rightCustomComponentContainerStyle}>
              <RightCustomComponent />
            </RightComponentContainer>
          )}
        </OverlayContainer>}
      </VideoPlayerWrapper>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  width: 100%;
`;

const VideoPlayerWrapper = styled.View`
  flex: 1;
  position: relative;
`;

const BufferingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index:9;
`;

const BufferingText = styled.Text`
  color: ${colors.white};
  margin-top: 10px;
`;

const OverlayContainer = styled.View`
  position: absolute;
  bottom: ${px(87)}px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  z-index: 9999;
`;

const LeftComponentContainer = styled.View`
  flex: 1;
`;

const RightComponentContainer = styled.View`
  flex: 1;
  align-items: flex-end;
`;

export default AndroidPlayer;
