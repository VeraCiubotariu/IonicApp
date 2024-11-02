export default interface RecordItem {
  _id?: string;
  name: string;
  artist: string;
  isBand: boolean;
  releaseDate: Date;
  price: number;
  isOffline?: boolean;
}
