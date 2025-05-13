import { H3 } from '../typography/H3';

interface NaviTitleDisplayProps {
  title: string;
}

const NaviTitleDisplay = ({ title }: NaviTitleDisplayProps) => <H3 weight="semibold">{title}</H3>;

export default NaviTitleDisplay;
