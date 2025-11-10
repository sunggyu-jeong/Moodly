import { TextStyle } from 'react-native';

import { H3 } from '../typography/H3';

interface NaviTitleDisplayProps {
  title: string;
  style?: TextStyle;
}

const NaviTitleDisplay = ({ title, style }: NaviTitleDisplayProps) => (
  <H3
    weight="semibold"
    style={style}
  >
    {title}
  </H3>
);

export default NaviTitleDisplay;
