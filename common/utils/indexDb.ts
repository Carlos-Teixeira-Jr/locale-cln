
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

export const addImageToDB = (file: File, src: any, id: string) => {
  openDatabase().then((db) => {
    const transaction = db.transaction(['imagens'], 'readwrite');
    const objectStore = transaction.objectStore('imagens');

    const request = objectStore.add({
      id,
      data: file,
      name: file.name,
      mimeType: file.type,
      src: src
    });

    request.onsuccess = () => {
      console.log('Imagem adicionada com sucesso ao IndexedDB.');
    };

    request.onerror = (event) => {
      console.error(`Erro ao adicionar a imagem ao IndexedDB: ${(event.target as IDBRequest).error}`);
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
        console.log('Imagem removida com sucesso do IndexedDB.');
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
        console.log('Conteúdo do IndexedDB removido com sucesso.');
        resolve();
      };

      request.onerror = (event) => {
        console.error(`Erro ao limpar o conteúdo do IndexedDB: ${(event.target as IDBRequest).error}`);
        reject();
      };
    });
  });
};
