// Define an explicit, strict union of allowed actions. No generic strings.
export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'REFUND'
  | 'LOGIN'
  | 'EXPORT';

export type AuditEntityType =
  | 'PRODUCT'
  | 'ORDER'
  | 'CUSTOMER'
  | 'DISCOUNT'
  | 'SETTINGS'
  | 'TEAM';

export interface AuditPayload {
  actor_id: string; // The Admin or System ID triggering the event
  action: AuditActionType;
  entity_type: AuditEntityType;
  entity_id: string; // The specific Order ID, Product ID, etc.
  details?: { before?: any; after?: any }; // Diff tracking for the UI
  ip_address?: string;
}

/**
 * Immutably records administrative and security events to the Cloudflare D1 Database.
 * @param db The D1Database binding (passed from the Edge runtime locals)
 * @param payload The strict audit event payload
 */
export async function logAuditAction(
  db: any,
  payload: AuditPayload
): Promise<void> {
  try {
    const id = crypto.randomUUID();
    const detailsJson = payload.details
      ? JSON.stringify(payload.details)
      : null;

    // We use a prepared statement to prevent SQL injection, even from internal details.
    await db
      .prepare(
        `
      INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, ip_address, details)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
    `
      )
      .bind(
        id,
        payload.actor_id,
        payload.action,
        payload.entity_type,
        payload.entity_id,
        payload.ip_address || '0.0.0.0',
        detailsJson
      )
      .run();
  } catch (error) {
    // In a high-availability environment, logging failure should NOT crash the main transaction
    // (e.g., the user should still get their refund even if the log fails), but we must alert Ops.
    console.error(
      '[AUDIT_LOG_CRITICAL_FAILURE] Failed to write audit event:',
      error
    );
    // Note: If strict compliance (e.g., SOC2) requires it, you would throw the error here.
  }
}
