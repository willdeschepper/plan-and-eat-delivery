import { Alert } from 'react-native';
import { client } from '@/lib/api';
import { formatApiErrorForUser, parseApiError } from '@/lib/api/errors';
import { getToken } from '@/lib/auth/utils';
import { signOut } from '@/lib/hooks/use-auth-store';

export async function logoutWithBackend() {
  const token = getToken();

  try {
    if (token?.refresh) {
      await client.post('/api/customers/logout/', { refresh: token.refresh });
    }
  }
  catch (error) {
    Alert.alert('Error', formatApiErrorForUser(parseApiError(error)));
  }
  finally {
    signOut();
  }
}
