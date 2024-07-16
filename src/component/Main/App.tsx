import React, { useRef, useState, useEffect } from 'react';
import { AppState, Animated, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import IVSPlayer, { type IVSPlayerRef, LogLevel,type IVSPlayerProps } from 'amazon-ivs-react-native-player';
import styled from 'styled-components/native';
import { Dropdown } from 'react-native-element-dropdown';
import { enterFullScreen, exitFullScreen, px } from './utiles';
import IsLive from './Components/IsLive';
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
  title?: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const IVSPlayerComponent: React.FC<IVSPlayerComponentProps> = ({
                                                                 streamUrl,
                                                                 autoplay = true,
                                                                 loop = true,
                                                                 title,
                                                                 logLevel = LogLevel.IVSLogLevelError,
                                                                 muted = false,
                                                                 paused: initialPaused = false,
                                                                 playbackRate = 1.0,
                                                                 volume: defaultVolume = 1.0,
                                                                 quality: initialQuality,
                                                                 autoMaxQuality,
                                                                 autoQualityMode = true,
                                                                 maxBitrate,
                                                                 liveLowLatency,
                                                                 rebufferToLive = false,
                                                                 style,
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground, handle any necessary actions
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSliderValueChange = (value: number) => {
    mediaPlayerRef.current?.seekTo(value);
  };

  const togglePlayPause = () => {
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

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      hideControls();
    }, 3000);
  };

  const handleUserInteraction = () => {
    showControls();
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
    setVolume(value);
  };

  const PlayerContainer = !isFullScreen ? SafeAreaView : React.Fragment;
  const containerProps = isFullScreen ? {} : { style: { flex: 1 } };

  return (
    <TouchableWithoutFeedback onPress={handleUserInteraction}>
      <Container>
        <>
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
              onRebuffering={() => console.log('rebuffering...')}
              onError={(error) => console.log('error', error)}
              onLiveLatencyChange={(liveLatency) => console.log(`live latency changed: ${liveLatency}`)}
              onData={(data: DataResponse) => handleData(data)}
              onVideoStatistics={(video) => console.log('video bitrate', video.bitrate)}
              onPlayerStateChange={(state) => console.log(`state changed: ${state}`)}
              onLoad={(loadedDuration) => setDuration(loadedDuration || 0)}
              onLoadStart={() => console.log(`load started`)}
              onProgress={(position) => setCurrentTime(position)}
              onTimePoint={(timePoint) => console.log('time point', timePoint)}
              onTextMetadataCue={(textMetadataCue) => console.log('text metadata cue text', textMetadataCue.text)}
              onDurationChange={(newDuration) => isFinite(newDuration || 0) && setDuration(newDuration || 0)}
              onSeek={(newPosition) => console.log('new position', newPosition)}
              onQualityChange={(newQuality) => console.log(`quality changed: ${newQuality?.name}`)}
              onPipChange={(isActive) => console.log(`picture in picture changed - isActive: ${isActive}`)}
              style={{ backgroundColor: '#000', ...style }}
            />
            <AnimatedControls style={{ opacity: controlsOpacity }}>
              <Overlay>
                <Top>
                  <IsLive />
                  <Title numberOfLines={1} ellipsizeMode="tail">{title}</Title>
                  <Volume volume={volume} handleVolumeValueChange={handleVolumeValueChange} />
                </Top>
                <Bottom>
                  <BottomSectionOne>
                    <PlayTime>{formatTime(currentTime)}</PlayTime>
                    <Slider
                      style={{ width: '80%' }}
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
                  </BottomSectionOne>
                  <BottomSectionTwo>
                    <FullScreenButton isFullScreen={isFullScreen} onPress={handleFullScreen} />
                    <PlayPauseButton togglePlayPause={togglePlayPause} paused={paused} />
                    <Dropdown
                      data={qualities}
                      labelField="name"
                      valueField="name"
                      value={selectedQuality}
                      onChange={(item: Quality) => handleQualityChange(item)}
                      placeholder="Quality"
                      placeholderStyle={{ color: 'white', fontSize: 10 }}
                      selectedTextStyle={{ color: 'white' }}
                      containerStyle={{ backgroundColor: '#fff' }}
                      style={{ backgroundColor: 'rgba(124,122,122,0.5)', padding: 10, borderRadius: 5, width: 100 }}
                      itemTextStyle={{ color: 'black' }}
                    />
                  </BottomSectionTwo>
                </Bottom>
              </Overlay>
            </AnimatedControls>
          </IVSPlayerWrapper>
        </>
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
  margin-right: ${px(5)}px;
  margin-left: ${px(3)}px;
  top: 1px;
`;
const StyledSafeAreaView = styled(SafeAreaView)<{ isFullScreen: boolean }>`
  flex: 1;
  ${({ isFullScreen }) => isFullScreen && `
    padding-top: 0;
    padding-bottom: 0;
  `}
`;
const Title = styled.Text`
  color: ${colors.white};
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Bottom = styled.View``;

const AnimatedControls = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const BottomSectionOne = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const BottomSectionTwo = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${px(5)}px;
`;

export default IVSPlayerComponent;
