import React, {useContext, useState} from 'react'
import {Button, Container, Row, Switch, TextInput} from "react-materialize";
import Stats from "../Stats";
import Graph from "../Graph";
import WSConsole from "../DeviceProvider/WSConsole";
import {DeviceContext} from "../DeviceProvider";

const Settings = () => {
  const context = useContext(DeviceContext);
  const [configDraft, setConfig] = useState({...context.config, _dirty: []});

  const handleChange = (e) => {
    e.preventDefault();
    const {name, value, checked, type} = e.target;
    const config = {...configDraft};
    if (type === 'checkbox') {
      config[name] = checked;
    } else {
      config[name] = value;
    }

    if (config._dirty.indexOf(name) < 0)
      config._dirty.push(name);

    setConfig(config);
  };

  const handleSave = (...keys) => (e) => {
    e.preventDefault();
    let config = {};

    configDraft._dirty.map(k => {
      if (keys.indexOf(k) >= 0)
        config[k] = configDraft[k];
    });

    console.log({config});

    context.send({configSet: config});
    setConfig({...configDraft, _dirty: configDraft._dirty.filter(k => keys.indexOf(k) === -1)});
  };

  return (
    <Container style={{marginTop: '3rem', marginBottom: '3rem'}}>
      <form onSubmit={handleSave('wifi_on', 'wifi_key', 'wifi_ssid')}>
        <div className={'card'}>
          <div className={'card-content'}>
            <div className={'card-title'} style={{marginBottom: '1.5rem'}}>
              <div className={'right'}>
                <Switch onLabel={'On'} offLabel={'Off'} name={'wifi_on'} id={'wifi_on'}
                        checked={!!configDraft.wifi_on} onChange={handleChange}/>
              </div>
              WiFi Connection
            </div>
            <Row style={{marginLeft: '-0.75rem', marginRight: '-0.75rem', marginBottom: 0}}>
              <TextInput s={12} name={'wifi_ssid'} id={'wifi_ssid'} label={'Network SSID'} value={configDraft.wifi_ssid}
                         onChange={handleChange}/>
              <TextInput type='password' s={12} name={'wifi_key'} id={'wifi_key'} label={'Network Password'}
                         value={configDraft.wifi_key} onChange={handleChange}/>
            </Row>
          </div>
          <div className={'card-action right-align'}>
            <Button type={'submit'}>Save</Button>
          </div>
        </div>
      </form>

      <form onSubmit={handleSave('bt_on', 'bt_display_name')}>
        <div className={'card'}>
          <div className={'card-content'}>
            <div className={'card-title'} style={{marginBottom: '1.5rem'}}>
              <div className={'right'}>
                <Switch onLabel={'On'} offLabel={'Off'} name={'bt_on'} id={'bt_on'}
                        checked={!!configDraft.bt_on} onChange={handleChange}/>
              </div>
              Bluetooth Connection
            </div>
            <Row style={{marginLeft: '-0.75rem', marginRight: '-0.75rem', marginBottom: 0}}>
              <TextInput s={12} name={'bt_display_name'} id={'bt_display_name'} label={'Bluetooth Display Name'} value={configDraft.bt_display_name}
                         onChange={handleChange}/>
            </Row>
          </div>
          <div className={'card-action right-align'}>
            <Button type={'submit'}>Save</Button>
          </div>
        </div>
      </form>

      <div className={'card'}>
        <div className={'card-content'}>
          <div className={'card-title'}>Raw Settings</div>
          <pre>
            {JSON.stringify(context.config, undefined, 2)}
          </pre>
        </div>
      </div>

      <Button type={'button'} className={'red darken-2'} onClick={e => {
        e.preventDefault();
        context.send({serialCmd: {cmd: 'restart'}})
      }}>
        Reboot Device
      </Button>
    </Container>
  )
};

export default Settings;
