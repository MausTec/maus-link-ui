import React, {useContext, useState} from 'react'
import {CartesianGrid, Legend, Line, LineChart, ReferenceLine, YAxis} from "recharts";
import {DeviceContext, ReadingsContext} from "../DeviceProvider";
import Measure from "react-measure";

const Graph = (props) => {
  const context = useContext(DeviceContext);
  const readings = useContext(ReadingsContext);
  const [size, setSize] = useState({width: 0, height: 300});

  const {
    config: {
      sensitivity_threshold
    }
  } = context;

  const {
    readings: data
  } = readings;

  return (
    <Measure bounds onResize={contentRect => setSize(contentRect.bounds)}>
      {({ measureRef }) => (
        <div style={{ height: 300 }} ref={measureRef}>
          <LineChart width={size.width} height={size.height} data={data}>
            <YAxis yAxisId={0} domain={[0, 4096]} />
            <YAxis yAxisId={1} domain={[0, 255]} label={"%"} orientation={"right"} />
            <Legend />
            <CartesianGrid vertical={false} stroke={"#333333"} />
            <ReferenceLine y={sensitivity_threshold * 4}  label={"Arousal Limit"} stroke={"#b71c1c"} />

            <Line name="Pressure" type={"monotone"} dataKey={"pressure"} yAxisId={0} dot={false} stroke={"#81c784"} />
            <Line name="Motor Speed" type={"step"} dataKey={"motor"} yAxisId={1} dot={false} stroke={"#ffab40"} />
            <Line name="Arousal" type={"linear"} dataKey={"scaledarousal"} strokeWidth={2} yAxisId={0} dot={false} stroke={"#ff3d00"} />
          </LineChart>
        </div>
      )}
    </Measure>
  )
};

export default Graph
