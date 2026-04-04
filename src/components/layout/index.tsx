import React, { useState } from "react";
import {
  HomeOutlined,
  DatabaseOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Card } from "antd";
import { useNavigate, useLocation } from "@/tools/router";
import "./layout.css";
import SiderLayout from "./Sider";
import HeaderLayout from "./HeaderLayout";
import routerApp from "@/config/router";

const { Content, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface Props {
  children: React.ReactNode;
}

const LayoutApp: React.FC<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const routes = routerApp();

  // 🔥 iconos según ruta
  const iconMap: Record<string, React.ReactNode> = {
    "/": <HomeOutlined />,
    "/states": <DatabaseOutlined />,
    "/claimants": <BuildOutlined />,
  };

  // 🔥 menu dinámico desde router
  const menuItems: MenuItem[] = routes
    .filter((route:any) => route.sibedar)
    .map((route) => ({
      key: route.path,
      icon: iconMap[route.path],
      label: route.name,
    }));

  // 🔥 navegación
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  // 🔥 selección activa
  const selectedKey = () => {
    return location.pathname || "/";
  };

  // 🔥 sin submenus
  const openKeys = () => [];

  // HEADER (lo dejamos igual como pediste)
  const headerTabs = [
    { label: "Dashboard", path: "/" },
    { label: "Estate Management", path: "/states" },
  ];

  const activeTab = () => {
    const path = location.pathname;
    if (path.startsWith("/states")) return "Estate Management";
    return "Dashboard";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SiderLayout
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        selectedKey={selectedKey as any}
        openKeys={openKeys}
        menuItems={menuItems}
        handleMenuClick={handleMenuClick}
      />

      <Layout>
        <HeaderLayout
          headerTabs={headerTabs}
          activeTab={activeTab}
          navigate={navigate}
        />

        <Content className="fs-content">
          <Card>{children}</Card>
        </Content>

        <Footer className="fs-footer">
          FairSplit © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;