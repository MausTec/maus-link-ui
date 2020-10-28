import React, {useState} from 'react'
import Logo from '../assets/MT_Logo_White_64h.png';
import {Icon, Navbar, NavItem} from "react-materialize";

const wifiStrength = (rssi) => {
  if (rssi < -90) {
    return "Very Low"
  } else if (rssi < -80) {
    return "Low"
  } else if (rssi < -70) {
    return "Good"
  } else if (rssi < -60) {
    return "Very Good"
  } else if (rssi < -50) {
    return "Excellent"
  } else if (rssi < 0) {
    return "Suspiciously Excellent"
  } else {
    return "Unknown"
  }
};

const Header = (props) => {
  const { status, connected, onConnect, connecting, defaultAddress = "" } = props;
  const [address, setAddress] = useState(defaultAddress);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(address);
  };

  return(
    <Navbar
      alignLinks="right"
      brand={<a className="brand-logo" href="#" style={{ paddingLeft: '1rem' }}>
        <img src={Logo} height={24} width={165} />
      </a>}
      id="mobile-nav"
      menuIcon={<Icon>menu</Icon>}
      options={{
        draggable: true,
        edge: 'left',
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        outDuration: 200,
        preventScrolling: true
      }}
    >
      <NavItem href="">
        Getting started
      </NavItem>
    </Navbar>
  );

  if (!connected) {
    if (connecting) {
      return (
        <header className={"App-header"}>
          <span>Connecting to {address}...</span>
        </header>
      )
    }

    return (
      <header className={"App-header"}>
        <form onSubmit={handleSubmit}>
          <label htmlFor={'device-address'}>Device Address: </label>
          <input id={'device-address'} onChange={e => setAddress(e.target.value)} value={address} />
          <button type={"submit"}>Connect</button>
        </form>
      </header>
    )
  }

  return (
    <header className="App-header">
      <span className={"ssid"}>{ status.ssid }</span>{' '}
      <span className={"ip"}>{ status.ip }</span>{' '}
      <span className={"strength"}>({ wifiStrength(status.signalStrength) })</span>
    </header>
  )
};

export default Header;
