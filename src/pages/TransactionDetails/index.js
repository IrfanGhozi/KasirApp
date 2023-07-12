import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import back from "../../assets/icons/back_black.png";
import search from "../../assets/icons/search_black.png";
import history from "../../assets/icons/history_black.png";
import plus from "../../assets/icons/plus_button.png";
import minus from "../../assets/icons/minus_button.png";
import { AuthContext } from "../../config/services/AuthContext.js";
import Spinner from "react-native-loading-spinner-overlay";

const TransactionDetails = ({ navigation }) => {
  const route = useRoute();
  const selectedItem = route.params.selectedItem;

  const [isLoading, setIsLoading] = useState(true);
  const { getTransaksi, dataTransaksi, cookies } = useContext(AuthContext);

  useEffect(() => {
    getTransaksi();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const mergedData = dataTransaksi.filter((transaksi) => transaksi.pesanan_id === selectedItem.pesanan_id);

  function getFormattedDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedDate = new Date(date).toLocaleString('id-ID', options);
    const timeWithoutPukul = formattedDate.replace('pukul', ',');
    return timeWithoutPukul + ' WIB';
  }

  return (
    <View>
      <Spinner visible={isLoading} />
      <View style={Styles.header} >
        <TouchableOpacity style={Styles.buttonIcon} onPress={()=>navigation.goBack()}>
          <Image source={back} style={Styles.logoIcon}/>
        </TouchableOpacity>
        <Text style={Styles.headerText}>Detail Pesanan</Text>
      </View>
      <ScrollView>
        {isLoading ? (
          <Spinner visible={isLoading} />
        ) : (
          <View style={{marginTop: 5, marginBottom: 60}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10}}>
              <View style={{flex: 1}}>
                <Text>Kode Pesanan</Text>
                <Text>No Pesanan</Text>
                <Text>Tipe Pesanan</Text>
                <Text>Tanggal</Text>
              </View>
              <View style={Styles.rightText}>
                <Text>{selectedItem.pesanan_id}</Text>
                <Text>{selectedItem.nomorPesanan}</Text>
                <Text>{selectedItem.tipePesanan}</Text>
                <Text>{getFormattedDate(selectedItem.created_time)}</Text>
              </View>
            </View>
            <View style={{paddingHorizontal: 10, borderTopColor: 'skyblue', borderTopWidth: 4,}}>
              {mergedData.map((item, index) => (
                <View style={Styles.wrapperMenu} key={index}>
                  <View style={{flexDirection: 'row', marginBottom: 4}}>
                    <Image source={{ uri: item.gambar }} style={Styles.menuImage} />
                    <View style={{marginLeft: 5}}>
                      <Text style={Styles.boldText}>{item.namaMenu}</Text>
                      <Text style={{fontSize: 12, fontWeight: '400'}}>{item.jumlah} x Rp. {item.harga}</Text>
                    </View>
                  </View>
                  {item.note !== '' && <Text style={{fontSize: 12}}>{item.note}</Text>}
                  <View style={{borderTopColor: 'black', borderTopWidth: 1, paddingTop: 3, marginTop: 4}}>
                    <Text>Total Harga</Text>
                    <Text style={{}}>Rp. {Number(item.totalHarga).toLocaleString('id-ID')}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{paddingHorizontal: 20, paddingTop: 10, borderTopColor: 'skyblue', borderTopWidth: 4}}>
              <Text style={Styles.boldText}>Rincian Pembayaran</Text>
              <View style={{flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 1, paddingBottom: 4}}>
                <View style={{flex: 1}}>
                  <Text>Metode Pembayaran</Text>  
                </View>
                <View style={Styles.rightText}>
                  <Text style={{}}>{selectedItem.jenisPembayaran}</Text>                    
                </View>
              </View>
              {mergedData.map((item, index) => (
                <View style={{flexDirection: 'row', marginVertical: 2}} key={index}>
                  <View style={{flex: 3}}>
                    <Text>{item.jumlah} x {item.namaMenu}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text>{Number(item.harga).toLocaleString('id-ID')}</Text>
                  </View>
                  <View style={Styles.rightText}>
                    <Text>Rp. {Number(item.totalHarga).toLocaleString('id-ID')}</Text>
                  </View>
                </View>
              ))}
              <View style={{marginTop: 2, paddingTop: 2, flexDirection: 'row', borderTopColor: 'grey', borderTopWidth: 1}}>
                <View style={{flex: 1}}>
                  <Text style={Styles.boldText}>Total Pesanan</Text>                  
                </View>
                <View style={Styles.rightText}>
                  <Text style={Styles.boldText}>Rp. {selectedItem.subTotal.toLocaleString('id-ID')}</Text> 
                </View>
              </View>
            </View>
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

  headerText: {
    paddingLeft: 5,
    flex: 1,
    alignSelf: 'center'
  },

  boldText: {
    color: 'black',
    fontWeight: '600'
  },

  rightText: {
    flex: 1,
    alignItems: 'flex-end'
  },

  priceText: {
    alignSelf: 'flex-end',
    marginBottom: '1%',
    marginLeft: 10,
  },

  logoIcon: {
    height: 22,
    width: 22,
  },

  menuImage: {
    height: 60,
    width: 60
  },

  wrapperMenu: {
    marginVertical: 10,
    borderRadius: 0,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity:  0.16,
    shadowRadius: 1.51,
    elevation: 2
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

export default TransactionDetails;