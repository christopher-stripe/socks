export type Result<T, E> = { ok: T } | { err: E };

export type Status = "initial" | "running" | "failed" | "complete";
