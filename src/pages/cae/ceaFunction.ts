// ceaFunction.ts

export const CEA_RESULT_KEY = "cea_result";

export interface CEAStep {
  step: number;
  w: number;
  activeClaimants: number[];
  exhaustedStates: number[];
  exitingClaimants: number[];
  stateCapacitiesAfter: Record<number, number>;
}

export interface CEAAssignment {
  claimantId: number;
  claim: number;
  steps: number[];
  total: number;
}

export interface CEAResult {
  steps: CEAStep[];
  assignments: CEAAssignment[];
  totalAssigned: number;
  totalDemand: number;
  totalSupply: number;
}

export interface CEAProgress {
  currentStep: CEAStep;
  stepNumber: number;
  done: false;
}

export interface CEADone {
  result: CEAResult;
  done: true;
}

const getCEAResult = (): CEAResult | null => {
  const data = localStorage.getItem(CEA_RESULT_KEY);
  return data ? JSON.parse(data) : null;
};

const setCEAResult = (result: CEAResult): void => {
  localStorage.setItem(CEA_RESULT_KEY, JSON.stringify(result));
};

const sleep = () => new Promise<void>((resolve) => setTimeout(resolve, 0));


/**
 * Ejecuta el algoritmo CEA (Constrained Equal Awards) de forma asíncrona,
 * emitiendo el progreso paso a paso mediante un `AsyncGenerator`.
 *
 * ### Fuente de datos
 * Lee directamente desde `localStorage`:
 * - `"claims"`: `Array<{ id: number; quantity: number; stateId: number[] }>`
 *   Lista de reclamantes con su reclamación (`quantity`) y los estados a los que tienen acceso (`stateId`).
 * - `"states"`: `Array<{ id: number; quantity: number }>`
 *   Lista de estados con su capacidad disponible (`quantity`).
 * 
 * ### Lógica por iteración
 * En cada step, W se calcula como el **mínimo** entre:
 * 1. Para cada estado activo: `capacidad_del_estado / número_de_reclamantes_activos_que_lo_usan`
 *    → garantiza que ningún estado se sobrepase.
 * 2. El menor residuo pendiente entre todos los reclamantes activos
 *    → garantiza que ningún reclamante recibe más de lo que reclamó.
 *
 * Ese W se distribuye equitativamente. Luego:
 * - Se descuenta W de cada estado por cada reclamante que lo usa.
 * - Los estados que llegan a 0 se marcan como `exhaustedStates`.
 * - Los reclamantes vinculados a al menos un estado agotado salen como `exitingClaimants`.
 *
 * ### Uso con `for await...of`
 * ```ts
 * for await (const event of runCEAAsync()) {
 *   if (!event.done) {
 *     console.log(`Step ${event.stepNumber}:`, event.currentStep);
 *   } else {
 *     console.log("Resultado final:", event.result);
 *   }
 * }
 * ```
 *
 * @yields `CEAProgress` en cada step completado (con `done: false`).
 * @yields `CEADone` al finalizar el algoritmo (con `done: true`).
 * @throws Error si no existen `"claims"` o `"states"` en localStorage.
 */

export async function* runCEAAsync(): AsyncGenerator<CEAProgress | CEADone> {
  const claimantsRaw = localStorage.getItem("claims");
  const statesRaw = localStorage.getItem("states");

  if (!claimantsRaw || !statesRaw) {
    throw new Error("No hay claimants o states en localStorage");
  }

  const claimants: { id: number; quantity: number; stateId: number[] }[] =
    JSON.parse(claimantsRaw);
  const statesArr: { id: number; quantity: number }[] = JSON.parse(statesRaw);

  const stateCapacity: Record<number, number> = {};
  statesArr.forEach((s) => { stateCapacity[s.id] = s.quantity; });

  const totalSupply = Object.values(stateCapacity).reduce((a, b) => a + b, 0);
  const totalDemand = claimants.reduce((a, c) => a + c.quantity, 0);

  const residuals: Record<number, number> = {};
  claimants.forEach((c) => { residuals[c.id] = c.quantity; });

  const assignmentMap: Record<number, number[]> = {};
  claimants.forEach((c) => { assignmentMap[c.id] = []; });

  let activeIds = claimants.map((c) => c.id);
  const ceaSteps: CEAStep[] = [];
  let stepNumber = 0;

  while (activeIds.length > 0) {
    stepNumber++;

    let W = Infinity;

    for (const sid of Object.keys(stateCapacity).map(Number)) {
      const users = activeIds.filter((id) => {
        const c = claimants.find((x) => x.id === id)!;
        return c.stateId.includes(sid);
      });
      if (users.length > 0 && stateCapacity[sid] > 0) {
        W = Math.min(W, stateCapacity[sid] / users.length);
      }
    }

    const minResidual = Math.min(...activeIds.map((id) => residuals[id]));
    W = Math.min(W, minResidual);
    W = parseFloat(W.toFixed(6));

    activeIds.forEach((id) => {
      assignmentMap[id].push(W);
      residuals[id] = parseFloat((residuals[id] - W).toFixed(6));
    });

    for (const sid of Object.keys(stateCapacity).map(Number)) {
      const users = activeIds.filter((id) => {
        const c = claimants.find((x) => x.id === id)!;
        return c.stateId.includes(sid);
      });
      if (users.length > 0) {
        stateCapacity[sid] = parseFloat(
          (stateCapacity[sid] - users.length * W).toFixed(6)
        );
        if (stateCapacity[sid] < 0.0001) stateCapacity[sid] = 0;
      }
    }

    const exhaustedStates = Object.entries(stateCapacity)
      .filter(([, cap]) => cap <= 0)
      .map(([id]) => Number(id));

    const exitingClaimants = activeIds.filter((id) => {
      const c = claimants.find((x) => x.id === id)!;
      return c.stateId.some((sid) => exhaustedStates.includes(sid));
    });

    const currentStep: CEAStep = {
      step: stepNumber,
      w: W,
      activeClaimants: [...activeIds],
      exhaustedStates,
      exitingClaimants,
      stateCapacitiesAfter: { ...stateCapacity },
    };

    ceaSteps.push(currentStep);

    // ← Cede el hilo, persiste el paso y notifica al componente
    yield { currentStep, stepNumber, done: false };
    await sleep();

    activeIds = activeIds.filter((id) => !exitingClaimants.includes(id));
  }

  const maxSteps = ceaSteps.length;
  const assignments: CEAAssignment[] = claimants.map((c) => {
    const steps = assignmentMap[c.id];
    while (steps.length < maxSteps) steps.push(0);
    const total = parseFloat(steps.reduce((a, b) => a + b, 0).toFixed(6));
    return { claimantId: c.id, claim: c.quantity, steps, total };
  });

  const totalAssigned = parseFloat(
    assignments.reduce((a, b) => a + b.total, 0).toFixed(6)
  );

  const result: CEAResult = {
    steps: ceaSteps,
    assignments,
    totalAssigned,
    totalDemand,
    totalSupply,
  };

  setCEAResult(result);
  yield { result, done: true };
}

export { getCEAResult };