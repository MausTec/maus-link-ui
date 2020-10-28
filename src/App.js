import React, {Component} from 'react';
import Graph from './Graph'

import Websocket from 'react-websocket';

import LEDRing from "./LEDRing";
import Header from "./Header";
import Sidebar from "./Sidebar";
import LCDDisplay from './LCDDisplay';
import {Container} from "react-materialize";
import DeviceProvider from "./DeviceProvider";

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
              <Container style={{ width: 330 * 3, marginTop: '1.5rem' }}>
                <div className={'row'}>
                  <div className={'col s12 m3'}>
                    Pressure
                  </div>

                  <div className={'col s12 m6'}>
                    <LEDRing style={{ margin: '0 auto' }} />
                  </div>

                  <div className={'col s12 m3'}>
                    Denial Count
                  </div>
                </div>

                <div className={'row'}>
                  <div className={'col s12'}>
                    <div className={'card'}>
                      <div className={'card-content'}>
                        <Graph />
                      </div>
                    </div>
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
