import React, {useContext, useState} from 'react'
import {Button, Icon, SideNav, SideNavItem} from "react-materialize";
import blueprint from '../assets/EoM_Blueprint.svg';
import Connect from "../DeviceProvider/Connect";
import {DeviceContext} from "../DeviceProvider";
import {NavLink} from "react-router-dom";

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
        <li><NavLink to={"/"} exact activeClassName={'primary-dark white-text'}><Icon className={'prefix'}>dashboard</Icon> Dashboard</NavLink></li>
        <li><NavLink to={"/settings"} activeClassName={'primary-dark white-text'}><Icon className={'prefix'}>settings</Icon> Settings</NavLink></li>
        <li><NavLink to={"/console"} activeClassName={'primary-dark white-text'}><Icon className={'prefix'}>code</Icon> Serial Console</NavLink></li>
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
