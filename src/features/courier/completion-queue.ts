import axios from 'axios';
import { randomUUID } from 'expo-crypto';

import { client } from '@/lib/api/client';
import { getIsOnline } from '@/lib/network/network-status';
import { getItem, setItem } from '@/lib/storage';

const COMPLETION_QUEUE_KEY = 'courier:completion-queue:v1';

export type PendingCompletion = {
  assignmentId: number;
  operationId: string;
  createdAt: string;
  attempts: number;
  lastAttemptAt?: string;
  state: 'pending' | 'awaiting_confirmation';
};

export type CompletionResult = {
  assignmentId: number;
  operationId: string;
  status: 'confirmed' | 'queued';
};

let flushPromise: Promise<number> | null = null;

function isPendingCompletion(value: unknown): value is PendingCompletion {
  if (!value || typeof value !== 'object')
    return false;

  const item = value as Partial<PendingCompletion>;
  return (
    Number.isInteger(item.assignmentId)
    && typeof item.operationId === 'string'
    && typeof item.createdAt === 'string'
    && typeof item.attempts === 'number'
    && (item.state === 'pending' || item.state === 'awaiting_confirmation')
  );
}

export function readPendingCompletions(): PendingCompletion[] {
  const stored = getItem<unknown>(COMPLETION_QUEUE_KEY);
  if (!Array.isArray(stored))
    return [];

  return stored.filter(isPendingCompletion);
}

async function persistQueue(queue: PendingCompletion[]): Promise<void> {
  const persisted = await setItem(COMPLETION_QUEUE_KEY, queue);
  if (!persisted)
    throw new Error('Unable to persist the delivery completion queue');
}

async function replacePendingCompletion(next: PendingCompletion): Promise<void> {
  const queue = readPendingCompletions();
  await persistQueue(
    queue.some(item => item.operationId === next.operationId)
      ? queue.map(item => item.operationId === next.operationId ? next : item)
      : [...queue, next],
  );
}

async function removePendingCompletion(operationId: string): Promise<void> {
  await persistQueue(
    readPendingCompletions().filter(item => item.operationId !== operationId),
  );
}

export async function enqueueCompletion(assignmentId: number): Promise<PendingCompletion> {
  const existing = readPendingCompletions().find(
    item => item.assignmentId === assignmentId,
  );
  if (existing)
    return existing;

  const pending: PendingCompletion = {
    assignmentId,
    operationId: randomUUID(),
    createdAt: new Date().toISOString(),
    attempts: 0,
    state: 'pending',
  };

  await replacePendingCompletion(pending);
  return pending;
}

function shouldRetry(error: unknown): boolean {
  if (!axios.isAxiosError(error))
    return true;
  if (!error.response)
    return true;

  const status = error.response.status;
  return status === 408 || status === 429 || status >= 500;
}

async function sendPendingCompletion(
  pending: PendingCompletion,
): Promise<CompletionResult> {
  if (!getIsOnline()) {
    return {
      assignmentId: pending.assignmentId,
      operationId: pending.operationId,
      status: 'queued',
    };
  }

  const attempted: PendingCompletion = {
    ...pending,
    attempts: pending.attempts + 1,
    lastAttemptAt: new Date().toISOString(),
    state: 'awaiting_confirmation',
  };
  await replacePendingCompletion(attempted);

  try {
    await client.put(
      `/api/couriers/${pending.assignmentId}/complete/`,
      undefined,
      {
        headers: {
          'Idempotency-Key': pending.operationId,
        },
      },
    );
    await removePendingCompletion(pending.operationId);
    return {
      assignmentId: pending.assignmentId,
      operationId: pending.operationId,
      status: 'confirmed',
    };
  }
  catch (error) {
    if (shouldRetry(error)) {
      return {
        assignmentId: pending.assignmentId,
        operationId: pending.operationId,
        status: 'queued',
      };
    }

    await removePendingCompletion(pending.operationId);
    throw error;
  }
}

export async function completeAssignment(
  assignmentId: number,
): Promise<CompletionResult> {
  const pending = await enqueueCompletion(assignmentId);
  return sendPendingCompletion(pending);
}

export async function flushPendingCompletions(
  onConfirmed?: (result: CompletionResult) => void,
): Promise<number> {
  if (!getIsOnline())
    return 0;
  if (flushPromise)
    return flushPromise;

  flushPromise = (async () => {
    let confirmed = 0;
    for (const pending of readPendingCompletions()) {
      if (!getIsOnline())
        break;

      try {
        const result = await sendPendingCompletion(pending);
        if (result.status === 'confirmed') {
          confirmed += 1;
          onConfirmed?.(result);
        }
      }
      catch {
        // A permanent rejection is removed by sendPendingCompletion.
        // Continue so one invalid command cannot block the whole queue.
      }
    }
    return confirmed;
  })().finally(() => {
    flushPromise = null;
  });

  return flushPromise;
}
