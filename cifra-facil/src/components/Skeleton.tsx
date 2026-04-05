import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return <Animated.View style={[styles.skeleton, { width: width as any, height, borderRadius, opacity }, style]} />;
}

export function CifraSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width="60%" height={20} style={styles.mb} />
      <Skeleton width="80%" height={14} style={styles.mb} />
      <Skeleton width="40%" height={14} style={styles.mb} />
      <Skeleton width="90%" height={14} style={styles.mb} />
      <Skeleton width="70%" height={14} style={styles.mb} />
      <Skeleton width="50%" height={20} style={styles.mbLg} />
      <Skeleton width="85%" height={14} style={styles.mb} />
      <Skeleton width="65%" height={14} style={styles.mb} />
      <Skeleton width="75%" height={14} style={styles.mb} />
      <Skeleton width="45%" height={14} style={styles.mb} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: { backgroundColor: '#2d2d44' },
  container: { padding: 16 },
  mb: { marginBottom: 10 },
  mbLg: { marginBottom: 20 },
});
