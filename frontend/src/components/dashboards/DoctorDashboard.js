import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicineName: '',
    dosage: '',
    instructions: '',
    duration: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
    loadAppointments();
    loadPrescriptions();
    loadPatients();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await ApiService.getDoctorDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await ApiService.getDoctorAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadPrescriptions = async () => {
    try {
      const data = await ApiService.getDoctorPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await ApiService.getPatientsForDoctor();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await ApiService.updateAppointmentStatus(id, status);
      loadAppointments();
      loadDashboard();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createPrescription(prescriptionForm);
      setShowPrescriptionModal(false);
      setPrescriptionForm({
        patientId: '',
        medicineName: '',
        dosage: '',
        instructions: '',
        duration: ''
      });
      loadPrescriptions();
      loadDashboard();
    } catch (error) {
      console.error('Error creating prescription:', error);
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
            <h2>Doctor Dashboard</h2>
            <div>
              <Button 
                variant="success" 
                className="me-2"
                onClick={() => setShowPrescriptionModal(true)}
              >
                Create Prescription
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

      {/* Appointments */}
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
                      <th>Patient</th>
                      <th>Date & Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 10).map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.patient.firstName} {appointment.patient.lastName}</td>
                        <td>{new Date(appointment.appointmentDateTime).toLocaleString()}</td>
                        <td>{appointment.reason}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                        <td>
                          {appointment.status === 'SCHEDULED' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="success" 
                                className="me-1"
                                onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                              >
                                Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === 'CONFIRMED' && (
                            <Button 
                              size="sm" 
                              variant="info"
                              onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                            >
                              Complete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No appointments found</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Prescriptions */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Recent Prescriptions</h5>
            </Card.Header>
            <Card.Body>
              {prescriptions.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.slice(0, 10).map((prescription) => (
                      <tr key={prescription.id}>
                        <td>{prescription.patient.firstName} {prescription.patient.lastName}</td>
                        <td>{prescription.medicineName}</td>
                        <td>{prescription.dosage}</td>
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

      {/* Prescription Modal */}
      <Modal show={showPrescriptionModal} onHide={() => setShowPrescriptionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Prescription</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePrescriptionSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Patient</Form.Label>
              <Form.Select
                value={prescriptionForm.patientId}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, patientId: e.target.value})}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Medicine Name</Form.Label>
              <Form.Control
                type="text"
                value={prescriptionForm.medicineName}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, medicineName: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dosage</Form.Label>
              <Form.Control
                type="text"
                value={prescriptionForm.dosage}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={prescriptionForm.instructions}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control
                type="number"
                value={prescriptionForm.duration}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPrescriptionModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Prescription
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DoctorDashboard;