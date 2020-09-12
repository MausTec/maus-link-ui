import React, {Component} from 'react';
import Graph from './Graph'

import Websocket from 'react-websocket';

import './App.css';
import LEDRing from "./LEDRing";
import Header from "./Header";
import Sidebar from "./Sidebar";
import LCDDisplay from './LCDDisplay';

class App extends Component {
  HOST = "192.168.1.172";
  ws = null;
  lastDraw = 0;


  constructor(props) {
    super(props);

    // TODO: Cache deviceAddress in a cookie?
    // "This site uses Cookies to remember your device information so you can
    //  not orgasm even faster. Do you consent?"

    this.state = {
      deviceAddress: "",
      connected: false,
      log: [],
      pressure: [],
      sampleDepth: 300,
      sampleRate: 1, // updates per second
      settings: {
        peakLimit: 600,
        brightness: 128,
      },
      status: {
        ssid: "",
        ip: "",
        signalStrength: 0
      },
      lcdData: "FF837D7D7D83FF3F7F017F3FFF03FDFDFD03FFC1B777B7C1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00FFFFFFFFFFFFFFFFFFFF9F6F6F6F01FF837D7D7D83FF3F7F017F3FFFB36D6D6D9BFFFFFFFFFFFFFFFFFF00FFFFFFFFFFFFFFFFFFFFFFFFB36D6D6D9BFF3F7F017F3FFFC1B777B7C1FF3F7F017F3FFFB36D6D6D9BFF070505050507050505050705050505070505050507050505050705050505070505050507050505050705040505070505050507050505050705050505070505050507050505050705050505070505050507050505050605050505070505050507050505050705050505070505050507050505050705050505070505050507FD21000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000FF49000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000FF92000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000FF240000000000000000008080000000000080808000000080808000000080808000000000000000008000000080000000000000000080808000000080808000000080808000000080808000000000000000000000000080000000000000008080000000000080808000000080808000000080808000000000000000008000000F890000000000000000001109043231001F2824221F001F2824221F001F2824221F0000000A0000000F1222120F000000000000001B2424241B001F2824221F001F2824221F001F2824221F0000000A000000182424243F000000000000001109043231001F2824221F001F2824221F001F2824221F0000000A0000003F100E103F000C181313180C00000000FF81E181F11F000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002FE820000021E2A2A04003E0402023C001E2020103E00021E2A2A0400FE403840FE",
    }
  }

  handleBrightnessChange(e) {
    e.preventDefault();
    const brightness = e.target.value;
    this.setState({ settings: { ...this.state.settings, brightness }});
    this.send({ cmd: "SET_BRIGHTNESS", brightness });
  }

  handleLimitChange(e) {
    e.preventDefault();
    const limit = e.target.value;
    this.setState({ settings: { ...this.state.settings, peakLimit: limit }});
    this.send({ cmd: "SET_LIMIT", limit });
  }

  send(data) {
    if (this.ws) {
      this.ws.sendMessage(JSON.stringify(data));
    }
  }

  log(data) {
    const log = [...this.state.log];
    log.push(data);
    this.setState({log});
  }

  reconnect(e) {
    e.preventDefault();
    this.send({cmd: "hello"});
  }

  handleWsOpen() {
    this.setState({connected: true});
    this.log("Connected");
    this.send({cmd: "GET_SETTINGS"});
    this.send({cmd: "GET_WIFI_STATUS"});
    this.send({cmd: "GET_SD_STATUS"});
  }

  handleWsClose() {
    this.setState({connected: false});
    this.log("Closed");
  }

  handleWsMessage(data) {
    let doc;

    try {
      doc = JSON.parse(data);
    } catch(e) {
      doc = { data };
      console.warn(e);
    }

    if (typeof doc.pressure !== "undefined") {
      let pressure = this.state.pressure.slice(0 - (this.state.sampleDepth - 1));
      let screenshot = this.state.lcdData;
      doc.millis = doc.millis / 1000;
      if (doc.screenshot) {
        screenshot = doc.screenshot;
        delete doc.screenshot;
      }
      this.setState({ pressure: [...pressure, doc], lcdData: screenshot });
    } else {
      console.log(doc);
    }

    if (doc.cmd === "SETTINGS") {
      let newSettings = {...this.state.settings};
      (typeof doc.brightness !== "undefined") && (newSettings.brightness = doc.brightness);
      (typeof doc.peak_limit !== "undefined") && (newSettings.peakLimit = doc.peak_limit);
      this.setState({settings: newSettings});
    }

    if (doc.cmd === "WIFI_STATUS") {
      let newStatus = {...this.state.status};
      newStatus.signalStrength = doc.signal_strength;
      newStatus.ip = doc.ip;
      newStatus.ssid = doc.ssid;
      this.setState({status: newStatus});
    }

    console.log({ doc });

    if (typeof doc.screenshot !== "undefined") {
      // this.setState({ lcdData: doc.screenshot });
    }
  }

  handleConnect(address) {
    this.setState({ deviceAddress: address });
  }

  getLastData() {
    return (this.state.pressure.length && this.state.pressure[this.state.pressure.length - 1]) || {}
  }

  // TODO: Refactor <Websocket> component into a <WebsocketProvider/> which will more gracefully
  // handle connecting, and use a function child pattern to pass down the send() methods. Otherwise,
  // keep the websocket connection in context? Idek, man, I just work here.
  render() {
    return (
      <div className="App">
        { this.state.deviceAddress && <Websocket
          url={'ws://' + this.state.deviceAddress}
          onOpen={this.handleWsOpen.bind(this)}
          onClose={this.handleWsClose.bind(this)}
          ref={websocket => this.ws = websocket}
          debug
          onMessage={this.handleWsMessage.bind(this)}>
        </Websocket> }

        <Header connecting={!!this.state.deviceAddress} connected={this.state.connected} onConnect={this.handleConnect.bind(this)} status={ this.state.status } />
        <div className={'content'}>
          <Sidebar />

          <main>
            <div className={'row'}>
              <div className={'col s12 m6'}>
                <div className={'card'}>
                  <LEDRing connected={this.state.connected} pressure={ this.getLastData().pressure } arousal={ this.getLastData().arousal } limit={ this.state.settings.peakLimit } />
                </div>
              </div>
              <div className={'col s12 m6'}>
                <div className={'card'}>
                  <LCDDisplay data={this.state.lcdData} />
                </div>
              </div>
            </div>

            <div className={'card'}>
              {/*<Graph data={this.state.pressure} peakLimit={this.state.settings.peakLimit} />*/}
            </div>

            <div className={'controls'}>
              <div className={'control'}>
                <label htmlFor="brightness">Brightness</label>
                <input type={"number"} min={1} max={255} onChange={this.handleBrightnessChange.bind(this)} id={"brightness"} value={this.state.settings.brightness} />
              </div>

              <div className={'control'}>
                <label htmlFor="brightness">Arousal Limit</label>
                <input type={"number"} min={1} max={4096} onChange={this.handleLimitChange.bind(this)} id={"limit"} value={this.state.settings.peakLimit} />
              </div>

              <div className={'control'}>
                <a href={'#'} onClick={this.reconnect.bind(this)}>Reconnect</a>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
