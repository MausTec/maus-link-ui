import React from 'react'
import {CartesianGrid, Legend, Line, LineChart, ReferenceLine, YAxis} from "recharts";

const Graph = (props) => {
  const { data, peakLimit } = props;

  return (
    <div style={{ height: 500, width: 600, margin: '2rem auto' }}>
      {/*<Chart data={data} series={series} axes={axes} tooltip />*/}

      <LineChart width={600} height={400} data={data}>
        <YAxis yAxisId={0} domain={[0, 4096]} />
        <YAxis yAxisId={1} domain={[0, 255]} label={"%"} orientation={"right"} />
        <Legend />
        <CartesianGrid vertical={false} stroke={"#333333"} />
        <ReferenceLine y={peakLimit} label={"Arousal Limit"} stroke={"#b71c1c"} />

        {/*<Line name="Pressure" type={"monotone"} dataKey={"pressure"} yAxisId={0} dot={false} stroke={"#81c784"} />*/}
        <Line name="Pressure" type={"monotone"} dataKey={"pavg"} strokeWidth={2} yAxisId={0} dot={false} stroke={"#69f0ae"} />
        <Line name="Motor Speed" type={"step"} dataKey={"motor"} yAxisId={1} dot={false} stroke={"#ffab40"} />
        <Line name="Arousal" type={"linear"} dataKey={"arousal"} strokeWidth={2} yAxisId={0} dot={false} stroke={"#ff3d00"} />
      </LineChart>
    </div>
  )
};

export default Graph
