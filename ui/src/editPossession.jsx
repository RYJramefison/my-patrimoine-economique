import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button, Alert } from 'react-bootstrap';

export default function EditPossession({ possession, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        libelle: '',
        valeur: '',
        dateDebut: '',
        dateFin: '',
        taux: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (possession) {
            setFormData({
                libelle: possession.libelle || '',
                valeur: possession.valeur || '',
                dateDebut: possession.dateDebut ? new Date(possession.dateDebut).toISOString().split('T')[0] : '',
                dateFin: possession.dateFin ? new Date(possession.dateFin).toISOString().split('T')[0] : '',
                taux: possession.taux || ''
            });
        }
    }, [possession]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
            setSuccess('Possession mise à jour avec succès!');
            setError(null);
        } else {
            setError('Veuillez remplir tous les champs obligatoires.');
            setSuccess(null);
        }
    };

    const validateForm = () => {
        return formData.libelle && formData.valeur && formData.dateDebut && formData.taux;
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Éditer la Possession</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formLibelle">
                            <Form.Label>Libellé</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le libellé de la possession"
                                name="libelle"
                                value={formData.libelle}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formValeur">
                            <Form.Label>Valeur Initiale</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez la valeur initiale"
                                name="valeur"
                                value={formData.valeur}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formDateDebut">
                            <Form.Label>Date Début</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formDateFin">
                            <Form.Label>Date Fin</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formTaux">
                            <Form.Label>Taux d'Amortissement (%)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez le taux d'amortissement"
                                name="taux"
                                value={formData.taux}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">Enregistrer les Modifications</Button>
                <Button variant="secondary" className="ms-2" onClick={onCancel}>Annuler</Button>
            </Form>
        </Container>
    );
}
