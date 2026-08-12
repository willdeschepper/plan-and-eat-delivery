import { Alert } from 'react-native';
import { client } from '@/lib/api';
import { formatApiErrorForUser, parseApiError } from '@/lib/api/errors';
import { signOut } from '@/lib/hooks/use-auth-store';

export async function deleteAccountWithBackend() {
  try {
    await client.delete('/api/couriers/profile/delete/');
    signOut();
  }
  catch (error) {
    Alert.alert('Error', formatApiErrorForUser(parseApiError(error)));
  }
}
