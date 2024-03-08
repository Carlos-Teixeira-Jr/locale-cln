export function monetaryFormat(value: string) {
  try {
    const numericValue = parseInt(value);

    if (isNaN(numericValue)) {
      throw new Error("Formato inválido");
    }

    const formattedInteger = numericValue.toLocaleString("pt-BR");

    return "R$ " + formattedInteger;
  } catch (error) {
    return "Formato inválido";
  }
}