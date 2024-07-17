import { PixelRatio } from 'react-native';
import { NativeModules, Platform } from 'react-native';

export const px = (value: number) => PixelRatio.getPixelSizeForLayoutSize(value);


const LINKING_ERROR =
  `The package 'react-native-newinstance-video-player' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const NewinstanceVideoPlayer = NativeModules.NewinstanceVideoPlayer
  ? NativeModules.NewinstanceVideoPlayer
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return NewinstanceVideoPlayer.multiply(a, b);
}


export function exitFullScreen() {
  return NewinstanceVideoPlayer.exitFullScreen();
}


export function enterFullScreen() {
  return NewinstanceVideoPlayer.enterFullScreen();
}
