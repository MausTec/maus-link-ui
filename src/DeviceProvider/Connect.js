import React, {useContext, useState} from 'react';
import  { DeviceContext } from './index.js'

const Connect = (props) => {
  const context = useContext(DeviceContext);
  const [ip, setIp] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    context.connect(ip);
  };

  if (context.state !== 'disconnected')
    return null;

  return (
    <form onSubmit={handleSubmit}>
      <input type={"text"} placeholder={"IP Address"} onChange={e => setIp(e.target.value)} />
      <button type={"submit"}>Connect</button>
    </form>
  )
};

export default Connect;
