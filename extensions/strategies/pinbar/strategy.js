var z = require('zero-fill')
  , n = require('numbro')

module.exports = function container (get, set, clear) {
  return {
    name: 'pinbar',
    description: 'Buy when (EMA - last(EMA) > 0) and sell when (EMA - last(EMA) < 0). Optional buy on low RSI.',

    getOptions: function () {
      this.option('period', 'period length', String, '2m')
      this.option('market_trend', 'Market trend', String, 'down')
      this.option('min_periods', 'min. number of history periods', Number, 52)
      this.option('trend_ema', 'number of periods for trend EMA', Number, 26)
      this.option('neutral_rate', 'avoid trades if abs(trend_ema) under this float (0 to disable, "auto" for a variable filter)', Number, 'auto')
      this.option('oversold_rsi_periods', 'number of periods for oversold RSI', Number, 14)
      this.option('oversold_rsi', 'buy when RSI reaches this value', Number, 10)
    },

    calculate: function (s) {
      get('lib.pinbar')(s);
      // get('lib.ema')(s, 'trend_ema', s.options.trend_ema)
      // if (s.options.oversold_rsi) {
      //   // sync RSI display with oversold RSI periods
      //   s.options.rsi_periods = s.options.oversold_rsi_periods
      //   get('lib.rsi')(s, 'oversold_rsi', s.options.oversold_rsi_periods)
      //   if (!s.in_preroll && s.period.oversold_rsi <= s.options.oversold_rsi && !s.oversold && !s.cancel_down) {
      //     s.oversold = true
      //     if (s.options.mode !== 'sim' || s.options.verbose) console.log(('\noversold at ' + s.period.oversold_rsi + ' RSI, preparing to buy\n').cyan)
      //   }
      // }
      // if (s.period.trend_ema && s.lookback[0] && s.lookback[0].trend_ema) {
      //   s.period.trend_ema_rate = (s.period.trend_ema - s.lookback[0].trend_ema) / s.lookback[0].trend_ema * 100
      // }
      // if (s.options.neutral_rate === 'auto') {
      //   get('lib.stddev')(s, 'trend_ema_stddev', 10, 'trend_ema_rate')
      // }
      // else {
      //   s.period.trend_ema_stddev = s.options.neutral_rate
      // }
    },

    onPeriod: function (s, cb) {

    //  s.exchange.getBalance({currency: s.currency, asset: s.asset}, function (err, balance) {
    //  console.log(balance);


        // var market_trend = s.options.market_trend;
         if(s.lookback.length ){
           console.log(`
             slop: ${s.lookback[0].pinbar_slope}
             pinbar_position_pct: ${s.period.pinbar_position_pct}
             pinbar_bottom_times: ${s.period.pinbar_bottom_times}
             pinbar_top_times : ${s.period.pinbar_top_times}
             pinbar_num_down : ${s.period.pinbar_num_down}
            `);
        //   if(s.lookback[0].pinbar_slope <=-2){
        //     market_trend = 'down';
        //   }else if(s.lookback[0].pinbar_slope >=2){
        //     market_trend = 'up';
        //   }
         }

        // if(s.signal === 'bought'){
        //   console.log('signan',s.signal);
        // }
      let buy_pinbar_position_pct = 80
      let buy_pinbar_bottom_times = 3
      if(s.options.market_trend ==='up'){
        buy_pinbar_position_pct = 60
        buy_pinbar_bottom_times = 2
      }
      if(typeof s.pinbar_sell_stop !== 'undefined'
        && s.pinbar_sell_stop > s.period.close
      ){
        s.signal ='sell';
        console.log("\n"+'lose stop',s.pinbar_sell_stop,s.period.close+"\n")

        s.pinbar_sell_stop = undefined;
        s.pinbar_profit_stop = undefined;
        return cb();
      }

      if(typeof s.pinbar_profit_stop !== 'undefined'
        && s.pinbar_profit_stop < s.period.close
      ){
        s.signal ='sell';
        console.log("\n"+'profit sell stop',s.pinbar_profit_stop,s.period.close+"\n" )

        s.pinbar_sell_stop = undefined;
        s.pinbar_profit_stop = undefined;
        return cb();
      }
      // already bought skip buy signal
  //    if(typeof s.pinbar_profit_stop  !== 'undefined' ||
    //    typeof s.pinbar_sell_stop  !== 'undefined'

  //    ){
    //    console.log('xxx');
        /*
        { asset: '0.0000000000000000',
          currency: '6193.8160804563442000',
          asset_hold: '0.0000000000000000',
          currency_hold: '1000.0000000000000000' }
        */
        //send buy signal but cannot buy
        // if(balance.asset < 0.001){
        //   s.pinbar_sell_stop = undefined;
        //   s.pinbar_profit_stop = undefined;
        // }else{
      //    return cb();
        //}
        //console.log('djkjdl',typeof s.pinbar_profit_stop  == 'undefined',s.pinbar_profit_stop);

    //  }
      if(
        //s.period.pinbar_direction == 1
        s.period.pinbar_position_pct >= buy_pinbar_position_pct
        && s.period.pinbar_bottom_times >= buy_pinbar_bottom_times
        && s.period.pinbar_num_down >= 3

      ){

        if(s.lookback.length ){

    //      if(s.lookback[0].pinbar_slope <=-1){
            s.signal = 'buy';


             if(typeof s.pinbar_profit_stop  === 'undefined' ||
                  typeof s.pinbar_sell_stop  === 'undefined'
            ){
              
              if(typeof s.pinbar_sell_stop  === 'undefined'){
                  s.pinbar_sell_stop = s.period.low;
              }
            let price_length = s.period.low  - s.pinbar_sell_stop;
            if(typeof s.pinbar_profit_stop  === 'undefined'){
              if(s.options.market_trend ==='down'){
                s.pinbar_profit_stop =((s.period.close  - s.pinbar_sell_stop)/2)+s.period.close;

              }else{
                s.pinbar_profit_stop =((s.period.close  - s.pinbar_sell_stop))*2+s.period.close;
              }
            }
          }
            console.log(`
                buy
                open : ${s.period.open}
                profit_stop : ${s.pinbar_profit_stop}
                sell_stop: ${s.pinbar_sell_stop}
                low: ${s.period.low}

            `);
        //  }
        }

        //s.pinbar_profit_stop =
      //  console.log('buy');

      }else if(
        //s.period.pinbar_direction == -1
        s.period.pinbar_position_pct <= 20
        && s.period.pinbar_top_times >2
      ){
          s.signal = 'sell';





          s.pinbar_sell_stop = undefined;
          s.pinbar_profit_stop = undefined;
      //    console.log('sell')
      }
    //  console.log(s);
      cb();
  //  });
    },

    onReport: function (s) {
      var cols = []
      if (typeof s.period.trend_ema_stddev === 'number') {
        var color = 'grey'
        if (s.period.trend_ema_rate > s.period.trend_ema_stddev) {
          color = 'green'
        }
        else if (s.period.trend_ema_rate < (s.period.trend_ema_stddev * -1)) {
          color = 'red'
        }
        cols.push(z(8, n(s.period.trend_ema_rate).format('0.0000'), ' ')[color])
        if (s.period.trend_ema_stddev) {
          cols.push(z(8, n(s.period.trend_ema_stddev).format('0.0000'), ' ').grey)
        }else{
          cols.push('                  ')
        }
      }
      else {
        if (s.period.trend_ema_stddev) {
          cols.push('                  ')
        }
        else {
          cols.push('         ')
        }
      }
      return cols
    }
  }
}
