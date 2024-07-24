import React from 'react';
import { Platform } from 'react-native';
// import styled from 'styled-components/native';
import IOSPlayer, { type IVSPlayerComponentProps} from './component/Main/Players/IOSPlayer';
import AndroidPlayer, { type VideoPlayerComponentProps } from './component/Main/Players/AndroidPlayer';

const isIOS = Platform.OS === 'ios';

// Define the common props shared between the components


interface IOSPlayerProps extends IVSPlayerComponentProps {
}

interface AndroidPlayerProps extends VideoPlayerComponentProps {
}

// const TestBox = styled.View`
//   height: 10px;
//   width: 10px;
//   background-color: red;
// `;

const Index: React.FC<IOSPlayerProps |AndroidPlayerProps > = (props) => {
  if (isIOS) {
    const iosProps = {
      ...props,
      // Add any iOS-specific props or adjustments here
    };
    return <IOSPlayer {...iosProps as IOSPlayerProps} />;
  } else {
    const androidProps: any = {
      ...props
      // Add any Android-specific props or adjustments here
    };
    return <AndroidPlayer {...androidProps} />;
  }
};

export { IOSPlayer, AndroidPlayer };
export default Index;
