import { expect, vi } from "vitest";

export const runMiddleware = (middleware, requestOverrides = {}) => {
  const request = { headers: {}, body: {}, ...requestOverrides };
  const next = vi.fn();

  middleware(request, {}, next);

  expect(next).toHaveBeenCalledTimes(1);
  return { error: next.mock.calls[0][0], request };
};
