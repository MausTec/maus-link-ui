import React, {useContext, useState} from 'react'
import {Button, Icon, SideNav, SideNavItem} from "react-materialize";
import blueprint from '../assets/EoM_Blueprint.svg';
import Connect from "../DeviceProvider/Connect";
import {DeviceContext} from "../DeviceProvider";

const Sidebar = () => {
  const context = useContext(DeviceContext);
  const connecting = context.state === 'connecting';
  const connected = context.state === 'connected';
  const disconnected = context.state === 'disconnected';

  return (
    <SideNav
      id="SideNav"
      options={{
        draggable: true
      }}
      fixed
    >
      <SideNavItem
        user={{
          background: blueprint,
          image: blueprint,
          name: context.state === 'connecting' ? "Connecting..." : (context.info.deviceName || "Unknown Device"),
          email: context.ip || "Disconnected"
        }}
        userView
      />

      { disconnected && <SideNavItem>
        <Connect />
      </SideNavItem>}

      { connected && <React.Fragment>
        <SideNavItem
          href="#!dashboard"
          icon={<Icon>dashboard</Icon>}
        >
          Dashboard
        </SideNavItem>

        <SideNavItem
          href="#!dashboard"
          icon={<Icon>settings</Icon>}
        >
          Settings
        </SideNavItem>
      </React.Fragment> }

      {/*<SideNavItem href="#!second">*/}
        {/*Second Link*/}
      {/*</SideNavItem>*/}

      {/*<SideNavItem subheader>*/}
        {/*Subheader*/}
      {/*</SideNavItem>*/}

      { !disconnected && <React.Fragment>
        <SideNavItem divider />

        <SideNavItem
          href="#!disconnect"
          onClick={e => e.preventDefault() && context.connect(null)}
          waves
          icon={<Icon>close</Icon>}
        >
          Disconnect
        </SideNavItem>
      </React.Fragment> }
    </SideNav>
  )
};

export default Sidebar;
