import { axiosget } from '@/apis/axios'
import { getKlines } from "@/apis/bbtrade";
import socket from "./socket";

export class DataFeeds {
  constructor(pairName) {
    this._configuration = defaultConfiguration()
    this._symbolsStorage = null
    this.pairName = pairName
    this._historyProvider = new HistoryProvider(pairName);

    this._configurationReadyPromise = this._requestConfiguration()
      .then((configuration) => {
        configuration = defaultConfiguration();
        this._setupWithConfiguration(configuration);
      });
  }

  // 此方法旨在提供填充配置数据的对象。
  onReady(callback) {
    setTimeout(() => {
      callback(this._configuration);
    }, 0)
  }

  // 调用这个函数来获得可见的K线范围的标记。 图表预期每调用一次getMarks就会调用一次onDataCallback。
  // SymbolInfo是一个包含商品metadata的对象.
  getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    if (!this._configuration.supports_marks) {
      return;
    }

    // /marks
    setTimeout(() => {
      let response = defaultMarks()
      if (!Array.isArray(response)) {
        const result = [];
        for (let i = 0; i < response.id.length; ++i) {
          result.push({
            id: extractField(response, 'id', i),
            time: extractField(response, 'time', i),
            color: extractField(response, 'color', i),
            text: extractField(response, 'text', i),
            label: extractField(response, 'label', i),
            labelFontColor: extractField(response, 'labelFontColor', i),
            minSize: extractField(response, 'minSize', i)
          });
        }
        response = result;
      }
      onDataCallback(response);
    }, 0)
  }

  // 调用此函数获取可见K线范围的时间刻度标记。图表预期您每个调用getTimescaleMarks会调用一次onDataCallback。
  getTimescaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    if (!this._configuration.supports_timescale_marks) {
      return;
    }

    // timescale_marks
    let response = defaultTimescaleMarks()
    if (!Array.isArray(response)) {
      const result = [];
      for (let i = 0; i < response.id.length; ++i) {
        result.push({
          id: extractField(response, 'id', i),
          time: extractField(response, 'time', i),
          color: extractField(response, 'color', i),
          label: extractField(response, 'label', i),
          tooltip: extractField(response, 'tooltip', i)
        });
      }

      response = result;
    }

    onDataCallback(response);
  }

  // 当图表需要知道服务器时间时，如果配置标志supports_time设置为true，则调用此函数。图表库预期只调用一次回调。
  getServerTime(callback) {
    if (!this._configuration.supports_time) {
      return;
    }

    const time = parseInt(Date.now());
    if (!isNaN(time)) {
      callback(time);
    }
  }

  // 通过商品名称解析商品信息
  // /symbols?symbol=<symbol> JSON包含的对象与SymbolInfo完全一样
  resolveSymbol(symbolName, onResolve, onError) {
    const resolveRequestStartTime = Date.now();
    function onResultReady(symbolInfo) {
      console.log(`Symbol resolved: ${Date.now() - resolveRequestStartTime}ms`);
      onResolve(symbolInfo);
    }

    if (!this._configuration.supports_group_request) {
      const params = {
        symbol: symbolName
      };
      setTimeout(() => {
        const response = defaultSymbolInfo(this.pairName)
        if (response.s !== undefined) {
          onError('unknown_symbol');
        } else {
          onResultReady(response);
        }
      }, 0)
    } else {
      if (this._symbolsStorage === null) {
        throw new Error('UdfCompatibleDatafeed: inconsistent configuration (symbols storage)');
      }

      this._symbolsStorage.resolveSymbol(symbolName).then(onResultReady).catch(onError);
    }
  }

  // 通过日期范围获取历史K线数据。图表库希望通过onHistoryCallback仅一次调用，接收所有的请求历史。而不是被多次调用。
  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onResult, onError) {
    this._historyProvider.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate)
      .then((result) => {
        onResult(result.bars, result.meta);
      })
      .catch(onError);
  }

  // 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据。
  subscribeBars(symbolInfo, resolution, cb, listenerGuid, onResetCacheNeededCallback) {
    // this._dataPulseProvider.subscribeBars(symbolInfo, resolution, cb, listenerGuid);
    const sub = {
      businessName: 'SUBSCRIBLE_PAIR_K_LINE',
      pairName: this.pairName.split('_').join('|'),
      // '时间线  "15s" | "1m" | "5m" | "15m" | "30m" | "1h" | "8h" | "1d"'
      rangeType: transResolutions(resolution),
      appId: 'aaa'
    }
    // window.$socket.emit('subcrible', sub)
    socket.subscribe('subcrible', sub)
    window.$socket.on('data', (data) => {
      const _data = JSON.parse(data);
      const type = _data.type
      const body = _data.body
      if (type === 'SUBSCRIBLE_PAIR_K_LINE') {
        cb(new Kline(body))
      }
    })
  }

  // 取消订阅K线数据。在调用subscribeBars方法时,图表库将跳过与subscriberUID相同的对象。
  unsubscribeBars(listenerGuid) {
    // this._dataPulseProvider.unsubscribeBars(listenerGuid);
  }

  // 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度。
  calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
    return undefined;
  }

  _requestConfiguration() {
    return Promise.resolve('')
  }

  _setupWithConfiguration(configurationData) {
    this._configuration = configurationData;

    if (configurationData.exchanges === undefined) {
      configurationData.exchanges = [];
    }

    if (!configurationData.supports_search && !configurationData.supports_group_request) {
      throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
    }

    if (configurationData.supports_group_request || !configurationData.supports_search) {
      this._symbolsStorage = new SymbolsStorage(this._datafeedURL, configurationData.supported_resolutions || [], this._requester);
    }

    console.log(`UdfCompatibleDatafeed: Initialized with ${JSON.stringify(configurationData)}`);
  }
}

