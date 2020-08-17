import React, {useState} from 'react'

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
