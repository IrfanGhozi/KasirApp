import React, {useCallback, useContext, useEffect, useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import back from "../../assets/icons/back_black.png";
import search from "../../assets/icons/search_black.png";
import basketShop from "../../assets/icons/basket_shop_black.png";
import down from "../../assets/icons/down.png";
import iconMenu from "../../assets/icons/menu/iconMenu.png";
import coffee from "../../assets/icons/menu/coffee_beans.png";
import nonCoffee from "../../assets/icons/menu/ice_drink.png";
import mainCourse from "../../assets/icons/menu/ricebowl.png";
import snack from "../../assets/icons/menu/snack.png";
import axios from "axios";
import { BASE_URL } from '../../config/config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import moment from 'moment';
import 'moment-timezone';
import { AuthContext } from "../../config/services/AuthContext";

const Cart = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{marginRight: 4}}>
      <TouchableOpacity onPress={() => navigation.navigate("Transaction")}>
        <Image source={basketShop} style={Styles.logoIcon}/>
        {props.quantity !== null && props.quantity !== undefined ? (
          <Text style={Styles.notif}>{props.quantity}</Text>
        ) : null}
      </TouchableOpacity>
    </View>
  )
};

const Menu = ({ item, onTotalMenuChange }) => {

  const handlePlaceOrder = () => {
    onTotalMenuChange(item);
  };

  return (
    <View style={Styles.cardMenu}>
      <Image source={{ uri: item.gambar }} style={Styles.imageMenu} />
      <Text style={Styles.titleMenu}>Nama Menu</Text>
      <Text style={Styles.textMenu}>{item.namaMenu}</Text>
      <Text style={Styles.titleMenu}>Price</Text>
      <Text style={Styles.textMenu}>Rp {item.harga.toLocaleString('id-ID')}</Text>
      <Text style={Styles.titleMenu}>Kategori</Text>
      <Text style={Styles.textMenu}>{item.kategori}</Text>
      <TouchableOpacity style={Styles.buttonOrder} onPress={handlePlaceOrder}>
        <Text style={Styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  )
};

const Order = ({ navigation }) => {
  const [toggle, setToggle] = useState(false);
  const [activeView, setActiveView] = useState('menu');
  const [cartItems, setCartItems] = useState('');
  const [menuCoffee, setMenuCoffee] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newIdPesanan, setNewIdPesanan] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const { getMenu, dataMenu, getTransaksi, dataTransaksi, getCoffeeMenu, getNonCoffeeMenu, getMainCourseMenu, getSnackMenu, dataCoffeeMenu, dataNonCoffeeMenu, dataMainCourseMenu, dataSnackMenu, cookies } = useContext(AuthContext);

  useEffect(() => {
    getMenu();
    getTransaksi();
    getCoffeeMenu();
    getNonCoffeeMenu();
    getMainCourseMenu();
    getSnackMenu();
  }, []);

  // Membuat array baru dengan menjumlahkan data jumlah berdasarkan barang_id
  const menuTerlaris = dataTransaksi.reduce((index, item1) => {
    const menuTerjual = index.find(item2 => item2.menu_id === item1.menu_id);
    if (menuTerjual) {
      menuTerjual.jumlah += parseInt(item1.jumlah);
    } else {
      index.push({
        menu_id: item1.menu_id,
        jumlah: parseInt(item1.jumlah),
      });
    }
    return index;
  }, []);

  // Menggabungkan data menu dan menuTerlaris berdasarkan id
  const allMenuArray = dataMenu.map(item1 => {
    const jumlahMenuTerjual = menuTerlaris.find(item2 => item2.menu_id === item1.idMenu);
    return { ...item1, ...jumlahMenuTerjual };
  }, []);

  const coffeeMenuArray = dataCoffeeMenu.map(item1 => {
    const jumlahMenuTerjual = menuTerlaris.find(item2 => item2.menu_id === item1.idMenu);
    return { ...item1, ...jumlahMenuTerjual };
  }, []);

  const nonCoffeeMenuArray = dataNonCoffeeMenu.map(item1 => {
    const jumlahMenuTerjual = menuTerlaris.find(item2 => item2.menu_id === item1.idMenu);
    return { ...item1, ...jumlahMenuTerjual };
  }, []);

  const mainCourseMenuArray = dataMainCourseMenu.map(item1 => {
    const jumlahMenuTerjual = menuTerlaris.find(item2 => item2.menu_id === item1.idMenu);
    return { ...item1, ...jumlahMenuTerjual };
  }, []);

  const snackMenuArray = dataSnackMenu.map(item1 => {
    const jumlahMenuTerjual = menuTerlaris.find(item2 => item2.menu_id === item1.idMenu);
    return { ...item1, ...jumlahMenuTerjual };
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
      const jumlah = item.jumlah || 0;

    if (jumlah > pivot.jumlah) {
      greater.push(item);
    } else if (jumlah < pivot.jumlah) {
      less.push(item);
    } else {
      equal.push(item);
    }
  }

    return [...quicksort(greater), ...equal, ...quicksort(less)];
  };

  // Menerapkan quicksort pada mergedArray berdasarkan created_time
  const sortedAllMenu = quicksort(allMenuArray);
  const sortedCoffeeMenu = quicksort(coffeeMenuArray);
  const sortedNonCoffeeMenu = quicksort(nonCoffeeMenuArray);
  const sortedMainCourseMenu = quicksort(mainCourseMenuArray);
  const sortedSnackMenu = quicksort(snackMenuArray);

  const changeView = useCallback((view) => {
    setActiveView(view);
    setToggle(false);
  },[]);


  useEffect(() => {
    setIsLoading(true);
    const fetchCountCart = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/transaksi/countCart`,
          {
            headers: {
              Authorization: cookies,
            },
          }
        );
        
        const countCartData = response.data.data;
        setCartItems(countCartData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching count cart:', error);
        setIsLoading(false);
      }
    };

    fetchCountCart();
  }, [refreshing]);

  const handlePlaceOrder = async (item) => {
    
    try {
      const newDataTransaksi = {
        menu_id: item.idMenu,
        jumlah: 1,
        tanggal: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
        created_time: new Date().toISOString(),
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


 //Menggunakan Algoritma Binary Search 
 const binarySearch = (index, target) => {
  let left = 0;
  let right = index.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const menuName = index[mid].name;

    if (menuName === target) {
      return index[mid];
    }

    if (menuName < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null;
};

const handleSearchPress = () => {
    setShowTextInput(true);
    const result = binarySearch(sortedAllMenu, searchTerm);
};

const handleTextInputBlur = () => {
  setShowTextInput(false);
};
  

  return (
    <View>
      <Spinner visible={isLoading} />
      <View style={Styles.header}>
        <TouchableOpacity style={{marginRight: 5}} onPress={()=>navigation.goBack()}>
          <Image source={back} style={Styles.logoIcon}/>
        </TouchableOpacity>
        <Text style={Styles.textHeader} >Order</Text>
        
        <View style={Styles.containerSearch}>
          {showTextInput && (
            <View style={Styles.textInputSearch}>
              <TextInput
                onBlur={handleTextInputBlur}
                placeholder="Enter search nama menu"
                style={Styles.textInput}
                onChangeText={setSearchTerm}
              />
            </View>
          )}
          <TouchableOpacity onPress={handleSearchPress}>
            <Image source={search} style={{height: 21, width: 21, marginHorizontal: 4}}/>
          </TouchableOpacity>
        </View>

        <Cart quantity={cartItems}/>
      </View>
      <ScrollView>
        <View style={{marginBottom: 60}}>
          <TouchableOpacity style={Styles.buttonMenu} onPress={()=>setToggle(!toggle)}>
            <Image source={down} style={Styles.logoIcon} />
            <Text style={Styles.buttonText}>Menu</Text>
          </TouchableOpacity>
          {toggle && ( 
            <View style={{ marginBottom: 5 }}>
              <TouchableOpacity
                style={[Styles.buttonView, activeView === 'menu' && Styles.activeButtonView]}
                onPress={() => changeView('menu')}
              >
                <Image source={iconMenu} style={Styles.logoIcon} />
                <Text style={Styles.buttonText}>Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.buttonView, activeView === 'coffee' && Styles.activeButtonView]}
                onPress={() => changeView('coffee')}
              >
                <Image source={coffee} style={Styles.logoIcon} />
                <Text style={Styles.buttonText}>Coffee</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[Styles.buttonView, activeView === 'nonCoffee' && Styles.activeButtonView]}
                onPress={() => changeView('nonCoffee')}
              >
                <Image source={nonCoffee} style={Styles.logoIcon} />
                <Text style={Styles.buttonText}>Non Coffee</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[Styles.buttonView, activeView === 'mainCourse' && Styles.activeButtonView]}
                onPress={() => changeView('mainCourse')}
              >
                <Image source={mainCourse} style={Styles.logoIcon} />
                <Text style={Styles.buttonText}>Main Course</Text>
              </TouchableOpacity>
                
              <TouchableOpacity
                style={[Styles.buttonView, activeView === 'snack' && Styles.activeButtonView]}
                onPress={() => changeView('snack')}
              >
                <Image source={snack} style={Styles.logoIcon} />
                <Text style={Styles.buttonText}>Snack</Text>
              </TouchableOpacity>
            </View>
          )}        

          {isLoading ? (
            <Spinner visible={isLoading} />
          ) : (
            <View>
              {activeView === 'menu' && (
                <View style={Styles.wrapperMenu}>
                  {searchTerm === null || searchTerm === "" ? (
                    sortedAllMenu.map((item, index) => {
                      return (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      );
                    })
                  
                    ) : (
                      sortedAllMenu
                        .filter((item) =>
                          item.namaMenu.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((item, index) => (
                          <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                        ))
                    )}
                </View>
              )}
                
              {activeView === 'coffee' && (
                <View style={Styles.wrapperMenu}>
                  {searchTerm === null || searchTerm === "" ? (
                    sortedCoffeeMenu.map((item, index) => {
                      return (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      );
                    })
                  ) : (
                    sortedCoffeeMenu
                      .filter((item) =>
                        item.namaMenu.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, index) => (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      ))
                  )}
                </View>
              )}

              {activeView === 'nonCoffee' && (
                <View style={Styles.wrapperMenu}>
                  {searchTerm === null || searchTerm === "" ? (
                    sortedNonCoffeeMenu.map((item, index) => {
                      return (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      );
                    })
                  ) : (
                    sortedNonCoffeeMenu
                      .filter((item) =>
                        item.namaMenu.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, index) => (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      ))
                  )}
                </View>
              )}
                
              {activeView === 'mainCourse' && (
                <View style={Styles.wrapperMenu}>
                  {searchTerm === null || searchTerm === "" ? (
                    sortedMainCourseMenu.map((item, index) => {
                      return (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      );
                    })
                  ) : (
                    sortedMainCourseMenu
                      .filter((item) =>
                        item.namaMenu.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, index) => (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      ))
                  )}    
                </View>
              )}

              {activeView === 'snack' && (
                <View style={Styles.wrapperMenu}>
                  {searchTerm === null || searchTerm === "" ? (
                    sortedSnackMenu.map((item, index) => {
                      return (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      );
                    })
                  ) : (
                    sortedSnackMenu
                      .filter((item) =>
                        item.namaMenu.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, index) => (
                        <Menu item={item} key={index} onTotalMenuChange={handlePlaceOrder}/>
                      ))
                  )}    
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
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

  logoIcon: {
    height: 30,
    width: 30,
  },

  imageMenu: {
    width: '90%',
    aspectRatio: 1 / 1,
  },

  cardMenu: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop:20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    margin: '1%'
  },

  wrapperMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  buttonMenu: {
    flexDirection: 'row',
    width: '30%',
    marginLeft: 15,
    marginTop: 5,
    border: 'black',
    borderWidth: 1,
    alignItems: 'center',
  },

  buttonOrder: {
    border: 'black',
    borderWidth: 1,
    marginTop: 6,
    paddingHorizontal: 30,
    paddingVertical: 4,
  },
  
  textMenu: {
    marginVertical: 2,
    textAlign: 'center'
  },

  titleMenu: {
    marginVertical: 2,
    fontWeight: 'bold',
    color: 'black',
  },

  notif: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 10,
    color: 'black',
    backgroundColor: '#6FCF97',
    padding: 1,
    borderRadius: 25,
    width: 16,
    height: 16,
    position: 'absolute',
    top: 0,
    right: 0,
  },

  buttonView: {
    flexDirection: 'row',
    width: '30%',
    marginLeft: 15,
    borderEndColor: 'black',
    borderEndWidth: 1,
    borderStartColor: 'black',
    borderStartWidth: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: '#EEE',
  },

  activeButtonView: {
    backgroundColor: '#888',
  },



  containerSearch: {
    alignItems: 'center',
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    padding: 0,
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


export default Order;