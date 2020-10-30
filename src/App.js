import React, {Component} from 'react';

import Header from "./Header";
import Sidebar from "./Sidebar";
import DeviceProvider from "./DeviceProvider";
import Dashboard from "./Dashboard";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Console from "./pages/Console";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <DeviceProvider>
            <Header />

            <div className={'content'}>
              <Sidebar />

              <main>
                <Switch>
                  <Route exact path={'/'}>
                    <Dashboard />
                  </Route>
                  <Route path={'/settings'}>
                    <h1>Settings.</h1>
                  </Route>
                  <Route path={'/console'}>
                    <Console />
                  </Route>
                </Switch>
              </main>
            </div>
          </DeviceProvider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
