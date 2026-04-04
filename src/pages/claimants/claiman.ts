import { getStates } from "@/pages/states/stateFunction";
import { CEA_RESULT_KEY } from "../cae/ceaFunction";

const STORAGE_KEY = "claims";

const getStorageData = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setStorageData = (data: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const normalizeName = (name: string) => {
  return name?.trim().toUpperCase();
};

export const createStates = (values: any) => {
  try {
    const states = getStorageData();

    const normalizedName = normalizeName(values.name);
    const normalizeFruits = normalizeName(values.fruit);

    const exists = states.some((item) => item.name === normalizedName);

    if (exists) {
      throw new Error("El nombre ya existe");
    }

    const newId = getLastStates() + 1;

    const newState = {
      id: newId,
      name: normalizedName,
      quantity: values.quantity,
      fruit: normalizeFruits,
      stateId: values.stateId,
    };

    states.push(newState);
    setStorageData(states);

    localStorage.removeItem(CEA_RESULT_KEY);

    return newState;
  } catch (error: any) {
    console.error("Error creating state:", error);
    throw error;
  }
};

export const getLastStates = (): number => {
  const states = getStorageData();

  if (states.length === 0) return 0;

  return Math.max(...states.map((item) => item.id));
};

export const getClaimants = () => {
  return getStorageData();
};

export const deleteState = (id: number) => {
  try {
    const states = getStorageData();

    const filtered = states.filter((item) => item.id !== id);

    setStorageData(filtered);
    return filtered;
  } catch (error) {}
};

export const statesSelect = async () => {
  const response = await getStates();

  return response.map((state: any) => ({
    label: state.name,
    value: state.id,
  }));
};

export const updateState = (id: number, values: any) => {
  try {
    const states = getStorageData();

    const normalizedName = normalizeName(values.name);

    const exists = states.some(
      (item) => item.name === normalizedName && item.id !== id,
    );

    if (exists) {
      throw new Error("El nombre ya existe");
    }

    const updated = states.map((item) =>
      item.id === id
        ? {
            ...item,
            ...values,
            name: normalizedName,
          }
        : item,
    );

    console.log("Estado actualizado:", updated);

    setStorageData(updated);
    return updated;
  } catch (error: any) {
    console.error("Error updating state:", error);
    throw error;
  }
};

export const seedClaimants = async () => {
  clearStatesStorage();
  const defaultClaimants = [
    { name: "Claimant 1", quantity: 10, fruit: "Mango", stateId: [1] },
    { name: "Claimant 2", quantity: 9, fruit: "Guava", stateId: [1] },
    { name: "Claimant 3", quantity: 8, fruit: "Pawpaw", stateId: [1, 2] },
    { name: "Claimant 4", quantity: 10, fruit: "Pawpaw", stateId: [2] },
    { name: "Claimant 5", quantity: 9, fruit: "Mango", stateId: [1, 2] },
    { name: "Claimant 6", quantity: 7, fruit: "Pawpaw", stateId: [2, 3] },
    { name: "Claimant 7", quantity: 7, fruit: "Melon", stateId: [3] },
    { name: "Claimant 8", quantity: 8, fruit: "Guava", stateId: [3] },
    { name: "Claimant 9", quantity: 9, fruit: "Pawpaw", stateId: [3, 4] },
    { name: "Claimant 10", quantity: 6, fruit: "Mango", stateId: [2, 3] },
    { name: "Claimant 11", quantity: 5, fruit: "Pineapple", stateId: [4] },
    { name: "Claimant 12", quantity: 5, fruit: "Guava", stateId: [3, 4] },
    { name: "Claimant 13", quantity: 7, fruit: "Melon", stateId: [4] },
    { name: "Claimant 14", quantity: 8, fruit: "Pineapple", stateId: [4] },
  ];

  for (const claimant of defaultClaimants) {
    try {
      await createStates(claimant);
    } catch (error: any) {
      console.warn(`Skipped ${claimant.name}: ${error.message}`);
    }
  }
};

export const searchClaimants = (query?: string, stateId?: number) => {
  const data = getStorageData();

  const normalizedQuery = query?.toLowerCase().trim() || "";

  if (!normalizedQuery && !stateId) return data;

  const matchFuzzy = (text: string, query: string) => {
    if (text.includes(query)) return true;

    let i = 0;
    for (const char of text) {
      if (char === query[i]) i++;
      if (i === query.length) return true;
    }

    return false;
  };

  return data.filter((item: any) => {
    const name = item.name.toLowerCase();
    const fruit = item.fruit.toLowerCase();

    const matchText = normalizedQuery
      ? matchFuzzy(name, normalizedQuery) || matchFuzzy(fruit, normalizedQuery)
      : true;

    const matchState = stateId ? item.stateId.includes(stateId) : true;

    return matchText && matchState;
  });
};

export const seedClaimantsRandom = async () => {
  clearStatesStorage();
  const states = getStates(); // asumo que aquí tienes los states
  const totalStates = states.length;

  if (!totalStates) return;

  const fruits = ["Mango", "Guava", "Pawpaw", "Melon", "Pineapple"];

  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomStates = () => {
    const maxStates = totalStates - 1 || 1;
    const count = getRandomInt(1, maxStates);

    const shuffled = [...states]
      .sort(() => 0.5 - Math.random())
      .slice(0, count);

    return shuffled.map((s: any) => s.id);
  };

  const claimants: any[] = [];

  let idCounter = 1;

  // 🔥 1. Garantizar mínimo 1 claimant por cada state
  for (const state of states) {
    claimants.push({
      name: `Claimant ${idCounter++}`,
      quantity: getRandomInt(5, 15),
      fruit: fruits[getRandomInt(0, fruits.length - 1)],
      stateId: [state.id],
    });
  }

  // 🔥 2. Generar adicionales (como tu ejemplo: ~14 total)
  const extraCount = Math.max(10, totalStates * 2);

  for (let i = 0; i < extraCount; i++) {
    claimants.push({
      name: `Claimant ${idCounter++}`,
      quantity: getRandomInt(5, 15),
      fruit: fruits[getRandomInt(0, fruits.length - 1)],
      stateId: getRandomStates(),
    });
  }

  // 🔥 3. Guardar
  for (const claimant of claimants) {
    try {
      await createStates(claimant);
    } catch (error: any) {
      console.warn(`Skipped ${claimant.name}: ${error.message}`);
    }
  }
};

export const clearStatesStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
