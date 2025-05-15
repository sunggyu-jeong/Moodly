// react-native-textinput-extensions.d.ts
import {
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  TextLayoutEventData,
} from 'react-native';

declare module 'react-native' {
  interface TextInputProps {
    /** multiline TextInput 의 줄별 레이아웃 정보를 받기 위함 */
    onTextLayout?: (e: NativeSyntheticEvent<TextLayoutEventData>) => void;
    /** 커서 위치 변경 시 이벤트를 받기 위함 */
    onSelectionChange?: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  }
}