class HistoryProvider {
  constructor(pairName) {
    this.pairName = pairName
  }
  // 获取数据(k线图) /history
  // nextTime: 下一个K线柱的时间 如果在请求期间无数据 (状态码为no_data)
  async getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate) {
    const requestParams = {
      pairName: this.pairName,
      rangeType: transResolutions(resolution),
      // rangeType: '1h',
      startTime: new Date(rangeStartDate * 1000),
      endTime: new Date(rangeEndDate * 1000)
    };

    try {
      const resData = await getKlines(requestParams)
      if (!resData.success) {
        return Promise.reject(resData.message)
      }
      const bars = [];
      const meta = {
        noData: false
      };

      if (resData.data.length === 0) {
        meta.noData = true;
        // meta.nextTime = resData.nextTime;
      } else {
        const data = resData.data
        for (const val of data) {
          const barValue = new Kline(val)
          bars.push(barValue);
        }
      }
      // console.log(bars)
      return ({
        bars,
        meta
      })
    } catch (e) {
      console.error(`HistoryProvider: getBars() failed, error=${e}`);
      return Promise.reject(e)
    }
  }
}

class SymbolsStorage {
  constructor(datafeedUrl, datafeedSupportedResolutions) {
    this._exchangesList = ['NYSE', 'FOREX', 'AMEX'];
    this._symbolsInfo = {}
    this._symbolsList = []

    this._datafeedUrl = datafeedUrl;
    this._datafeedSupportedResolutions = datafeedSupportedResolutions;

    this._readyPromise = this._init();
    this._readyPromise.catch((error) => {
      // seems it is impossible
      console.error(`SymbolsStorage: Cannot init, error=${error.toString()}`);
    });
  }

  resolveSymbol(symbolName) {
    return this._readyPromise.then(() => {
      const symbolInfo = this._symbolsInfo[symbolName];
      if (symbolInfo === undefined) {
        return Promise.reject(new Error('invalid symbol'));
      }

      return Promise.resolve(symbolInfo);
    });
  }

