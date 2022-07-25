import React, {Component} from 'react';

import Header from "./Header";
import Sidebar from "./Sidebar";
import DeviceProvider from "./DeviceProvider";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import ButtplugProvider from "./DeviceProvider/ButtplugProvider";
import DeviceRoutes from "./DeviceRoutes";
import Diagnostic from "./Diagnostic";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App" style={{ minHeight: '100vh'}}>
        <BrowserRouter>
          <Switch>
            <Route path="/diagnostic">
              <Diagnostic />
            </Route>
            <Route path="/">
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
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
