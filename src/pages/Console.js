import React from 'react'
import {Container} from "react-materialize";
import Stats from "../Stats";
import Graph from "../Graph";
import WSConsole from "../DeviceProvider/WSConsole";

const Console = () => {
  return (
    <Container style={{ marginTop: '3rem' }}>
      <div className={'row'}>
        <div className={'col s12'}>
          <WSConsole />
        </div>
      </div>
    </Container>
  )
};

export default Console;
