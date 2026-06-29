import {
  PushNativeModuleMissingError,
  PushPermissionDeniedError,
  PushTokenUnavailableError,
  requestCourierPushToken,
} from './request-push-token';

const mockGetPermissionsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();
const mockGetDevicePushTokenAsync = jest.fn();

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: mockGetPermissionsAsync,
  requestPermissionsAsync: mockRequestPermissionsAsync,
  getDevicePushTokenAsync: mockGetDevicePushTokenAsync,
}));

describe('requestCourierPushToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPermissionsAsync.mockResolvedValue({ granted: true });
    mockGetDevicePushTokenAsync.mockResolvedValue({ data: 'device-push-token' });
  });

  it('returns device push token when permission is already granted', async () => {
    const token = await requestCourierPushToken();

    expect(token).toBe('device-push-token');
    expect(mockRequestPermissionsAsync).not.toHaveBeenCalled();
    expect(mockGetDevicePushTokenAsync).toHaveBeenCalled();
  });

  it('requests permission and returns token when granted after prompt', async () => {
    mockGetPermissionsAsync.mockResolvedValueOnce({ granted: false });
    mockRequestPermissionsAsync.mockResolvedValueOnce({ granted: true });

    const token = await requestCourierPushToken();

    expect(mockRequestPermissionsAsync).toHaveBeenCalled();
    expect(token).toBe('device-push-token');
  });

  it('throws PushPermissionDeniedError when permission is denied', async () => {
    mockGetPermissionsAsync.mockResolvedValueOnce({ granted: false });
    mockRequestPermissionsAsync.mockResolvedValueOnce({ granted: false });

    await expect(requestCourierPushToken()).rejects.toBeInstanceOf(PushPermissionDeniedError);
  });

  it('throws PushTokenUnavailableError when token is empty', async () => {
    mockGetDevicePushTokenAsync.mockResolvedValueOnce({ data: '   ' });

    await expect(requestCourierPushToken()).rejects.toBeInstanceOf(PushTokenUnavailableError);
  });

  it('defines PushNativeModuleMissingError for rebuild guidance', () => {
    const error = new PushNativeModuleMissingError();
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('PushNativeModuleMissingError');
  });
});
