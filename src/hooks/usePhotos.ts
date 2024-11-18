import { useCamera } from "./useCamera";
import { useFilesystem } from "./useFilesystem";
import { MyPhoto } from "../models/photo-types";

const PHOTOS = "photos";

export function usePhotos() {
  const { getPhoto } = useCamera();
  const { readFile, writeFile, deleteFile } = useFilesystem();

  return {
    takePhoto,
    getImageById,
  };

  async function takePhoto(filepath: string) {
    const data = await getPhoto();
    await writeFile(filepath, data.base64String!);
    const webviewPath = `data:image/jpeg;base64,${data.base64String}`;
    return { filepath, webviewPath };
  }

  async function getImageById(id: string) {
    try {
      const filepath = id + ".jpeg";
      const data = await readFile(filepath);
      return {
        filepath: filepath,
        webviewPath: `data:image/jpeg;base64,${data}`,
      } as MyPhoto;
    } catch (e) {
      return undefined;
    }
  }

  /*function loadPhotos() {
    loadSavedPhotos();

    async function loadSavedPhotos() {
      const savedPhotoString = await get(PHOTOS);
      const savedPhotos = (savedPhotoString ? JSON.parse(savedPhotoString) : []) as MyPhoto[];
      console.log('load', savedPhotos);
      for (let photo of savedPhotos) {
        const data = await readFile(photo.filepath);
        photo.webviewPath = `data:image/jpeg;base64,${data}`;
      }
      setPhotos(savedPhotos);
    }
  }*/
}
