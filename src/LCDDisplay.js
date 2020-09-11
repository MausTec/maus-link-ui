import React from 'react';

const LCDDisplay = ({data}) => {
  const width = 128;
  const height = 64;
  const colHeight = Math.floor((height + 7) / 8);

  console.log({ data});

  let columns = [];
  for(let c = 0; c < width; c++) {
    let rows = [];
    const start = c * colHeight;
    const colData = data.slice(start, start + (colHeight * 2));
    const colHex = colData.match(/..?/g) || [];
    const colBytes = colHex.map((i) => parseInt(i, 16));
    console.log({ colData, colHex, colBytes });

    for (let r = 0; r < height; r++) {
      const byte = colBytes[Math.floor(r/8)];
      const bit = !!(byte & (1 << 7-(r % 8)));
      console.log({c, r, colBytes, byte, bit});
      rows.push(<div key={"c" + c + "r" + r} className={'pixel'} style={{ border: "1px solid black", backgroundColor: (bit ? "green" : "black"), width: 2, height: 2 }} />);
    }

    columns.push(<div key={"c" + c} className={'column'} style={{ float: "left" }}>
      { rows }
    </div>);
  }

  return (
    <div className={'lcd'} style={{ backgroundColor: 'black', display: 'inline-block', width: 'auto'}}>
      { columns }
      <br style={{ clear: "both" }} />
    </div>
  );
};

export default LCDDisplay;
