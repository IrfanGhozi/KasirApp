import React, { Component } from "react";
import Router from "./src/config/router";
import {AuthProvider} from "./src/config/services/AuthContext.js"

class KasirApp extends Component {
    render() {
      return (
        <AuthProvider>
          <Router />
        </AuthProvider>
        );
    }
};

export default KasirApp;