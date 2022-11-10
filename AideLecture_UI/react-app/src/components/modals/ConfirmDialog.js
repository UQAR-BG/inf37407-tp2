import React from "react";
import PropTypes from "prop-types";
import { confirmable, createConfirmation } from "react-confirm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ConfirmDialog = ({ show, proceed, confirmation, options }) => (
  <Modal show={show} onHide={() => proceed(false)}>
    <Modal.Header closeButton>
      <Modal.Title>{options.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{confirmation}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => proceed(false)}>
        Annuler
      </Button>
      <Button variant="primary" onClick={() => proceed(true)}>
        Confirmer
      </Button>
    </Modal.Footer>
  </Modal>
);

ConfirmDialog.propTypes = {
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string, // arguments of your confirm function
  options: PropTypes.object, // arguments of your confirm function
};

export const confirm = createConfirmation(confirmable(ConfirmDialog));

export function confirmWrapper(
  confirmation,
  options = { title: "Nous devons confirmer" }
) {
  return confirm({ confirmation, options });
}
