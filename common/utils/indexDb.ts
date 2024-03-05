import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from "./toasts";

export const openDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('propertyImages', 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (db && !db.objectStoreNames.contains('imagens')) {
        db.createObjectStore('imagens', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (db) {
        resolve(db);
      } else {
        reject(`Erro ao abrir o banco de dados: db é nulo`);
      }
    };

    request.onerror = (event) => {
      reject(`Erro ao abrir o banco de dados: ${(event.target as IDBOpenDBRequest).error}`);
    };
  });
};

export const addImageToDB = (file: File, src: string, id: string) => {
  openDatabase().then((db) => {
    const transaction = db.transaction(['imagens'], 'readwrite');
    const objectStore = transaction.objectStore('imagens');
    const storedImages = objectStore.getAll();
    storedImages.onsuccess = () => {
      const result = storedImages.result;
      const sumOfSizes = result.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.data.size;
      }, 0);

      const totalSize = sumOfSizes + file.size;

      if (totalSize >= 800 * 1024 * 1024) {
        showErrorToast(ErrorToastNames.ImagesTotalSizeLimit);
        return;
      }
    }

    const request = objectStore.add({
      id,
      data: file,
      name: file.name,
      mimeType: file.type,
      src: src
    });

    request.onsuccess = () => {
      showSuccessToast(SuccessToastNames.UploadedImage)
    };

    request.onerror = (event) => {
      console.error(`Erro ao adicionar a imagem ao IndexedDB: ${(event.target as IDBRequest).error}`);
      showErrorToast(ErrorToastNames.ImageUploadError);
    };
  });
};


export const getAllImagesFromDB = () => {
  return new Promise((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(['imagens'], 'readonly');
      const objectStore = transaction.objectStore('imagens');

      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(`Erro ao obter imagens do IndexedDB: ${(event.target as IDBRequest).error}`);
      };
    });
  });
};

export const removeImageFromDB = (id: string) => {

  return new Promise<void>((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(['imagens'], 'readwrite');
      const objectStore = transaction.objectStore('imagens');

      // Deletar a imagem do IndexedDB usando o ID UUID
      const deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = () => {
        showSuccessToast(SuccessToastNames.RemoveImage)
        resolve();
      };

      deleteRequest.onerror = (event) => {
        console.error(`Erro ao remover a imagem do IndexedDB: ${(event.target as IDBRequest).error}`);
        reject();
      };
    });
  });
};

export const clearIndexDB = () => {
  return new Promise<void>((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(['imagens'], 'readwrite');
      const objectStore = transaction.objectStore('imagens');

      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error(`Erro ao limpar o conteúdo do IndexedDB: ${(event.target as IDBRequest).error}`);
        reject();
      };
    });
  });
};

export const getImageFromDBById = (id: string) => {
  return new Promise((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(['imagens'], 'readonly');
      const objectStore = transaction.objectStore('imagens');

      // Obter a imagem do IndexedDB usando o ID UUID
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = () => {
        const imageData = getRequest.result;
        if (imageData) {
          resolve(imageData); // Resolvendo com os dados da imagem
        } else {
          reject("Imagem não encontrada no IndexedDB."); // Rejeitando se a imagem não for encontrada
        }
      };

      getRequest.onerror = (event) => {
        reject(`Erro ao obter imagem do IndexedDB: ${(event.target as IDBRequest).error}`);
      };
    });
  });
};

