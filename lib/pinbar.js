/*
  variable
  direction - up/down
  resistance = {
    open :
    close :
    max
    min
    percent :
  }
  supprt ={
    open :
    close :
    max
    min
    percent :
  }
}

{ period_id: '5m5000530',
       size: '5m',
       time: 1500159000000,
       open: 175.71,
       high: 175.73,
       low: 175,
       close: 175,
       volume: 1499.5538755300001,
       close_time: 1500159291753,
       rsi_avg_gain: 0.21478901334029404,
       rsi_avg_loss: 0.3177602767463018,
       rsi: 40 }
*/
module.exports = function container (get, set, clear) {
  return function pinbar (s, key, length, source_key) {
    //console.log(s);
    /*
    { options:
       { profit_stop_enable_pct: 10,
         sell_stop_pct: 5,
         period: '1d',
         buy_pct: 10,
         sell_pct: 100,
         strategy: 'pinbar',
         paper: true,
         buy_stop_pct: 0,
         profit_stop_pct: 1,
         max_slippage_pct: 5,
         order_adjust_time: 5000,
         max_sell_loss_pct: 25,
         order_poll_time: 5000,
         markup_pct: 0,
         order_type: 'maker',
         poll_trades: 30000,
         currency_capital: 1000,
         asset_capital: 0,
         rsi_periods: 14,
         avg_slippage_pct: 0.045,
         debug: undefined,
         stats: true,
         mode: 'paper',
         selector: 'gdax.ETH-USD',
         min_periods: 52,
         trend_ema: 26,
         neutral_rate: 'auto',
         oversold_rsi_periods: 14,
         oversold_rsi: 10 },
         selector: 'gdax.ETH-USD',
  exchange:
   { name: 'gdax',
     historyScan: 'backward',
     makerFee: 0,
     takerFee: 0.3,
     getProducts: [Function: getProducts],
     getTrades: [Function: getTrades],
     getBalance: [Function: getBalance],
     getQuote: [Function: getQuote],
     cancelOrder: [Function: cancelOrder],
     buy: [Function: buy],
     sell: [Function: sell],
     getOrder: [Function: getOrder],
     getCursor: [Function: getCursor] },
  product_id: 'ETH-USD',
  asset: 'ETH',
  currency: 'USD',
  product:
   { asset: 'ETH',
     currency: 'USD',
     min_size: '0.01',
     max_size: '1000000',
     increment: '0.01',
     label: 'ETH/USD' },
  balance: { asset: 0, currency: 1000 },
  ctx: { option: [Function: option] },
  lookback: [],
  day_count: 1,
  my_trades: [],
  vol_since_last_blink: 0,
  strategy:
   { name: 'trend_ema',
     description: 'Buy when (EMA - last(EMA) > 0) and sell when (EMA - last(EMA) < 0). Optional buy on low RSI.',
     getOptions: [Function: getOptions],
     calculate: [Function: calculate],
     onPeriod: [Function: onPeriod],
     onReport: [Function: onReport] },
  last_day:
   Bucket {
     size: BucketSize { spec: '1d', value: 1, granularity: 'd' },
     value: 17342 },
  period:
   { period_id: 'd17342',
     size: '1d',
     time: 1498348800000,
     open: 300.76,
     high: 300.76,
     low: 300.76,
     close: 300.76,
     volume: 0.01,
     close_time: 1498351201998 },
  in_preroll: true }

300

280-290  285
(150-160)/2 - 155

110-120   = 115
100




% 55/200 * 100
10/(150-100) * 100


1 times

10/10  18 times
    */


  //  s.period[key] = (s.period[source_key] - prev_ema) * multiplier + prev_ema


    let avg = ((s.period.open+s.period.close)/2);
    let position_pct =  ((avg - s.period.low)/(s.period.high-s.period.low))* 100;

    let = size = Math.abs(s.period.open - s.period.close);
    let top_times = 0
    let bottom_times = 0;
    if(size ===0){
      top_times = 100;
      bottom_times = 100;
    }else{
      bottom_times = (Math.min(s.period.open, s.period.close) - s.period.low)/size;
      top_times = (s.period.high - Math.max(s.period.open, s.period.close) )/size;

      //(s.period.)/size
    }

    let direction=0;
    let num_down=0;
    let num_up=0;
    if (s.lookback.length) {

      for(var i =0 ;i<s.lookback.length && i < 5; i++){
        if(s.lookback[i].close > s.period.close){
            num_down++;

        }else if(s.lookback[i].close < s.period.close){
            num_up++;
        }

      }
      s.period.pinbar_num_down =num_down;
      s.period.pinbar_num_up =num_up;

      if(s.lookback[0].close > s.period.close){
        direction=-1
        if(s.lookback[0].pinbar_slope < 0){
          s.period.pinbar_slope = s.lookback[0].pinbar_slope -1;
        }else{
          s.period.pinbar_slope = -1;
        }

      }else if(s.lookback[0].close < s.period.close){
        direction=1;
        if(s.lookback[0].pinbar_slope > 0){
          s.period.pinbar_slope = s.lookback[0].pinbar_slope + 1;
        }else{
          s.period.pinbar_slope = 1;
        }
      }

    }else{
      s.period.pinbar_slope = 0;
    }
    s.period.pinbar_top_times = top_times;
    s.period.pinbar_bottom_times = bottom_times;
    s.period.pinbar_position_pct = position_pct;
    s.period.pinbar_direction = direction;

    //throw 'aaa';
    // if (!source_key) source_key = 'close'
    // if (s.lookback.length >= length) {
    //   var prev_ema = s.lookback[0][key]
    //   if (typeof prev_ema === 'undefined' || isNaN(prev_ema)) {
    //     var sum = 0
    //     s.lookback.slice(0, length).forEach(function (period) {
    //       sum += period[source_key]
    //     })
    //     prev_ema = sum / length
    //   }
    //   var multiplier = 2 / (length + 1)
    //   s.period[key] = (s.period[source_key] - prev_ema) * multiplier + prev_ema
    // }
  }
}
