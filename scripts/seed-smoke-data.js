const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

const users = [
  { email: 'dlabiano@iesjoanramis.org', name: 'Admin Master', group: 'ADMIN', role: 'admin', active: 1 },
  { email: 'bip1@iesjoanramis.org', name: 'Usuari BiP 1', group: 'BIP', role: 'user', active: 1 },
  { email: 'alumno1@iesjoanramis.org', name: 'Alumne 1', group: 'HM-G1', role: 'user', active: 1 },
  { email: 'alumno2@iesjoanramis.org', name: 'Alumne 2', group: 'HM-G1', role: 'user', active: 1 },
  { email: 'alumno3@iesjoanramis.org', name: 'Alumne 3', group: 'HM-G2', role: 'user', active: 1 },
  { email: 'alumno4@iesjoanramis.org', name: 'Alumne 4', group: 'HM-G2', role: 'user', active: 1 },
];

const resources = [
  { code: 'PC-A001', name: 'PC Aula Test PRU', type: 'PC', status: 'available', assignedEmail: null, location: { x: 0, z: -1.75, mesaId: 0 }, driveLink: 'https://drive.google.com/' },
  { code: 'PC-HM-01', name: 'PC Principal HM', type: 'PC', status: 'assigned', assignedEmail: 'alumno1@iesjoanramis.org', location: { x: -5, z: -3, mesaId: 1 }, driveLink: 'https://drive.google.com/' },
  { code: 'PC-HM-02', name: 'PC Secundario HM', type: 'PC', status: 'assigned', assignedEmail: 'alumno2@iesjoanramis.org', location: { x: -5, z: -2.5, mesaId: 1 }, driveLink: 'https://drive.google.com/' },
  { code: 'SCR-HM-01', name: 'Pantalla HM', type: 'Pantalla', status: 'shared', assignedEmail: 'alumno1@iesjoanramis.org', location: { x: -4.5, z: -3, mesaId: 1 }, driveLink: 'https://drive.google.com/' },
  { code: 'PROJ-HM-01', name: 'Proyector HM', type: 'Projector', status: 'occupied', assignedEmail: 'alumno3@iesjoanramis.org', location: { x: -1.5, z: 0, mesaId: 5 }, driveLink: 'https://drive.google.com/' },
  { code: 'PC-G2-01', name: 'PC Grupo 2-1', type: 'PC', status: 'assigned', assignedEmail: 'alumno3@iesjoanramis.org', location: { x: 2, z: 3, mesaId: 9 }, driveLink: 'https://drive.google.com/' },
  { code: 'PC-G2-02', name: 'PC Grupo 2-2', type: 'PC', status: 'assigned', assignedEmail: 'alumno4@iesjoanramis.org', location: { x: 2, z: 2.5, mesaId: 9 }, driveLink: 'https://drive.google.com/' },
  { code: 'SCR-G2-01', name: 'Pantalla Grupo 2', type: 'Pantalla', status: 'shared', assignedEmail: 'alumno3@iesjoanramis.org', location: { x: 1.5, z: 3, mesaId: 9 }, driveLink: 'https://drive.google.com/' },
  { code: 'LAP-001', name: 'Portatil 001', type: 'Laptop', status: 'available', assignedEmail: null, location: { x: -1.5, z: -3, mesaId: 2 }, driveLink: null },
  { code: 'LAP-002', name: 'Portatil 002', type: 'Laptop', status: 'available', assignedEmail: null, location: { x: -1.5, z: -2.5, mesaId: 2 }, driveLink: null },
  { code: 'PC-LAB-01', name: 'PC Lab 01', type: 'PC', status: 'available', assignedEmail: null, location: { x: -5, z: 0, mesaId: 4 }, driveLink: null },
  { code: 'PC-LAB-02', name: 'PC Lab 02', type: 'PC', status: 'available', assignedEmail: null, location: { x: -4.5, z: 0, mesaId: 4 }, driveLink: null },
  { code: 'PC-LAB-03', name: 'PC Lab 03', type: 'PC', status: 'available', assignedEmail: null, location: { x: 2, z: 0, mesaId: 6 }, driveLink: null },
  { code: 'PC-LAB-04', name: 'PC Lab 04', type: 'PC', status: 'available', assignedEmail: null, location: { x: 2.5, z: 0, mesaId: 6 }, driveLink: null },
  { code: 'PC-LAB-05', name: 'PC Lab 05', type: 'PC', status: 'available', assignedEmail: null, location: { x: -1.5, z: 3, mesaId: 8 }, driveLink: null },
  { code: 'PC-LAB-06', name: 'PC Lab 06', type: 'PC', status: 'available', assignedEmail: null, location: { x: -1, z: 3, mesaId: 8 }, driveLink: null },
];

function ensureUser(user) {
  const now = new Date().toISOString();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email);

  if (existing) {
    db.prepare(
      'UPDATE users SET name = ?, "group" = ?, role = ?, active = ? WHERE email = ?'
    ).run(user.name, user.group, user.role, user.active, user.email);
    return existing.id;
  }

  const result = db
    .prepare(
      'INSERT INTO users (email, name, "group", role, active, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(user.email, user.name, user.group, user.role, user.active, now);

  return Number(result.lastInsertRowid);
}

function upsertResource(resource, assignedToUserId) {
  const now = new Date().toISOString();
  const existing = db.prepare('SELECT id FROM resources WHERE code = ?').get(resource.code);

  const payload = {
    code: resource.code,
    name: resource.name,
    type: resource.type,
    status: resource.status,
    assignedToUserId: assignedToUserId ?? null,
    location: JSON.stringify(resource.location),
    os: 'Windows 11 Pro',
    cpu: 'Intel Core i5',
    ram: '16GB',
    storage: '512GB SSD',
    driveLink: resource.driveLink,
  };

  if (existing) {
    db.prepare(
      'UPDATE resources SET name = ?, type = ?, status = ?, assignedToUserId = ?, location = ?, os = ?, cpu = ?, ram = ?, storage = ?, driveLink = ? WHERE code = ?'
    ).run(
      payload.name,
      payload.type,
      payload.status,
      payload.assignedToUserId,
      payload.location,
      payload.os,
      payload.cpu,
      payload.ram,
      payload.storage,
      payload.driveLink,
      payload.code
    );
    return 'updated';
  }

  db.prepare(
    'INSERT INTO resources (code, name, type, status, assignedToUserId, location, os, cpu, ram, storage, driveLink, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    payload.code,
    payload.name,
    payload.type,
    payload.status,
    payload.assignedToUserId,
    payload.location,
    payload.os,
    payload.cpu,
    payload.ram,
    payload.storage,
    payload.driveLink,
    now
  );

  return 'created';
}

function seed() {
  console.log('Seeding smoke data...');

  const userIdsByEmail = {};
  for (const user of users) {
    const id = ensureUser(user);
    userIdsByEmail[user.email] = id;
  }

  let created = 0;
  let updated = 0;

  for (const resource of resources) {
    const assignedToUserId = resource.assignedEmail
      ? userIdsByEmail[resource.assignedEmail] ?? null
      : null;
    const result = upsertResource(resource, assignedToUserId);
    if (result === 'created') created += 1;
    if (result === 'updated') updated += 1;
  }

  console.log(`Users ensured: ${users.length}`);
  console.log(`Resources created: ${created}`);
  console.log(`Resources updated: ${updated}`);
  console.log('Smoke data ready.');
}

try {
  seed();
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  db.close();
}
