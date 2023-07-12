import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, StyleSheet, Text, View } from "react-native";
import successIcon from "../../assets/icons/success_2c.png";
import close from "../../assets/icons/close.png";
import logo from "../../assets/logo/coffee.png";
import axios from "axios";
import { BASE_URL } from '../../config/config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import moment from 'moment';
import 'moment-timezone';
import { ScrollView } from "react-native-gesture-handler";

const Success = ({ navigation, route }) => {
  const { dataPesanan, dataTransaksi, cashAmount } = route.params;

  const currentTime = new Date();

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Menghitung total pesanan_id yang bernilai sama
  const totalByPesananId = dataTransaksi.reduce((index, item) => {
    const { pesanan_id } = item;
    if (index[pesanan_id]) {
      index[pesanan_id]++;
    } else {
      index[pesanan_id] = 1;
    }
    return index;
  }, {});

  const newArrayTransaksi = dataTransaksi.reduce((index, item1) => {
    const pesananMenu = index.find(item2 => item2.jenisPembayaran === item1.jenisPembayaran);
    if (pesananMenu) {
      pesananMenu.totalHarga += parseInt(item1.totalHarga);
    } else {
      index.push({
        totalHarga: parseInt(item1.totalHarga),
        jenisPembayaran: item1.jenisPembayaran,
        totalByPesananId: totalByPesananId[item1.pesanan_id],
      });
    }
    return index;
  }, []);

  return (
    <View style={Styles.wrapper}>
      <View style={{paddingHorizontal: 20, flexDirection: 'row', height: 35, backgroundColor: 'skyblue', alignItems: 'center'}}>
        <Text style={{flex: 1, fontWeight: '500', color: 'black'}}>Konfirmasi Tampilan Struk</Text>
        <TouchableOpacity style={{ alignItems: 'flex-end', borderColor: 'black', borderWidth: 1, }} onPress={()=> navigation.navigate("Home")}>
          <Image source={close} style={{height: 20, width: 20}}/>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          <View style={{ marginVertical: 30, marginHorizontal: 20, backgroundColor: '#fff'}}>
            <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
              <View style={{alignItems: 'center'}}>
                <Image source={logo} style={{height: 80, width: 80}} />
                <Text style={{marginBottom: 10, fontWeight: 'bold'}}>Cafe</Text>
              </View>
              <View style={{borderWidth: 1, borderColor: 'black', borderStyle: 'dashed'}} />
              <View style={{marginHorizontal: 10, marginVertical: 4}}>
                <Text>{currentHour}:{currentMinute}, {dataPesanan.tanggal.toLocaleString('id-ID')}</Text>
                <Text>Nomor Pesanan : {dataPesanan.nomorPesanan}</Text>
                <Text>Tipe Pesanan : {dataPesanan.tipePesanan}</Text>
                <Text>Nama Pelanggan : {dataPesanan.namaPelanggan}</Text>
              </View>

              <View style={{borderWidth: 1, borderColor: 'black', borderStyle: 'dashed'}} />
              
              <View style={{ marginVertical: 4, marginHorizontal: 10}}>
                {dataTransaksi.map((item, index) => {
                  return (
                    <View style={{flexDirection: 'row', marginVertical: 4, flex: 1}} key={index}>
                      <View style={{flex: 3}}>
                        <Text>{item.namaMenu}</Text>
                        <Text>{item.jumlah} x {item.harga.toLocaleString('id-ID')}</Text>
                        {item.note !== '' && <Text>{item.note}</Text>}
                      </View>
                      <View style={{flexDirection: 'row', marginLeft: 10, flex: 1}}>
                        <Text>Rp. </Text>
                        <View style={{alignItems: 'flex-end', flex: 1}}>
                          <Text>{item.totalHarga.toLocaleString('id-ID')}</Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>

              <View style={{ borderWidth: 1, borderColor: 'black', borderStyle: 'dashed' }} />
              

              {newArrayTransaksi.length > 0 && newArrayTransaksi[0].jenisPembayaran === 'Tunai' && (
                <View style={{ marginVertical: 4, marginHorizontal: 10, flexDirection: 'row' }}>
                  <View style={{flex: 3}} />
                  <View style={{flex: 2,}}>
                    <Text>Sub Total</Text>
                    <Text>{newArrayTransaksi[0].jenisPembayaran}</Text>
                    <Text>Kembali</Text>
                  </View>
                  <View style={{flex: 2}}>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                      <Text>Rp.</Text>
                      <View style={{alignItems: 'flex-end', flex: 1}}>
                        <Text>{newArrayTransaksi[0].totalHarga.toLocaleString('id-ID')}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                      <Text>Rp.</Text>
                      <View style={{alignItems: 'flex-end', flex: 1}}>
                        <Text>{cashAmount.toLocaleString('id-ID')}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                      <Text>Rp.</Text>
                      <View style={{alignItems: 'flex-end', flex: 1}}>
                        <Text>{(cashAmount - newArrayTransaksi[0].totalHarga).toLocaleString('id-ID')}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {newArrayTransaksi.length > 0 && newArrayTransaksi[0].jenisPembayaran !== 'Tunai' && (
                <View style={{ marginVertical: 4, marginHorizontal: 10, flexDirection: 'row' }}>
                  <View style={{flex: 3}} />
                  <View style={{flex: 2}}>
                    <Text>Sub Total</Text>
                    <Text>{newArrayTransaksi[0].jenisPembayaran}</Text>
                  </View>
                  <View style={{ flex: 2, alignItems: 'flex-end', }}>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                      <Text>Rp.</Text>
                      <View style={{alignItems: 'flex-end', flex: 1}}>
                        <Text>{newArrayTransaksi[0].totalHarga.toLocaleString('id-ID')}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                      <Text>Rp.</Text>
                      <View style={{alignItems: 'flex-end', flex: 1}}>
                        <Text>{newArrayTransaksi[0].totalHarga.toLocaleString('id-ID')}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text>---Terima Kasih---</Text>
                <Text>Atas kunjungan anda di Cafe</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
};

const Styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#dfe4ea',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  titleText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.3
  },

  icon: {
    width: 250,
    height: 250,
  },
  
  btn: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginVertical: 5,
    borderRadius: 4
  }
});

export default Success;