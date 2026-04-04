import React from "react";
import Action from "./Action";
import { Modal, Table } from "antd";
import FormClaimants from "./FormClaimants";

interface Props {
  actionButton: any[];
  openModal: boolean;
  selectedClaimant: any;
  onClose: () => void;
  states: any[];
  claimants: any[];
  columns: any[];
}

const Content: React.FC<Props> = ({
  actionButton,
  openModal,
  selectedClaimant,
  onClose,
  states,
  claimants,
  columns
}) => {
  console.log(claimants);

  return (
    <>
      <Action actionButton={actionButton} states={states} />

      <Table dataSource={claimants} columns={columns} />

      <Modal
        open={openModal}
        onCancel={onClose}
        footer={null}
        width={700}
        destroyOnHidden
        title={selectedClaimant ? `Editar reclamante ${selectedClaimant.name}` : "Agregar reclamante"}
      >
        <FormClaimants
          states={states}
          selectedClaimant={selectedClaimant}
          onClose={onClose}
        />
      </Modal>
    </>
  );
};

export default Content;
