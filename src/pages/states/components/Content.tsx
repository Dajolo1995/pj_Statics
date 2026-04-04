import React from "react";
import Action from "./Action";
import FormState from "./FormState";
import { Modal, Table } from "antd";

interface Props {
  handleOpenModal: (data?: any) => void;
  openModal: boolean;
  stateData: any;
  handleCloseModal: () => void;
  states: any[];
  columns: any[];
  handleSearch: (value: string) => void;
  search: () => void;
  getStatesData: () => void;
  stateSearch: string;
  createRamdom: () => void;
  createDemoOfXlsx: () => void;
}

const Content: React.FC<Props> = ({
  handleOpenModal,
  openModal,
  stateData,
  handleCloseModal,
  states,
  columns,
  handleSearch,
  search,
  getStatesData,
  stateSearch,
  createRamdom,
  createDemoOfXlsx
}) => {
  return (
    <>
      <Action
        handleOpenModal={handleOpenModal}
        handleSearch={handleSearch}
        search={search}
        getStatesData={getStatesData}
        stateSearch={stateSearch}
        createRamdom={createRamdom}
        createDemoOfXlsx={createDemoOfXlsx}
      />

      <Table dataSource={states} columns={columns} />

      <Modal
        title={
          stateData?.id ? `Edit State: ${stateData?.name}` : "Create State"
        }
        open={openModal}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        destroyOnHidden
      >
        <FormState handleCloseModal={handleCloseModal} stateData={stateData} />
      </Modal>
    </>
  );
};

export default Content;
