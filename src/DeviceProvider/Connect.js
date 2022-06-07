import React, {useContext, useState} from 'react';
import {DeviceContext} from './index.js'
import {Button, Row, Switch, Tab, Tabs, TextInput} from "react-materialize";
import logo from '../assets/MT_Logo_White_64h.png'
import {ConnectionState} from "./index";

const Connect = (props) => {
  const context = useContext(DeviceContext);
  const [ip, setIp] = useState(context.ip);
  const [protocol, setProtocol] = useState('ws:');

  const handleSubmit = (e) => {
    e.preventDefault();
    context.connect(`${protocol}//${ip}`);
  };

  const handleProtocolChange = (e) => {
    setProtocol(e.target.checked ? 'wss:' : 'ws:');
  }

  // noinspection HttpUrlsUsage
  return (
    <div className={'full-splash'} style={{minHeight: '100vh', position: 'relative'}}>
      <form onSubmit={handleSubmit} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'block',
        margin: '0 auto',
        width: 300
      }}>
        <img src={logo} alt={'Maus-Tec Logo'}/>
        <div className={'card'}>
          <Tabs scope="device-connect">
            <Tab key="by-id" title="Remote Link">
              Coming Soon (TM)
            </Tab>
            <Tab key="by-ip" title="Local Network" active>
              <div className={'card-content'}>
                {context.error && <div className={"error red-text text-darken-1"}>{context.error}</div>}

                <Row style={{margin: '0rem -0.75rem 0 -0.75rem'}}>
                  <TextInput autoFocus s={12} disabled={context.state === ConnectionState.CONNECTING} type={"text"}
                             label={"IP Address"} id={'ip_address'} onChange={e => setIp(e.target.value)}/>
                </Row>

                <div style={{width: 'auto', margin: '0 auto 1.5rem auto', textAlign: 'center'}}>
                  <Switch name='protocol' id='protocol' offLabel='HTTP' onLabel='HTTPS' onChange={handleProtocolChange}
                          checked={protocol === 'wss:'}/>
                </div>

                <Button type={"submit"} disabled={context.state === ConnectionState.CONNECTING} style={{
                  display: 'block',
                  width: '100%'
                }}>{context.state === ConnectionState.CONNECTING ? 'Connecting...' : 'Connect'}</Button>

                {window.location.protocol === 'https:' && protocol === 'ws:' &&
                  <div className={'hint'} style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.7)'
                  }}>
                    You are currently using the HTTPS version of this interface. If your device does not have HTTPS
                    enabled, you must use this interface through HTTP.
                    <br/><br/>
                    <a href={window.location.href.replace(window.location.protocol, 'http:')} onClick={(e) => {
                      e.preventDefault();
                      window.location.protocol = 'http:';
                    }}>
                      Switch to HTTP</a>
                  </div>}
              </div>
            </Tab>
          </Tabs>
        </div>
      </form>
    </div>
  )
};

export default Connect;
