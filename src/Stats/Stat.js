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
  marginRight: '0.5rem',
  height: '4rem',
  lineHeight: '4rem',
  verticalAlign: 'middle',
  padding: '0 5px'
};

const Stat = ({name, value = '?', style = {}, onChange}) => (
  <React.Fragment>
    <h4 style={{...headingStyle, ...style}} className="stat-heading center primary-text">{name}</h4>
    <h1 className={'stat-value center primary-light-text'} style={valueStyle}>
      {onChange && <Button flat onClick={e => onChange(-1)} className={'primary-dark-text'}
                           style={buttonStyle}><Icon>keyboard_arrow_down</Icon></Button>}
      {value}
      {onChange && <Button flat onClick={e => onChange(1)} className={'primary-dark-text'}
                           style={buttonStyle}><Icon>keyboard_arrow_up</Icon></Button>}
    </h1>
  </React.Fragment>
);

export default Stat;
