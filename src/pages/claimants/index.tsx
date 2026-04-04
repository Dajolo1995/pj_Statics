import React, { useState, useEffect } from "react";
import LayoutApp from "@/components/layout";

import Content from "./components/Content";
import { deleteState, seedClaimantsRandom, statesSelect } from "./claiman";
import { getClaimants, seedClaimants } from "./claiman";
import { formatCOP } from "@/utils/number";
import ActionTable from "../states/components/ActionTable";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const Claimants: React.FC = () => {
  const [claimants, setClaimants] = useState<any[]>([]);
  const [selectedClaimant, setSelectedClaimant] = useState<any>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [stateSearch, setStateSearch] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  // const [selectedStates, setSelectedStates] = useState<string>("");
  const [states, setStates] = useState<any[]>([]);

  const handleModalOpen = (data?: any) => {
    setSelectedClaimant(data || null);
    setOpenModal(true);
  };

  const actionButton = [
    {
      icon: <SearchOutlined />,
      text: "Buscar",
      type: "primary",
      onClick: () => {},
    },
    {
      icon: <DeleteOutlined />,
      text: "Limpiar",
      onClick: () => {},
    },
    {
      icon: <AppstoreAddOutlined />,
      text: "Agregar Demo",
      type: "default",
      onClick: () => createDemoOfXlsx(),
    },
    {
      icon: <ThunderboltOutlined />,
      text: "Crear Random",
      type: "default",
      onClick: () => ramdomClaimants(),
    },
    {
      icon: <PlusOutlined />,
      text: "Crear",
      type: "primary",
      onClick: () => handleModalOpen(),
    },
  ] as any;

  // const handleSearch = (value: string) => {
  //   setStateSearch(value);
  // };

  // const hanndleStates = (value: string) => {
  //   setSelectedStates(value);
  // };

  // const onClear = () => {
  //   setStateSearch("");
  //   setSelectedStates("");
  // };

  const onClose = () => {
    setOpenModal(false);
    setSelectedClaimant(null);
    getStates();
    getClaimantsData();
  };

  const getStates = async () => {
    const response = await statesSelect();
    setStates(response);
  };

  const getClaimantsData = () => {
    const response = getClaimants();
    setClaimants(response || []);
  };

  const selecteName = (data: string | number) => {
    const selected = states.find((item) => item.value === data);
    return selected ? selected.label : "";
  };

  useEffect(() => {
    getStates();
    getClaimantsData();
  }, []);

  const deleteData = (id: number) => {
    try {
      deleteState(id);
      getClaimantsData();
    } catch (error) {
      console.error("Error deleting state:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: any) => <span> C{text}</span>,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Estado",
      dataIndex: "stateId",
      key: "state",
      render: (_: any, record: any) => {
        const stateNames = record?.stateId?.map((data: any) =>
          selecteName(data),
        );

        return <span>{stateNames.join(", ")}</span>;
      },
    },

    {
      title: "Fruta",
      dataIndex: "fruit",
      key: "fruit",
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: any) => <span> {formatCOP(text)}</span>,
    },
    {
      title: "Action",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: any) => (
        <>
          <ActionTable
            record={record}
            handleOpenModal={handleModalOpen}
            deleteData={deleteData}
          />
        </>
      ),
    },
  ];

  const createDemoOfXlsx = async () => {
    await seedClaimants();
     getClaimantsData();
  };


  const ramdomClaimants = async () => {
    await seedClaimantsRandom();
    getClaimantsData();
  }

  return (
    <LayoutApp>
      <Content
        actionButton={actionButton}
        openModal={openModal}
        selectedClaimant={selectedClaimant}
        onClose={onClose}
        states={states}
        claimants={claimants}
        columns={columns}
      />
    </LayoutApp>
  );
};

export default Claimants;
