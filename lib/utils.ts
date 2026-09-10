import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;

export function cn(
  ...styles: Array<Style | false | null | undefined>
): Style[] | undefined {
  const result: Style[] = [];

  for (const style of styles) {
    if (!style) continue;
    result.push(style);
  }

  return result.length === 0 ? undefined : result;
}
