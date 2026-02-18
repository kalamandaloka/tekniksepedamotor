const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

let db;

function initDatabase() {
  // Determine database path based on environment
  // In development, use local folder. In production, use userData folder.
  const isDev = process.env.NODE_ENV === 'development';
  const userDataPath = app.getPath('userData');
  const dbPath = isDev 
    ? path.join(__dirname, '../database.sqlite') 
    : path.join(userDataPath, 'database.sqlite');

  console.log('Database path:', dbPath);

  // Create db instance
  db = new Database(dbPath);

  // Initialize schema
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'guru', 'siswa')),
      name TEXT,
      nik TEXT,
      kelas TEXT
    )
  `;

  db.exec(createUsersTable);

  // Create Classes Table
  const createClassesTable = `
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `;
  db.exec(createClassesTable);

  // Create Exam Results Table
  const createExamResultsTable = `
    CREATE TABLE IF NOT EXISTS exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      module_id TEXT,
      score REAL,
      date TEXT,
      type TEXT,
      FOREIGN KEY(student_id) REFERENCES users(id)
    )
  `;
  db.exec(createExamResultsTable);

  // Create Licenses Table
  const createLicensesTable = `
    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'active',
      activation_date TEXT,
      duration_days INTEGER
    )
  `;
  db.exec(createLicensesTable);

  // Create Modules Table
  const createModulesTable = `
    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT
    )
  `;
  db.exec(createModulesTable);

  // Create Module Contents Table
  const createModuleContentsTable = `
    CREATE TABLE IF NOT EXISTS module_contents (
      module_id TEXT PRIMARY KEY,
      capaian TEXT,
      teori TEXT,
      komponen TEXT,
      system TEXT,
      evaluasi TEXT,
      FOREIGN KEY(module_id) REFERENCES modules(id)
    )
  `;
  db.exec(createModuleContentsTable);

  // Migration: Add columns if they don't exist (for existing DB)
  try {
    db.prepare('ALTER TABLE users ADD COLUMN nik TEXT').run();
  } catch (e) { /* Column might already exist */ }
  
  try {
    db.prepare('ALTER TABLE users ADD COLUMN kelas TEXT').run();
  } catch (e) { /* Column might already exist */ }

  // Seed default users if empty
  const stmt = db.prepare('SELECT count(*) as count FROM users');
  const result = stmt.get();

  if (result.count === 0) {
    console.log('Seeding database with default users...');
    const insert = db.prepare('INSERT INTO users (username, password, role, name, nik, kelas) VALUES (?, ?, ?, ?, ?, ?)');
    insert.run('admin', 'admin123', 'admin', 'Administrator', '001', '-');
    insert.run('guru', 'guru123', 'guru', 'Bapak Guru', '002', '-');
    insert.run('siswa', 'siswa123', 'siswa', 'Siswa Teladan', '12345', 'XII-A');
    console.log('Database seeded.');
  }

  // Seed default classes if empty
  const classStmt = db.prepare('SELECT count(*) as count FROM classes');
  if (classStmt.get().count === 0) {
      console.log('Seeding default classes...');
      const insertClass = db.prepare('INSERT INTO classes (name) VALUES (?)');
      ['X-A', 'X-B', 'XI-A', 'XI-B', 'XII-A', 'XII-B'].forEach(c => insertClass.run(c));
  }

  // Seed default modules if empty
  const moduleStmt = db.prepare('SELECT count(*) as count FROM modules');
  if (moduleStmt.get().count === 0) {
      console.log('Seeding default modules...');
      const modules = [
        { id: "LD-01", title: "Persiapan Lahan & Bedengan", description: "Panduan lengkap mengenai persiapan lahan awal dan pembuatan bedengan yang ideal untuk memaksimalkan pertumbuhan tanaman.", category: "Persiapan" },
        { id: "LD-02", title: "Pengolahan Tanah", description: "Teknik pengolahan tanah yang benar untuk menjaga struktur dan kesuburan tanah agar siap ditanami.", category: "Persiapan" },
        { id: "LD-03", title: "Persemaian & Pembibitan", description: "Metode persemaian dan pembibitan untuk menghasilkan bibit unggul yang sehat dan kuat.", category: "Persiapan" },
        { id: "LD-04", title: "Penanaman & Jarak Tanam", description: "Aturan jarak tanam dan teknik penanaman yang tepat untuk mengoptimalkan populasi dan hasil panen.", category: "Penanaman" },
        { id: "LD-05", title: "Mulsa Plastik & Pengendalian Gulma", description: "Penggunaan mulsa plastik untuk menjaga kelembaban tanah dan strategi pengendalian gulma yang efektif.", category: "Perawatan" },
        { id: "LD-06", title: "Irigasi Tetes", description: "Sistem irigasi tetes yang efisien untuk menghemat air dan memastikan tanaman mendapatkan nutrisi yang cukup.", category: "Irigasi" },
        { id: "LD-07", title: "Fertigasi (Pupuk via Irigasi)", description: "Penerapan teknik fertigasi untuk efisiensi pemupukan yang terintegrasi dengan sistem irigasi.", category: "Irigasi" },
        { id: "LD-08", title: "Uji Tanah: pH, EC, Tekstur", description: "Cara melakukan uji tanah untuk mengetahui parameter penting seperti pH, EC, dan tekstur demi kesehatan tanaman.", category: "Analisis" },
        { id: "LD-09", title: "Pemupukan Dasar & Susulan", description: "Strategi pemupukan dasar dan susulan yang berimbang sesuai fase pertumbuhan tanaman.", category: "Pemupukan" },
        { id: "LD-10", title: "Kalibrasi Sprayer & Aplikasi Pestisida Aman", description: "Teknik kalibrasi sprayer dan prosedur keamanan dalam aplikasi pestisida untuk perlindungan tanaman.", category: "Perlindungan" },
        { id: "LD-11", title: "Identifikasi Hama & Penyakit (IPM)", description: "Pengenalan hama dan penyakit utama serta penerapan Integrated Pest Management (IPM).", category: "Perlindungan" },
        { id: "LD-12", title: "Greenhouse: Kontrol Iklim", description: "Manajemen iklim mikro di dalam greenhouse untuk menciptakan lingkungan tumbuh yang optimal.", category: "Infrastruktur" },
        { id: "LD-13", title: "Pruning, Training & Ajir", description: "Teknik pemangkasan (pruning), pembentukan (training), dan pemasangan ajir untuk menopang tanaman.", category: "Perawatan" },
        { id: "LD-14", title: "Panen & Pascapanen (Sortasi-Grading-Packing)", description: "Prosedur panen yang tepat serta penanganan pascapanen meliputi sortasi, grading, dan packing.", category: "Panen" },
        { id: "LD-15", title: "Kompos & Pupuk Organik", description: "Pembuatan dan aplikasi kompos serta pupuk organik untuk menjaga keberlanjutan kesuburan tanah.", category: "Pemupukan" }
      ];
      
      const insertModule = db.prepare('INSERT INTO modules (id, title, description, category) VALUES (?, ?, ?, ?)');
      modules.forEach(m => insertModule.run(m.id, m.title, m.description, m.category));
  }

  return db;
}

function getUser(username, password) {
  const stmt = db.prepare('SELECT id, username, role, name, nik, kelas FROM users WHERE username = ? AND password = ?');
  return stmt.get(username, password);
}

function addStudent(nik, name, kelas) {
  // Use NIK as username and default password '12345678'
  const stmt = db.prepare('INSERT INTO users (username, password, role, name, nik, kelas) VALUES (?, ?, ?, ?, ?, ?)');
  return stmt.run(nik, '12345678', 'siswa', name, nik, kelas);
}

function getStudents() {
  const stmt = db.prepare("SELECT id, nik, name, kelas, username FROM users WHERE role = 'siswa' ORDER BY name ASC");
  return stmt.all();
}

function getClasses() {
  const stmt = db.prepare("SELECT * FROM classes ORDER BY name ASC");
  return stmt.all();
}

function addClass(name) {
  const stmt = db.prepare("INSERT INTO classes (name) VALUES (?)");
  return stmt.run(name);
}

function deleteClass(id) {
    const stmt = db.prepare("DELETE FROM classes WHERE id = ?");
    return stmt.run(id);
}

function getExamResults(studentId = null) {
    let sql = `
        SELECT er.*, u.name as student_name, u.kelas 
        FROM exam_results er 
        JOIN users u ON er.student_id = u.id 
    `;
    
    if (studentId) {
        sql += ` WHERE er.student_id = ?`;
    }
    
    sql += ` ORDER BY er.date DESC`;

    const stmt = db.prepare(sql);
    return studentId ? stmt.all(studentId) : stmt.all();
}

function getDashboardStats() {
    const studentCount = db.prepare("SELECT count(*) as count FROM users WHERE role = 'siswa'").get().count;
    const classCount = db.prepare("SELECT count(*) as count FROM classes").get().count;
    const moduleCount = 15; // Fixed based on modules.ts
    
    const avgScoreResult = db.prepare("SELECT avg(score) as avg FROM exam_results").get();
    const avgScore = avgScoreResult.avg || 0;
    
    return {
        studentCount,
        classCount,
        moduleCount,
        avgScore
    };
}

function addExamResult(studentId, moduleId, score, type) {
    const date = new Date().toISOString();
    const stmt = db.prepare("INSERT INTO exam_results (student_id, module_id, score, date, type) VALUES (?, ?, ?, ?, ?)");
    return stmt.run(studentId, moduleId, score, date, type);
}

// --- Modules CRUD ---
function getModules() {
    return db.prepare("SELECT * FROM modules ORDER BY id ASC").all();
}

function getModuleContent(moduleId) {
    return db.prepare("SELECT * FROM module_contents WHERE module_id = ?").get(moduleId);
}

function saveModuleContent(moduleId, content) {
    const { capaian, teori, komponen, system, evaluasi } = content;
    
    const existing = db.prepare("SELECT module_id FROM module_contents WHERE module_id = ?").get(moduleId);
    
    if (existing) {
        const stmt = db.prepare(`
            UPDATE module_contents 
            SET capaian = ?, teori = ?, komponen = ?, system = ?, evaluasi = ?
            WHERE module_id = ?
        `);
        return stmt.run(
            JSON.stringify(capaian), 
            JSON.stringify(teori), 
            JSON.stringify(komponen), 
            JSON.stringify(system), 
            JSON.stringify(evaluasi), 
            moduleId
        );
    } else {
        const stmt = db.prepare(`
            INSERT INTO module_contents (module_id, capaian, teori, komponen, system, evaluasi)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(
            moduleId,
            JSON.stringify(capaian), 
            JSON.stringify(teori), 
            JSON.stringify(komponen), 
            JSON.stringify(system), 
            JSON.stringify(evaluasi)
        );
    }
}

// --- Licenses CRUD ---
function getLicenses() {
    return db.prepare("SELECT * FROM licenses ORDER BY id DESC").all();
}

function addLicense(code, duration_days) {
    const date = new Date().toISOString();
    const stmt = db.prepare("INSERT INTO licenses (code, duration_days, activation_date) VALUES (?, ?, ?)");
    return stmt.run(code, duration_days, date);
}

function deleteLicense(id) {
    return db.prepare("DELETE FROM licenses WHERE id = ?").run(id);
}

module.exports = {
  initDatabase,
  getUser,
  addStudent,
  getStudents,
  getClasses,
  addClass,
  deleteClass,
  getExamResults,
  getDashboardStats,
  addExamResult,
  getModules,
  getModuleContent,
  saveModuleContent,
  getLicenses,
  addLicense,
  deleteLicense
};
