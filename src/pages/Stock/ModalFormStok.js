import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import close from "../../assets/icons/close.png";
import axios from "axios";
import { BASE_URL } from '../../config/config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import moment from 'moment';
import 'moment-timezone';
import { AuthContext } from "../../config/services/AuthContext";




const ModalFormStok = ({ isVisible, onClose, itemId, itemName, dataStatus }) => {
  const [jumlah, setJumlah] = useState('');
  const [status, setStatus] = useState('');
  const [tanggal, setTanggal] = useState(moment().tz('Asia/Jakarta').format('YYYY-MM-DD'));
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const { getBarang, dataBarang, cookies } = useContext(AuthContext);

  useEffect(() => {
    getBarang();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);

    // Cari barang_id berdasarkan itemName
    const barangId = dataBarang.find(item => item.namaBarang === itemName)?.idBarang;

    if (barangId) {
      let newData = {
        barang_id: barangId,
        jumlah: 0,
        status: '',
        tanggal: tanggal,
        created_time: new Date().toISOString()
      };
  
      if (dataStatus === 'bertambah' || dataStatus === 'Bertambah' || dataStatus === 'BERTAMBAH') {
        newData.jumlah = jumlah;
        newData.status = 'bertambah';
      } else {
        newData.jumlah = -jumlah;
        newData.status = 'berkurang';
      }
      
      try {
        const response = await axios.post(`${BASE_URL}/stokbarangapi`, newData, {
          headers: {
            'Authorization': cookies
          }
        });
        console.log('Stok barang berhasil ditambahkan:', response.data);
        setIsLoading(false);
        onClose();
        setRefresh(true);
      }
      catch (error) {
        console.error('Gagal menambahkan stok barang:', error);
        setIsLoading(false);
      }
    }
    else {
      console.error('Barang tidak ditemukan');
      setIsLoading(false);
    }
  };



  const handleDateChange = (text) => {
    const formattedDate = formatDateString(text);
    setTanggal(formattedDate);
    console.log(formattedDate)
  };

  const formatDateString = (text) => {
    const numericText = text.replace(/\D/g, '');
    console.log(numericText)
    // Validate the date format
    if (numericText.length === 8) {
      console.log(numericText.length)
      const formattedDate = moment(numericText, 'YYYYMMDD').format('YYYY-MM-DD');

      // Check if the formatted date is valid
      if (moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
        return formattedDate;
      }
    }

    // Return an empty string if the date is invalid
    // return moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
  };
  
  return (
    <View>
      <Spinner visible={isLoading} />
      <Modal
        transparent={true}
        visible={isVisible}
      >   
        <View style={Styles.wrapperBackground}>
        <ScrollView>
          <View style={Styles.wrapperBody}>
            <TouchableOpacity
              onPress={onClose}
              style={Styles.btnClose}
            >
              <Image source={close} style={Styles.icon} />
            </TouchableOpacity>
            <View style={Styles.wrapperContent}>
              <Text style={Styles.textTitle}>Manajemen Stok Barang</Text>
              <Text style={Styles.textObject} >Nama Barang</Text>
              <TextInput
                value={itemName}
                style={Styles.textinputObject}
              />
              <Text style={Styles.textObject} >Status</Text>
              <TextInput
                placeholder="Masukkan bertambah/berkurang"
                value={dataStatus}
                style={Styles.textinputObject}
              />
              <Text style={Styles.textObject} >Jumlah Barang</Text>
              <TextInput
                placeholder="Masukkan Jumlah Barang"
                style={Styles.textinputObject}
                onChangeText={text => setJumlah(text)}
              />
              <Text style={Styles.textObject}>Tanggal</Text>
                
                <TextInput
                  placeholder="YYYY-MM-DD"
                  value={tanggal}
                  style={Styles.textinputObject}
                  onChangeText={handleDateChange}
                />
              <Button title="Submit" onPress={handleSubmit} />
            </View>
            </View>
            </ScrollView>
          </View>
      </Modal>
    </View>
  );
};

const Styles = StyleSheet.create({
  wrapperBackground: {
    backgroundColor: '#000000aa',
    flex: 1
  },

  wrapperBody: {
    backgroundColor: 'white',
    margin: 50,
    borderRadius: 5,
    flex: 1,
  },

  wrapperContent: {
    margin: 20,
    flex: 1,
  },

  btnClose: {
    backgroundColor: 'red',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -10,
    left: -10,
  },

  icon: {
    height: 16,
    width: 16,
  },

  textTitle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },

  textObject: {
    marginBottom: 4,
  },

  textinputObject: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ModalFormStok;