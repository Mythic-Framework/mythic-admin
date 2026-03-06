import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: "20px 10px 20px 20px",
  },
}));

export default ({ current, history }) => {
  const classes = useStyles();
  const [pHistory, setPHistory] = useState({});

  useEffect(() => {
    const now = moment().unix();
    let entries = history.map((h) => {
      return { ...h, name: moment.unix(h.time).format("HH:mm") };
    });

    entries.push({
      time: now,
      count: current,
      name: "Now",
    });

    setPHistory(entries);
  }, [history, current]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={pHistory}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#208692" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#208692" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: "'Rajdhani', sans-serif" }}
          axisLine={{ stroke: 'rgba(32,134,146,0.15)' }}
          tickLine={{ stroke: 'rgba(32,134,146,0.15)' }}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: "'Rajdhani', sans-serif" }}
          axisLine={{ stroke: 'rgba(32,134,146,0.15)' }}
          tickLine={{ stroke: 'rgba(32,134,146,0.15)' }}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(18,16,37,0.96)',
            border: '1px solid rgba(32,134,146,0.3)',
            borderRadius: 2,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            color: '#fff',
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#208692"
          strokeWidth={2}
          fill="url(#tealGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
