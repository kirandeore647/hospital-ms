import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

const PatientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    appointmentDateTime: new Date(),
    reason: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
    loadAppointments();
    loadPrescriptions();
    loadDoctors();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await ApiService.getPatientDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await ApiService.getPatientAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadPrescriptions = async () => {
    try {
      const data = await ApiService.getPatientPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await ApiService.getDoctorsForPatient();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...appointmentForm,
        appointmentDateTime: appointmentForm.appointmentDateTime.toISOString().slice(0, 19)
      };
      await ApiService.bookAppointment(appointmentData);
      setShowAppointmentModal(false);
      setAppointmentForm({
        doctorId: '',
        appointmentDateTime: new Date(),
        reason: ''
      });
      loadAppointments();
      loadDashboard();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Please try again.');
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await ApiService.cancelAppointment(id);
        loadAppointments();
        loadDashboard();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'SCHEDULED': 'primary',
      'CONFIRMED': 'success',
      'COMPLETED': 'info',
      'CANCELLED': 'danger',
      'NO_SHOW': 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Patient Dashboard</h2>
            <div>
              <Button 
                variant="primary" 
                className="me-2"
                onClick={() => setShowAppointmentModal(true)}
              >
                Book Appointment
              </Button>
              <Button 
                variant="info" 
                className="me-2"
                onClick={() => navigate('/patient/profile')}
              >
                Profile
              </Button>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{dashboardData?.totalAppointments || 0}</h3>
              <p>Total Appointments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{dashboardData?.totalPrescriptions || 0}</h3>
              <p>Total Prescriptions</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Appointments */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>My Appointments</h5>
            </Card.Header>
            <Card.Body>
              {appointments.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 10).map((appointment) => (
                      <tr key={appointment.id}>
                        <td>Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</td>
                        <td>{new Date(appointment.appointmentDateTime).toLocaleString()}</td>
                        <td>{appointment.reason}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                        <td>
                          {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No appointments found. <Button variant="link" onClick={() => setShowAppointmentModal(true)}>Book your first appointment</Button></p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Prescriptions */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>My Prescriptions</h5>
            </Card.Header>
            <Card.Body>
              {prescriptions.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Instructions</th>
                      <th>Duration</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.slice(0, 10).map((prescription) => (
                      <tr key={prescription.id}>
                        <td>Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}</td>
                        <td>{prescription.medicineName}</td>
                        <td>{prescription.dosage}</td>
                        <td>{prescription.instructions}</td>
                        <td>{prescription.duration} days</td>
                        <td>{new Date(prescription.prescribedDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No prescriptions found</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Book Appointment Modal */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAppointmentSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                value={appointmentForm.doctorId}
                onChange={(e) => setAppointmentForm({...appointmentForm, doctorId: e.target.value})}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Appointment Date & Time</Form.Label>
              <div>
                <DatePicker
                  selected={appointmentForm.appointmentDateTime}
                  onChange={(date) => setAppointmentForm({...appointmentForm, appointmentDateTime: date})}
                  showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  className="form-control"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                placeholder="Describe the reason for your visit"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Book Appointment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PatientDashboard;