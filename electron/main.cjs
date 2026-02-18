const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getUser, addStudent, getStudents, getClasses, addClass, deleteClass, getExamResults, getDashboardStats, addExamResult, getModules, getModuleContent, saveModuleContent, getLicenses, addLicense, deleteLicense } = require('./db.cjs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let db;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // Security best practice
      contextIsolation: true, // Security best practice
      preload: path.join(__dirname, 'preload.cjs'),
    },
    autoHideMenuBar: true, // Hide the default menu bar
    icon: path.join(__dirname, '../public/vite.svg') // Use vite logo as icon for now if available
  });

  // Load the index.html of the app.
  // In development, load from the Vite dev server
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built file
    // __dirname in built app points to resources/app/electron (or similar)
    // We need to point to ../dist/index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Initialize Database
  try {
    db = initDatabase();
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }

  // Setup IPC handlers
  ipcMain.handle('login', async (event, { username, password }) => {
    try {
      const user = getUser(username, password);
      if (user) {
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('add-student', async (event, { nik, name, kelas }) => {
    try {
      const result = addStudent(nik, name, kelas);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Add student error:', error);
      // SQLite constraint error for unique username
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'NIK/Username sudah terdaftar' };
      }
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-students', async () => {
    try {
      const students = getStudents();
      return { success: true, students };
    } catch (error) {
      console.error('Get students error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-classes', async () => {
    try {
      const classes = getClasses();
      return { success: true, classes };
    } catch (error) {
       return { success: false, error: error.message };
    }
  });

  ipcMain.handle('add-class', async (event, name) => {
    try {
      const result = addClass(name);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
       if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'Nama kelas sudah ada' };
       }
       return { success: false, error: error.message };
    }
  });

  ipcMain.handle('delete-class', async (event, id) => {
      try {
          deleteClass(id);
          return { success: true };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('get-exam-results', async (event, studentId) => {
      try {
          const results = getExamResults(studentId);
          return { success: true, results };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('get-dashboard-stats', async () => {
      try {
          const stats = getDashboardStats();
          return { success: true, stats };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('add-exam-result', async (event, { studentId, moduleId, score, type }) => {
      try {
          const result = addExamResult(studentId, moduleId, score, type);
          return { success: true, id: result.lastInsertRowid };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  // --- New Handlers ---

  ipcMain.handle('get-modules', async () => {
      try {
          const modules = getModules();
          return { success: true, modules };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('get-module-content', async (event, moduleId) => {
      try {
          const content = getModuleContent(moduleId);
          return { success: true, content: content ? {
              ...content,
              capaian: JSON.parse(content.capaian),
              teori: JSON.parse(content.teori),
              komponen: JSON.parse(content.komponen),
              system: JSON.parse(content.system),
              evaluasi: JSON.parse(content.evaluasi)
          } : null };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('save-module-content', async (event, { moduleId, content }) => {
      try {
          saveModuleContent(moduleId, content);
          return { success: true };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('get-licenses', async () => {
      try {
          const licenses = getLicenses();
          return { success: true, licenses };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('add-license', async (event, { code, duration_days }) => {
      try {
          addLicense(code, duration_days);
          return { success: true };
      } catch (error) {
           if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { success: false, error: 'Kode lisensi sudah ada' };
           }
          return { success: false, error: error.message };
      }
  });

  ipcMain.handle('delete-license', async (event, id) => {
      try {
          deleteLicense(id);
          return { success: true };
      } catch (error) {
          return { success: false, error: error.message };
      }
  });

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
