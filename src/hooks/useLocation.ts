import { Preferences } from "@capacitor/preferences";

export const useLocation = () => {
  async function getLocationFromPreferences(id: string) {
    const locations = (
      await Preferences.get({
        key: "locations",
      })
    ).value;

    const locationsArray = locations ? JSON.parse(locations) : [];
    return locationsArray.find(
      (location: { id: string; lat: number; lng: number }) =>
        location.id === id,
    );
  }

  async function saveLocationToPreferences(location: {
    id: string;
    lat: number;
    lng: number;
  }) {
    const locations = (
      await Preferences.get({
        key: "locations",
      })
    ).value;

    const locationsArray = locations ? JSON.parse(locations) : [];

    const filtered = locationsArray.filter(
      (loc: { id: string; lat: number; lng: number }) => loc.id !== location.id,
    );
    filtered.push(location);

    await Preferences.set({
      key: "locations",
      value: JSON.stringify(filtered),
    });
  }

  return {
    saveLocationToPreferences,
    getLocationFromPreferences,
  };
};
