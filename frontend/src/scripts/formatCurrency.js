// Convertir el numero parametrado a moneda de Guatemala
export const formatCurrency = (number) => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(number);
};
