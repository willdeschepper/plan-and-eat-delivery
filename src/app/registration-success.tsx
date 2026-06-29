import { Redirect } from 'expo-router';

export default function RemovedAuthRouteRedirect() {
  return <Redirect href="/login" />;
}
