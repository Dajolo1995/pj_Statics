import { SwapOutlined } from "@ant-design/icons";
import { Layout, Menu, type MenuProps } from "antd";
import React from "react";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  selectedKey: () => string;
  openKeys: () => string[];
  menuItems: MenuItem[];
  handleMenuClick: MenuProps["onClick"];
}

const SiderLayout: React.FC<Props> = ({
  collapsed,
  setCollapsed,
  selectedKey,
  openKeys,
  menuItems,
  handleMenuClick,
}) => {
  return (
    <Sider
      className="fs-sider"
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={220}
      collapsedWidth={64}
    >
      {/* LOGO */}
      <div className="fs-logo">
        <div className="fs-logo__icon">
          <SwapOutlined style={{ fontSize: 18, color: "#fff" }} />
        </div>

        {!collapsed && (
          <div className="fs-logo__text">
            <span className="fs-logo__title">FairSplit</span>
            <br/>
            <span className="fs-logo__subtitle">
              Analytical Architect
            </span>
          </div>
        )}
      </div>

      {/* MENU */}
      <Menu
        className="fs-menu"
        mode="inline"
        selectedKeys={[selectedKey()]}
        openKeys={openKeys()}
        items={menuItems}
        onClick={handleMenuClick}
      />

      {/* VERSION */}
      {!collapsed && (
        <div className="fs-version">
          <div className="fs-version__badge">
            v1.0.0 — FairSplit Engine
          </div>
        </div>
      )}
    </Sider>
  );
};

export default SiderLayout;