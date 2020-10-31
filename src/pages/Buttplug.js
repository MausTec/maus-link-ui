import React, {useEffect, useRef, useState} from 'react'
import useButtPlug from "react-buttplug/src/useButtPlug";
import {Button} from "react-materialize";

const Buttplug = () => {
  const [ready, setReady] = useState(false);
  const [isConnected, setConnected] = useState(false);

  useButtPlug(ready, (device) => {
    console.log({ device });
    setConnected(true);
  });

  if (!window.Bluetooth) {
    return <div>Unsupported browser. Use Chrome like a normal person.</div>
  }

  if (isConnected) {
    return <div>Connected to a device.</div>
  }

  return (
    <div>
      <h1>Buttplug.io Connection</h1>
      { !ready && <Button onClick={e => setReady(true)}>Scan</Button> }
      { ready && <Button onClick={e => setReady(false)}>Stop Scan</Button> }
    </div>
  )
};

export default Buttplug;
