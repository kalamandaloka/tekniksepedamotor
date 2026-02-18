const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  login: (username, password) => ipcRenderer.invoke('login', { username, password }),
  addStudent: (studentData) => ipcRenderer.invoke('add-student', studentData),
  getStudents: () => ipcRenderer.invoke('get-students'),
  getClasses: () => ipcRenderer.invoke('get-classes'),
  addClass: (name) => ipcRenderer.invoke('add-class', name),
  deleteClass: (id) => ipcRenderer.invoke('delete-class', id),
  getExamResults: (studentId) => ipcRenderer.invoke('get-exam-results', studentId),
  addExamResult: (data) => ipcRenderer.invoke('add-exam-result', data),
  getDashboardStats: () => ipcRenderer.invoke('get-dashboard-stats'),
  getModules: () => ipcRenderer.invoke('get-modules'),
  getModuleContent: (moduleId) => ipcRenderer.invoke('get-module-content', moduleId),
  saveModuleContent: (moduleId, content) => ipcRenderer.invoke('save-module-content', { moduleId, content }),
  getLicenses: () => ipcRenderer.invoke('get-licenses'),
  addLicense: (data) => ipcRenderer.invoke('add-license', data),
  deleteLicense: (id) => ipcRenderer.invoke('delete-license', id),
  onLoginResponse: (callback) => ipcRenderer.on('login-response', callback)
});
