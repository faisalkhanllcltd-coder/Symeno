// src/lib/db.ts

export function getDb(env: any) {
  // Accepts the per-request env object from context.locals.runtime?.env
  return env?.DB;
}
