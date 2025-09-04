// backend/routes/notifications.routes.js
const express = require('express');
const router = express.Router();
const notifications = require('../controllers/notifications.controller');

// Middleware que chequea si el token del admin es válido
function adminAuth(req, res, next) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  if (!ADMIN_TOKEN) {
    return res.status(500).json({ error: 'No está configurado el ADMIN_TOKEN en el .env' });
  }

  // Se busca el token en el header: "x-admin-token" o "authorization: Bearer <token>"
  const tokenHeader = (req.headers['x-admin-token'] || req.headers['authorization'] || '').trim();
  if (!tokenHeader) return res.status(401).json({ error: 'Falta el token' });

  // Si viene con "Bearer", se lo sacamos para quedarnos con el valor
  const token = tokenHeader.startsWith('Bearer ') ? tokenHeader.slice(7).trim() : tokenHeader;
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Token inválido' });

  next();
}

/**
 * GET /api/notifications
 * Lista las notificaciones guardadas en la base
 * 
 * Parámetros (opcionales):
 *  - limit: cuántas traer (default 50)
 *  - offset: desde dónde empezar (default 0)
 *  - unread: si queremos solo no leídas (true|false)
 *  - since: fecha ISO → trae las que son más nuevas que esa fecha
 * 
 * Solo accesible con token de admin
 */
router.get('/notifications', adminAuth, (req, res) => {
  try {
    const { limit = 50, offset = 0, unread, since } = req.query;
    const unreadBool = typeof unread !== 'undefined' ? (unread === 'true' || unread === '1') : undefined;
    const result = notifications.getNotifications({ limit: Number(limit), offset: Number(offset), unread: unreadBool, since });
    res.json(result);
  } catch (err) {
    console.error('GET /api/notifications error', err);
    res.status(500).json({ error: 'No se pudieron traer las notificaciones' });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Marca una notificación como leída (o no leída)
 * 
 * Body opcional: { read: true } (si no viene, se asume true)
 * Necesita token de admin
 */
router.patch('/notifications/:id/read', adminAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });

    const read = typeof req.body.read === 'undefined' ? true : !!req.body.read;
    const updated = notifications.markAsRead(id, read);
    if (!updated) return res.status(404).json({ error: 'No se encontró la notificación' });
    res.json(updated);
  } catch (err) {
    console.error('PATCH /api/notifications/:id/read error', err);
    res.status(500).json({ error: 'No se pudo actualizar la notificación' });
  }
});

/**
 * PATCH /api/notifications/mark-read
 * Marca varias notificaciones como leídas/no leídas
 * 
 * Body: { ids: [1,2,3], read: true }
 * Necesita token de admin
 */
router.patch('/notifications/mark-read', adminAuth, (req, res) => {
  try {
    const { ids, read = true } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'Hace falta un array de ids' });

    const updated = notifications.markMultipleAsRead(ids.map(Number).filter(Boolean), !!read);
    res.json({ updatedCount: updated.length, items: updated });
  } catch (err) {
    console.error('PATCH /api/notifications/mark-read error', err);
    res.status(500).json({ error: 'No se pudieron marcar las notificaciones' });
  }
});

/**
 * POST /api/messages
 * Crea una notificación “a mano” (pensado para pruebas desde Postman)
 * 
 * Body esperado: { name, email, subject, body, timestamp?, source?, metadata? }
 * - Al menos subject o body tienen que venir
 * - Esta ruta NO pide token, porque simula el envío de un mensaje de un usuario real
 */
router.post('/messages', (req, res) => {
  try {
    const { name, email, subject, body, timestamp, source, metadata } = req.body;
    if (!body && !subject) return res.status(400).json({ error: 'Se necesita al menos subject o body' });

    const notif = notifications.createNotification({ name, email, subject, body, timestamp, source, metadata });
    res.status(201).json(notif);
  } catch (err) {
    console.error('POST /api/messages error', err);
    res.status(500).json({ error: 'No se pudo crear el mensaje' });
  }
});

module.exports = router;
