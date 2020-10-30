import React from 'react';
import Stats from "../Stats";
import Graph from "../Graph";
import WSConsole from "../DeviceProvider/WSConsole";
import {Container} from "react-materialize";

const Dashboard = () => {
  return (
    <Container style={{ marginTop: '3rem' }}>
      <Stats />

      <div className={'row'}>
        <div className={'col s12'}>
          <div className={'card'}>
            <div className={'card-content'}>
              <Graph />
            </div>
          </div>
        </div>
      </div>
      <div className={'row'}>
        <div className={'col s12'}>
          <WSConsole />
        </div>
      </div>
    </Container>
  )
};

export default Dashboard;
