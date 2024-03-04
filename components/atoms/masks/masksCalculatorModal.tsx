export const cepMask = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 9;
  let value = event.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  event.currentTarget.value = value;
  return event;
};

export const currencyMask = (event: React.FormEvent<HTMLInputElement>) => {
  let value = event.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d)(\d{2})$/, '$1,$2');
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
  event.currentTarget.value = value;
  return event;
};

export const cpfMask = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 14;
  let value = event.currentTarget.value;
  if (!value.match(/^(\d{3}).(\d{3}).(\d{3})-(\d{2})$/)) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
    event.currentTarget.value = value;
  }
  return event;
};

export const areaMask = (event: React.FormEvent<HTMLInputElement>) => {
  const inputElement = event.currentTarget;
  const selectionStart = inputElement.selectionStart;
  const selectionEnd = inputElement.selectionEnd;
  let value = inputElement.value;
  // Verifica se a tecla pressionada é o "Backspace"
  const isBackspace = event.nativeEvent instanceof KeyboardEvent && event.nativeEvent.key === 'Backspace';
  if (isBackspace) {
    // Remove o último caractere se o cursor estiver no final do valor
    if (selectionStart === selectionEnd && selectionStart === value.length) {
      value = value.slice(0, -1);
    }
  } else {
    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, '');
  }
  value += ' m²';
  // Atualiza o valor do input
  inputElement.value = value;
  // Restaura a posição do cursor
  inputElement.setSelectionRange(selectionStart, selectionEnd);
  return event;
};

export const cellPhoneMask = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 15;
  let value = event.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  event.currentTarget.value = value;
  return event;
};

export const phoneMask = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 14;
  let value = event.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');
  event.currentTarget.value = value;
  return event;
};

export const cardNumber = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 19;
  let value = event.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{4})(\d)/, '$1.$2');
  value = value.replace(/(\d{4})(\d)/, '$1.$2');
  value = value.replace(/(\d{4})(\d)/, '$1.$2');
  event.currentTarget.value = value;
  return event;
};

export const expiryDateMask = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 5;
  let value = event.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/, '$1/$2');
  event.currentTarget.value = value;
  return event;
};

export const cvcCardMask = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 3;
  let value = event.currentTarget.value;
  value = value.replace(/\D/g, '');
  event.currentTarget.value = value;
  return event;
};

export const ufMask = (event: React.FormEvent<HTMLInputElement>) => {
  event.currentTarget.maxLength = 2;
  let value = event.currentTarget.value;
  value = value.replace(/\d/g, '');
  value = value.toUpperCase();
  event.currentTarget.value = value;
  return event;
};
