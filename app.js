const axios = require('axios');
const prompt = require("prompt-sync")({ sigint: true });

const baseUrl = 'htt://api.kucoin.com'


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
const url = `/api/v1/market/orderbook/level2_100?symbol=${tokenName}-USDT`

async function run()
{
    while (true){
        const data = getData(url);
        data.then(response => {
            try{
                var sum = 0.0;
                var length = response.data.data.bids.length;
                var from = response.data.data.bids[0][0];
                var to = response.data.data.bids[length - 1][0];
                for (var i = 0; i < length; i++)
                {
                    sum += parseFloat(response.data.data.bids[i][1]);
                }
                    
                console.log("Total B: " + parseInt(sum) + " in " + "Range: " + from + ' ~ ' + to);
                    
                
                sum = 0.0;
                length = response.data.data.asks.length;
                from = response.data.data.asks[0][0];
                to = response.data.data.asks[length - 1][0];
                for (var i = 0; i < length; i++)
                {
                    sum += parseFloat(response.data.data.asks[i][1]);
                }
                
                console.log("Total S: " + parseInt(sum) + " in " + "Range: " + from + ' ~ ' + to);
                
            }catch (err)
            {
                console.log("There is some error");
            }
        })
        console.log("");
        await sleep(4500);
    }
}
run();

