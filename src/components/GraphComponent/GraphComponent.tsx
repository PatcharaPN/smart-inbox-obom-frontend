// src/DemoArea.tsx
import React from "react";
import { Area } from "@ant-design/plots";
import Modal from "../Modal/Modal";

const GraphArea: React.FC = () => {
  const config = {
    data: {
      type: "fetch",
      value: "https://assets.antv.antgroup.com/g2/stocks.json",
      transform: [
        { type: "filter", callback: (d: any) => d.symbol === "GOOG" },
      ],
    },
    xField: (d: any) => new Date(d.date),
    yField: "price",
    style: {
      fill: "l(270) 0:#ffffff 1:#6F42C1",
    },
    axis: {
      y: { labelFormatter: "~s" },
    },
    line: {
      style: {
        stroke: "6F42C1",
        strokeWidth: 2,
      },
    },
  };

  return (
    <>
      <Modal>
        {" "}
        <div className="w-[680px] h-[250px]">
          {" "}
          <p>กราฟต์จำนวนคนดูรายเดือน</p>
          <Area {...config} />
        </div>
      </Modal>
    </>
  );
};

export default GraphArea;
