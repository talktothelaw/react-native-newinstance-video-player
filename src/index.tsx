import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import IOSPlayer, { type IVSPlayerComponentProps} from './component/Main/Players/IOSPlayer';
import AndroidPlayer, { type VideoPlayerComponentProps } from './component/Main/Players/AndroidPlayer';

const isIOS = Platform.OS === 'ios';

// Define the common props shared between the components
interface CommonPlayerProps {
  streamUrl: string;
  autoplay?: boolean;
  muted?: boolean;
  style?: object;
}

interface IOSPlayerProps extends IVSPlayerComponentProps {
  resizeMode?: any;
}

interface AndroidPlayerProps extends VideoPlayerComponentProps {
  resizeMode?: any;
}

const TestBox = styled.View`
  height: 10px;
  width: 10px;
  background-color: red;
`;

const Index: React.FC<CommonPlayerProps> = (props) => {
  if (isIOS) {
    const iosProps: IOSPlayerProps = {
      ...props,
      // Add any iOS-specific props or adjustments here
    };
    return <IOSPlayer {...iosProps} />;
  } else {
    const androidProps: AndroidPlayerProps = {
      ...props,
      RightCustomComponent: TestBox,
      // Add any Android-specific props or adjustments here
    };
    return <AndroidPlayer {...androidProps} />;
  }
};

export { IOSPlayer, AndroidPlayer };
export default Index;
