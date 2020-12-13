import React, {Component} from 'react';
import Websocket from "react-websocket";
import Connect from "./Connect";

export const DeviceMode = {
  MANUAL: "manual",
  AUTOMATIC: "automatic"
};

export const ConnectionState = {
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  CONNECTED: "connected"
};

const defaultState = {
  ip: null,
  state: ConnectionState.DISCONNECTED,
  config: {},
  readings: [],
  lastReading: {},
  mode: "",
  modeDisplay: "",
  info: {
    deviceName: "",
    firmwareVersion: "",
    hardwareVersion: "",
    deviceSerial: ""
  },
  status: {
    wifi: {},
    sd: {}
  },
  _ws_log: [],
  _serial_cb: () => {}
};

const DeviceContext = React.createContext({
  ...defaultState,
  connect: (ip) => {},
  send: (data) => {},
  onSerialCmd: (fn) => {},
  dir: (path, cb) => {},
});

const ReadingsContext = React.createContext({
  readings: [],
  lastReading: {}
});

class DeviceProvider extends Component {
  constructor(props) {
    super(props);

    this.ws = null;

    const defaultIP = window.location.hash && window.location.hash.substring(1);

    this.state = {
      deviceContext: {
        ...defaultState,
        ip: defaultIP,
        state: defaultIP ? ConnectionState.CONNECTING : ConnectionState.DISCONNECTED,
        connect: this.connect.bind(this),
        send: this.send.bind(this),
        onSerialCmd: this.setSerialCb.bind(this),
        dir: this.dir.bind(this),
      },
      readingsContext: {
        readings: [],
        lastReading: {}
      }
    };

    this.nonceCb = {};

    /**
     * Register functions here to handle messages from the
     * device. These should point to methods in this object.
     */
    this.callbacks = {
      info: this.cbInfo,
      configList: this.cbConfigList,
      serialCmd: this.cbSerialCmd,
      wifiStatus: this.cbWifiStatus,
      sdStatus: this.cbSdStatus,
      readings: this.cbReadings,
      mode: this.cbMode,
      dir: this.cbDir,
    };
  }

  setReadingsState(state = {}) {
    this.setState({ readingsContext: {...this.state.readingsContext, ...state} });
  }

  setDeviceState(state = {}) {
    this.setState({ deviceContext: {...this.state.deviceContext, ...state} });
  }

  /*
   * Register Callbacks Here
   */

  cbDir(data) {
    const { files, nonce } = data
    if (nonce && this.nonceCb[nonce]) {
      this.nonceCb[nonce](files)
      delete this.nonceCb[nonce]
    }
  }

  cbInfo(data) {
    // {device: "Edge-o-Matic 3000", serial: "", hwVersion: "", fwVersion: "0.1.2"}
    this.setDeviceState({ info: {
        deviceName: data.device,
        firmwareVersion: data.fwVersion,
        hardwareVersion: data.hwVersion,
        deviceSerial: data.serial
    } });
  }

  cbConfigList(config) {
    this.setDeviceState({ config });
  }

  cbSerialCmd({ text, nonce }) {
    if (this.state.deviceContext._serial_cb) {
      this.state.deviceContext._serial_cb({ text, nonce });
    }
  }

  cbWifiStatus(status) {
    this.setDeviceState({ status: {...this.state.deviceContext.status, wifi: status}});
  }

  cbSdStatus(status) {
    this.setDeviceState({ status: {...this.state.deviceContext.status, sd: status}});
  }

  cbReadings(data) {
    let readings = [...this.state.readingsContext.readings];

    if (readings.length >= 100) {
      readings.shift();
    }

    readings.push(data);

    this.setReadingsState({
      readings: readings,
      lastReading: data
    });
  }

  cbMode(data) {
    this.setDeviceState({ mode: data.text.toLowerCase(), modeDisplay: data.text });
  }

  /*
   * Public command helpers, which should* be abstracted to another module?
   */
  dir(path, cb) {
    const nonce = Math.floor(Math.random() * 1000000);
    this.nonceCb[nonce] = cb;
    this.send({ dir: {
      path, nonce
    }})
  }

  /*
   * Internal State Things
   */

  send(data) {
    if (this.ws) {
      this.setDeviceState({ _ws_log: [ ...this.state.deviceContext._ws_log, {send: data} ]});
      this.ws.sendMessage(JSON.stringify(data));
    }
  }

  connect(ip) {
    let state = "connecting";

    if (!ip) {
      state = "disconnected";
    } else if (ip === this.state.deviceContext.ip) {
      state = this.state.deviceContext.state;
    }

    this.setDeviceState({ ip, state });
  }

  handleWsOpen() {
    this.setDeviceState({state: 'connected'});
    this.send({ streamReadings: true });
    this.send({ info: null });
    this.send({ configList: null });
    console.log("Connected");
  }

  handleWsClose() {
    this.setDeviceState({state: 'disconnected'});
    console.log("Closed.");
  }

  handleWsMessage(data) {
    const _this = this;
    let doc;
    try {
      doc = JSON.parse(data);
    } catch(e) {
      doc = { data };
      console.warn(e);
    }

    if (!doc.readings) {
      let _ws_log = [...this.state.deviceContext._ws_log];

      if (_ws_log.length >= 100) {
        _ws_log.shift();
      }

      this.setDeviceState({_ws_log: [_ws_log, {recv: data}]});
    }

    Object.keys(doc).map(cmd => {
      if (this.callbacks[cmd]) {
        this.callbacks[cmd].bind(_this)(doc[cmd]);
      } else {
        console.warn("Received unknown command from device: ", cmd, doc[cmd]);
      }
    })
  }

  setSerialCb(fn) {
    this.setDeviceState({ _serial_cb: fn });
  }

  render() {
    return (
      <DeviceContext.Provider value={ this.state.deviceContext }>
        <ReadingsContext.Provider value={ this.state.readingsContext }>
          { this.state.deviceContext.ip && <Websocket
            url={'ws://' + this.state.deviceContext.ip}
            onOpen={this.handleWsOpen.bind(this)}
            onClose={this.handleWsClose.bind(this)}
            ref={websocket => this.ws = websocket}
            debug
            onMessage={this.handleWsMessage.bind(this)}>
          </Websocket> }
          {/*{ this.props.children }*/}
          { this.state.deviceContext.state === ConnectionState.CONNECTED && this.props.children }
          { this.state.deviceContext.state !== ConnectionState.CONNECTED && <Connect /> }
        </ReadingsContext.Provider>
      </DeviceContext.Provider>
    )
  }
}

export default DeviceProvider;
export { DeviceContext, ReadingsContext };
