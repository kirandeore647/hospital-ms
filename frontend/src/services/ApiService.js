import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class ApiService {
  // Admin endpoints
  async getAdminDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }

  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  }

  async getAllDoctors() {
    const response = await api.get('/admin/doctors');
    return response.data;
  }

  async getAllPatients() {
    const response = await api.get('/admin/patients');
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }

  // Doctor endpoints
  async getDoctorDashboard() {
    const response = await api.get('/doctor/dashboard');
    return response.data;
  }

  async getDoctorProfile() {
    const response = await api.get('/doctor/profile');
    return response.data;
  }

  async getDoctorAppointments() {
    const response = await api.get('/doctor/appointments');
    return response.data;
  }

  async updateAppointmentStatus(id, status) {
    const response = await api.put(`/doctor/appointments/${id}/status`, { status });
    return response.data;
  }

  async updateAppointmentNotes(id, notes) {
    const response = await api.put(`/doctor/appointments/${id}/notes`, { notes });
    return response.data;
  }

  async getDoctorPrescriptions() {
    const response = await api.get('/doctor/prescriptions');
    return response.data;
  }

  async createPrescription(prescriptionData) {
    const response = await api.post('/doctor/prescriptions', prescriptionData);
    return response.data;
  }

  async updatePrescription(id, prescriptionData) {
    const response = await api.put(`/doctor/prescriptions/${id}`, prescriptionData);
    return response.data;
  }

  async getPatientsForDoctor() {
    const response = await api.get('/doctor/patients');
    return response.data;
  }

  // Patient endpoints
  async getPatientDashboard() {
    const response = await api.get('/patient/dashboard');
    return response.data;
  }

  async getPatientProfile() {
    const response = await api.get('/patient/profile');
    return response.data;
  }

  async updatePatientProfile(profileData) {
    const response = await api.put('/patient/profile', profileData);
    return response.data;
  }

  async getPatientAppointments() {
    const response = await api.get('/patient/appointments');
    return response.data;
  }

  async bookAppointment(appointmentData) {
    const response = await api.post('/patient/appointments', appointmentData);
    return response.data;
  }

  async rescheduleAppointment(id, appointmentDateTime) {
    const response = await api.put(`/patient/appointments/${id}/reschedule`, { appointmentDateTime });
    return response.data;
  }

  async cancelAppointment(id) {
    const response = await api.delete(`/patient/appointments/${id}`);
    return response.data;
  }

  async getPatientPrescriptions() {
    const response = await api.get('/patient/prescriptions');
    return response.data;
  }

  async getDoctorsForPatient() {
    const response = await api.get('/patient/doctors');
    return response.data;
  }
}

export default new ApiService();