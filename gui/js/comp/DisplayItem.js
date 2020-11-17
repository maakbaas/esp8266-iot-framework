import React from "react";
import PropTypes from "prop-types";

import "../../../node_modules/react-vis/dist/style.css";
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries } from "react-vis";

export function DisplayItem(props) {

    if (props.item.display == "graph") {
        const chartData = [];
        let min;
        let max;
        let xLim = [0, 1];
        if (props.data.length > 0) {
            min = props.data[0][1][props.item.name];
            max = props.data[0][1][props.item.name];

            xLim = [props.data[props.data.length - 1][0] - (props.item.xaxis || 10) * 1000 + 500, props.data[props.data.length - 1][0] - 500];
        }
        for (let j = 0; j < props.data.length; j++) {
            if (props.data[j][0] > props.data[props.data.length - 1][0] - (props.item.xaxis || 10) * 1000 + 500) {
                chartData.push({ x: props.data[j][0], y: props.data[j][1][props.item.name] });
                min = Math.min(min, props.data[j][1][props.item.name]);
                max = Math.max(max, props.data[j][1][props.item.name]);
            }
        }

        return <div>
            <FlexibleWidthXYPlot
                xDomain={xLim}
                margin={{ left: 40, right: 10, top: 10, bottom: 10 }}
                xType='time'
                yDomain={[min - 0.1 * (max - min), max + 0.1 * (max - min)]}
                yBaseValue={min - 0.1 * (max - min)}
                height={150}>
                <HorizontalGridLines />
                <VerticalGridLines />
                <XAxis
                    tickValues={[]} />
                <YAxis
                    tickSizeInner={0} />
                <LineSeries
                    color="#000"
                    data={chartData} />
            </FlexibleWidthXYPlot>
        </div>;

    } else {

        return <span id={props.item.name} name={props.item.name} className={props.item.type == "bool" ? props.value.toString() : ""}>{props.value.toString()}</span>;

    }
}

DisplayItem.propTypes = {
    item: PropTypes.array,
    value: PropTypes.any,
};