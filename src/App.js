import React, {Component} from 'react';
import Graph from './Graph'

import Websocket from 'react-websocket';

import LEDRing from "./LEDRing";
import Header from "./Header";
import Sidebar from "./Sidebar";
import LCDDisplay from './LCDDisplay';
import {Button, Container, Icon} from "react-materialize";
import DeviceProvider from "./DeviceProvider";
import Stats from "./Stats";
import WSConsole from "./DeviceProvider/WSConsole";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <DeviceProvider>
          <Header />

          <div className={'content'}>
            <Sidebar />

            <main>
              <Container style={{ marginTop: '3rem' }}>
                <Stats />

                <div className={'row'}>
                  <div className={'col s12'}>
                    <div className={'card'}>
                      <div className={'card-content'}>
                        <Graph />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={'row'}>
                  <div className={'col s12'}>
                    <WSConsole />
                  </div>
                </div>
              </Container>
            </main>
          </div>
        </DeviceProvider>
      </div>
    );
  }
}

export default App;
