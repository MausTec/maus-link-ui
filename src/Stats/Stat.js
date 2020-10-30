import React from "react";
import {Button, Icon} from "react-materialize";

const headingStyle = {
  fontSize: '1.9rem',
  marginTop: 0,
  fontWeight: '300'
};

const valueStyle = {
  verticalAlign: 'middle',
  fontWeight: '300',
  marginTop: 0,
  marginBottom: 0,
  fontSize: '4rem',
  lineHeight: '4rem'
};

const buttonStyle = {
  margin: '0 0.5rem 0 0',
  height: '4rem',
  lineHeight: '4rem',
  verticalAlign: 'middle',
  padding: '0 5px'
};

const Stat = ({name, value = '?', style = {}, onChange, unit, round, max = 0, step = 1}) => {
  let v_disp = value;

  if (max > 0 && !isNaN(value / max)) {
    value = (value / max) * 100;
    unit = '%';
    v_disp = value;
  }

  if (value % 1) {
    let dp = 2;
    if (round || value > 100) {
      dp = 0;
    } else {
      if (value >= 10) dp = 1;
    }

    v_disp = Math.floor(value * Math.pow(10, dp)) / Math.pow(10, dp);
  }

  if (isNaN(v_disp)) {
    v_disp = '?';
  }

  return (
    <React.Fragment>
      <h4 style={{...headingStyle, ...style}} className="stat-heading center primary-text">{name}</h4>
      <h1 className={'stat-value center primary-light-text'} style={valueStyle}>
        {onChange && <Button flat onClick={e => onChange(-1 * step)} className={'primary-dark-text'}
                             style={buttonStyle}><Icon>keyboard_arrow_down</Icon></Button>}
        {v_disp}
        { unit && <span style={{ fontSize: '1.2rem'}}> { unit }</span> }
        {onChange && <Button flat onClick={e => onChange(step)} className={'primary-dark-text'}
                             style={{...buttonStyle, margin: '0 0 0 0.5rem'}}><Icon>keyboard_arrow_up</Icon></Button>}
      </h1>
    </React.Fragment>
  );
};

export default Stat;
