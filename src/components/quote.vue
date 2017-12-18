<template>
    <div class="row">
        <div class="col-5">
            <div class="quote" v-if="stock.symbol">
                <div class="row">
                    <div class="col-6">Symbol</div>
                    <div class="col-6">{{stock.symbol}}</div>
                </div>
                <div class="row">
                    <div class="col-6">Company Name</div>
                    <div class="col-6">{{stock.companyName}}</div>
                </div>
                <div class="row">
                    <div class="col-6">Latest Price</div>
                    <div class="col-6">{{stock.latestPrice}}</div>
                </div>
                <div class="row">
                    <div class="col-6">Change</div>
                    <div class="col-6">{{stock.change}}</div>
                </div>
                <div class="row">
                    <div class="col-6">Change Percent</div>
                    <div class="col-6">{{stock.changePercent}}</div>
                </div>
                <div class="row">
                    <div class="col-6">Latest Time</div>
                    <div class="col-6">{{stock.latestTime}}</div>
                </div>
            </div>
        </div>
        <div class="col-7">
            graph
        </div>
    </div>
</template>

<script>
module.exports = {
  props: ["stock"]
};
</script>

<style>
.quote {
  margin-top: 30px;
}
</style>
