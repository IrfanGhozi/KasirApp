import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ModalFormStok from "./ModalFormStok.js";
import back from "../../assets/icons/back_black.png";
import search from "../../assets/icons/search_black.png";
import history from "../../assets/icons/history_black.png";
import plus from "../../assets/icons/plus_button.png";
import minus from "../../assets/icons/minus_button.png";
import axios from "axios";
import { BASE_URL } from '../../config/config';
import Spinner from "react-native-loading-spinner-overlay";
import { AuthContext } from "../../config/services/AuthContext.js";

const Stock = ({ navigation, data }) => {
  const [gabunganData, setGabunganData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('');
  const [dataStatus, setDataStatus] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const { getBarang, dataBarang, getStokBarang, dataStokBarang, isLoading, cookies } = useContext(AuthContext);

  useEffect(() => {

  getBarang();
  getStokBarang();

  }, []);

  // Membuat array baru dengan menjumlahkan data jumlah berdasarkan barang_id
  const arrayJumlah = dataStokBarang.reduce((index, item1) => {
    const persediaanBarang = index.find(item2 => item2.barang_id === item1.barang_id);
    if (persediaanBarang) {
      persediaanBarang.jumlah += parseInt(item1.jumlah);
      persediaanBarang.tanggal = item1.tanggal;
      persediaanBarang.created_time = item1.created_time;
    } else {
      index.push({
        barang_id: item1.barang_id,
        jumlah: parseInt(item1.jumlah),
        tanggal: item1.tanggal,
        created_time: item1.created_time,
      });
    }
    return index;
  }, []);

  // Menggabungkan tabel barang dan arrayJumlah berdasarkan id
  const mergedArray = dataBarang.map(item1 => {
    const jumlah = arrayJumlah.find(item2 => item2.barang_id === item1.idBarang);
    return { ...item1, ...jumlah };
  }, []);

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

  // Menerapkan quicksort pada mergedArray berdasarkan created_time
  const sortedArray = quicksort(mergedArray);
    
  const handleOpenModal = (itemId, itemName, dataStatus) => {
    setSelectedItemId(itemId);
    setSelectedItemName(itemName);
    setDataStatus(dataStatus);
    setModalVisible(true);
    console.log(dataStatus);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setRefresh(true);
  };

   // Pembaruan halaman saat stok barang berubah
   useEffect(() => {
    if (refresh) {
      getStokBarang();
      setRefresh(false);
    }
   }, [refresh]);
  
  //Menggunakan Algoritma Binary Search 
  const binarySearch = (index, target) => {
    let left = 0;
    let right = index.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const productName = index[mid].name;

      if (productName === target) {
        return index[mid];
      }

      if (productName < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return null;
  };
  
  const handleSearchPress = () => {
      setShowTextInput(true);
      const result = binarySearch(sortedArray, searchTerm);
  };

  const handleTextInputBlur = () => {
    setShowTextInput(false);
  };

  return (
    <View>
      {/* <Spinner visible={isLoading} /> */}
      <View style={Styles.header} >
        <TouchableOpacity style={Styles.buttonIcon} onPress={()=>navigation.goBack()}>
          <Image source={back} style={Styles.logoIcon}/>
        </TouchableOpacity>
        <Text style={Styles.textHeader}>Inventaris</Text>


        <View style={Styles.containerSearch}>
          {showTextInput && (
            <View style={Styles.textInputSearch}>
              <TextInput
                onBlur={handleTextInputBlur}
                placeholder="Enter search query"
                style={Styles.textInput}
                onChangeText={setSearchTerm}
              />
            </View>
          )}
          <TouchableOpacity onPress={handleSearchPress}>
            <Image source={search} style={Styles.logoIcon}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={Styles.buttonIcon} onPress={()=>navigation.navigate("HistoryStock")}>
          <Image source={history} style={Styles.logoIcon}/>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{marginBottom: 55}}>
          {isLoading ? (
            <Spinner visible={isLoading} />
          ) : (
            <View>
              {searchTerm === null || searchTerm === "" ? (
                sortedArray.map((item, index) => {
                  return (
                    <View style={Styles.cardProduct} key={index}>
                      <Image source={{ uri: `${BASE_URL}/upload/barang/${item.gambar}` }} style={Styles.productImage} />
                  
                      <View style={Styles.wrapperProductName}>
                        <Text style={Styles.textProductName}>{item.namaBarang}</Text>
                        <Text style={Styles.textPrice}>Total = {item.jumlah}</Text>
                      </View>
                      <TouchableOpacity style={Styles.buttonIcon}
                        onPress={() => handleOpenModal(item.barang_id, item.namaBarang, 'Bertambah')}
                      >
                        <Image source={plus} style={Styles.logoIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity style={Styles.buttonIcon}
                        onPress={() => handleOpenModal(item.barang_id, item.namaBarang, 'Berkurang')}
                      >
                        <Image source={minus} style={Styles.logoIcon} />
                      </TouchableOpacity>
                    </View>
                  )
                })
              ) : (
                sortedArray
                  .filter((item) =>
                    item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, index) => (
                    <View style={Styles.cardProduct} key={index}>
                      <Image source={{ uri: `${BASE_URL}/upload/barang/${item.gambar}` }} style={Styles.productImage} />
                  
                      <View style={Styles.wrapperProductName}>
                        <Text style={Styles.textProductName}>{item.namaBarang}</Text>
                        <Text style={Styles.textPrice}>Total = {item.jumlah}</Text>
                      </View>
                      <TouchableOpacity style={Styles.buttonIcon}
                        onPress={() => handleOpenModal(item.barang_id, item.namaBarang, 'Bertambah')}
                      >
                        <Image source={plus} style={Styles.logoIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity style={Styles.buttonIcon}
                        onPress={() => handleOpenModal(item.barang_id, item.namaBarang, 'Berkurang')}
                      >
                        <Image source={minus} style={Styles.logoIcon} />
                      </TouchableOpacity>
                    </View>
                  ))
              )}
          </View>
          )}
        </View>
      </ScrollView>
      <ModalFormStok
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        itemId={selectedItemId}
        itemName={selectedItemName}
        dataStatus={dataStatus}
      />
    </View>
  )
};

const Styles = StyleSheet.create({
  header: {
    padding: 10,
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
    height: 25,
    width: 25,
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
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },

  containerSearch: {
    alignItems: 'center',
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    paddingHorizontal: 5,
    flexDirection: 'row'
  },
  textInputSearch: {
    marginHorizontal: 5,
  },
  textInput: {
    height: 35,
    fontSize: 11,
    paddingHorizontal: 8,
  },
});

export default Stock;