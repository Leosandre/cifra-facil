import { useState, useCallback, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const show = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, []);

  const ToastView = toast ? (
    <Animated.View style={[styles.toast, styles[toast.type], { opacity }]} pointerEvents="none">
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  ) : null;

  return { show, ToastView };
}

const styles = StyleSheet.create({
  toast: { position: 'absolute', bottom: 90, left: 20, right: 20, borderRadius: 12, padding: 14, alignItems: 'center', zIndex: 999 },
  success: { backgroundColor: '#00b894' },
  error: { backgroundColor: '#e17055' },
  info: { backgroundColor: '#6c5ce7' },
  text: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
