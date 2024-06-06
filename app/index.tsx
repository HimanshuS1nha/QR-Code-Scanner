import SafeView from "@/components/SafeView";
import {
  Alert,
  BackHandler,
  Linking,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import tw from "twrnc";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { BarCodeScanningResult } from "expo-camera/build/legacy/Camera.types";
import Slider from "@react-native-community/slider";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const [scanned, setScanned] = useState(false);
  const [zoom, setZoom] = useState(0);

  const getPermission = async () => {
    if (permission?.granted || !permission) {
      return;
    } else {
      if (permission?.canAskAgain) {
        await requestPermission();
      } else {
        Alert.alert("Error", "This app needs this permission to operate", [
          {
            text: "Cancel",
            onPress: BackHandler.exitApp,
          },
          {
            text: "Ok",
            onPress: () => Linking.openSettings(),
          },
        ]);
      }
    }
  };

  const onBarcodeScanned = (result: BarCodeScanningResult) => {
    setScanned(true);
    Alert.alert(
      "Warning",
      `Do you want to open ${result.data.substring(0, 40)}`,
      [
        {
          text: "No",
        },
        {
          text: "Yes",
          onPress: () => Linking.openURL(result.data),
        },
      ]
    );
  };

  useEffect(() => {
    getPermission();
  }, [permission, isFocused]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeView style={tw`justify-center items-center`}>
        <Text style={tw`text-rose-600 font-semibold`}>
          This app needs the camera permission to operate
        </Text>
      </SafeView>
    );
  }

  return (
    <SafeView style={tw`justify-center items-center bg-black gap-y-10`}>
      <Text style={tw`text-white text-xl font-medium`}>
        {scanned ? "Not scanning" : "Scanning..."}
      </Text>
      {isFocused && (
        <CameraView
          facing="back"
          style={tw`w-full h-[50%] items-center justify-center`}
          onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
          zoom={zoom}
        >
          <View style={tw`w-60 h-56 items-center justify-center`}>
            <View
              style={tw`border-l-4 border-t-4 border-white w-12 h-12 absolute top-0 left-0`}
            ></View>
            <View
              style={tw`border-r-4 border-t-4 border-white w-12 h-12 absolute top-0 right-0`}
            ></View>
            <View
              style={tw`border-r-4 border-b-4 border-white w-12 h-12 absolute bottom-0 right-0`}
            ></View>
            <View
              style={tw`border-l-4 border-b-4 border-white w-12 h-12 absolute bottom-0 left-0`}
            ></View>
          </View>
          <View style={tw`absolute bottom-3 w-full items-center`}>
            <Slider
              style={tw` w-[80%]`}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#2563eb"
              maximumTrackTintColor="#ffffff"
              value={zoom}
              onValueChange={(value) => setZoom(value)}
            />
          </View>
        </CameraView>
      )}
      <View style={tw`items-center`}>
        <TouchableOpacity
          style={tw`px-4 py-2 rounded-full ${
            scanned ? "bg-blue-600" : "bg-gray-700 opacity-75"
          }`}
          onPress={() => {
            setScanned(false);
            setZoom(0);
          }}
          disabled={!scanned}
        >
          <Text style={tw`text-white text-base font-semibold`}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </SafeView>
  );
}
