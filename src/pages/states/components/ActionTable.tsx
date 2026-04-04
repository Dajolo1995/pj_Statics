import React from "react";
import { Button, Tooltip, Space } from "antd";

interface Props {
  record: any;
  handleOpenModal: (data?: any) => void;
  deleteData: (id: number) => void;
}

const ActionTable: React.FC<Props> = ({
  record,
  handleOpenModal,
  deleteData,
}) => {
  const actionButton = [
    {
      icon: <span className="material-symbols-outlined">edit</span>,
      label: "Edit",
      onClick: () => handleOpenModal(record),
    },
    {
      icon: <span className="material-symbols-outlined">delete</span>,
      label: "Delete",
      onClick: () => {
        deleteData(record.id);
      },
      danger: true,
    },
  ];

  return (
    <Space size="small">
      {actionButton.map((action, index) => (
        <Tooltip title={action.label} key={index}>
          <Button
            icon={action.icon}
            onClick={action.onClick}
            danger={action.danger}
          />
        </Tooltip>
      ))}
    </Space>
  );
};

export default ActionTable;
