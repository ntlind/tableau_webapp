import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface IProps {
    data?: number[];
    xVar: string;
    yVar: string;
}

/* Component */
export default function Barchart(props: IProps) {
    const d3Container = useRef(null);
    const parentRef = useRef(null)
    const [height, setHeight] = useState(null)
    const [width, setWidth] = useState(null)

    useEffect(
        () => {
            let margin = { top: 80, right: 50, bottom: 90, left: 50 }

            setHeight(parentRef.current.offsetHeight - margin.top - margin.bottom)
            setWidth(parentRef.current.offsetWidth - margin.left - margin.right);

            d3.select("g").remove()
            if (props.data && d3Container.current && height) {

                const svg = d3.select(d3Container.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");


                let csv = d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv")
                csv.then(function (data) {
                    // X axis
                    var x = d3.scaleBand()
                        .range([0, width])
                        .domain(data.map(function (d) { return d[props.xVar]; }))
                        .padding(0.2);
                    svg.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x))
                        .selectAll("text")
                        .attr("transform", "translate(-10,0)rotate(-45)")
                        .style("text-anchor", "end");

                    // Add Y axis
                    var y = d3.scaleLinear()
                        .domain([0, 13000])
                        .range([height, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    // Bars
                    svg.selectAll("mybar")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x", function (d) { return x(d[props.xVar]); })
                        .attr("width", x.bandwidth())
                        .attr("fill", "#69b3a2")
                        // no bar at the beginning thus:
                        .attr("height", function (d) { return height - y(0); }) // always equal to 0
                        .attr("y", function (d) { return y(0); })

                    // Animation
                    svg.selectAll("rect")
                        .transition()
                        .duration(800)
                        .attr("y", function (d) { return y(d[props.yVar]); })
                        .attr("height", function (d) { return height - y(d[props.yVar]); })
                        .delay(function (d, i) { return (i * 100) })

                })

                svg.exit()
                    .remove();
            }
        }, [props.data, d3Container.current, parentRef])

    return (
        <div ref={parentRef} className='h-full w-full'>
            <svg
                className="d3-component w-full h-full"
                ref={d3Container}
            />
        </div>
    );
}