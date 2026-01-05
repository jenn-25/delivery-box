import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─────────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────────
const MetricCard = ({
  title,
  value,
  iconName,
  color,
  valueColor = 'text-gray-900',
  fullWidth = false,
}) => (
  <View className={fullWidth ? 'w-full p-2' : 'w-1/2 p-2'}>
    <View className={`rounded-2xl p-4 ${color}`}>
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons name={iconName} size={20} color="#374151" />
        <Text className="ml-2 text-xs font-semibold text-gray-600">
          {title}
        </Text>
      </View>

      <Text className={`text-xl font-extrabold ${valueColor}`}>
        {value}
      </Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────
// DEVICE CARD
// ─────────────────────────────────────────────
const DeviceCard = ({ device, pressEventHandler }) => {
  const online = device.isOnline;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => pressEventHandler(device)}
      className="bg-white mx-4 mt-4 rounded-3xl shadow-md overflow-hidden"
    >
      {/* HEADER – DEVICE PLATE */}
      <View className="bg-slate-900 px-5 py-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="cube-outline"
              size={28}
              color="white"
            />
            <View className="ml-3">
              <Text className="text-xs text-slate-400 font-semibold">
                SMART VAULT
              </Text>
              <Text className="text-lg font-extrabold text-white">
                {device.deviceID}
              </Text>
            </View>
          </View>

          <View
            className={`px-3 py-1 rounded-full ${
              online ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                online ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {online ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
        </View>
      </View>

      {/* BODY */}
      <View className="p-4">
        {/* VAULT CONTROL – PRIMARY */}
        <MetricCard
          title="Vault Control"
          value={device.LockControl ? 'UNLOCKED' : 'LOCKED'}
          iconName={device.LockControl ? 'lock-open-variant' : 'lock'}
          color={device.LockControl ? 'bg-emerald-50' : 'bg-rose-50'}
          valueColor={
            device.LockControl ? 'text-emerald-700' : 'text-rose-700'
          }
          fullWidth
        />

        {/* SENSOR DATA */}
        <View className="flex-row flex-wrap -m-2 mt-2">
          <MetricCard
            title="Dry Temperature"
            value={`${device.temperature1} °C`}
            iconName="thermometer"
            color="bg-amber-50"
            valueColor="text-amber-700"
          />

          <MetricCard
            title="Wet Temperature"
            value={`${device.temperature2} °C`}
            iconName="thermometer-water"
            color="bg-sky-50"
            valueColor="text-sky-700"
          />
        </View>

        {/* STORAGE */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-slate-500 mb-2">
            STORAGE STATUS
          </Text>

          <View className="flex-row flex-wrap -m-2">
            <MetricCard
              title="Dry Compartment"
              value={device.dryhascontents ? 'LOADED' : 'EMPTY'}
              iconName="package-variant"
              color={device.dryhascontents ? 'bg-emerald-50' : 'bg-slate-100'}
              valueColor={
                device.dryhascontents
                  ? 'text-emerald-700'
                  : 'text-slate-500'
              }
            />

            <MetricCard
              title="Wet Compartment"
              value={device.wethascontents ? 'LOADED' : 'EMPTY'}
              iconName="package-variant-closed"
              color={device.wethascontents ? 'bg-emerald-50' : 'bg-slate-100'}
              valueColor={
                device.wethascontents
                  ? 'text-emerald-700'
                  : 'text-slate-500'
              }
            />
          </View>
        </View>
      </View>

      {/* FOOTER – DEVICE STRIP */}
      <View className="bg-slate-900 px-5 py-3 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={18}
            color="#cbd5f5"
          />
          <Text className="ml-2 text-xs font-semibold text-slate-300">
            Encrypted Device
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color="#cbd5f5"
        />
      </View>
    </TouchableOpacity>
  );
};

export default DeviceCard;
