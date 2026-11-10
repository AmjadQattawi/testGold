import type { LoaderFunctionArgs } from "react-router-dom";
import { authService } from "../services/authService";
import { ApiError } from "../api/client";
export type Result =
  | { ok: true }
  | { ok: false; message?: string; invalid?: boolean };
export function confirmEmailLoader({ request }: LoaderFunctionArgs) {
  const params = new URL(request.url).searchParams;
  const userId = params.get("userId");
  const token = params.get("token");
  const confirmation: Promise<Result> =
    !userId?.trim() || !token?.trim()
      ? Promise.resolve({ ok: false, invalid: true })
      : authService
          .confirmEmail({ userId, token }, { signal: request.signal })
          .then((response): Result => {
            if (
              response === false ||
              (response &&
                typeof response === "object" &&
                (response.success === false || response.isSuccess === false))
            ) {
              return { ok: false };
            }
            return { ok: true };
          })
          .catch(
            (error: unknown): Result => ({
              ok: false,
              message: error instanceof ApiError ? error.message : undefined,
            }),
          );
  return { confirmation };
}
