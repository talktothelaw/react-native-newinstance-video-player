import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  Platform,
  ActivityIndicator,
  type ViewStyle,
} from 'react-native';
import IVSPlayer, { type IVSPlayerRef, LogLevel, type IVSPlayerProps } from 'amazon-ivs-react-native-player';
import styled from 'styled-components/native';
import { Dropdown } from 'react-native-element-dropdown';
import { enterFullScreen, exitFullScreen, px } from './utiles';
import colors from './colors';
import Slider from '@react-native-assets/slider';
import Volume from './Components/Volume';
import PlayPauseButton from './Components/PlayPauseButton';
import FullScreenButton from './Components/FullScreenButton';

interface Quality {
  bitrate: number;
  codecs: string;
  framerate: number;
  height: number;
  name: string;
  width: number;
}

interface DataResponse {
  qualities: Quality[];
  sessionId: string;
  version: string;
}

interface IVSPlayerComponentProps extends IVSPlayerProps {
  isFullScreen?: boolean;
  hideSeekBar?: boolean;
  LeftCustomComponent?: React.ComponentType;
  RightCustomComponent?: React.ComponentType;
  Header?: React.ComponentType;
  leftCustomComponentContainerStyle?: ViewStyle;
  rightCustomComponentContainerStyle?: ViewStyle;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
const isIOS = Platform.OS === 'ios';
const IVSPlayerComponent: React.FC<IVSPlayerComponentProps> = ({
                                                                 onQualityChange,
                                                                 streamUrl,
                                                                 autoplay = true,
                                                                 loop = true,
                                                                 hideSeekBar = false,
                                                                 logLevel = LogLevel.IVSLogLevelError,
                                                                 muted = false,
                                                                 paused: initialPaused = false,
                                                                 playbackRate = 1.0,
                                                                 volume: defaultVolume = 1.0,
                                                                 quality: initialQuality,
                                                                 autoMaxQuality,
                                                                 autoQualityMode = true,
                                                                 onVideoStatistics,
                                                                 maxBitrate,
                                                                 liveLowLatency,
                                                                 rebufferToLive = false,
                                                                 style,
                                                                 onPipChange,
                                                                 onTimePoint,
                                                                 resizeMode,
                                                                 Header,
                                                                 pipEnabled,
                                                                 onRebuffering, onLiveLatencyChange,
                                                                 onError, onLoadStart,
                                                                 onTextMetadataCue,
                                                                 onSeek,
                                                                 initialBufferDuration,
                                                                 isFullScreen: isInitFullScreen = false,
                                                                 leftCustomComponentContainerStyle,
                                                                 rightCustomComponentContainerStyle,
                                                                 LeftCustomComponent,
                                                                 RightCustomComponent,
                                                               }) => {
  const mediaPlayerRef = useRef<IVSPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(initialPaused);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<null | Quality | undefined>(initialQuality || null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const [volume, setVolume] = useState(defaultVolume);
  const [isFullScreen, setIsFullScreen] = useState(isInitFullScreen);
  const [isBuffering, setIsBuffering] = useState(false); // Add state for buffering

  const handleUserInteraction = () => {
    showControls();
  };

  const handleSliderValueChange = (value: number) => {
    handleUserInteraction();
    mediaPlayerRef.current?.seekTo(value);
  };

  const togglePlayPause = () => {
    handleUserInteraction();
    setPaused(!paused);
  };

  const showControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    resetControlsTimeout();
  };

  useEffect(() => {
    setPaused(initialPaused)
  }, [initialPaused]);

  const handleFullScreen = () => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!isInitFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  }, [isInitFullScreen]);

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      hideControls();
    }, 3000);
  };

  const handleQualityChange = (item: Quality) => {
    setSelectedQuality(item);
  };

  const handleData = (data: DataResponse) => {
    if (data && data.qualities) {
      setQualities(data.qualities);
      const defaultQuality = data?.qualities[0];
      setSelectedQuality(defaultQuality);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  const handleVolumeValueChange = (value: number) => {
    handleUserInteraction();
    setVolume(value);
  };

  const handleBuffering = (buffering: boolean) => {
    if (onRebuffering) {
      onRebuffering();
    }
    setIsBuffering(buffering);
  };
  const handleError = (error: string) => {
    if (onError) {
      onError(error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handleUserInteraction}>
      <Container>
        <IVSPlayerWrapper>
          <IVSPlayer
            ref={mediaPlayerRef}
            streamUrl={streamUrl}
            autoplay={autoplay}
            loop={loop}
            logLevel={logLevel}
            muted={muted}
            paused={paused}
            playbackRate={playbackRate}
            volume={volume}
            quality={selectedQuality}
            autoMaxQuality={autoMaxQuality}
            autoQualityMode={autoQualityMode}
            maxBitrate={maxBitrate}
            liveLowLatency={liveLowLatency}
            rebufferToLive={rebufferToLive}
            onRebuffering={() => handleBuffering(true)}
            onError={handleError}
            onLiveLatencyChange={onLiveLatencyChange}
            onData={(data: DataResponse) => handleData(data)}
            onVideoStatistics={onVideoStatistics}
            onPlayerStateChange={(state) => handleBuffering(state === 'Buffering')}
            onLoad={(loadedDuration) => setDuration(loadedDuration || 0)}
            onLoadStart={onLoadStart}
            onProgress={(position) => setCurrentTime(position)}
            onTimePoint={onTimePoint}
            resizeMode={resizeMode}
            pipEnabled={pipEnabled}
            onTextMetadataCue={onTextMetadataCue}
            onDurationChange={(newDuration) => isFinite(newDuration || 0) && setDuration(newDuration || 0)}
            onSeek={onSeek}
            onQualityChange={onQualityChange}
            onPipChange={onPipChange}
            initialBufferDuration={initialBufferDuration}
            style={{ backgroundColor: '#000', ...style }}
          />
          {isBuffering && (
            <BufferingOverlay>
              <ActivityIndicator size="large" color="#fff" />
              <BufferingText>Loading...</BufferingText>
            </BufferingOverlay>
          )}
          <AnimatedControls style={{ opacity: controlsOpacity, zIndex: 9 }}>
            <Overlay>
              <Top>
                <TopInner>
                  {!isFullScreen && <View style={{ marginTop: px(20) }} />}
                  {Header && <Header />}
                </TopInner>
                <CustomComponentContainer style={{ justifyContent: 'flex-end' }}>
                  <Volume volume={volume} handleVolumeValueChange={handleVolumeValueChange} />
                </CustomComponentContainer>
              </Top>

              <Bottom>
                <CustomComponentContainer>
                  <ContentOne style={[{ left: px((3)) }, leftCustomComponentContainerStyle]}>
                    {LeftCustomComponent && <LeftCustomComponent />}
                  </ContentOne>
                  <ContentOne style={rightCustomComponentContainerStyle}>
                    {RightCustomComponent && <RightCustomComponent />}
                  </ContentOne>
                </CustomComponentContainer>
                {!hideSeekBar && <BottomSectionOne>
                  <PlayTime>{formatTime(currentTime)}</PlayTime>
                  <Slider
                    style={{ flex: 1, zIndex: 999, marginLeft: px(3), marginRight: px(3) }}
                    minimumValue={0}
                    maximumValue={duration}
                    thumbTintColor="rgba(211,211,211,.8)"
                    value={currentTime}
                    slideOnTap
                    onValueChange={handleSliderValueChange}
                    minimumTrackTintColor="rgba(211,211,211,.8)"
                    maximumTrackTintColor="rgba(211,211,211,0.44)"
                  />
                  <PlayTime>{formatTime(duration)}</PlayTime>
                </BottomSectionOne>}
                <BottomSectionTwo>
                  <FullScreenContainer>
                    <FullScreenButton isFullScreen={isFullScreen || isInitFullScreen} onPress={handleFullScreen} />
                  </FullScreenContainer>
                  <PlayButtonContainer>
                    <PlayPauseButton togglePlayPause={togglePlayPause} paused={paused} />
                  </PlayButtonContainer>
                  <DropDownContainer>
                    <Dropdown
                      data={qualities}
                      labelField="name"
                      valueField="name"
                      value={selectedQuality}
                      onChange={(item: Quality) => handleQualityChange(item)}
                      placeholder="Quality"
                      placeholderStyle={{ color: 'white', fontSize: 10 }}
                      selectedTextStyle={{ color: 'white', fontSize: 13 }}
                      containerStyle={{ backgroundColor: '#fff' }}
                      style={{
                        backgroundColor: 'rgba(124,122,122,0.5)',
                        padding: px(3),
                        borderRadius: 5,
                        width: px(30),
                      }}
                      itemTextStyle={{ color: 'black' }}
                    />
                  </DropDownContainer>
                </BottomSectionTwo>
              </Bottom>
            </Overlay>
          </AnimatedControls>
        </IVSPlayerWrapper>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.View`
  flex: 1;
  width: 100%;
`;

const PlayTime = styled.Text`
  color: ${colors.white};
`;

const DropDownContainer = styled.View``;

const PlayButtonContainer = styled.View`
  flex: 1;
  align-self: center;
  left: 20%;
`;

const FullScreenContainer = styled.View`
  flex: 1;
`;


const IVSPlayerWrapper = styled.View`
  flex: 1;
  position: relative;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: space-between;
  padding-left: ${px(4)}px;
  padding-right: ${px(3)}px;
  z-index: 1;
`;

const Top = styled.View`

`;

const TopInner = styled.View`
  margin-top: ${px(8)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;


const Bottom = styled.View`
  justify-content: flex-end;
`;

const AnimatedControls = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const BottomSectionOne = styled.View`
  flex-direction: row;
  align-items: center;
  z-index: 99999;
`;

const BottomSectionTwo = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${px(isIOS ? 7 : 3)}px;
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
  z-index: 2;
`;

const BufferingText = styled.Text`
  color: ${colors.white};
  margin-top: 10px;
`;


const CustomComponentContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const ContentOne = styled.View`
  height: 80%;
  min-width: ${px(20)}px;
  margin-bottom: ${px(10)}px;
`;
export default IVSPlayerComponent;
