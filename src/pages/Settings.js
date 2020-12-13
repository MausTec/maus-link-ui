import React, {useContext, useEffect, useState} from 'react'
import {Button, Col, Container, Row, Switch, TextInput} from "react-materialize";
import {DeviceContext} from "../DeviceProvider";

const SettingForm = ({onSave, keys=[], config, title, toggle, children}) => {
  if (children && children.map) {
    children.map(c => {
      keys.push(c.props.id);
    });
  } else if (children.props) {
    keys.push(children.props.id);
  }

  if (toggle && toggle.props) {
    keys.push(toggle.props.id);
  }

  const isDirty = config._dirty.filter(k => keys.indexOf(k) >= 0).length > 0;

  return (
    <form onSubmit={onSave(keys)}>
      <div className={'card'}>
        <div className={'card-content'}>
          <div className={'card-title'} style={{marginBottom: '1.5rem'}}>
            { toggle && <div className={'right'}>
              { toggle }
            </div> }
            {title}
          </div>
          <Row style={{marginLeft: '-0.75rem', marginRight: '-0.75rem', marginBottom: 0}}>
            {children}
          </Row>
        </div>
        <div className={'card-action right-align'}>
          <Button type={'submit'} disabled={!isDirty}>Save</Button>
        </div>
      </div>
    </form>
  )
};

const SettingsInput = ({onChange, config, Component = TextInput, type='text', s=12, m=12, label, id, ...props }) => {
  if (type === 'switch') {
    const toggle = (
      <Switch onLabel={'On'}
              offLabel={'Off'}
              checked={!!config[id]}
              onChange={onChange}
              id={id}
              name={id}
              {...props}
      />
    );

    if (label === "") {
      return toggle
    } else {
      return (
        <React.Fragment>
          <Col s={12} m={6}>{ label }</Col>
          <Col s={12} m={6} className={'right-align'}>{ toggle }</Col>
        </React.Fragment>
      )
    }
  }
  return (
    <Component name={id}
               id={id}
               s={s}
               m={m}
               label={label}
               type={type}
               value={config[id] || ""}
               onChange={onChange}
               {...props}
    />
  )
};

const Settings = () => {
  const context = useContext(DeviceContext);
  const [configDraft, setConfig] = useState({...context.config, _dirty: []});

  useEffect(() => {
    const preserve = {};

    configDraft._dirty.map(k => {
      preserve[k] = configDraft[k];
    });

    setConfig({...context.config, ...preserve, _dirty: configDraft._dirty});
  }, [context.config]);

  const handleChange = (e) => {
    const {name, value, checked, type} = e.target;
    const config = {...configDraft};

    if (type === 'checkbox') {
      config[name] = checked;
    } else {
      config[name] = value;
      e.preventDefault();
    }

    if (config._dirty.indexOf(name) < 0)
      config._dirty.push(name);

    setConfig(config);
  };

  const handleSave = (keys) => (e) => {
    e.preventDefault();
    let config = {};

    configDraft._dirty.map(k => {
      if (keys.indexOf(k) >= 0)
        config[k] = configDraft[k];
    });

    console.log({keys, configDraft, config});

    context.send({configSet: config});
    setConfig({
      ...configDraft,
      _dirty: configDraft._dirty.filter(k => keys.indexOf(k) === -1)
    });
  };

  return (
    <Container style={{marginTop: '3rem', marginBottom: '3rem'}}>
      <SettingForm onSave={handleSave} title={"WiFi Connection"} config={configDraft}
                   toggle={<SettingsInput type={'switch'} id={'wifi_on'} config={configDraft} onChange={handleChange} />}>
        <SettingsInput config={configDraft} onChange={handleChange} id={'wifi_ssid'} label={'Network SSID'} />
        <SettingsInput config={configDraft} onChange={handleChange} id={'wifi_key'} label={'Network Password'} type={'password'} />
      </SettingForm>

      <SettingForm onSave={handleSave} title={'Bluetooth Connection'} config={configDraft}
                   toggle={<SettingsInput type={'switch'} id={'bt_on'} config={configDraft} onChange={handleChange} />}>
        <SettingsInput config={configDraft} onChange={handleChange} id={'bt_display_name'} label={'Bluetooth Display Name'} />
      </SettingForm>

      <SettingForm onSave={handleSave} title={'Remote Control'} config={configDraft}>
        <SettingsInput type={'number'} id={'websocket_port'} label={'Websocket Port'} config={configDraft} onChange={handleChange} />
        <SettingsInput type={'switch'} id={'classic_serial'} label={'Classic Serial'} config={configDraft} onChange={handleChange} />
      </SettingForm>

      <SettingForm onSave={handleSave} title={'Display Settings'} config={configDraft}>
        <SettingsInput type={'number'} id={'screen_dim_seconds'} label={'Screen Dim (Seconds)'} config={configDraft} onChange={handleChange} />
        <SettingsInput type={'number'} id={'screen_timeout_seconds'} label={'Screen Timeout (Seconds)'} config={configDraft} onChange={handleChange} />
      </SettingForm>

      <SettingForm onSave={handleSave} title={'Edging Control'} config={configDraft}>
        <SettingsInput type={'number'} id={'motor_max_speed'} label={'Motor Max Speed'} config={configDraft} onChange={handleChange} />
        <SettingsInput type={'number'} id={'sensitivity_threshold'} label={'Sensitivity Threshold'} config={configDraft} onChange={handleChange} />
        <SettingsInput type={'number'} id={'motor_ramp_time_s'} label={'Motor Ramp-up Time (Seconds)'} config={configDraft} onChange={handleChange} />
        <SettingsInput type={'number'} id={'pressure_smoothing'} label={'Pressure Smoothing Samples'} config={configDraft} onChange={handleChange} />
        <SettingsInput type={'number'} id={'update_frequency_hz'} label={'Update Frequency (Hz)'} config={configDraft} onChange={handleChange} />
        <SettingsInput type={'switch'} id={'use_average_values'} label={'Use Average Values'} config={configDraft} onChange={handleChange} />
      </SettingForm>

      <div className={'card'} style={{ display: 'none'}}>
        <div className={'card-content'}>
          <div className={'card-title'}>Raw Settings</div>
          <pre>
            {JSON.stringify(configDraft, undefined, 2)}
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
