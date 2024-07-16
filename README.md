// src/IVSPlayerComponent.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Button, StyleProp, ViewStyle } from 'react-native';
import IVSPlayer, { IVSPlayerRef, LogLevel, Quality, Source } from 'amazon-ivs-react-native-player';

interface IVSPlayerComponentProps {
streamUrl?: string;
autoplay?: boolean;
loop?: boolean;
logLevel?: LogLevel;
muted?: boolean;
paused?: boolean;
playbackRate?: number;
volume?: number;
quality?: Quality | null;
autoMaxQuality?: Quality;
autoQualityMode?: boolean;
maxBitrate?: number;
liveLowLatency?: boolean;
rebufferToLive?: boolean;
onRebuffering?: () => void;
onError?: (error: string) => void;
onLiveLatencyChange?: (liveLatency: number) => void;
onData?: ({ qualities, version, sessionId }: { qualities: Quality; version: string; sessionId: string }) => void;
onVideoStatistics?: ({ duration, bitrate, framesDropped, framesDecoded }: { duration: number | null; bitrate: number; framesDropped: number; framesDecoded: number }) => void;
onPlayerStateChange?: (state: any) => void;
onLoad?: (duration: number | number) => void;
onLoadStart?: () => void;
onProgress?: (position: number) => void;
initialBufferDuration?: number;
progressInterval?: number;
onTimePoint?: (position: number) => number;
breakpoints?: number[];
onTextCue?: (textCue: any) => void;
onTextMetadataCue?: (textMetadataCue: any) => void;
onDurationChange?: (duration: number | null) => void;
onSeek?: (position: number) => void;
onQualityChange?: (quality: Quality) => void;
onPipChange?: (isActive: boolean) => void;
resizeMode?: 'aspectFill' | 'aspectFit' | 'aspectZoom';
style?: StyleProp<ViewStyle>;
}

const IVSPlayerComponent: React.FC<IVSPlayerComponentProps> = ({
streamUrl,
autoplay = true,
loop = true,
logLevel = LogLevel.ERROR,
muted = false,
paused = false,
playbackRate = 1.0,
volume = 1.0,
quality,
autoMaxQuality,
autoQualityMode = true,
maxBitrate,
liveLowLatency,
rebufferToLive = false,
onRebuffering,
onError,
onLiveLatencyChange,
onData,
onVideoStatistics,
onPlayerStateChange,
onLoad,
onLoadStart,
onProgress,
initialBufferDuration,
progressInterval = 1,
onTimePoint,
breakpoints = [],
onTextCue,
onTextMetadataCue,
onDurationChange,
onSeek,
onQualityChange,
onPipChange,
resizeMode,
style,
}) => {
const mediaPlayerRef = useRef<IVSPlayerRef>(null);
const [sources, setSources] = useState<Source[]>([]);

useEffect(() => {
const { current } = mediaPlayerRef;
if (!current) return;

    // Preloading example URLs for demonstration
    const prefetch = [
      current.preload('https://example.com/stream0.m3u8'),
      current.preload('https://example.com/stream1.m3u8'),
      current.preload('https://example.com/stream2.m3u8'),
    ];
    setSources(prefetch);

    return () => {
      prefetch.forEach((source) => current.releaseSource(source));
    };
}, []);

const handlePlay = () => mediaPlayerRef.current?.play();
const handlePause = () => mediaPlayerRef.current?.pause();
const handleSeekTo = (position: number) => mediaPlayerRef.current?.seekTo(position);
const togglePip = () => mediaPlayerRef.current?.togglePip();

return (
<View style={style}>
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
quality={quality}
autoMaxQuality={autoMaxQuality}
autoQualityMode={autoQualityMode}
maxBitrate={maxBitrate}
liveLowLatency={liveLowLatency}
rebufferToLive={rebufferToLive}
onRebuffering={onRebuffering}
onError={onError}
onLiveLatencyChange={onLiveLatencyChange}
onData={onData}
onVideoStatistics={onVideoStatistics}
onPlayerStateChange={onPlayerStateChange}
onLoad={onLoad}
onLoadStart={onLoadStart}
onProgress={onProgress}
initialBufferDuration={initialBufferDuration}
progressInterval={progressInterval}
onTimePoint={onTimePoint}
breakpoints={breakpoints}
onTextCue={onTextCue}
onTextMetadataCue={onTextMetadataCue}
onDurationChange={onDurationChange}
onSeek={onSeek}
onQualityChange={onQualityChange}
onPipChange={onPipChange}
resizeMode={resizeMode}
/>
<Button onPress={handlePlay} title="Play" />
<Button onPress={handlePause} title="Pause" />
<Button onPress={() => handleSeekTo(15)} title="Seek to 15s" />
<Button onPress={togglePip} title="Toggle PiP" />
{sources.map((source, i) => (
<Button key={i} onPress={() => mediaPlayerRef.current?.loadSource(source)} title={`Load URL${i}`} />
))}
</View>
);
};

export default IVSPlayerComponent;
