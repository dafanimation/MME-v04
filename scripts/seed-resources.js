// scripts/seed-resources.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function seedResources() {
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  const pcs = [
    { code: 'A-0001', cpu: 'Intel Core i5-2400', ram: '8GB DDR3', os: 'Windows 10 Pro' },
    { code: 'A-0002', cpu: 'Intel Core i3-2100', ram: '4GB DDR3', os: 'Ubuntu 22.04' },
    { code: 'A-0003', cpu: 'Intel Pentium G2030', ram: '4GB DDR3', os: 'Windows 10 Pro' },
    { code: 'A-0004', cpu: 'Intel Core i5-3470', ram: '8GB DDR3', os: 'Ubuntu 20.04' },
    { code: 'A-0005', cpu: 'AMD Athlon II X2', ram: '4GB DDR2', os: 'Windows 7' },
    { code: 'A-0006', cpu: 'Intel Core i7-2600', ram: '16GB DDR3', os: 'Windows 10 Pro' },
    { code: 'A-0007', cpu: 'Intel Pentium G630', ram: '8GB DDR3', os: 'Ubuntu 22.04' },
    { code: 'A-0008', cpu: 'Intel Core i3-3220', ram: '8GB DDR3', os: 'Windows 10 Pro' },
    { code: 'A-0009', cpu: 'Intel Core i5-4570', ram: '8GB DDR3', os: 'Ubuntu 24.04' },
    { code: 'A-0010', cpu: 'AMD Ryzen 3 1200', ram: '8GB DDR4', os: 'Windows 11 Pro' },
    { code: 'A-0011', cpu: 'Intel Core i3-7100', ram: '8GB DDR4', os: 'Ubuntu 22.04' },
    { code: 'A-0012', cpu: 'Intel Core i5-7400', ram: '16GB DDR4', os: 'Windows 10 Pro' },
    { code: 'A-0013', cpu: 'Intel Pentium G4560', ram: '8GB DDR4', os: 'Ubuntu 24.04' },
    { code: 'A-0014', cpu: 'AMD Ryzen 5 2400G', ram: '16GB DDR4', os: 'Windows 11 Pro' },
    { code: 'A-0015', cpu: 'Intel Core i3-8100', ram: '8GB DDR4', os: 'Ubuntu 22.04' },
    { code: 'A-0016', cpu: 'Intel Core i5-8400', ram: '16GB DDR4', os: 'Windows 10 Pro' },
    { code: 'A-0017', cpu: 'Intel Core i7-8700', ram: '32GB DDR4', os: 'Ubuntu 24.04' },
    { code: 'A-0018', cpu: 'AMD Ryzen 7 2700X', ram: '16GB DDR4', os: 'Windows 11 Pro' },
    { code: 'A-0019', cpu: 'Intel Core i5-9400F', ram: '16GB DDR4', os: 'Ubuntu 22.04' },
    { code: 'A-0020', cpu: 'Intel Core i7-9700K', ram: '32GB DDR4', os: 'Windows 10 Pro' },
    { code: 'A-0021', cpu: 'AMD Ryzen 5 3600', ram: '16GB DDR4', os: 'Ubuntu 24.04' },
    { code: 'A-0022', cpu: 'Intel Core i3-10100', ram: '8GB DDR4', os: 'Windows 11 Pro' },
    { code: 'A-0023', cpu: 'Intel Core i5-10400F', ram: '16GB DDR4', os: 'Ubuntu 22.04' },
    { code: 'A-0024', cpu: 'AMD Ryzen 7 3700X', ram: '32GB DDR4', os: 'Windows 10 Pro' },
    { code: 'A-0025', cpu: 'Intel Core i7-10700K', ram: '32GB DDR4', os: 'Ubuntu 24.04' },
    { code: 'A-0026', cpu: 'Intel Core i5-11400', ram: '16GB DDR4', os: 'Windows 11 Pro' },
    { code: 'A-0027', cpu: 'AMD Ryzen 5 5600X', ram: '16GB DDR4', os: 'Ubuntu 22.04' },
    { code: 'A-0028', cpu: 'Intel Core i7-11700K', ram: '32GB DDR4', os: 'Windows 10 Pro' },
    { code: 'A-0029', cpu: 'Intel Core i9-11900K', ram: '64GB DDR4', os: 'Ubuntu 24.04' },
    { code: 'A-0030', cpu: 'AMD Ryzen 9 5900X', ram: '64GB DDR4', os: 'Windows 11 Pro' },
  ];

  let created = 0;
  let skipped = 0;

  for (const pc of pcs) {
    const existing = await db.get('SELECT id FROM resources WHERE code = ?', [pc.code]);
    if (!existing) {
      await db.run(`
        INSERT INTO resources (code, name, type, status, os, cpu, ram, storage, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        pc.code,
        `Ordinador ${pc.code}`,
        'PC',
        'available',
        pc.os,
        pc.cpu,
        pc.ram,
        '500GB HDD',
        new Date().toISOString()
      ]);
      created++;
      console.log(`✅ Creat recurs ${pc.code}`);
    } else {
      skipped++;
      console.log(`⏭️ Recurs ${pc.code} ja existeix`);
    }
  }

  console.log(`\n🎉 Resum: ${created} recursos creats, ${skipped} recursos existents`);
  await db.close();
}

seedResources().catch(console.error);