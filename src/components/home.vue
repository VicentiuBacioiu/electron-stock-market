<template>
    <div class="container-fluid margins">
        <div class="row">
            <div class="col-10">
                <input type="text" class="form-control full-width" placeholder="Enter symbol..." v-model="symbol" v-on:keyup.enter="search"/>
            </div>
            <div class="col-2">
                <input type="button" class="btn btn-primary full-width" value="Go" v-on:click="search" />
            </div>
        </div>
        
       <stock-quote></stock-quote>

       
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
  components: {
    "stock-quote": Quote
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
    color: #C0C0C0;
}
.bottom {
    position: absolute;
    bottom: 5px;
    margin: 0 auto;
}
</style>