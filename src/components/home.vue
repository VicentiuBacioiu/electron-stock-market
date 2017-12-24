<template>
    <div class="container-fluid margins">
        <div class="row">
            <div class="col-10">
                <input type="text" class="form-control full-width" autofocus placeholder="Enter symbol..." v-model="symbol" v-on:keyup.enter="search"/>
            </div>
            <div class="col-2">
                <input type="button" class="btn btn-primary full-width" value="Go" v-on:click="search" />
            </div>
        </div>
        
       <stock-quote v-bind:stock="stock" v-bind:graph="graph"></stock-quote>
       <div class="alert alert-danger" role="alert" v-if="error">
         <strong>Error!</strong> {{this.error}}
       </div>

       <p class="small bottom">Data provided for free by
        <a href="https://iextrading.com/developer" target="_blank">IEX</a>.
        <br/> By using this application you agree to
        <a href="https://iextrading.com/api-exhibit-a" target="_blank">IEX terms of service</a>.
       </p>

    </div>
</template>
<script>
var Quote = require("./quote.vue");

module.exports = {
  data() {
    return {
      stock: {},
      graph: {},
      error: ""
    };
  },
  components: {
    "stock-quote": Quote
  },
  methods: {
    init() {
      this.stock = {};
      this.graph = {};
      this.error = "";
    },
    search() {
      let url = `https://api.iextrading.com/1.0/stock/${this.symbol}/quote`;

      this.init();
      this.$http
        .get(url)
        .then(this.getGraphData)
        .catch(this.handleErrors);
    },
    getGraphData(result) {
      let gUrl = `https://api.iextrading.com/1.0/stock/${this.symbol}/chart/1m`;
      this.stock = result.data;

      this.$http
        .get(gUrl)
        .then(result => {
          this.graph = result.data;
        })
        .catch(this.handleErrors);
    },
    handleErrors(err) {
      if (err.status === 404) {
        this.error = "The specified symbol could not be found...";
      } else {
        this.error = "There was an error retrieving the data...";
      }
    }
  }
};
</script>
<style>
.margins {
  padding: 40px 30px;
}
.full-width {
  width: 100%;
}
.small {
  font-size: 8px;
  color: #c0c0c0;
}
.bottom {
  position: absolute;
  bottom: 5px;
  margin: 0 auto;
}
</style>