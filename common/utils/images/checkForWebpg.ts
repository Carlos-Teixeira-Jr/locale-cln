export function checkForWebpFiles(fileList: FileList) {
  // Converte o FileList em um array para facilitar a manipulação
  const filesArray = Array.from(fileList);

  // Percorre o array de arquivos
  for (const file of filesArray) {
    // Verifica se o tipo do arquivo é "image/webp"
    if (file.type === 'image/webp') {
      return true; // Encontrou um arquivo do tipo webp
    }
  }
  return false; // Nenhum arquivo do tipo webp foi encontrado
}