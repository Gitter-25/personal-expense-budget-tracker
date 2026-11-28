import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import Tabs from "./src/navigation/Tabs";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditExpenseScreen from "./src/screens/EditExpenseScreen";
const Stack = createNativeStackNavigator();
function Root() {
  const { user, loading, error, loadSession } = useAuth();
  if (loading || error) return <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#F4F9FF"}}>
    {loading ? <ActivityIndicator color="#1677F2"/> : <><Text>{error}</Text><TouchableOpacity onPress={loadSession}><Text>Retry</Text></TouchableOpacity></>}
  </View>;
  return <NavigationContainer><Stack.Navigator screenOptions={{headerShown:false}}>
    {user ? <Stack.Group navigationKey={user.id}>
      <Stack.Screen name="Main" component={Tabs}/>
      <Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="EditExpense" component={EditExpenseScreen}/>
    </Stack.Group> : <Stack.Group navigationKey="guest">
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Signup" component={SignupScreen}/>
    </Stack.Group>}
  </Stack.Navigator></NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><AuthProvider><Root/></AuthProvider></SafeAreaProvider>;
}
