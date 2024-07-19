import { StyleSheet, View } from 'react-native';
import Player from 'react-native-newinstance-video-player';

export default function App() {
  // const [result, setResult] = useState<number | undefined>();

  // useEffect(() => {
  //   multiply(3, 7).then(setResult);
  // }, []);
// const Box = ()=> {
//   return <View style={{height:100, width:100, backgroundColor:"green"}}/>
// }
  return (
    <View style={styles.container}>
      <Player
        hidePlayButton
        // RightCustomComponent={Box}
        // hideSeekBar
        // autoplay={false}
        streamUrl={
          'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8'
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
