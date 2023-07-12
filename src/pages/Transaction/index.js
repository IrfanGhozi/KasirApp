import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, ScrollView, TextInput, } from "react-native";
import back from "../../assets/icons/back_black.png";
import downArrow from "../../assets/icons/down.png";
import plus from "../../assets/icons/plus_button.png";
import minus from "../../assets/icons/minus_button.png";
import note from "../../assets/icons/note.png";
import axios from "axios";
import { BASE_URL } from '../../config/config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import moment from 'moment';
import 'moment-timezone';
import { AuthContext } from "../../config/services/AuthContext";

const Menu = ({ item, noteText, onNoteTextChange, onPlusMenuChange, onMinusMenuChange }) => {
  const handleNoteText = (text) => {
    onNoteTextChange(text);
  };

  const handlePlusMenu = () => {
    onPlusMenuChange(item);
  };

  const handleMinusMenu = () => {
    onMinusMenuChange(item);
  };

  return (
    <View style={Styles.wrapperMenu}>
      <View style={Styles.wrapperMenuText}>
        <Text>{item.namaMenu}</Text>
        <Text style={{paddingVertical: 4}}>Rp. {item.harga.toLocaleString('id-ID')}</Text>
        <View style={Styles.btnNote} >
          <Image source={note} style={Styles.logoIcon} />
            <TextInput
                placeholder="Catatan"
                value={noteText}
                onChangeText={handleNoteText}
                style={{paddingLeft: 4, paddingVertical: 0, width: '100%', maxHeight: 40}}
                multiline={true}
                numberOfLines={2}
              />
        </View>
      </View>
      <View style={Styles.wrapperMenuImage}>
        <Image source={{ uri: item.gambar }} style={Styles.imageMenu} />
        <View style={Styles.wrapperTotalMenu}>
          <TouchableOpacity style={Styles.wrapperBtnQty} onPress={handlePlusMenu}>
            <Image source={plus} style={Styles.btnQty} />
          </TouchableOpacity>
          <Text style={{ paddingHorizontal: 4 }}>{item.jumlah}</Text>
          <TouchableOpacity style={Styles.wrapperBtnQty} onPress={handleMinusMenu}>
            <Image source={minus} style={Styles.btnQty} />
          </TouchableOpacity>
        </View>
      </View>
   </View> 
  )
};

const Divider = () => <View style={Styles.divider} />;

