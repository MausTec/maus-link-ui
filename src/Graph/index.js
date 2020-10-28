import React, {useContext} from 'react'
import {CartesianGrid, Legend, Line, LineChart, ReferenceLine, YAxis} from "recharts";
import {DeviceContext} from "../DeviceProvider";

const Graph = (props) => {
  const context = useContext(DeviceContext);
  const {
    readings: data,
    config: {
      peakLimit
    }
  } = context;

  return (
    <div style={{ height: 300, width: 900, margin: '2rem auto' }}>
      <LineChart width={900} height={300} data={data}>
        <YAxis yAxisId={0} domain={[0, 4096]} />
        <YAxis yAxisId={1} domain={[0, 255]} label={"%"} orientation={"right"} />
        <Legend />
        <CartesianGrid vertical={false} stroke={"#333333"} />
        <ReferenceLine y={peakLimit} label={"Arousal Limit"} stroke={"#b71c1c"} />

        <Line name="Pressure" type={"monotone"} dataKey={"pressure"} yAxisId={0} dot={false} stroke={"#81c784"} />
        <Line name="Motor Speed" type={"step"} dataKey={"motor"} yAxisId={1} dot={false} stroke={"#ffab40"} />
        <Line name="Arousal" type={"linear"} dataKey={"arousal"} strokeWidth={2} yAxisId={0} dot={false} stroke={"#ff3d00"} />
      </LineChart>
    </div>
  )
};

export default Graph
