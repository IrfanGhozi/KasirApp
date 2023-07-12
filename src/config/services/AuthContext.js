import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from '../config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import md5 from 'react-native-md5';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState('');
  const [dataMenu, setDataMenu] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);
  const [dataStokBarang, setDataStokBarang] = useState([]);
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [dataCoffeeMenu, setDataCoffeeMenu] = useState([]);
  const [dataNonCoffeeMenu, setDataNonCoffeeMenu] = useState([]);
  const [dataMainCourseMenu, setDataMainCourseMenu] = useState([]);
  const [dataSnackMenu, setDataSnackMenu] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [cookies, setCookies] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);


  // Mengambil data user
  const login = (username, password) => {
    setIsLoading(true);
    axios.post(`${BASE_URL}/login`, {
      username,
      password,
    }).then(result => {
        let userInfo = result.data;
        // console.log(userInfo);
        setUserInfo(userInfo);
        setIsLogin(true);

        let tokens = userInfo.token

        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        AsyncStorage.setItem('access_token', tokens);

        setIsLoading(false);
      })
      .catch(err => {
        console.log(`login error ${err}`);
        setIsLoading(false)
        setErrorMessage('Username or password is incorrect');
      });
  };

  // Sistem logout
  const logout = () => {
    setIsLoading(true);

    AsyncStorage.removeItem('userInfo');
    AsyncStorage.removeItem('access_token');
    setIsLogin(false);

    setIsLoading(false)
  };

  // Mengambil data menu
  const getMenu = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/menuapi`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        const modifiedMenu = result.data.data.map(item => {
          return {
            idMenu: item.id,
            namaMenu: item.namaMenu,
            harga: item.harga,
            kategori: item.kategori,
            gambar: item.gambar,
          };
        });
        let dataMenu = modifiedMenu;
        setDataMenu(dataMenu);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(`data menu error ${error}`);
        setIsLoading(false)
      })
  };

  // Mengambil data barang
  const getBarang = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/barangapi`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        const modifiedBarang = result.data.data.map(item => {
          return {
            idBarang: item.id,
            namaBarang: item.namaBarang,
            gambar: item.gambar,
          };
        });
        let dataBarang = modifiedBarang;
        setDataBarang(dataBarang);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Data barang gagal diambil:', error);
        setIsLoading(false);
      })
  };

  // Mengambil data stokbarang
  const getStokBarang = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/stokbarangapi`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        const modifiedStokBarang = result.data.data.map(item => {
          return {
            idStokBarang: item.id,
            barang_id: item.barang_id,
            jumlah: item.jumlah,
            status: item.status,
            tanggal: item.tanggal,
            created_time: item.created_time,
          };
        });
        let dataStokBarang = modifiedStokBarang;
        setDataStokBarang(dataStokBarang);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Data stok barang gagal diambil:', error);
        setIsLoading(false);
      })
  };

  // Mengambil data transaksi
  const getTransaksi = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/transaksiapi`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        let dataTransaksi = result.data.data;
        setDataTransaksi(dataTransaksi);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Data transaksi gagal diambil:', error);
        setIsLoading(false);
      })
  };

  const getCoffeeMenu = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/api/menu/categoryMenu/Coffee`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        const modifiedMenu = result.data.data.map(item => {
          return {
            idMenu: item.id,
            namaMenu: item.namaMenu,
            harga: item.harga,
            kategori: item.kategori,
            gambar: item.gambar,
          };
        });
        let dataCoffeeMenu = modifiedMenu;
        setDataCoffeeMenu(dataCoffeeMenu);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(`data menu by kategori coffee error ${error}`);
        setIsLoading(false)
      })
  };

  const getNonCoffeeMenu = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/api/menu/categoryMenu/NonCoffee`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        const modifiedMenu = result.data.data.map(item => {
          return {
            idMenu: item.id,
            namaMenu: item.namaMenu,
            harga: item.harga,
            kategori: item.kategori,
            gambar: item.gambar,
          };
        });
        let dataNonCoffeeMenu = modifiedMenu;
        setDataNonCoffeeMenu(dataNonCoffeeMenu);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(`data menu by kategori noncoffee error ${error}`);
        setIsLoading(false)
      })
  };

  const getMainCourseMenu = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/api/menu/categoryMenu/MainCourse`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        const modifiedMenu = result.data.data.map(item => {
          return {
            idMenu: item.id,
            namaMenu: item.namaMenu,
            harga: item.harga,
            kategori: item.kategori,
            gambar: item.gambar,
          };
        });
        let dataMainCourseMenu = modifiedMenu;
        setDataMainCourseMenu(dataMainCourseMenu);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(`data menu by kategori maincourse error ${error}`);
        setIsLoading(false)
      })
  };

  const getSnackMenu = async () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/api/menu/categoryMenu/Snack`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    ).then(result => {
        const modifiedMenu = result.data.data.map(item => {
          return {
            idMenu: item.id,
            namaMenu: item.namaMenu,
            harga: item.harga,
            kategori: item.kategori,
            gambar: item.gambar,
          };
        });
        let dataSnackMenu = modifiedMenu;
        setDataSnackMenu(dataSnackMenu);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(`data menu by kategori snack error ${error}`);
        setIsLoading(false)
      })
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        isLogin,
        cookies,
        dataMenu,
        dataBarang,
        dataStokBarang,
        dataTransaksi,
        dataCoffeeMenu,
        dataNonCoffeeMenu,
        dataMainCourseMenu,
        dataSnackMenu,
        errorMessage,
        login,
        logout,
        getMenu,
        getBarang,
        getStokBarang,
        getTransaksi,
        getCoffeeMenu,
        getNonCoffeeMenu,
        getMainCourseMenu,
        getSnackMenu,
      }}>
      {children}
    </AuthContext.Provider>
  );
};