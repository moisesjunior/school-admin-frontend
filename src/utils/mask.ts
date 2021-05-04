export const maskCPF = (value: string) => {
  if (value !== null && value !== '' ){
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  } else {
    return value;  
  }
}

export const maskPhoneNumber = (value: string) => {
  if (value !== null && value !== '' ){
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  } else {
    return value;
  }
}

export const maskCEP = (value: string) => {
  if (value !== null && value !== '' ){
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d{3})/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  } else {
    return value;
  }
}