import React, {useContext, useState} from 'react';
import {DeviceContext} from './index.js'
import {Button, Row, Switch, Tab, Tabs, TextInput} from "react-materialize";
import logo from '../assets/MT_Logo_White_64h.png'
import {ConnectionState} from "./index";
import {Link} from "react-router-dom";

const Connect = ({ defaultIp = "", defaultId = ""}) => {
  const defaults = defaultId ? [] : defaultIp.split(/\/\//);
  const context = useContext(DeviceContext);
  const [ip, setIp] = useState(defaults[1] || "");
  const [id, setId] = useState(defaultId);
  const [protocol, setProtocol] = useState(defaults[0] || 'ws:');

  const handleSubmit = (mode) => (e) => {
    e.preventDefault();

    if (mode === 'remote') {
      const url = `wss://link.maustec.net/remote/${id}`;
      console.log("Connecting to " + url);
      context.connect(url);
    } else {
      context.connect(`${protocol}//${ip}`);
    }
  };

  const handleProtocolChange = (e) => {
    setProtocol(e.target.checked ? 'wss:' : 'ws:');
  }

  // noinspection HttpUrlsUsage
  return (
    <div className={'full-splash'} style={{minHeight: '100vh', position: 'relative'}}>
      <div className="service-links" style={{
        position: "absolute",
        right: "0.5rem",
        bottom: "0.5rem",
      }}>
        <Link to={"/diagnostic"} style={{ color: "rgba(255,255,255,0.5)" }}>Diagnostic</Link>
      </div>
      <div className="form" style={{
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
          <Tabs>
            <Tab title="Remote Link">
              <form onSubmit={handleSubmit('remote')}>
                <div className={'card-content'}>
                  {context.error && <div className={"error red-text text-darken-1"}>{context.error}</div>}

                  <Row style={{margin: '0rem -0.75rem 0 -0.75rem'}}>
                    <TextInput autoFocus s={12} disabled={context.state === ConnectionState.CONNECTING} type={"text"}
                               label={"Device ID"} id={'device_id'} value={id} onChange={e => setId(e.target.value)}/>
                  </Row>

                  <Button type={"submit"} disabled={context.state === ConnectionState.CONNECTING} style={{
                    display: 'block',
                    width: '100%'
                  }}>{context.state === ConnectionState.CONNECTING ? 'Connecting...' : 'Connect'}</Button>
                </div>
              </form>
            </Tab>
            <Tab title="Local Network" active={!id}>
              <form onSubmit={handleSubmit('local')}>
                <div className={'card-content'}>
                  {context.error && <div className={"error red-text text-darken-1"}>{context.error}</div>}

                  <Row style={{margin: '0rem -0.75rem 0 -0.75rem'}}>
                    <TextInput autoFocus s={12} disabled={context.state === ConnectionState.CONNECTING} type={"text"}
                               label={"IP Address"} id={'ip_address'} value={ip} onChange={e => setIp(e.target.value)}/>
                  </Row>

                  <div style={{width: 'auto', margin: '0 auto 1.5rem auto', textAlign: 'center'}}>
                    <Switch name='protocol' id='protocol' offLabel='HTTP' onLabel='HTTPS'
                            onChange={handleProtocolChange}
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
              </form>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
};

export default Connect;
