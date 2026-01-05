import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import loadingOverlay from "../components/LoadingOverlay";
import logo from "../../assets/images/logo.png";

const ProfileTab = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deviceIDs, setDeviceIDs] = useState([]);
  const [selectedDeviceID, setSelectedDeviceID] = useState("");
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  /* ─────────────────────────────────────────────
     LOAD DEVICES
  ───────────────────────────────────────────── */
  const loadDevices = async () => {
    try {
      const res = await axiosInstance.get("/device/get-my-devices", {
        withCredentials: true,
      });

      if (!res.data.success) {
        setErrorMsg(res.data.message);
        return;
      }

      setDeviceIDs(res.data.data.map((d) => d.deviceID));
    } catch (error) {
      setErrorMsg("Failed to load devices.");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadDevices().finally(() => setIsLoading(false));
  }, []);

  /* ─────────────────────────────────────────────
     SEARCH EVENTS
  ───────────────────────────────────────────── */
  const searchEvents = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setData([]);

    try {
      const payload = {
        startDate,
        endDate,
      };

      if (selectedDeviceID) payload.deviceID = selectedDeviceID;

      const res = await axiosInstance.post(
        "/event/sensor-records",
        payload,
        { withCredentials: true }
      );

      if (!res.data.success) {
        setErrorMsg(res.data.message || "No records found.");
        Toast.show({
          type: "error",
          text1: "Search failed",
          text2: res.data.message,
        });
        return;
      }

      setData(res.data.data);
    } catch (error) {
      setErrorMsg("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {isLoading && loadingOverlay()}

      {/* Header */}
      <View className="flex-row items-center gap-4 px-5 py-4 bg-white border-b pt-10">
        <Image source={logo} style={{ width: 45, height: 45 }} />
        <Text className="text-3xl font-extrabold text-green-700">
          Logs
        </Text>
      </View>

      {/* Filters */}
      <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-sm">
        <Text className="text-gray-600 mb-1">Device</Text>
        <Picker
          selectedValue={selectedDeviceID}
          onValueChange={(v) => setSelectedDeviceID(v)}
        >
          <Picker.Item label="All Devices" value="" />
          {deviceIDs.map((id) => (
            <Picker.Item key={id} label={id} value={id} />
          ))}
        </Picker>

        <View className="flex-row gap-3 mt-3">
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="flex-1 border border-gray-300 rounded-lg p-3 flex-row justify-between"
          >
            <Text>{startDate.toLocaleDateString()}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="flex-1 border border-gray-300 rounded-lg p-3 flex-row justify-between"
          >
            <Text>{endDate.toLocaleDateString()}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} />
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(_, d) => {
              setShowStartPicker(false);
              if (d) setStartDate(d);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            minimumDate={startDate}
            onChange={(_, d) => {
              setShowEndPicker(false);
              if (d) setEndDate(d);
            }}
          />
        )}

        <TouchableOpacity
          onPress={searchEvents}
          className="bg-blue-600 mt-4 py-3 rounded-lg"
        >
          <Text className="text-center text-white font-semibold">
            Search Logs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {errorMsg !== "" && (
        <View className="mx-4 mb-3 bg-red-100 border border-red-300 p-3 rounded-lg">
          <Text className="text-red-700 text-sm text-center">
            {errorMsg}
          </Text>
        </View>
      )}

      {/* MOBILE-FRIENDLY TABLE */}
      {data.length > 0 && (
        <View className="mx-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 750 }}>
              {/* Header */}
              <View className="flex-row bg-slate-700 py-3">
                <Text className="w-24 text-center text-white text-xs font-bold">
                  DATE
                </Text>
                <Text className="w-28 text-center text-white text-xs font-bold">
                  DEVICE
                </Text>
                <Text className="w-20 text-center text-white text-xs font-bold">
                  LOCK
                </Text>
                <Text className="w-20 text-center text-white text-xs font-bold">
                  DRY °C
                </Text>
                <Text className="w-20 text-center text-white text-xs font-bold">
                  WET °C
                </Text>
                <Text className="w-24 text-center text-white text-xs font-bold">
                  DRY BOX
                </Text>
                <Text className="w-24 text-center text-white text-xs font-bold">
                  WET BOX
                </Text>
              </View>

              {/* Rows */}
              {data.map((item, index) => (
                <View
                  key={item._id}
                  className={`flex-row py-3 border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <Text className="w-24 text-center text-xs">
                    {new Date(item.eventDate).toLocaleDateString()}
                  </Text>

                  <Text className="w-28 text-center text-xs font-semibold">
                    {item.device?.deviceID}
                  </Text>

                  <Text
                    className={`w-20 text-center text-xs font-bold ${
                      item.LockControl ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.LockControl ? "UNLOCKED" : "LOCKED"}
                  </Text>

                  <Text className="w-20 text-center text-xs">
                    {item.temperature1}°
                  </Text>

                  <Text className="w-20 text-center text-xs">
                    {item.temperature2}°
                  </Text>

                  <Text className="w-24 text-center text-xs">
                    {item.dryhascontents ? "LOADED" : "EMPTY"}
                  </Text>

                  <Text className="w-24 text-center text-xs">
                    {item.wethascontents ? "LOADED" : "EMPTY"}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileTab;
