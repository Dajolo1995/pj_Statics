// components/cea/CEAMatrix.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Empty,
  Progress,
} from "antd";
import {
  runCEAAsync,
  getCEAResult,
  type CEAResult,
  type CEAStep,
} from "./ceaFunction";
import LayoutApp from "@/components/layout";

const CEAMatrix: React.FC = () => {
  const [result, setResult] = useState<CEAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepsReady, setStepsReady] = useState<CEAStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const abortRef = useRef(false);

  useEffect(() => {
    const cached = getCEAResult();
    if (cached) setResult(cached);
  }, []);

  const handleRun = async () => {
    abortRef.current = false;
    setLoading(true);
    setResult(null);
    setStepsReady([]);
    setCurrentStep(0);

    try {
      const gen = runCEAAsync();

      for await (const event of gen) {
        if (abortRef.current) break;

        if (!event.done) {
          // Muestra progreso step a step
          setStepsReady((prev) => [...prev, event.currentStep]);
          setCurrentStep(event.stepNumber);
        } else {
          // Resultado final completo
          setResult(event.result);
          setStepsReady([]);
        }
      }
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Mientras carga muestra los steps que ya llegaron
  if (loading) {
    return (
      <LayoutApp>
        <Card style={{ textAlign: "center", padding: 40, marginBottom: "16px" }}>
          <div style={{ marginBottom: 16, fontSize: 16, color: "#1B4F8A" }}>
            Calculando CEA... step {currentStep}
          </div>
          <Progress
            percent={
              stepsReady.length > 0
                ? (currentStep / (currentStep + 1)) * 100
                : 0
            }
            status="active"
            strokeColor="#1B4F8A"
            style={{ maxWidth: 400, margin: "0 auto" }}
          />
          {stepsReady.length > 0 && (
            <div style={{ marginTop: 24, textAlign: "left" }}>
              {stepsReady.map((s, i) => (
                <Tag key={i} color="blue" style={{ marginBottom: 4 }}>
                  Step {s.step} · W={s.w.toFixed(4)} ·{" "}
                  {s.exitingClaimants.length} salen
                </Tag>
              ))}
            </div>
          )}
          <Button
            danger
            style={{ marginTop: 24 }}
            onClick={() => {
              abortRef.current = true;
              setLoading(false);
            }}
          >
            Cancelar
          </Button>
        </Card>
      </LayoutApp>
    );
  }

  if (!result) {
    return (
      <LayoutApp>
        <Empty description="No hay resultados CEA" style={{ marginTop: 48 }}>
          <Button type="primary" onClick={handleRun}>
            Calcular CEA
          </Button>
        </Empty>
      </LayoutApp>
    );
  }

  const { steps, assignments, totalAssigned, totalDemand, totalSupply } =
    result;

  const columns = [
    {
      title: "Claimant",
      dataIndex: "claimantId",
      key: "claimantId",
      fixed: "left" as const,
      width: 100,
      render: (v: number) =>
        v === -1 ? <strong>TOTAL</strong> : <strong>X{v}</strong>,
    },
    {
      title: "Demanda",
      dataIndex: "claim",
      key: "claim",
      width: 90,
      render: (v: number) => <strong>{v} TON</strong>,
    },
    ...steps.map((s, i) => ({
      title: (
        <span>
          P<sub>{i + 1}</sub>
          <br />
          <span style={{ fontSize: 11, fontWeight: 400, color: "#888" }}>
            W={s.w.toFixed(2)}
          </span>
        </span>
      ),
      dataIndex: ["steps", i],
      key: `step_${i}`,
      width: 90,
      render: (v: number, row: any) => {
        if (row.key === "total_row") return <strong>{v?.toFixed(2)}</strong>;
        const isActive = s.activeClaimants.includes(row.claimantId);
        const exited = s.exitingClaimants.includes(row.claimantId);
        if (!isActive) return <span style={{ color: "#ccc" }}>—</span>;
        return (
          <span
            style={{ color: exited ? "#E24B4A" : "#1B4F8A", fontWeight: 500 }}
          >
            {v.toFixed(2)}
            {exited && (
              <Tag
                color="red"
                style={{ marginLeft: 4, fontSize: 9, padding: "0 4px" }}
              >
                SALE
              </Tag>
            )}
          </span>
        );
      },
    })),
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      fixed: "right" as const,
      width: 100,
      render: (v: number) => (
        <strong style={{ color: "#0E8C7A" }}>{v.toFixed(2)}</strong>
      ),
    },
  ];

  const dataSource = [
    ...assignments.map((a) => ({ ...a, key: a.claimantId })),
    {
      key: "total_row",
      claimantId: -1,
      claim: totalDemand,
      steps: steps.map((s) => {
        const sum = assignments.reduce(
          (acc, a) => acc + (a.steps[steps.indexOf(s)] || 0),
          0,
        );
        return parseFloat(sum.toFixed(2));
      }),
      total: totalAssigned,
    },
  ];

  return (
    <LayoutApp>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card style={{marginBottom:"16px"}} size="small">
            <Statistic
              title="Claimants"
              value={assignments.length}
              valueStyle={{ color: "#1B4F8A" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{marginBottom:"16px"}} size="small">
            <Statistic
              title="Demanda total"
              value={totalDemand}
              suffix="TON"
              valueStyle={{ color: "#F07040" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{marginBottom:"16px"}} size="small">
            <Statistic
              title="Oferta total"
              value={totalSupply}
              suffix="TON"
              valueStyle={{ color: "#0E8C7A" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{marginBottom:"16px"}} size="small">
            <Statistic
              title="Escasez"
              value={totalDemand - totalSupply}
              suffix="TON"
              valueStyle={{ color: "#E24B4A" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={8}>
        {steps.map((s, i) => (
          <Col key={i} span={Math.floor(24 / steps.length)}>
            <Card  size="small" style={{ borderLeft: "3px solid #1B4F8A", marginBottom:"16px" }}>
              <div style={{ fontSize: 12, color: "#888" }}>Step {i + 1}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#1B4F8A" }}>
                W = {s.w.toFixed(4)}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                {s.activeClaimants.length} activos · {s.exitingClaimants.length}{" "}
                salen ·{" "}
                {s.exhaustedStates.map((e) => (
                  <Tag key={e} color="red" style={{ fontSize: 10, marginLeft: 4 }}>
                    E{e}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{marginBottom:"16px"}}
        size="small"
        title="Matriz de asignación CEA"
        extra={
          <Button size="small" onClick={handleRun}>
            Recalcular
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: "max-content" }}
          size="small"
          rowClassName={(record: any) =>
            record.key === "total_row" ? "total-row" : ""
          }
          style={{ fontSize: 13 }}
        />
      </Card>

      <style>{`.total-row td { background: #f5f5f5 !important; font-weight: 600; }`}</style>
    </LayoutApp>
  );
};

export default CEAMatrix;
