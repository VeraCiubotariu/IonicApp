import { GoogleMap } from "@capacitor/google-maps";
import { useRef } from "react";
import { MapClickCallbackData } from "@capacitor/google-maps/dist/typings/definitions";
import { mapsApiKey } from "../../utils/mapsApiKey";

interface MyMapProps {
  lat: number | undefined;
  lng: number | undefined;
  itemId: string;
  onMapClick: (e: any) => void;
  onMarkerClick: (e: any) => void;
}

const MyMap: React.FC<MyMapProps> = ({
  lat,
  lng,
  onMapClick,
  itemId,
  onMarkerClick,
}) => {
  const mapRef = useRef<HTMLElement>(null);
  const markerIDs: string[] = [];
  //useEffect(myMapEffect, [mapRef.current]);
  myMapEffect();

  console.log("Lat: " + lat + " lng: " + lng);

  return (
    <div className="component-wrapper">
      <capacitor-google-map
        ref={mapRef}
        style={{
          display: "block",
          width: 300,
          height: 400,
        }}
      ></capacitor-google-map>
    </div>
  );

  function myMapEffect() {
    let canceled = false;
    let googleMap: GoogleMap | null = null;
    createMap();
    return () => {
      canceled = true;
      googleMap?.removeAllMapListeners();
    };

    async function createMap() {
      if (!mapRef.current) {
        return;
      }
      googleMap = await GoogleMap.create({
        id: "my-cool-map",
        element: mapRef.current,
        apiKey: mapsApiKey,
        config: {
          center: { lat: lat || 41.40338, lng: lng || 2.17403 },
          zoom: 8,
        },
      });
      console.log("gm created");

      if (lat && lng) {
        const markerID = await googleMap.addMarker({
          coordinate: { lat: lat, lng: lng },
          title: "My location2",
        });
        markerIDs.push(markerID);
        console.log("Added marker!");
      }

      await googleMap.setOnMapClickListener(
        ({ latitude, longitude }: MapClickCallbackData) => {
          onMapClick({ id: itemId, lat: latitude, lng: longitude });
          console.log(markerIDs);
          googleMap?.removeMarkers(markerIDs).then(() => {
            markerIDs.splice(0, markerIDs.length);
            googleMap!
              .addMarker({
                coordinate: { lat: latitude, lng: longitude },
                title: "My location2",
              })
              .then((markerID) => {
                markerIDs.push(markerID);
              });
          });
        },
      );
    }
  }
};

export default MyMap;
