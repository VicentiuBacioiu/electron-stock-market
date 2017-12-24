<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-5">
                <div class="quote" v-if="stock.symbol">
                    <div class="row">
                        <div class="col-6">Symbol:</div>
                        <div class="col-6">{{stock.symbol}}</div>
                    </div>
                    <div class="row">
                        <div class="col-6">Company Name:</div>
                        <div class="col-6">{{stock.companyName}}</div>
                    </div>
                    <div class="row">
                        <div class="col-6">Latest Price (USD):</div>
                        <div class="col-6">{{stock.latestPrice}}</div>
                    </div>
                    <div class="row">
                        <div class="col-6">Change (USD):</div>
                        <div class="col-6">{{stock.change}}</div>
                    </div>
                    <div class="row">
                        <div class="col-6">Change (%):</div>
                        <div class="col-6">{{stock.changePercent}}</div>
                    </div>
                    <div class="row">
                        <div class="col-6">Latest Time:</div>
                        <div class="col-6">{{stock.latestTime}}</div>
                    </div>
                </div>
            </div>
            <div class="col-7">
                <div class="graph row" id="graph"></div>
            </div>
        </div>
    </div>
</template>

<script>
let gCrosshair = require("../../lib/g-crosshair");

module.exports = {
  props: ["stock", "graph"],
  data() {
    return {
      width: 0
    };
  },
  watch: {
    graph() {
      //if the graph data is updated, rerender the graph
      if (this.graph.length) {
        this.redrawGraph();
      } else {
        this.cleanupGraph();
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.redrawGraph);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.redrawGraph);
  },
  methods: {
    computeDimensions() {
      var graphEl = document.getElementById("graph");
      this.width = graphEl.offsetWidth;
    },
    cleanupGraph() {
      document.getElementById("graph").innerHTML = "";
    },
    redrawGraph() {
      this.cleanupGraph();
      this.computeDimensions();
      var x = this.graph.length - 1;
      var y = this.graph[x].open;

      gCrosshair.drawGraph(
        this.graph,
        this.stock.companyName,
        this.width,
        x,
        y
      );
    }
  }
};
</script>

<style>
.quote {
  margin-top: 50px;
}

.quote .row {
  padding: 10px;
}

.quote .row div:first-child {
  font-weight: 500;
}

.quote .row:nth-child(odd) {
  background-color: #f0f0f0;
}

.graph {
  font-size: 10px;
  margin-top: 50px;
}

path.candle {
  stroke: #000000;
}

path.candle.body {
  stroke-width: 0;
}

path.candle.up {
  fill: #00aa00;
  stroke: #00aa00;
}

path.candle.down {
  fill: #ff0000;
  stroke: #ff0000;
}

.crosshair {
  cursor: crosshair;
}

.crosshair path.wire {
  stroke: #dddddd;
  stroke-dasharray: 1, 1;
}

.crosshair .axisannotation path {
  fill: #dddddd;
}
</style>