const Transaction = ({ navigation }) => {
  const [toggle, setToggle] = useState(false);
  const [dataTransactionMenu, setDataTransactionMenu] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [tipePesanan, setTipePesanan] = useState('');
  const [jenisPembayaran, setJenisPembayaran] = useState('');
  const [selectedTypeOrder, setSelectedTypeOrder] = useState('Dine in');
  const [activeTab, setActiveTab] = useState('Tunai');
  const [nonTunaiValue, setNonTunaiValue] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [noteText, setNoteText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const { getMenu, dataMenu, cookies } = useContext(AuthContext);

  useEffect(() => {
    getMenu();
  }, []);

  useEffect(() => {
    const listTransactionMenu = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/transaksi/transaksiList`,
          {
            headers: {
              Authorization: cookies,
            },
          }
        );
        
        const listMenu = response.data.data;
        setDataTransactionMenu(listMenu);
      } catch (error) {
        console.error('Error get Cart Data Menu:', error);
      }
    };

    listTransactionMenu();
  }, [refreshing]);

  const dataCartMenu = dataTransactionMenu.map(item1 => {
    const listCartMenu = dataMenu.find(item2 => item2.idMenu === item1.menu_id);
    return { ...item1, ...listCartMenu };
  }, []);


  const handleNoteTextChange = (text, index) => {
    setNoteText((prevNoteText) => ({
      ...prevNoteText,
      [index]: text,
    }));
  };


  const handlePlusMenu = async (item) => {
    try {
      const newDataTransaksi = {
        menu_id: item.idMenu,
        jumlah: 1,
        tanggal: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
        updated_time: new Date().toISOString(),
      };
  
      const responseTransaksi = await axios.post(
        `${BASE_URL}/transaksiapi`,
        newDataTransaksi,
        {
          headers: {
            Authorization: cookies,
          },
        }
      );
  
      setRefreshing(prevState => !prevState);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleMinusMenu = async (item) => {
    try {
      const newDataTransaksi = {
        menu_id: item.idMenu,
        jumlah: -1,
        tanggal: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
        updated_time: new Date().toISOString(),
      };
  
      const responseTransaksi = await axios.post(
        `${BASE_URL}/transaksiapi`,
        newDataTransaksi,
        {
          headers: {
            Authorization: cookies,
          },
        }
      );
  
      setRefreshing(prevState => !prevState);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };


  const handleTogglePress = () => {
    setToggle(!toggle);
  };

  const handleTypePress = (type) => {
    setSelectedTypeOrder(type);
    setToggle(false);
  };


  const totalPembayaran = dataCartMenu.reduce((total, item) => total + parseInt(item.totalHarga), 0);
 


  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    setNonTunaiValue('');
    setSelectedPayment('');
  };

  const handleNonTunaiPress = (value) => {
    setNonTunaiValue(value);
    setSelectedPayment(value);
  };

  useEffect(() => {
    if (activeTab === 'Tunai') {
      setJenisPembayaran('Tunai');
    } else if (activeTab === 'Non Tunai') {
      setJenisPembayaran(nonTunaiValue);
    }
  }, [activeTab, nonTunaiValue]);



  const [selectedCash, setSelectedCash] = useState('');
  const [customCash, setCustomCash] = useState('');

  const handleCashPress = (value) => {
    setSelectedCash(value);
    setCustomCash('');
  };

  const handleCustomCashChange = (value) => {
    setSelectedCash('');
    setCustomCash(value);
  };

  const displayCash = selectedCash || customCash;

  const handlePayment = async () => {
    setIsLoading(true);
    
    if (!namaPelanggan) {
      console.error('Nama pelanggan tidak boleh kosong');
      setIsLoading(false);
      return;
    }

    try {
      const newDataPesanan = {
        namaPelanggan: namaPelanggan,
        tipePesanan: selectedTypeOrder,
        tanggal: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
        created_time: new Date().toISOString(),
      };

      const responsePesanan = await axios.post(
        `${BASE_URL}/pesananapi`,
        newDataPesanan,
        {
          headers: {
            Authorization: cookies,
          },
        }
      );

      // console.log('Update pesanan berhasil:', responsePesanan.data.data);

      const updatedDataArray = [];

      const dataPesanan = responsePesanan.data.data;
      const dataTransaksi = [];
      const noteMenu = '';

      // Loop untuk memperbarui setiap data transaksi
      for (let i = 0; i < dataCartMenu.length; i++) {
        const item = dataCartMenu[i];

        const noteMenu = ''

        const newDataTransaksi = {
          pesanan_id: responsePesanan.data.data.id,
          menu_id: item.menu_id,
          harga: item.harga,
          jumlah: item.jumlah,
          note: noteText[i] === undefined ? noteMenu : noteText[i],
          status: '1',
          jenisPembayaran: jenisPembayaran,
          tanggal: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
          updated_time: new Date().toISOString(),
        };          

        updatedDataArray.push({
          id: item.id,
          updatedData: newDataTransaksi,
        });
      }

    //  Loop untuk melakukan pembaruan data
    for (let i = 0; i < updatedDataArray.length; i++) {
      const datas = updatedDataArray[i];
     
        try {
          const responseTransaksi = await axios.put(
            `${BASE_URL}/transaksiapi/`+datas.id,
            datas.updatedData,
            {
              headers: {
                Authorization: cookies,
              },
            }
          );
          
          const updatedTransaksi = responseTransaksi.data.data;
          // console.log(responseTransaksi.data)
          dataTransaksi.push(updatedTransaksi);

          // console.log(`Update Transaksi ${i + 1} berhasil:`, responseTransaksi.data.data);
        } catch (error) {
          console.error(`Gagal update Transaksi ${i + 1}:`, error);
        }
      }

      const cashAmount = parseFloat(displayCash.replace(/[^\d.-]/g, ''));

      navigation.navigate("Success", {
        dataPesanan: responsePesanan.data.data,
        dataTransaksi: dataTransaksi,
        cashAmount: cashAmount,
      });
      setIsLoading(false);
    }
    catch (error) {
      console.error('Gagal update pesanan:', error);
      setIsLoading(false);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <Spinner visible={isLoading} />
      <View style={Styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image source={back} style={Styles.logoButton}/>
        </TouchableOpacity>
        <Text style={Styles.textHeader} >Order</Text>
      </View>
      <ScrollView>
        <View>
          {isLoading ? (
            <Spinner visible={isLoading} />
          ) : (
            <View style={Styles.wrapperOrder}>
              {dataCartMenu.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Menu item={item} noteText={noteText[index]} onNoteTextChange={(text) => handleNoteTextChange(text, index)} onPlusMenuChange={handlePlusMenu} onMinusMenuChange={handleMinusMenu} />
                    {index < dataCartMenu.length - 1 && <Divider />}
                  </React.Fragment>
                )
              })}
            </View>
          )}

          <View style={Styles.wrapperTypeOrder}>
            <TouchableOpacity style={Styles. wrapperTypeOrderMain} onPress={handleTogglePress}>
              <Text>{selectedTypeOrder}</Text>
              <Image source={downArrow} style={Styles.logoIcon} />
            </TouchableOpacity>
            {toggle && (
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}>
                <TouchableOpacity style={Styles. toggleTypeOrder} onPress={() => handleTypePress('Dine in')}>
                  <Text>Dine in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles. toggleTypeOrder} onPress={() => handleTypePress('Take Away')}>
                  <Text>Take Away</Text>
                </TouchableOpacity>
              </View>
              )}
          </View>

          <View style={{marginBottom: 15}}>
            <Text style={{ marginBottom: 5, marginHorizontal: 20}}>Nama Pelanggan</Text>
            <TextInput
              placeholder="Masukkan Nama Pelanggan"
              onChangeText={text => setNamaPelanggan(text)}
              style={{borderWidth: 1, borderColor: 'black', marginHorizontal: 20}}
            />
          </View>
          

          {isLoading ? (
            <Spinner visible={isLoading} />
          ) : (
            <View style={{marginHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: 'black', borderRadius: 7}}>
              <Text style={{paddingLeft: 10, fontSize: 14, fontWeight: 'bold'}}>Detail Pembayaran</Text>
              {dataCartMenu.map((item, index) => {
                return (
                  <View style={{flexDirection: 'row', paddingHorizontal: 20, marginVertical: 2}} key={index}>
                    <View style={{flex: 1}}>
                      <Text>{item.namaMenu}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text>Rp. {item.totalHarga.toLocaleString('id-ID')}</Text>
                    </View>
                  </View>
                )
              })}
              <View style={{borderWidth: 1, borderColor: 'black', marginRight: 20, marginLeft:10, marginVertical: 2}} />
              <View style={{flexDirection: 'row', paddingRight: 20, paddingLeft: 10, marginTop: 2}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>Total Pembayaran</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text>Rp. {totalPembayaran.toLocaleString('id-ID')}</Text>
                </View>
              </View>
            </View>
          )}
          
         
          <View style={Styles.wrapperTypePayment}>
            <View style={Styles.tabContainer}>
              <TouchableOpacity
                style={[Styles.tabItem, activeTab === 'Tunai' && Styles.activeTab]}
                onPress={() => handleTabPress('Tunai')}
              >
                <Text style={Styles.tabText}>Tunai</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.tabItem, activeTab === 'Non Tunai' && Styles.activeTab]}
                onPress={() => handleTabPress('Non Tunai')}
              >
                <Text style={Styles.tabText}>Non Tunai</Text>
              </TouchableOpacity>
            </View>
            {activeTab === 'Tunai' && (
              <View style={Styles.wrapperPayment}>
                  <TextInput
                    placeholder="Masukkan jumlah penerimaan uang"
                    style={Styles.inputCash}
                    value={displayCash}
                    onChangeText={handleCustomCashChange}
                  />
                  <View style={Styles.wrapperCash}>
                    <TouchableOpacity
                      style={[
                        Styles.btnCash,
                        selectedCash === 'Rp 20.000' && Styles.selectedBtnCash,
                      ]}
                      onPress={() => handleCashPress('20000')}
                    >
                        <Text>Rp 20.000</Text>
                      </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        Styles.btnCash,
                        selectedCash === 'Rp 50.000' && Styles.selectedBtnCash,
                      ]}
                      onPress={() => handleCashPress('50000')}
                    >
                        <Text>Rp 50.000</Text>
                      </TouchableOpacity>
                </View>
                <View style={{marginVertical:5}} />
                  <View style={Styles.wrapperCash}>
                    <TouchableOpacity
                      style={[
                        Styles.btnCash,
                        selectedCash === 'Rp 100.000' && Styles.selectedBtnCash,
                      ]}
                      onPress={() => handleCashPress('100000')}
                    >
                      <Text>Rp 100.000</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                          Styles.btnCash,
                          selectedCash === `${totalPembayaran.toLocaleString('id-ID')}` && Styles.selectedBtnCash,
                        ]}
                        onPress={() => handleCashPress(`${totalPembayaran}`)}
                      >
                        <Text>Rp {totalPembayaran.toLocaleString('id-ID')}</Text>
                      </TouchableOpacity>
                  </View>
              </View>
            )}
            {activeTab === 'Non Tunai' && (
              <View style={Styles.wrapperPayment}>
                <View style={Styles.wrapperCashless}>
                  <TouchableOpacity
                    style={[Styles.btnTypePayment, selectedPayment  === 'BCA' && Styles.selectedBtnTypePayment,]}
                    onPress={() => handleNonTunaiPress('BCA')}
                  >
                      <Text>BCA</Text>
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={[Styles.btnTypePayment, selectedPayment  === 'Gopay' && Styles.selectedBtnTypePayment]}
                    onPress={() => handleNonTunaiPress('Gopay')}
                  >
                      <Text>Gopay</Text>
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={[Styles.btnTypePayment, selectedPayment  === 'Ovo' && Styles.selectedBtnTypePayment]}
                    onPress={() => handleNonTunaiPress('Ovo')}
                  >
                      <Text>Ovo</Text>
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={[Styles.btnTypePayment, selectedPayment  === 'Dana' && Styles.selectedBtnTypePayment]}
                    onPress={() => handleNonTunaiPress('Dana')}
                  >
                      <Text>Dana</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            )}
          </View>
          
          
        </View>
      </ScrollView>
      <TouchableOpacity style={Styles.btnPayment} onPress={handlePayment}>
        <Text style={{ fontWeight: 'bold' }}>
          {activeTab === 'Tunai' ? `Bayar Rp. ${displayCash.toLocaleString('id-ID')}` : `Bayar Rp. ${totalPembayaran.toLocaleString('id-ID')}`}
        </Text>
      </TouchableOpacity>
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

  logoButton: {
    height: 30,
    width: 30,
    flexShrink: 30,
    marginHorizontal: 5,
  },

  divider: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginHorizontal: 20
  },

  wrapperTypeOrder: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 7,
  },
  
  wrapperTypeOrderMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2
  },

  toggleTypeOrder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    paddingVertical: 4,
    backgroundColor: 'gray',
  },

  wrapperOrder: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },

  wrapperMenu:{
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'space-between',
  },

  wrapperMenuText: {
    flex: 3,
    padding: 5,

  },

  wrapperMenuImage: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
  },

  wrapperTotalMenu: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },

  logoIcon:{
    height: 25,
    width: 25,
  },

  wrapperBtnQty: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 25,
    padding: 5,
  },

  btnQty: {
    height: 17,
    width: 17,
  },

  imageMenu: {
    height: 75,
    width: 75,
  },

  btnNote: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    padding: 3,
    marginTop: 4,
  },

  btnPayment: {
    backgroundColor: 'skyblue',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },


  wrapperPayment: {
    marginTop: 10,
    marginBottom: 15,
  },

  wrapperCash: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  wrapperCashless: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

  btnCancel: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  btnCharge: {
    backgroundColor: 'skyblue',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  btnCash: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    height: 28,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  btnTypePayment: {
    height: 28,
    width: 75,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  selectedBtnTypePayment: {
    backgroundColor: 'skyblue',
  },

  inputCash: {
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 30,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 5
  },






  wrapperTypePayment: {
    marginHorizontal: 20
  },

  selectedBtnCash: {
    backgroundColor: 'skyblue',
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: 'skyblue',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomColor: 'blue',
    borderBottomWidth: 2,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default Transaction;