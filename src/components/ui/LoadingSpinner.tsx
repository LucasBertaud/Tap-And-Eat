import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  color?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  message = 'Chargement...',
  color = '#F97316',
  fullScreen = false,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, [spinValue, scaleValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
      default:
        return 64;
    }
  };

  const iconSize = getSize();

  const content = (
    <View className="items-center justify-center">
      <Animated.View
        style={{
          transform: [{ rotate: spin }, { scale: scaleValue }],
        }}
      >
        <View
          className="rounded-full items-center justify-center"
          style={{
            width: iconSize + 20,
            height: iconSize + 20,
            backgroundColor: `${color}15`,
          }}
        >
          <Ionicons name="restaurant" size={iconSize} color={color} />
        </View>
      </Animated.View>

      {message && (
        <Text
          className="font-medium mt-4 text-center"
          style={{
            color: '#6B7280',
            fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
          }}
        >
          {message}
        </Text>
      )}

      <View className="flex-row gap-2 mt-2">
        {[0, 1, 2].map((index) => (
          <Animated.View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: color,
              opacity: scaleValue.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0.3, 1],
              }),
              transform: [
                {
                  translateY: scaleValue.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0, index === 1 ? -8 : -4],
                  }),
                },
              ],
            }}
          />
        ))}
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary-50">
        {content}
      </View>
    );
  }

  return content;
};
