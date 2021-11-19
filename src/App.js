
import React, {Component} from 'react';

import Header from "./Header";
import Sidebar from "./Sidebar";
import DeviceProvider from "./DeviceProvider";
import Dashboard from "./pages/Dashboard.js";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Console from "./pages/Console";
import Settings from "./pages/Settings";
import Buttplug from "./pages/Buttplug";
import ButtplugProvider from "./DeviceProvider/ButtplugProvider";
import FileManager from "./pages/FileManager"

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
                  <Switch>
                    <Route exact path={'/'}>
                      <Dashboard />
                    </Route>
                    <Route path={'/settings'}>
                      <Settings />
                    </Route>
                    <Route path={'/console'}>
                      <Console />
                    </Route>
                    <Route path={'/connect'}>
                      <Buttplug />
                    </Route>
                    <Route path={'/files/*'}>
                      <FileManager />
                    </Route>
                  </Switch>
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
