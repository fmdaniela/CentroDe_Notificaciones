import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import EventEmitter from 'events';

const events = new EventEmitter();

let db;

/**
 * Arranca la base de datos SQLite y se asegura de que la tabla exista.
 * Si no pasás un archivo, la crea en ../db/notifications.sqlite.
 */
function initDb(dbFile) {
  const dbPath = dbFile || join(__dirname, '..', 'db', 'notifications.sqlite');

  // si la carpeta no existe, la creamos
  const dir = dirname(dbPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL'); // esto mejora la concurrencia de SQLite

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      subject TEXT,
      body TEXT,
      timestamp TEXT,
      read INTEGER DEFAULT 0,
      delivered_email INTEGER DEFAULT 0,
      source TEXT,
      metadata TEXT
    );
  `;
  db.exec(createTableSql);

  // agregamos algunos índices para que las consultas sean más rápidas
  db.exec('CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp DESC);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);');

  console.log('[notifications.controller] DB lista en:', dbPath);
}

/**
 * Guarda una notificación en la base y devuelve el registro creado.
 * Además dispara el evento 'notification_created'.
 */
function createNotification(payload = {}) {
  if (!db) throw new Error('DB no inicializada. Tenés que correr initDb primero.');

  const { name = null, email = null, subject = null, body = null, timestamp, source = null, metadata = null } = payload;

  const ts = timestamp || new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO notifications (name, email, subject, body, timestamp, read, delivered_email, source, metadata)
    VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)
  `);

  const info = insert.run(name, email, subject, body, ts, source, metadata ? JSON.stringify(metadata) : null);
  const id = info.lastInsertRowid;

  const row = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
  if (row) {
    // normalizamos tipos para que sean más cómodos de usar en JS
    row.read = !!row.read;
    row.delivered_email = !!row.delivered_email;
    if (row.metadata) {
      try { row.metadata = JSON.parse(row.metadata); } catch (e) { row.metadata = row.metadata; }
    }
  }

  // avisamos que hay una notificación nueva (ej: para sockets)
  events.emit('notification_created', row);

  return row;
}

/**
 * Trae notificaciones con filtros opcionales:
 * - limit / offset para paginado
 * - unread: solo las no leídas
 * - since: solo las posteriores a cierta fecha (ISO string)
 */
function getNotifications({ limit = 50, offset = 0, unread, since } = {}) {
  if (!db) throw new Error('DB no inicializada.');

  let where = 'WHERE 1=1';
  const params = [];

  if (since) {
    where += ' AND timestamp > ?';
    params.push(since);
  }

  if (typeof unread !== 'undefined') {
    where += ' AND read = ?';
    params.push(unread ? 0 : 1); // si unread=true buscamos las con read=0
  }

  const totalStmt = db.prepare(`SELECT COUNT(*) as total FROM notifications ${where}`);
  const total = totalStmt.get(...params).total;

  const query = `
    SELECT *
    FROM notifications
    ${where}
    ORDER BY timestamp DESC
    LIMIT ?
    OFFSET ?
  `;
  const rows = db.prepare(query).all(...params, limit, offset);

  // normalizamos los tipos y parseamos metadata si viene en JSON
  const items = rows.map(r => {
    const copy = { ...r };
    copy.read = !!copy.read;
    copy.delivered_email = !!copy.delivered_email;
    if (copy.metadata) {
      try { copy.metadata = JSON.parse(copy.metadata); } catch (e) { /* dejamos el string */ }
    }
    return copy;
  });

  return { items, meta: { limit: Number(limit), offset: Number(offset), total: Number(total) } };
}

/**
 * Marca una notificación como leída (o no leída).
 * Dispara el evento 'notification_read' con el registro actualizado.
 */
function markAsRead(id, read = true) {
  if (!db) throw new Error('DB no inicializada.');
  const stmt = db.prepare('UPDATE notifications SET read = ? WHERE id = ?');
  const info = stmt.run(read ? 1 : 0, id);
  if (info.changes === 0) return null;

  const row = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
  if (row) {
    row.read = !!row.read;
    if (row.metadata) {
      try { row.metadata = JSON.parse(row.metadata); } catch (e) {}
    }
    events.emit('notification_read', row);
  }
  return row;
}

/**
 * Marca varias notificaciones como leídas/no leídas en una sola transacción.
 * Recibe { ids: [1,2,3], read: true } y devuelve las actualizadas.
 * También emite 'notification_read' por cada una.
 */
function markMultipleAsRead(ids = [], read = true) {
  if (!db) throw new Error('DB no inicializada.');
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const tx = db.transaction((idsList, readFlag) => {
    const updated = [];
    const updStmt = db.prepare('UPDATE notifications SET read = ? WHERE id = ?');
    const getStmt = db.prepare('SELECT * FROM notifications WHERE id = ?');
    for (const id of idsList) {
      const info = updStmt.run(readFlag ? 1 : 0, id);
      if (info.changes > 0) {
        const row = getStmt.get(id);
        if (row) {
          row.read = !!row.read;
          if (row.metadata) {
            try { row.metadata = JSON.parse(row.metadata); } catch (e) {}
          }
          updated.push(row);
        }
      }
    }
    return updated;
  });

  const result = tx(ids, read);
  // emitimos los eventos afuera de la transacción
  for (const r of result) events.emit('notification_read', r);
  return result;
}

// Exportamos todo lo que se necesita afuera
export default {
  initDb,
  createNotification,
  getNotifications,
  markAsRead,
  markMultipleAsRead,
  events,
};
