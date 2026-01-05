import { BackHandler, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import axiosInstance from '../../axiosConfig.js';
import loadingOverlay from "../components/LoadingOverlay";
import logo from "../../assets/images/logo.png";



const IrrigationDashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(0);

  const screenWidth = Dimensions.get("window").width;

  useEffect(()=>{
    setIsLoading(true);
    const func=async()=>{
      try{
        const response = await axiosInstance.get("/event/temp-summary",  {withCredentials: true});
        if(!response.data.success){
            console.log(JSON.stringify(response.data.message));
            setData([]);
        }else{
            setData(response.data.data);
            console.log(JSON.stringify(response.data.data));
        }
      }catch(error){
        console.error("Data retrieval error:", error.message);
      }
    }

    func();

    setIsLoading(false);
  },[]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );

      return () => subscription.remove();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {isLoading && loadingOverlay()}
      <View className="flex flex-row  items-center gap-5 px-5 py-4 bg-white shadow-sm border-b border-gray-100 pt-10">
        <Image source={logo} style={{ width: 50, height: 50 }} />
        <Text className="text-3xl font-extrabold text-green-700">Home</Text>
      </View>
      <View className="flex flex-col h-aut py-5 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg items-center" onLayout={(event)=>{ setWidth(event.nativeEvent.layout.width);}}>
        <View className="w-full h-fit  mb-7 px-5"><Text className="text-gray-700 text-2xl font-bold">Data summary/Updates/Anything you want to put in here...</Text></View>
          
      
      </View>
    </SafeAreaView>
  );
};

export default IrrigationDashboard;