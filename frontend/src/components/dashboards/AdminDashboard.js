import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await ApiService.getAdminDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
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
            <h2>Admin Dashboard</h2>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{dashboardData?.totalPatients || 0}</h3>
              <p>Total Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{dashboardData?.totalDoctors || 0}</h3>
              <p>Total Doctors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{dashboardData?.totalAppointments || 0}</h3>
              <p>Total Appointments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{dashboardData?.totalPrescriptions || 0}</h3>
              <p>Total Prescriptions</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                className="me-2 mb-2"
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
              <Button 
                variant="success" 
                className="me-2 mb-2"
                onClick={() => navigate('/admin/doctors')}
              >
                View Doctors
              </Button>
              <Button 
                variant="info" 
                className="me-2 mb-2"
                onClick={() => navigate('/admin/patients')}
              >
                View Patients
              </Button>
              <Button 
                variant="warning" 
                className="me-2 mb-2"
                onClick={() => navigate('/admin/appointments')}
              >
                View Appointments
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Appointments */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Recent Appointments</h5>
            </Card.Header>
            <Card.Body>
              {dashboardData?.recentAppointments?.length > 0 ? (
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.patient.firstName} {appointment.patient.lastName}</td>
                        <td>Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</td>
                        <td>{new Date(appointment.appointmentDateTime).toLocaleDateString()}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No recent appointments</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Prescriptions */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Recent Prescriptions</h5>
            </Card.Header>
            <Card.Body>
              {dashboardData?.recentPrescriptions?.length > 0 ? (
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Medicine</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentPrescriptions.map((prescription) => (
                      <tr key={prescription.id}>
                        <td>{prescription.patient.firstName} {prescription.patient.lastName}</td>
                        <td>Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}</td>
                        <td>{prescription.medicineName}</td>
                        <td>{new Date(prescription.prescribedDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No recent prescriptions</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;