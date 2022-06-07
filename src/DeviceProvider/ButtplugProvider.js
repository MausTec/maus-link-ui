import React, {Component, createContext, useEffect} from 'react';
import {ButtplugClient, ButtplugEmbeddedClientConnector} from "buttplug";
import {DeviceContext, ReadingsContext} from "./index";

const ButtplugState = {
  IDLE: 'idle',
  PAIRING: 'pairing',
  ERROR: 'error',
  UNAVAILABLE: 'unavailable'
};

const defaultState = {
  devices: [],
  state: ButtplugState.IDLE
};

const ButtplugContext = createContext({
  ...defaultState,
  startPairing: () => {},
  stopPairing: () => {}
});

class ButtplugProvider extends Component {
  static contextType = ReadingsContext;

  constructor(props) {
    super(props);

    this.client = new ButtplugClient("Edge-o-Matic UI");
    this.client.addListener("deviceadded", this.handleDevice.bind(this));
    this.client.addListener("deviceremoved", this.removeDevice.bind(this));
    this.connector = null;

    this.state = {
      ...defaultState,
      startPairing: this.startPairing.bind(this),
      stopPairing: this.stopPairing.bind(this)
    }
  }

  handleDevice(device) {
    console.log("Device added: ", device.Name);
    this.setState({ devices: [...this.state.devices, device] });
  }

  removeDevice(device) {
    console.log("Device removed: ", device.Name);
    this.setState({ devices: this.state.devices.filter(d => d.Index !== device.Index)});
  }

  startPairing() {
    this.setState({ state: ButtplugState.PAIRING });
    this.connector = new ButtplugEmbeddedClientConnector();

    console.log("Connecting...");

    this.client.Connect(this.connector)
      .then(() => {
        console.log("Starting scan...");
        this.client.StartScanning()
          .then(() => {
            console.log("Connected.");
            this.setState({ state: ButtplugState.IDLE });
          })
          .catch((e) => {
            console.error(e);
            this.setState({ state: ButtplugState.IDLE });
          });
      })
      .catch((e) => {
        console.error(e);
        this.setState({ state: ButtplugState.IDLE });
      });
  }

  stopPairing() {
    this.setState({ state: ButtplugState.IDLE });
    console.log("Stopping scan...");
    this.client.StopScanning()
      .then(() => {
        console.log("Disconnecting...");
        this.client.Disconnect()
          .then(console.log)
          .catch((e) => {
            console.error(e);
            this.setState({ state: ButtplugState.IDLE });
          });
      })
      .catch((e) => {
        console.error(e);
        this.setState({ state: ButtplugState.IDLE });
      });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const oldSpeed = this.context.lastReading.motor;
    const nextSpeed = nextContext.lastReading.motor;

    if (oldSpeed !== nextSpeed) {
      const speedPerc = Math.max(Math.min(1, nextSpeed / 255), 0);

      this.state.devices.map(device => {
        if (speedPerc > 0) {
          device.SendVibrateCmd(speedPerc)
            .then()
            .catch(console.error);
        } else {
          device.SendStopDeviceCmd()
            .then()
            .catch(console.error);
        }
      })
    }
  }

  render() {
    const { children } = this.props;

    return (
      <ButtplugContext.Provider value={this.state}>
        { children }
      </ButtplugContext.Provider>
    )
  }
}

export default ButtplugProvider;
export { ButtplugContext, ButtplugState };
