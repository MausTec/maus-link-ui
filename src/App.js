import React, {Component} from 'react';

import Header from "./Header";
import Sidebar from "./Sidebar";
import DeviceProvider from "./DeviceProvider";
import {BrowserRouter} from "react-router-dom";
import ButtplugProvider from "./DeviceProvider/ButtplugProvider";
import DeviceRoutes from "./DeviceRoutes";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App" style={{ minHeight: '100vh'}}>
        <BrowserRouter>
          <DeviceProvider>
            <ButtplugProvider>
              <Header />

              <div className={'content'} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Sidebar />

                <main style={{ display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                  <DeviceRoutes />
                </main>
              </div>
            </ButtplugProvider>
          </DeviceProvider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