  searchSymbols(searchString, exchange, symbolType, maxSearchResults) {
    return this._readyPromise.then(() => {
      const weightedResult = [];
      const queryIsEmpty = searchString.length === 0;

      searchString = searchString.toUpperCase();

      for (const symbolName of this._symbolsList) {
        const symbolInfo = this._symbolsInfo[symbolName];

        if (symbolInfo === undefined) {
          continue;
        }

        if (symbolType.length > 0 && symbolInfo.type !== symbolType) {
          continue;
        }

        if (exchange && exchange.length > 0 && symbolInfo.exchange !== exchange) {
          continue;
        }

        const positionInName = symbolInfo.name.toUpperCase().indexOf(searchString);
        const positionInDescription = symbolInfo.description.toUpperCase().indexOf(searchString);

        if (queryIsEmpty || positionInName >= 0 || positionInDescription >= 0) {
          const alreadyExists = weightedResult.some((item) => item.symbolInfo === symbolInfo);
          if (!alreadyExists) {
            const weight = positionInName >= 0 ? positionInName : 8000 + positionInDescription;
            weightedResult.push({ symbolInfo: symbolInfo, weight: weight });
          }
        }
      }

      const result = weightedResult
        .sort((item1, item2) => item1.weight - item2.weight)
        .slice(0, maxSearchResults)
        .map((item) => {
          const symbolInfo = item.symbolInfo;
          return {
            symbol: symbolInfo.name,
            full_name: symbolInfo.full_name,
            description: symbolInfo.description,
            exchange: symbolInfo.exchange,
            params: [],
            type: symbolInfo.type,
            ticker: symbolInfo.name
          };
        });

      return Promise.resolve(result);
    });
  }

  _init() {
    const promises = [];
    const alreadyRequestedExchanges = {};

    for (const exchange of this._exchangesList) {
      if (alreadyRequestedExchanges[exchange]) {
        continue;
      }

      alreadyRequestedExchanges[exchange] = true;
      promises.push(this._requestExchangeData(exchange));
    }

    return Promise.all(promises)
      .then(() => {
        this._symbolsList.sort();
        console.log('SymbolsStorage: All exchanges data loaded');
      });
  }

  _requestExchangeData(exchange) {
    return new Promise((resolve, reject) => {
      axiosget(`${this._datafeedUrl}/symbol_info`, { group: exchange })
        .then((response) => {
          try {
            this._onExchangeDataReceived(exchange, response);
          } catch (error) {
            reject(error);
            return;
          }

          resolve();
        })
        .catch((reason) => {
          console.error(`SymbolsStorage: Request data for exchange '${exchange}' failed, reason=${reason.err}`);
          resolve();
        });
    });
  }

  _onExchangeDataReceived(exchange, data) {
    let symbolIndex = 0;

    try {
      const symbolsCount = data.symbol.length;
      const tickerPresent = data.ticker !== undefined;

      for (; symbolIndex < symbolsCount; ++symbolIndex) {
        const symbolName = data.symbol[symbolIndex];
        const listedExchange = extractField(data, 'exchange-listed', symbolIndex);
        const tradedExchange = extractField(data, 'exchange-traded', symbolIndex);
        const fullName = tradedExchange + ':' + symbolName;

        const ticker = tickerPresent ? extractField(data, 'ticker', symbolIndex) : symbolName;

        const symbolInfo = {
          ticker: ticker,
          name: symbolName,
          base_name: [listedExchange + ':' + symbolName],
          full_name: fullName,
          listed_exchange: listedExchange,
          exchange: tradedExchange,
          description: extractField(data, 'description', symbolIndex),
          has_intraday: definedValueOrDefault(extractField(data, 'has-intraday', symbolIndex), false),
          has_no_volume: definedValueOrDefault(extractField(data, 'has-no-volume', symbolIndex), false),
          minmov: extractField(data, 'minmovement', symbolIndex) || extractField(data, 'minmov', symbolIndex) || 0,
          minmove2: extractField(data, 'minmove2', symbolIndex) || extractField(data, 'minmov2', symbolIndex),
          fractional: extractField(data, 'fractional', symbolIndex),
          pricescale: extractField(data, 'pricescale', symbolIndex),
          type: extractField(data, 'type', symbolIndex),
          session: extractField(data, 'session-regular', symbolIndex),
          timezone: extractField(data, 'timezone', symbolIndex),
          supported_resolutions: definedValueOrDefault(extractField(data, 'supported-resolutions', symbolIndex), this._datafeedSupportedResolutions),
          force_session_rebuild: extractField(data, 'force-session-rebuild', symbolIndex),
          has_daily: definedValueOrDefault(extractField(data, 'has-daily', symbolIndex), true),
          intraday_multipliers: definedValueOrDefault(extractField(data, 'intraday-multipliers', symbolIndex), ['1', '5', '15', '30', '60']),
          has_weekly_and_monthly: extractField(data, 'has-weekly-and-monthly', symbolIndex),
          has_empty_bars: extractField(data, 'has-empty-bars', symbolIndex),
          volume_precision: definedValueOrDefault(extractField(data, 'volume-precision', symbolIndex), 0)
        };

        this._symbolsInfo[ticker] = symbolInfo;
        this._symbolsInfo[symbolName] = symbolInfo;
        this._symbolsInfo[fullName] = symbolInfo;

        this._symbolsList.push(symbolName);
      }
    } catch (error) {
      throw new Error(`SymbolsStorage: API error when processing exchange ${exchange} symbol #${symbolIndex} (${data.symbol[symbolIndex]}): ${error}`);
    }
  }
}

