import React from "react";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import io from 'socket.io-client';

const socket = io('http://localhost:9700/');


const Test = (props) => {
  const [tests, setTests] = React.useState([]);
  React.useLayoutEffect(() => {
    socket.on("speeds_update", (data) => {
      console.log(data);
      setTests([
        {
          id: "Speed Tests",
          color: "hsl(209, 100%, 55%)",
          data: data,
        },
      ]);
    });
    axios
      .get("/api/speed/history")
      .then((response) => {
        setTests([
          {
            id: "Speed Tests",
            color: "hsl(209, 100%, 55%)",
            data: response.data,
          },
        ]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);
  return (
    <ResponsiveLine
      data={tests}
      enablePointLabel
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "transportation",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "count",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      colors={{ scheme: "paired" }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default Test;
