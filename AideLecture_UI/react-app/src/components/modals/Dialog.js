import React from "react";
import PropTypes from "prop-types";
import { confirmable, createConfirmation } from "react-confirm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Dialog = ({ show, proceed, confirmation, options }) => (
  <Modal show={show} onHide={() => proceed(false)}>
    <Modal.Header closeButton>
      <Modal.Title>{options.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{confirmation}</Modal.Body>
    <Modal.Footer>
      <Button variant={options.color} onClick={() => proceed(true)}>
        {options.label}
      </Button>
    </Modal.Footer>
  </Modal>
);

Dialog.propTypes = {
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string, // arguments of your confirm function
  options: PropTypes.object, // arguments of your confirm function
};

export const dialog = createConfirmation(confirmable(Dialog));

export function dialogWrapper(confirmation, options = {}) {
  return dialog({ confirmation, options });
}

export function errorDialogWrapper(
  confirmation,
  options = {
    title: "Erreur",
    color: "danger",
    label: "Fermer",
  }
) {
  return dialog({ confirmation, options });
}
