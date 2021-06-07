var request = require('request');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

exports.currencyConvert = (req, res, next) => {

    var fromCurrency = req.body.fromCurrency;
    var amount = req.body.amount;
    var toCurrency = req.body.toCurrency;
    var convertedCurrency = '';

    //Get exchange rates.
    const API_KEY = 'b08103793b70e9d70684b581c1fd31ea';
    
    const exchangeApiUrl = 'http://data.fixer.io/api/latest?access_key='+API_KEY+'&base='+fromCurrency;

    request(exchangeApiUrl, function (error, response, body) {
        var exchangeResponse = JSON.parse(response.body);
        if (exchangeResponse['success'] === true) {

            var ratesArray = exchangeResponse['rates'];
            //cache upto 24h
             const ttl = 60 * 60 * 1 * 24; 
            myCache.set( "currencyRates", ratesArray, ttl);

            var cachedRates = myCache.get("currencyRates");

            if(Object.values(cachedRates).includes(toCurrency) > -1) {
                var toCurrencyRate = cachedRates[toCurrency];
                convertedCurrency = (amount*toCurrencyRate);
            } else {
                console.log('Cannot find given currency rate!');
            }   
                
            res.status(201).json({ 
                message: `${amount}${fromCurrency} converted to ${toCurrency}`,
                convertedCurrencyAmount: convertedCurrency+' '+toCurrency
            });

            } else {
                res.status(201).json({ 
                    success: false,
                    errorCode:  JSON.parse(response.body)['error']['code'],
                    message: JSON.parse(response.body)['error']['type'],
                });
            }
    });
    
}
