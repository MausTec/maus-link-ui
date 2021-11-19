import React, {memo} from "react";
import {Button, Icon} from "react-materialize";
import RangeSlider from "../components/RangeSlider";

const headingStyle = {
  fontSize: '1.9rem',
  marginTop: '2rem',
  fontWeight: '300'
};

const valueStyle = {
  verticalAlign: 'middle',
  fontWeight: '300',
  marginTop: 0,
  marginBottom: 0,
  fontSize: '4rem',
  lineHeight: '2rem'
};

const buttonStyle = {
  margin: '0 0.5rem 0 0',
  height: '4rem',
  lineHeight: '4rem',
  verticalAlign: 'middle',
  padding: '0 5px'
};

const Stat = ({name, style = {}, onChange, unit, round, ...props}) => {
  const { value, max, min, step, disabled } = props;
  let v_disp = value;
  let lvalue = value;
  let sliderProps = {};

  if (max > 0 && !isNaN(value / max)) {
    lvalue = (value / max) * 100;
    unit = '%';
    v_disp = lvalue;
  }

  if (lvalue % 1) {
     let dp = 2;
     if (round || lvalue > 100) {
       dp = 0;
     } else {
       if (lvalue >= 10) dp = 1;
     }

    v_disp = Math.floor(lvalue * Math.pow(10, dp)) / Math.pow(10, dp);
  }

  if (isNaN(v_disp)) {
    v_disp = '?';
  }

  ////////// slider
  let valueup = (value + step);
  let valuedown = (value - step);
  ///////////////////////////////////////

  return (
    <React.Fragment>
      <h4 style={{marginTop: '0rem', ...headingStyle, ...style}} className="stat-heading center primary-text">{name}</h4>
      <h1 className={'stat-value center primary-light-text'} style={valueStyle}>
        {false && !disabled && <Button flat onClick={e => onChange(valuedown)} className={'primary-dark-text'}
                             style={buttonStyle}><Icon>keyboard_arrow_down</Icon></Button>}
        {v_disp}
        { unit && <span style={{ fontSize: '1.2rem'}}> { unit }</span> }
        {false && !disabled && <Button flat onClick={e => onChange(valueup)} className={'primary-dark-text'}
                             style={{...buttonStyle, margin: '0 0 0 0.5rem'}}><Icon>keyboard_arrow_up</Icon></Button>}
      </h1>
      { !disabled && <RangeSlider onChange={(e) => onChange(e)} {...sliderProps={...props}} /> }      
      { disabled && <p style={{ marginTop: '4.3rem' }}></p>}
    </React.Fragment>
  );
};

export default memo(Stat);
