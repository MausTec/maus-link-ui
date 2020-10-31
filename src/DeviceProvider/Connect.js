import React, {useContext, useState} from 'react';
import  { DeviceContext } from './index.js'
import {Button, Row, TextInput} from "react-materialize";
import logo from '../assets/MT_Logo_White_64h.png'
import {ConnectionState} from "./index";

const Connect = (props) => {
  const context = useContext(DeviceContext);
  const [ip, setIp] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    context.connect(ip);
  };

  return (
    <div className={'full-splash'} style={{ minHeight: '100vh', position: 'relative' }}>
      <form onSubmit={handleSubmit} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'block', margin: '0 auto', width: 300}}>
        <img src={logo} alt={'Maus-Tec Logo'} />
        <div className={'card'}>
          <div className={'card-content'}>
            <div className={'card-title'}>Connect Your Device</div>
            <Row style={{ margin: '0.5rem -0.75rem 0 -0.75rem'}}>
              <TextInput autoFocus s={12} disabled={ context.state === ConnectionState.CONNECTING } type={"text"} label={"IP Address"} id={'ip_address'} onChange={e => setIp(e.target.value)} />
            </Row>

            <Button type={"submit"} disabled={ context.state === ConnectionState.CONNECTING } style={{ display: 'block', width: '100%' }}>{ context.state === ConnectionState.CONNECTING ? 'Connecting...' : 'Connect' }</Button>
          </div>
        </div>
      </form>
    </div>
  )
};

export default Connect;
