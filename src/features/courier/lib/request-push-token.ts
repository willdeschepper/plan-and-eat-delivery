export class PushPermissionDeniedError extends Error {
  constructor() {
    super('Push notification permission denied');
    this.name = 'PushPermissionDeniedError';
  }
}

export class PushTokenUnavailableError extends Error {
  constructor() {
    super('Device push token unavailable');
    this.name = 'PushTokenUnavailableError';
  }
}

export class PushNativeModuleMissingError extends Error {
  constructor() {
    super('Push native module is not available. Rebuild the app with expo-notifications.');
    this.name = 'PushNativeModuleMissingError';
  }
}

type NotificationsModule = {
  getPermissionsAsync: () => Promise<{ granted: boolean }>;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  getDevicePushTokenAsync: () => Promise<{ data?: string }>;
};

function loadNotificationsModule(): NotificationsModule {
  try {
    // Deferred require keeps login route loadable before submit (no top-level native import).
    return require('expo-notifications') as NotificationsModule;
  }
  catch {
    throw new PushNativeModuleMissingError();
  }
}

export async function requestCourierPushToken(): Promise<string> {
  const Notifications = loadNotificationsModule();
  const currentPermissions = await Notifications.getPermissionsAsync();

  let isGranted = currentPermissions.granted;
  if (!isGranted) {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    isGranted = requestedPermissions.granted;
  }

  if (!isGranted) {
    throw new PushPermissionDeniedError();
  }

  const devicePushToken = await Notifications.getDevicePushTokenAsync();
  const token = devicePushToken.data?.trim();

  if (!token) {
    throw new PushTokenUnavailableError();
  }

  return token;
}
