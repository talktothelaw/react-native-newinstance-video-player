import IOSPlayer , { type IVSPlayerComponentProps } from './component/Main/Players/IOSPlayer';
import AndroidPlayer from './component/Main/Players/AndroidPlayer';
import React from 'react';
import { Platform } from 'react-native';
const isIOS = Platform.OS === "ios"
interface IPlayer extends IVSPlayerComponentProps{

}

const Index:React.FC<IPlayer> = (props) => {
  return (
    <>
      {isIOS ? <IOSPlayer {...props} />: <AndroidPlayer {...props}/>}
    </>
  );
};

export default Index;
