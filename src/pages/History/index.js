import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import back from '../../assets/icons/back_black.png';
import wallet from '../../assets/icons/wallet.png';
import e_wallet from '../../assets/icons/e_wallet.png';
import pesanan_menu from '../../assets/icons/pesanan_menu.png';
import axios from "axios";
import { BASE_URL } from '../../config/config';
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../config/services/AuthContext.js";

const History = ({ navigation }) => {
  const [gabunganData, setGabunganData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getTransaksi, dataTransaksi, cookies } = useContext(AuthContext);

  function getFormattedDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleString('id-ID', options);
  }

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
    const persediaanBarang = index.find(item2 => item2.pesanan_id === item1.pesanan_id);
    if (persediaanBarang) {
      persediaanBarang.subTotal += parseInt(item1.totalHarga);
    } else {
      index.push({
        idTransaksi: item1.id,
        pesanan_id: item1.pesanan_id,
        nomorPesanan: item1.nomorPesanan,
        namaPelanggan: item1.namaPelanggan,
        tipePesanan: item1.tipePesanan,
        menu_id: item1.menu_id,
        namaMenu: item1.namaMenu,
        harga: item1.harga,
        kategori: item1.kategori,
        gambar: item1.gambar,
        jumlah: item1.jumlah,
        totalHarga: parseInt(item1.totalHarga),
        subTotal: parseInt(item1.totalHarga),
        jenisPembayaran: ["BCA", "Gopay", "Ovo", "Dana"].includes(item1.jenisPembayaran) ? "NonTunai" : item1.jenisPembayaran,
        totalByPesananId: totalByPesananId[item1.pesanan_id],
        tanggal: item1.tanggal,
        created_time: item1.created_time,
        updated_time: item1.updated_time,
      });
    }
    return index;
  }, []);

  const getTotalHargaTunai = () => {
    const oneWeekAgoDate = getOneWeekAgoDate(); // Ambil tanggal 1 minggu yang lalu
    return newArrayTransaksi.reduce((total, item) => {
      // Jumlahkan total harga tunai hanya jika jenis pembayaran adalah "Tunai" dan tanggal transaksi lebih baru atau sama dengan tanggal 1 minggu yang lalu
      if (item.jenisPembayaran === "Tunai" && new Date(item.tanggal) >= oneWeekAgoDate) {
        return total + item.subTotal;
      }
      return total;
    }, 0);
  };
  
  const getTotalHargaNonTunai = () => {
    const oneWeekAgoDate = getOneWeekAgoDate(); // Ambil tanggal 1 minggu yang lalu
    return newArrayTransaksi.reduce((total, item) => {
      // Jumlahkan total harga non-tunai hanya jika jenis pembayaran adalah "NonTunai" dan tanggal transaksi lebih baru atau sama dengan tanggal 1 minggu yang lalu
      if (item.jenisPembayaran === "NonTunai" && new Date(item.tanggal) >= oneWeekAgoDate) {
        return total + item.subTotal;
      }
      return total;
    }, 0);
  };
  
  // Menggunakan Algoritma Quicksort
  function quicksort(index) {
    if (index.length <= 1) {
      return index;
    }

    const pivot = index[Math.floor(index.length / 2)];
    const less = [];
    const equal = [];
    const greater = [];

    for (let item of index) {
      if (item.created_time === null || item.created_time > pivot.created_time) {
        greater.push(item);
      } else if (item.created_time < pivot.created_time) {
        less.push(item);
      } else {
        equal.push(item);
      }
    }

    return [...quicksort(greater), ...equal, ...quicksort(less)];
  };

  useEffect(() => {
    getTransaksi();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const getOneWeekAgoDate = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return oneWeekAgo;
  };

  // Menerapkan quicksort pada newArrayTransaksi berdasarkan created_time
  const sortedArray = quicksort(newArrayTransaksi);

  // console.log(sortedArray);

  const filteredArray = sortedArray.filter(item => new Date(item.tanggal) >= getOneWeekAgoDate());

  const handleButtonTransaction = () => {

  }

  return(
    <View>
      <View style={Styles.header}>
        <TouchableOpacity style={Styles.buttonIcon} onPress={()=>navigation.goBack()}>
          <Image source={back} style={Styles.logoIcon}/>
        </TouchableOpacity>
        <Text style={Styles.textHeader}>Riwayat</Text>
      </View>
      <ScrollView>
        <View style={{marginBottom: 52}}>
          {isLoading ? (
            <Spinner visible={isLoading} />
          ) : (
            <View>
              <View style={Styles.wrapperMoney}>
                <View style={Styles.wrapperWallet}>
                  <Image source={wallet} style={Styles.logoIcon} />
                  <View style={Styles.wrapperTotalMoney}>
                    <Text>Tunai</Text>
                    <Text>Rp. {getTotalHargaTunai().toLocaleString('id-ID')}</Text>
                  </View>
                </View>
                <View style={Styles.wrapperWallet}>
                  <Image source={e_wallet} style={Styles.logoIcon} />
                  <View style={Styles.wrapperTotalMoney}>
                    <Text>NonTunai</Text>
                    <Text>Rp. {getTotalHargaNonTunai().toLocaleString('id-ID')}</Text>
                  </View>
                </View>
              </View>
            

              <View>
                {filteredArray.map((item, index) => (
                  <TouchableOpacity style={Styles.buttonTransaction} key={index} onPress={()=>navigation.navigate("TransactionDetails", { selectedItem: item })}>
                    <View style={{border: 'black', borderWidth: 1, padding: 5, borderRadius: 10}}>
                      <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                        <View style={{flexDirection:'row', flex: 1}}>
                          <Image source={pesanan_menu} style={{height: 35, width: 35,}} />
                          <View>
                            <Text style={{fontWeight: '600', fontSize: 12, color: 'black'}}>Pesanan</Text>
                            <Text style={{fontWeight: '400', fontSize: 11}}>{getFormattedDate(item.tanggal)}</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5}}>
                          <Text>Kode Pesanan: {item.pesanan_id}</Text>
                        </View>
                      </View>
                      <View style={Styles.wrapperPesananMenu}>
                        <Image source={{ uri: item.gambar }} style={Styles.productImage} />
                        <View style={Styles.transactionName}>
                          <Text style={{fontWeight: '600', color: 'black'}}>{item.namaMenu}</Text>
                          <Text style={{fontSize: 11, fontWeight: '400'}}>{item.jumlah} menu</Text>
                          {item.totalByPesananId - 1 !== 0 && <Text style={{fontSize: 12, marginTop:4}}>+ {item.totalByPesananId - 1} Menu Lain</Text>}
                        </View>
                        <Text style={Styles.textPrice}>Total = Rp. {item.subTotal.toLocaleString('id-ID')}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
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


  textPrice: {
    alignSelf: 'center',
    marginBottom: '1%',
    marginLeft: 10,
  },

  logoIcon: {
    height: 25,
    width: 25,
  },

  productImage: {
    height: 50,
    width: 50
  },

  cardTransaction: {
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

  wrapperMoney: {
    marginHorizontal: 10,
    marginVertical: 13,
    flexDirection: 'row',
  },

  wrapperWallet: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    flex: 1,
    flexDirection: 'row',
    border: 'black',
    borderWidth: 1,
  },

  wrapperTotalMoney: {
   paddingHorizontal: 5,
  },

  wrapperPesananMenu: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 5
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

  buttonTransaction: {
    marginHorizontal: 10,
    marginBottom: 8,
  },

  transactionName: {
    marginHorizontal: 10,
    flex: 1,
  },
});

export default History;