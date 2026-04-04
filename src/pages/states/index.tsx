import React, { useState, useEffect } from "react";
import LayoutApp from "@/components/layout";
import Content from "./components/Content";
import {
  createDemo,
  createStatesRandom,
  deleteState,
  getStates,
  searchStates,
} from "./stateFunction";
import { formatCOP } from "@/utils/number";
import ActionTable from "./components/ActionTable";

const StatesData: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [stateData, setStateData] = useState({});
  const [states, setStates] = useState([] as any[]);
  const [stateSearch, setStateSearch] = useState("");

  const handleOpenModal = (data?: any) => {
    setStateData(data || {});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setStateData({});
    getStatesData();
  };

  const getStatesData = async () => {
    try {
      setStateSearch("");
      const states = await getStates();
      setStates(states);
    } catch (error) {
      console.error("Error fetching states data:", error);
    }
  };

  useEffect(() => {
    getStatesData();
  }, []);

  const deleteData = (id: number) => {
    try {
      deleteState(id);
      getStatesData();
    } catch (error) {
      console.error("Error deleting state:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: any) => <span> E{text}</span>,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
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
            handleOpenModal={handleOpenModal}
            deleteData={deleteData}
          />
        </>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setStateSearch(value);
  };

  const search = () => {
    if (stateSearch.trim() === "") {
      getStatesData();
    } else {
      const response = searchStates(stateSearch);

      setStates(response);
    }
  };

  const createDemoOfXlsx = () => {
    createDemo();
    getStatesData();
  };

  const createRamdom = () => {
    createStatesRandom();
    getStatesData();
  };

  return (
    <LayoutApp>
      <Content
        handleOpenModal={handleOpenModal}
        openModal={openModal}
        stateData={stateData}
        handleCloseModal={handleCloseModal}
        states={states}
        columns={columns}
        handleSearch={handleSearch}
        search={search}
        getStatesData={getStatesData}
        stateSearch={stateSearch}
        createDemoOfXlsx={createDemoOfXlsx}
        createRamdom={createRamdom}
      />
    </LayoutApp>
  );
};

export default StatesData;