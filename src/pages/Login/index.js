import React, {useContext, useState} from "react";
import { Image, Text, TextInput, View, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import logoCoffee from "../../assets/logo/coffee.png";
import axios from "axios";
import Cookies from "universal-cookie";
import md5 from "react-native-md5";
import { AuthContext } from "../../config/services/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const { isLoading, login, errorMessage } = useContext(AuthContext);

  
  return (
    <View style={Styles.wrapper}>
      <Spinner visible={isLoading} />
      <Image source={logoCoffee} style={Styles.logoImage} />
      {errorMessage ? (
      <Text style={Styles.errorText}>{errorMessage}</Text> // Display error message if it exists
    ) : null}
      <TextInput
        placeholder='Enter username'
        type='text'
        value={username}
        onChangeText={(text)=> setUsername(text)}
        style={Styles.textInput}
        />
      <TextInput
        placeholder='Enter password'
        type='password'
        value={password}
        onChangeText={(text)=> setPassword(text)}
        style={Styles.textInput}
      />
      <TouchableOpacity
        onPress={() => { login(username, password)}}
      >
        <View style={Styles.button}>
          <Text style={Styles.textButton}>Login</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
};

const Styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center'
  },

  logoImage: {
    height: 100,
    aspectRatio: 1 / 1,
    marginTop: 80,
    marginBottom: 25,
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  textInput: {
    height: 40,
    width: 200,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 10
  },

  button: {
    width: 80,
    height: 35,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center'
  },

  textButton: {
    color: 'black',
    fontWeight: 'bold'
  },
});


export default Login;