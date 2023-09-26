import React, {Component} from 'react';
import Websocket from "react-websocket";
import Connect from "./Connect";
import {toast} from "materialize-css"
import GetDeviceInfo from "./GetDeviceInfo";

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
  error: null,
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
  _serial_cb: () => {
  }
};

const DeviceContext = React.createContext({
  ...defaultState,
  connect: (ip) => {
  },
  send: (data) => {
  },
  onSerialCmd: (fn) => {
  },
  dir: (path, cb) => {
  },
});

const ReadingsContext = React.createContext({
  readings: [],
  lastReading: {}
});

class DeviceProvider extends Component {
  constructor(props) {
    super(props);

    this.ws = null;

    const defaultProto = `ws${window.location.protocol.substring(4)}//`
    const hashParts = window.location.hash ? window.location.hash.substring(1).split(':') : [];
    let defaultIP = (defaultProto + hashParts[0]);
    let defaultId = null;

    if (typeof hashParts[0] === 'undefined') {
      defaultIP = '';
    } else if (hashParts[0] === 'link') {
      defaultId = hashParts[1];
      defaultIP = `wss://link.maustec.net/remote/${defaultId}`;
    } else if (hashParts[0] === 'wss') {
      defaultIP = `wss://${hashParts[1]}`
    }

    this.state = {
      deviceContext: {
        ...defaultState,
        ip: defaultIP,
        id: defaultId,
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
      page: this.cbPage,
      setMode: this.cbMode, // v1
    };
  }

  setReadingsState(state = {}) {
    this.setState({readingsContext: {...this.state.readingsContext, ...state}});
  }

  setDeviceState(state = {}) {
    this.setState({deviceContext: {...this.state.deviceContext, ...state}});
  }

  /*
   * Register Callbacks Here
   */

  cbPage(data) {
    // FOR NOW, we're gonna pass this to Mode since the old mode detection worked this way on v 0.x firmware.
    // V1.x firmwares report a page here.
    this.cbMode({text: data});
  }

  cbDir(data) {
    // noop - this is an nonce-usually command.
  }

  cbInfo(data) {
    // {device: "Edge-o-Matic 3000", serial: "", hwVersion: "", fwVersion: "0.1.2"}
    if (!data) {
      return;
    }

    this.setDeviceState({
      info: {
        deviceName: data.device,
        firmwareVersion: data.fwVersion,
        hardwareVersion: data.hwVersion,
        deviceSerial: data.serial
      }
    });
  }

  cbConfigList(config) {
    this.setDeviceState({config});
  }

  cbSerialCmd({text, nonce}) {
    if (this.state.deviceContext._serial_cb) {
      this.state.deviceContext._serial_cb({text, nonce});
    }
  }

  cbWifiStatus(status) {
    this.setDeviceState({status: {...this.state.deviceContext.status, wifi: status}});
  }

  cbSdStatus(status) {
    this.setDeviceState({status: {...this.state.deviceContext.status, sd: status}});
  }

  cbReadings(data) {
    let readings = [...this.state.readingsContext.readings];

    if (readings.length >= 100) {
      readings.shift();
    }

    readings.push(data);

    // Legacy-ish for the mode included in the readings broadcast:
    this.cbMode({mode: data.runMode});

    this.setReadingsState({
      readings: readings,
      lastReading: data
    });
  }

  cbMode({mode: modeStr, text}) {
    let str = modeStr || text;
    let mode = "manual";

    if (str.match(/auto|edging/i)) {
      mode = "automatic";
    }

    this.setDeviceState({mode, modeDisplay: str});
  }

  /*
   * Public command helpers, which should* be abstracted to another module?
   */
  dir(path, cb) {
    this.send({
      dir: {
        path, nonce: cb
      }
    })
  }

  /*
   * Internal State Things
   */

  mknonce(cb) {
    const nonce = Math.floor(Math.random() * 1000000);
    this.nonceCb[nonce] = cb;
    return nonce;
  }

  send(data) {
    if (this.ws) {
      // Filter out nonce funcs:
      Object.keys(data).forEach(k => {
        if (data[k] && typeof data[k].nonce === 'function') {
          data[k].nonce = this.mknonce(data[k].nonce);
        }
      })
      this.setDeviceState({_ws_log: [...this.state.deviceContext._ws_log, {send: data}]});
      this.ws.sendMessage(JSON.stringify(data));
    }
  }

  connect(ip) {
    let state = "connecting";
    let error = null;

    if (!ip) {
      state = "disconnected";
    } else if (ip === this.state.deviceContext.ip) {
      state = this.state.deviceContext.state;
    }

    this.setDeviceState({ip, state, error});
  }

  handleWsOpen() {
    this.setDeviceState({state: 'connected'});
    this.send({streamReadings: true});
    this.send({info: null});
    this.send({configList: null});
    console.log("Connected");
  }

  handleWsClose(error) {
    this.setDeviceState({state: 'disconnected', error: error || "Unknown error."});
    console.log("Closed.", error);
  }

  handleWsMessage(data) {
    const _this = this;
    let doc;
    try {
      doc = JSON.parse(data);
    } catch (e) {
      doc = {data};
      console.warn(e);
    }

    if (!doc.readings) {
      console.debug("handleWsMessage", doc, data);

      let _ws_log = [...this.state.deviceContext._ws_log];

      if (_ws_log.length >= 100) {
        _ws_log.shift();
      }

      this.setDeviceState({_ws_log: [_ws_log, {recv: data}]});
    }

    Object.keys(doc).forEach(cmd => {
      const data = doc[cmd];

      // Automatically handle some common keys:
      if (data) {
        if (data.nonce && this.nonceCb[data.nonce]) {
          this.nonceCb[data.nonce](data);
          delete this.nonceCb[data.nonce];
        }

        if (data.error) {
          toast({
            html: data.error,
            classes: 'red white-text',
            duration: 3000
          })
        } else if (data.errno) {
          toast({
            html: `ERRNO ${data.errno}`,
            classes: 'red white-text',
            duration: 3000
          })
        }

      }

      if (this.callbacks[cmd]) {
        this.callbacks[cmd].bind(_this)(data);
      } else {
        console.warn("Received unknown command from device: ", cmd, doc[cmd]);
      }
    })
  }

  setSerialCb(fn) {
    this.setDeviceState({_serial_cb: fn});
  }

  renderChildren() {
    if (this.state.deviceContext.state !== ConnectionState.CONNECTED) {
      return (<Connect defaultIp={this.state.deviceContext.ip} defaultId={this.state.deviceContext.id} />)
    } else if (!this.state.deviceContext.info.deviceName) {
      return (<GetDeviceInfo/>)
    } else {
      return this.props.children
    }
  }

  render() {
    return (
      <DeviceContext.Provider value={this.state.deviceContext}>
        <ReadingsContext.Provider value={this.state.readingsContext}>
          {this.state.deviceContext.ip && <Websocket
            url={this.state.deviceContext.ip}
            onOpen={this.handleWsOpen.bind(this)}
            onClose={this.handleWsClose.bind(this)}

            ref={websocket => this.ws = websocket}
            debug
            onMessage={this.handleWsMessage.bind(this)}>
          </Websocket>}
          {this.renderChildren()}
        </ReadingsContext.Provider>
      </DeviceContext.Provider>
    )
  }
}

export default DeviceProvider;
export {DeviceContext, ReadingsContext};
