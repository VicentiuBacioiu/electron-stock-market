<template>
    <div class="quote">
        <div class="row">
            <div class="col-2">{{q.symbol}}</div>
            <div class="col-4">{{q.lastPrice}}</div>
            <div class="col-3">{{q.change}}</div>
            <div class="col-3">{{q.changePercent}}</div>
        </div>
        <div class="row">
            <div class="col-12">{{q.name}}</div>
        </div>  
    </div>
</template>

<script>
module.exports = {
  data() {
    return {
      q: {
        symbol: "A",
        lastPrice: 12
      }
    };
  }
};
</script>

<style>
.quote {
    margin-top: 30px;
}
</style>
