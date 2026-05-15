import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexRoute() {
  const router = useRouter();

  return (
    <View>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => router.push('/triage')}>
        <Text>Go to Triage</Text>
      </TouchableOpacity>
    </View>
  );
}
