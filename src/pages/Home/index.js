import react, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import cashier from '../../assets/icons/cashier_machine_black.png';
import inventory from '../../assets/icons/inventory_management_black.png';
import history from '../../assets/icons/history_black.png';
import logoutIcon from '../../assets/icons/logout_black.png';
import logoCoffee from '../../assets/logo/coffee.png';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../config/services/AuthContext';

const LogoMenu = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{alignItems: 'center', marginVertical: 15,}}>
      <TouchableOpacity  onPress={()=>navigation.navigate(props.link)} style={Styles.buttonMenu}>
        <Image source={props.image} style={Styles.logoMenu} />
      </TouchableOpacity>
      <Text style={Styles.textMenu}>{props.menu}</Text>
    </View>
  )
};


const Home = ({ navigation }, props) => {
  const { userInfo, logout, isLoading, cookies } = useContext(AuthContext);

  return (
    <View style={Styles.container}>
      <Spinner visible={isLoading} />
      <View style={Styles.header}>
        <Image source={logoCoffee} style={Styles.logoImage} />
        <TouchableOpacity
          style={{ position: 'absolute', top: 5, right: 5, }}
          onPress={logout}
        >
          <Image source={logoutIcon} style={Styles.logoIcon} />
        </TouchableOpacity>
      </View>
      <View style={Styles.wrapperMenu}>
        <LogoMenu menu="Order" image={cashier} link="Order"/>
        <LogoMenu menu="Stok" image={inventory} link="Stock"/>
        <LogoMenu menu="Riwayat" image={history} link="History"/>
      </View>
      <View style={Styles.footer}>
        <Text style={Styles.textFooter}>{'\u00A9'}Copyright KasirApp 2023</Text>
      </View>
    </View>
  )
};

const Styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  header:{
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    alignItems: 'center',
    height: 120,
  },

  wrapperMenu:{
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-evenly',
    paddingVertical: 15,
  },

  footer:{
    height: 70,
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: 'black',
  },

  logoImage:{
    height: 100,
    width: 100,
    marginTop: 10,
    marginBottom: 10,
  },

  logoIcon:{
    height: 30,
    width: 30,
    marginVertical: 10,
    marginRight: 5
  },  

  logoMenu:{
    height: 80,
    width: 80,
    borderRadius: 50,
  },

  button:{
    width: 80,
    height: 35,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonMenu: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 100,
    padding: 10,
    alignItems: 'center'
  },

  textMenu: {
    color: 'black',
    fontWeight: '500',
  },

  textFooter:{
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
  
export default Home;