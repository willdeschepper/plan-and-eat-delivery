import { completeAssignment, flushPendingCompletions, readPendingCompletions } from './completion-queue';

let mockOnline = true;
let mockStoredValue: unknown = null;
const mockPut = jest.fn();

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => 'operation-123'),
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    isAxiosError: (error: unknown) => Boolean(
      error && typeof error === 'object' && 'isAxiosError' in error,
    ),
  },
}));

jest.mock('@/lib/api/client', () => ({
  client: { put: (...args: unknown[]) => mockPut(...args) },
}));

jest.mock('@/lib/network/network-status', () => ({
  getIsOnline: () => mockOnline,
}));

jest.mock('@/lib/storage', () => ({
  getItem: () => mockStoredValue,
  setItem: async (_key: string, value: unknown) => {
    mockStoredValue = value;
    return true;
  },
}));

describe('delivery completion queue', () => {
  beforeEach(() => {
    mockOnline = true;
    mockStoredValue = null;
    mockPut.mockReset();
  });

  it('persists a command before returning it as queued while offline', async () => {
    mockOnline = false;

    const result = await completeAssignment(42);

    expect(result).toEqual({
      assignmentId: 42,
      operationId: 'operation-123',
      status: 'queued',
    });
    expect(readPendingCompletions()).toHaveLength(1);
    expect(mockPut).not.toHaveBeenCalled();
  });

  it('reuses the operation id during replay and removes a confirmed command', async () => {
    mockOnline = false;
    await completeAssignment(42);
    mockOnline = true;
    mockPut.mockResolvedValueOnce({ data: { id: 42 } });

    await flushPendingCompletions();

    expect(mockPut).toHaveBeenCalledWith(
      '/api/couriers/42/complete/',
      undefined,
      { headers: { 'Idempotency-Key': 'operation-123' } },
    );
    expect(readPendingCompletions()).toEqual([]);
  });

  it('keeps an uncertain network result for reconciliation', async () => {
    mockPut.mockRejectedValueOnce({ isAxiosError: true });

    const result = await completeAssignment(42);

    expect(result.status).toBe('queued');
    expect(readPendingCompletions()[0]).toMatchObject({
      operationId: 'operation-123',
      state: 'awaiting_confirmation',
      attempts: 1,
    });
  });
});
