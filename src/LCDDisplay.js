import React from 'react';

const LCDDisplay = ({data = ""}) => {
  const width = 128;
  const height = 64;
  const colHeight = Math.floor((height + 7) / 8);

  let pages = [];

  for (let page = 0; page < height / colHeight; page++) {
    const pageStart = page * width * 2; // 128 bytes per page
    const pageData = data.slice(pageStart, pageStart + (width * 2));
    const pageDataHex = pageData.match(/..?/g) || [];
    const pageDataBytes = pageDataHex.map((i) => parseInt(i, 16));

    let columns = [];

    for (let column = 0; column < width; column++) {
      let rows = [];
      let byte = pageDataBytes[column];

      for (let row = 0; row < 8; row++) {
        const bit = !!(byte & (1 << (7 - (row % 8))));
        rows.push(<div key={"p" + page + "c" + column + "r" + row} className={'pixel'} style={{
          border: "1px solid black",
          borderTop: "none",
          borderLeft: "none",
          backgroundColor: (bit ? "green" : "black"),
          width: 3,
          height: 3
        }}/>);
      }

      columns.unshift(<div key={"p" + page + "c" + column} className={'column'} style={{float: "left"}}>
        {rows}
      </div>);
    }

    pages.unshift(<div key={"p" + page}>{columns}</div>);
  }

  return (
    <div className={'lcd'} style={{
      backgroundColor: 'black',
      borderTop: "1px solid black",
      borderLeft: "1px solid black",
      display: 'inline-block', width: 'auto'
    }}>
      {pages}
      <br style={{clear: "both"}}/>
    </div>
  );
};

export default LCDDisplay;
