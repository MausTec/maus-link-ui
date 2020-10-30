import React, {useRef, useContext, useEffect, useState} from 'react'
import {Button} from "react-materialize";
import {DeviceContext} from "../DeviceProvider";

const Console = () => {
  const context = useContext(DeviceContext);
  const [lines, setLines] = useState({});
  const [line, setLine] = useState("");
  const endstop = useRef(null);

  const serialCb = ({ text, nonce }) => {
    let l = {...lines};
    console.log({text, nonce, lines, l});
    if (!l[nonce]) {
      l[nonce] = {
        line: ""
      };
    }
    l[nonce].response = text;
    setLines(l);
  };

  useEffect(() => {
    context.onSerialCmd(serialCb);
    endstop.current.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);


  const handleSend = (e) => {
    e.preventDefault();

    if (line === "clear") {
      setLine("");
      setLines({});
      return;
    }

    const lineObj = {
      line,
      response: null
    };

    const nonce = Object.keys(lines).length + 1;
    setLines({...lines, [nonce]: lineObj});
    context.send({ serialCmd: { nonce, cmd: line }});
    setLine("");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setLine(e.target.value);
  };

  return (
    <div className={'fullscreen-view'} style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
      <pre style={{ margin: 0, padding: '0.5rem 1.5rem 1.5rem 1.5rem', flexGrow: 1, height: 100, overflow: 'auto' }}>
        { Object.keys(lines).map(key => {
          const l = lines[key];
          const cmd_m = l.line.match(/\s+/);
          const cmd_i = cmd_m ? cmd_m.index : l.line.length;
          const [cmd, args] = [
            l.line.substr(0, cmd_i),
            l.line.substr(cmd_i + 1)
          ];

          return (
            <code key={key} style={{ marginTop: '1rem', display: 'block' }}>
              <div><span className={'grey-text'}>&gt;</span> <span className={'primary-light-text'}>{ cmd }</span> <span>{ args }</span></div>
              { l.response && <div>{ l.response }</div> }
            </code>
          )
        })}
        <div style={{ float: 'left', clear: 'both' }} ref={endstop} />
      </pre>
      <form onSubmit={handleSend} style={{ display: 'flex' }}>
        <input type={'text'}
               className={'grey darken-3'}
               autoComplete={'off'}
               style={{
                 boxSizing: 'border-box', padding: '0 1.5rem',
                 margin: 0, flexGrow: 1
               }}
               name={'cmd'}
               value={line}
               onChange={handleChange}
               placeholder={"Command..."}
        />
        <Button disabled={ line === "" } type={'submit'} style={{ height: '3rem' }}>Send</Button>
      </form>
    </div>
  )
};

export default Console;
