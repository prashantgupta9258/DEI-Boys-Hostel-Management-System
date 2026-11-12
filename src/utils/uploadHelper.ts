import { uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage';

export const uploadWithTimeout = (
  storageRef: StorageReference,
  file: Blob | Uint8Array | ArrayBuffer,
  timeoutMs: number = 1000
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Upload timed out'));
    }, timeoutMs);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            clearTimeout(timeout);
            resolve(url);
          })
          .catch((err) => {
            clearTimeout(timeout);
            reject(err);
          });
      })
      .catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
  });
};