// k线图数据结构
class Kline {
  constructor(val) {
    this.time = new Date(val.createTime).getTime()
    this.close = Number(val.end)
    this.open = Number(val.start)
    this.high = Number(val.high)
    this.low = Number(val.low)
    this.volume = Number(val.vol)
  }
}

function transResolutions(resolution) {
  // 如果为分钟数
  if (!isNaN(+resolution)) {
    return resolution < 60 ? `${resolution}m` : `${(+resolution) / 60}h`
  } else {
    return resolution.toLowerCase()
  }
}

// 返回对应的秒
function periodLengthSeconds(resolution, requiredPeriodsCount) {
  let daysCount = 0;

  if (resolution === 'D' || resolution === '1D') {
    daysCount = requiredPeriodsCount;
  } else if (resolution === 'M' || resolution === '1M') {
    daysCount = 31 * requiredPeriodsCount;
  } else if (resolution === 'W' || resolution === '1W') {
    daysCount = 7 * requiredPeriodsCount;
  } else {
    daysCount = requiredPeriodsCount * parseInt(resolution) / (24 * 60);
  }

  return daysCount * 24 * 60 * 60;
}

// 获取字段
function extractField(data, field, arrayIndex) {
  const value = data[field];
  return Array.isArray(value) ? value[arrayIndex] : value;
}

// 如果没值，返回默认值
function definedValueOrDefault(value, defaultValue) {
  return value !== undefined ? value : defaultValue;
}

// 默认配置
// exchanges:交易所数组，exchanges = []会导致商品查询列表中看不到交易所过滤器。
// symbols_types:一个商品类型过滤器数组。
// supported_resolutions:一个表示服务器支持的分辨率数组，分辨率可以是数字或字符串。 如果分辨率是一个数字，它被视为分钟数。
// supports_marks:布尔值来标识您的 datafeed 是否支持在K线上显示标记。
// supports_timescale_marks:布尔值来标识您的 datafeed 是否支持时间刻度标记。
// supports_time:将此设置为true假如您的datafeed提供服务器时间（unix时间）。 它用于调整时间刻度上的价格比例。
function defaultConfiguration() {
  return {
    "supports_search": true,
    "supports_group_request": false,
    "supports_marks": true,
    "supports_timescale_marks": true,
    "supports_time": true,
    "exchanges": [],
    "symbols_types": [],
    "supported_resolutions": ['1', '5', '15', '30', '60', '480', '1D']
  }
}

function defaultMarks() {
  return {
    color: [],
    id: [],
    label: [],
    labelFontColor: [],
    minSize: [],
    text: [],
    time: []
  }
}

function defaultTimescaleMarks() {
  return []
}

function defaultSymbolInfo(pairName = 'usdt_eth') {
  return {
    description: pairName,
    'exchange-listed': "",
    "exchange-traded": "",
    "name": pairName || 'USDT_ETH',
    "timezone": "Asia/Shanghai",
    "minmov": 1,
    "minmov2": 0,
    "pointvalue": 1,
    "session": "24x7",
    "has_intraday": true,
    "has_no_volume": false,
    "type": "stock",
    "supported_resolutions": ['1', '5', '15', '30', '60', '480', '1D'],
    "pricescale": 100,
    "ticker": pairName || 'usdt_eth'
  }
}
