import { StyleSheet, View } from 'react-native';
import Player from 'react-native-newinstance-video-player';

export default function App() {
  // const [result, setResult] = useState<number | undefined>();

  // useEffect(() => {
  //   multiply(3, 7).then(setResult);
  // }, []);

  return (
    <View style={styles.container}>
      <Player
        // autoplay={false}
        streamUrl={
          'https://sgp1.vultrobjects.com/nnc-live/videos/shoutout_from_friends/master.m3u8'
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
