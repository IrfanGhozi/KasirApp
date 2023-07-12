import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import back from "../../assets/icons/back_black.png";
import search from "../../assets/icons/search_black.png";
import history from "../../assets/icons/history_black.png";
import plus from "../../assets/icons/plus_button.png";
import minus from "../../assets/icons/minus_button.png";
import axios from "axios";
import { BASE_URL } from '../../config/config';
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../config/services/AuthContext.js";
import moment from 'moment';
import 'moment-timezone';

const Barang = () => {
  return (
    <View style={Styles.cardProduct}>
      <Image source={{ uri: 'http://via.placeholder.com/100x100' }} style={Styles.productImage} />
      <View style={Styles.wrapperProductName}>
        <Text>Status: Bertambah</Text>
        <Text style={Styles.textProductName}>Nama Barang</Text>
        <Text style={Styles.textPrice}>Total = xxxx</Text>
      </View>
      <View>
        <Text>Tanggal</Text>
        <Text>12/12/2022</Text>
      </View>
    </View>
  )
};

const HistoryStock = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));

  const { getBarang, dataBarang, getStokBarang, dataStokBarang, isLoading, cookies } = useContext(AuthContext);

  useEffect(() => {
    setCurrentDate(moment().format("YYYY-MM-DD"));
  }, []);

  useEffect(() => {
    getBarang();
    getStokBarang();
  }, []);

// Menggabungkan tabel barang dan arrayJumlah berdasarkan id
const mergedArray = dataStokBarang.map(item1 => {
  const barang = dataBarang.find(item2 => item2.idBarang === item1.barang_id);
  return { ...item1, ...barang };
}, []);

  // Menggunakan Algoritma Quicksort
  function quicksort(arr) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const less = [];
    const equal = [];
    const greater = [];

    for (let item of arr) {
      if (item.created_time === null || item.created_time > pivot.created_time) {
        greater.push(item);
      } else if (item.created_time < pivot.created_time) {
        less.push(item);
      } else {
        equal.push(item);
      }
    }

    return [...quicksort(greater), ...equal, ...quicksort(less)];
  }

  // Menerapkan quicksort pada mergedArray berdasarkan created_time
  const sortedArray = quicksort(mergedArray);

  const filteredArray = sortedArray.filter(item => {
    const itemDate = moment(item.created_time).format("YYYY-MM-DD");
    const diffInMonths = moment(currentDate).diff(itemDate, "months");
    return diffInMonths < 1;
  });

  return (
    <View style={{marginBottom: 50}}>
      <View style={Styles.header} >
        <TouchableOpacity style={Styles.buttonIcon} onPress={()=>navigation.goBack()}>
          <Image source={back} style={Styles.logoIcon}/>
        </TouchableOpacity>
        <Text style={Styles.textHeader}>Riwayat Barang</Text>
      </View>
      <ScrollView>
        {isLoading ? (
          <Spinner visible={isLoading} />
        ) : (
          <View>
            {filteredArray.map((item, index) => {
              const formattedDate = new Date(item.tanggal).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              
              return (
                <View style={Styles.cardProduct} key={index}>
                  <Image source={{ uri: `${BASE_URL}/upload/barang/${item.gambar}` }} style={Styles.productImage} />
                  <View style={Styles.wrapperProductName}>
                    <Text>Status: {item.status}</Text>
                    <Text style={Styles.textProductName}>{item.namaBarang}</Text>
                    <Text style={Styles.textPrice}>Total = {item.jumlah}</Text>
                  </View>
                  <View>
                    <Text>Tanggal</Text>
                    <Text>{formattedDate}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          )}
      </ScrollView>
    </View>
  )
};

const Styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  textHeader: {
    paddingLeft: 5,
    flex: 1,
    alignSelf: 'center'
  },

  textProductName: {
    marginTop: '1%',
  },

  textPrice: {
    alignSelf: 'flex-end',
    marginBottom: '1%',
    marginLeft: 10,
  },

  logoIcon: {
    height: 22,
    width: 22,
  },

  productImage: {
    height: 50,
    width: 50
  },

  cardProduct: {
    width: '94%',
    margin: '2%',
    flexDirection: 'row',
    padding: 7,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wrapperProductName: {
    flex: 1,
    marginLeft: '4%',
    marginRight: '7%',
  },

  buttonIcon: {
    height: 35,
    width: 35,
    border: 'black',
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },

});

export default HistoryStock;