import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  ImageSourcePropType,
} from 'react-native';

interface IconProps {
  source: ImageSourcePropType;
  size?: number;
  style?: StyleProp<ImageStyle>;
  tintColor?: string;
}

export const Icon: React.FC<IconProps> = ({
  source,
  size = 24,
  style,
  tintColor,
}) => {
  return (
    <Image
      source={source}
      resizeMode="contain"
      style={[
        {
          width: size,
          height: size,
        },
        tintColor && { tintColor },
        style,
      ]}
    />
  );
};

