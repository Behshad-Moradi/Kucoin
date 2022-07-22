const axios = require('axios');
const prompt = require("prompt-sync")({ sigint: true });


const baseUrl = 'https://api.kucoin.com'

//ms
const sleepTime = 2500;

const sleep = (ms) => {
    return new Promise((resolve, reject) =>{
        setTimeout(resolve, ms);
    })
}

async function getData(url){
    return await axios.get(baseUrl + url, {Proxy : false}).then(response => {
        return response;
    })
}


var tokenName = prompt("Enter cryptocurrency name? ")
tokenName = tokenName.toUpperCase();
const orderBookUrl = `/api/v1/market/orderbook/level2_100?symbol=${tokenName}-USDT`;
const tickerUrl = `/api/v1/market/orderbook/level1?symbol=${tokenName}-USDT`;
const _24hrStateUrl = `/api/v1/market/stats?symbol=${tokenName}-USDT`;

async function run()
{
    while (true){
        const tickerData = getData(tickerUrl);
        await tickerData.then(response => {
            try{
                console.log(`${tokenName} Price is: `,response.data.data.price);
                
            }catch (err){
                console.log("There is some error to get ticker...");
            }
            
        })
        const _24hrState = getData(_24hrStateUrl);
        await _24hrState.then(response => {
            try{
                console.log("Vol(USDT): ", parseInt(response.data.data.volValue));
            }catch (err) {
                console.log("There is some error about get 24 hr state");
            }
        })   
        const orderBookData = getData(orderBookUrl);
        await orderBookData.then(response => {
            try{
                var maxB = {"price" : response.data.data.bids[0][0], "amount" : response.data.data.bids[0][1]};
                var maxS = {"price" : response.data.data.asks[0][0], "amount" : response.data.data.asks[0][1]};
                    
                var totalB = 0.0;
                var length = response.data.data.bids.length;
                var from = response.data.data.bids[0][0];
                var to = response.data.data.bids[length - 1][0];
                for (var i = 0; i < length; i++)
                {
                    totalB += parseFloat(response.data.data.bids[i][1]);
                    
                    if (parseFloat(response.data.data.bids[i][1]) > maxB.amount)
                    {
                        maxB.amount = response.data.data.bids[i][1];
                        maxB.price = response.data.data.bids[i][0]
                    }
                }
                    
                console.log("Total B: " + parseInt(totalB) + " in " + "Range: " + from + ' ~ ' + to);
                    
                
                totalS = 0.0;
                length = response.data.data.asks.length;
                from = response.data.data.asks[0][0];
                to = response.data.data.asks[length - 1][0];
                for (var i = 0; i < length; i++)
                {
                    totalS += parseFloat(response.data.data.asks[i][1]);
                    if (parseFloat(response.data.data.asks[i][1]) > maxS.amount)
                    {    
                        maxS.amount = response.data.data.asks[i][1];
                        maxS.price = response.data.data.asks[i][0]
                    }
                }
                
                console.log("Total S: " + parseInt(totalS) + " in " + "Range: " + from + ' ~ ' + to);
                console.log("Buy - Sell: ", parseInt(totalB - totalS));
                console.log("Largest B order: ", maxB);
                console.log("Largest S order: ", maxS);
                
            }catch (err)
            {
                console.log("There is some error");
            }
        });
        
        //Next line
        console.log("");
        await sleep(sleepTime);
    }
}
run();

