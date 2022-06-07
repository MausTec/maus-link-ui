import React, {useContext} from 'react'
import {Route, Switch} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Console from "./pages/Console";
import Buttplug from "./pages/Buttplug";
import FileManager from "./pages/FileManager";
import {DeviceContext} from "./DeviceProvider";

const DeviceRoutes = ({}) => {
  const deviceInfo = useContext(DeviceContext);
  const { info } = deviceInfo;

  switch (info.deviceName) {
    case "Edge-o-Matic 3000":
      return (
        <Switch>
          <Route exact path={'/'}>
            <Dashboard />
          </Route>
          <Route path={'/settings'}>
            <Settings />
          </Route>
          <Route path={'/console'}>
            <Console />
          </Route>
          <Route path={'/connect'}>
            <Buttplug />
          </Route>
          <Route path={'/files/*'}>
            <FileManager />
          </Route>
        </Switch>
      )

    case "Mercury 1000":
      return (
        <Switch>
          <Route exact path={'/'}>
            {/*<M1K.Dashboard />*/}
          </Route>
        </Switch>
      )

    default:
      return (
        <h1>Unknown Device Type: ${ info.deviceName }</h1>
      )
  }
}

export default DeviceRoutes