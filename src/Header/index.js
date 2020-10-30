import React, {useContext, useState} from 'react'
import Logo from '../assets/MT_Logo_White_64h.png';
import {Icon, Navbar, NavItem} from "react-materialize";
import {DeviceContext} from "../DeviceProvider";

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
  const context = useContext(DeviceContext);

  return(
    <Navbar
      alignLinks="right"
      brand={<React.Fragment>
        <a className="brand-logo" href="#">
          <img alt="Maus-Tec Logo" src={Logo} height={18} />
        </a>
        <div className={'status'}>
          { context.mode }
        </div>
      </React.Fragment>}
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
      <NavItem href="" icon={<Icon>wifi</Icon>}>
        { context.status.wifi.ssid }
      </NavItem>
    </Navbar>
  );
};

export default Header;
