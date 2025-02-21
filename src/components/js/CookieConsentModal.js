import React from "react";
import { Modal, Button } from "react-bootstrap";

const CookieConsentModal = ({ show, onAccept, onDecline }) => {
  return (
    <Modal show={show} onHide={onDecline} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cookie Consent</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>We use cookies to enhance your experience. Do you allow us to use cookies?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onDecline}>
          Decline
        </Button>
        <Button variant="primary" onClick={onAccept}>
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieConsentModal;
