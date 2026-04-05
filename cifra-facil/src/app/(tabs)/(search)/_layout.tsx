import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: '#0f0f23' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'CifraFácil' }} />
      <Stack.Screen name="results" options={{ title: 'Resultados' }} />
      <Stack.Screen name="cifra/[id]" options={{ title: 'Cifra' }} />
      <Stack.Screen name="download" options={{ presentation: 'modal', title: 'Download' }} />
      <Stack.Screen name="viewer" options={{ title: 'Visualizar PDF' }} />
    </Stack>
  );
}
