import React, {useContext} from 'react'
import logo from "../assets/MT_Logo_White_64h.png";
import {DeviceContext} from "./index";
import {Button} from "react-materialize";

const GetDeviceInfo = () => {
  const device = useContext(DeviceContext)

  const onDisconnect = (e) => {
    e.preventDefault()

    device.connect(null)
  }

  return (
    <div className={'full-splash'} style={{minHeight: '100vh', position: 'relative'}}>
      <div className={'form'} style={{
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
          <div className={'card-content'}>
            <div className={'card-title'}>Getting Device Info...</div>
            <Button type={"button"} style={{ display: 'block', width: '100%' }} onClick={onDisconnect}>Disconnect</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetDeviceInfo