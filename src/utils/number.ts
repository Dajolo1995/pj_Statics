export const formatCOP = (value: number | string): string => {
  if (value === null || value === undefined) return "";

  // Convertir a string
  let cleanValue = value.toString();

  // Eliminar todo excepto números y coma/punto
  cleanValue = cleanValue.replace(/[^0-9.,]/g, "");

  // Detectar si tiene decimales
  let [integerPart, decimalPart] = cleanValue.split(/[.,]/);

  // Formatear miles
  const formattedInteger = integerPart
    .replace(/^0+(?!$)/, "") // quitar ceros a la izquierda
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Si hay decimales
  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
};