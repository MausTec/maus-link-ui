import React, {useContext, useState} from 'react'
import {DeviceContext} from "./index";

const WSConsole = () => {
  const context = useContext(DeviceContext);
  const [cmd, changeCmd] = useState("");

  const handleSubmit = (e) => {
    let cmd_obj = {};
    try {
      cmd_obj = JSON.parse(cmd);
    } catch(e) {
      console.error(e);
    }
    e.preventDefault();
    changeCmd("");
    context.send(cmd_obj);
  };

  return (
    <pre style={{ height: 300, overflow: 'auto' }}>
      { context._ws_log.map((line, i) => (
        <code key={i} style={{ display: 'block'}} className={ line.send ? 'grey-text text-lighten-1' : ''}>
          { line.recv ? '< ' : '> ' }{ line.recv || JSON.stringify(line.send) }
        </code>
        ))
      }
      <form onSubmit={handleSubmit}>
        <input name={'line'} value={cmd} onChange={e => changeCmd(e.target.value)} />
        <button type={"submit"}>send</button>
      </form>
    </pre>
  )
};

export default WSConsole
