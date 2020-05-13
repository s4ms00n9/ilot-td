<template>
  <div id="d3-chart"></div>
</template>

<script>
import * as d3 from 'd3';
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    margin: { top: 10, right: 30, bottom: 30, left: 60 },
    svg: null,
    xAxis: null,
    yAxis: null,
    x: null,
    y: null,
    series: null
  }),

  computed: {
		...mapGetters(['chartData']),
    width() {
      return 800 - this.margin.left - this.margin.right
    },
    height() {
      return 400 - this.margin.top - this.margin.bottom
    }
  },

  mounted() {
    this.prepareChart();
    this.prepareAndRenderData();
    this.drawChart();
    this.renderLabels();
    this.prepareZooming();    
  },

  methods: {
    prepareChart() {
      this.svg = d3.select("#d3-chart")
        .append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      this.x = d3.scaleLinear()
        .range([0, this.width]);
      this.y = d3.scaleLinear()
        .range([this.height, 0]);
    },

    prepareAndRenderData() {
      const seriesNames = Object.keys(this.chartData[0]).filter(key => key !== 'lambda');
      const myColor = d3.scaleOrdinal()
        .domain(seriesNames)
        .range(d3.schemeSet2);
      this.series = seriesNames.map(grpName => (
        this.chartData.map(d => ({ x: d.lambda, y: d[grpName], color: myColor(grpName), name: grpName }))
      ));

      this.x.domain(d3.extent(d3.merge(this.series), d => d.x)).nice();
      this.y.domain(d3.extent(d3.merge(this.series), d => d.y)).nice();

      this.xAxis = this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x));

      this.yAxis = this.svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(this.y));
    },

    drawChart() {
      this.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", this.width )
        .attr("height", this.height )
        .attr("x", 0)
        .attr("y", 0);

      this.svg.selectAll(".series")
          .data(this.series)
        .enter().append("g")
          .attr("class", "series")
          .attr("clip-path", "url(#clip)")
          .style("fill", (d, i) => d[i].color)
        .selectAll(".point")
          .data(d => d)
        .enter().append("circle")
          .attr("class", "point")
          .attr("r", 2)
          .attr("cx", d => this.x(d.x))
          .attr("cy", d => this.y(d.y));
    },

    renderLabels() {
      this.svg.selectAll("myLabels")
        .data(this.series)
        .enter()
          .append('g')
          .append("text")
            .datum(d => d[d.length - 1])
            .attr("transform", d => "translate(" + this.x(d.x) + "," + this.y(d.y) + ")")
            .attr("x", 12)
            .text(d => d.name)
            .style("fill", d => d.color)
            .style("font-size", 15);
    },

    prepareZooming() {
      const extent = [[this.margin.left, this.margin.top], [this.width - this.margin.right, this.height - this.margin.top]];
      const zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", this.zoomed);

      this.svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .style('cursor', 'move')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        .call(zoom);
    },

    zoomed() {
      const newX = d3.event.transform.rescaleX(this.x);
      const newY = d3.event.transform.rescaleY(this.y);
      this.xAxis.call(d3.axisBottom(newX));
      this.yAxis.call(d3.axisLeft(newY));
      this.svg
        .selectAll("circle")
        .attr('cx', d => newX(d.x))
        .attr('cy', d => newY(d.y));
    }
  }
}
</script>
<style scoped>
#d3-chart {
  margin-top: 30px;
}
</style>
