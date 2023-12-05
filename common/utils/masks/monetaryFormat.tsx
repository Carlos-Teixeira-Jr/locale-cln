export function monetaryFormat(value: string) {
  try {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      throw new Error("Formato inválido");
    }

    const valorFormatado = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return valorFormatado;
  } catch (error) {
    return "Formato inválido";
  }
}
