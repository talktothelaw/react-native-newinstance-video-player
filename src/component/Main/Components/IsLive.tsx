import styled from 'styled-components/native';
import { px } from '../utiles';

const IsLive = () => {
  return (
    <LiveIconContainer>
      <LiveIcon/><Live>Live</Live>
    </LiveIconContainer>
  );
};
const Live = styled.Text`
  color: white;
  font-weight: bold;
`;

const LiveIcon = styled.View`
  background-color: #c20707;
  border-radius: ${px(15)}px;
  height: ${px(3.5)}px;
  width: ${px(3.5)}px;
  top: ${px(.1)}px;
  margin-right: ${px(1)}px;

`;


const LiveIconContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;
export default IsLive;
