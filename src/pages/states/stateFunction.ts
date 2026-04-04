import { CEA_RESULT_KEY } from "../cae/ceaFunction";

const STORAGE_KEY = "states";

export const municipiosMagdalena = [
  "Algarrobo",
  "Aracataca",
  "Ariguaní",
  "Cerro de San Antonio",
  "Chivolo",
  "Ciénaga",
  "Concordia",
  "El Banco",
  "El Piñón",
  "El Retén",
  "Fundación",
  "Guamal",
  "Nueva Granada",
  "Pedraza",
  "Pijiño del Carmen",
  "Pivijay",
  "Plato",
  "Puebloviejo",
  "Remolino",
  "Sabanas de San Ángel",
  "Salamina",
  "San Sebastián de Buenavista",
  "San Zenón",
  "Santa Ana",
  "Santa Bárbara de Pinto",
  "Santa Marta",
  "Sitionuevo",
  "Tenerife",
  "Zapayán",
  "Zona Bananera",
];

/* =========================
   Helpers
========================= */

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

/* =========================
   Obtener último ID
========================= */

export const getLastStates = (): number => {
  const states = getStorageData();

  if (states.length === 0) return 0;

  return Math.max(...states.map((item) => item.id));
};

/* =========================
   Crear
========================= */

export const createStates = async (values: any) => {
  try {
    const states = getStorageData();

    const normalizedName = normalizeName(values.name);

    const exists = states.some((item) => item.name === normalizedName);

    if (exists) {
      throw new Error("El nombre ya existe");
    }

    const newId = getLastStates() + 1;

    const newState = {
      id: newId,
      name: normalizedName,
      quantity: values.quantity,
    };

    states.push(newState);
    setStorageData(states);

    return newState;
  } catch (error: any) {
    console.error("Error creating state:", error);
    throw error;
  }
};

/* =========================
   Obtener todos
========================= */

export const getStates = () => {
  return getStorageData();
};

/* =========================
   Obtener por ID
========================= */

export const getStateById = (id: number) => {
  const states = getStorageData();
  return states.find((item) => item.id === id);
};

/* =========================
   Actualizar
========================= */

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

    setStorageData(updated);
    return updated;
  } catch (error: any) {
    console.error("Error updating state:", error);
    throw error;
  }
};

/* =========================
   Eliminar
========================= */

export const deleteState = (id: number) => {
  try {
    const states = getStorageData();

    const filtered = states.filter((item) => item.id !== id);

    setStorageData(filtered);
    return filtered;
  } catch (error) {}
};

/* =========================
   Buscador (fuzzy simple)
========================= */

export const searchStates = (query: string) => {
  const states = getStorageData();

  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return states;

  return states.filter((item) => {
    const name = item.name.toLowerCase();

    // coincidencia directa
    if (name.includes(normalizedQuery)) return true;

    // coincidencia por similitud (letras en orden)
    let i = 0;
    for (let char of name) {
      if (char === normalizedQuery[i]) i++;
      if (i === normalizedQuery.length) return true;
    }

    return false;
  });
};

export const createStatesRandom = () => {
  clearStatesStorage();
  const result = [];

  for (const municipio of municipiosMagdalena) {
    result.push(
      createStates({
        name: municipio,
        quantity: Math.floor(Math.random() * 100) + 1,
      }),
    );
  }

  localStorage.removeItem(CEA_RESULT_KEY);

  return result;
};

export const createDemo = () => {
  clearStatesStorage();
  const states = [
    {
      id: 1,
      name: "FUNDACIÓN",
      quantity: 25,
    },
    {
      id: 2,
      name: "ARACATACA",
      quantity: 20,
    },
    {
      id: 3,
      name: "PLATO",
      quantity: 18,
    },
    {
      id: 4,
      name: "SITIONUEVO",
      quantity: 15,
    },
  ];

  let result = [];

  for (const municipio of states) {
    result.push(
      createStates({
        name: municipio.name,
        quantity: municipio.quantity,
      }),
    );
  }

  return result;
};

export const clearStatesStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
