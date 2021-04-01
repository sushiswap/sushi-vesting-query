import results from '../outputs/results.json'
import fs from "fs"
const axios = require('axios')
import { BigNumber } from 'ethers'
import { apiKey } from './constants'

let cleaned = <any>[]
for(const result of results){
    let min = BigNumber.from('6666666666666666666666')
    if(BigNumber.from(result.balance).gt(min)){
        cleaned.push(result)
    }
}
console.log(cleaned.length)

const getContractName = async (address) => {
    return await axios.get('https://api.etherscan.io/api?module=contract&action=getsourcecode&address=' + address + '&apikey=' + apiKey)
    .then(response => {
      console.log(response.data.result[0].ContractName)
      return response.data.result[0].ContractName
    })
    .catch(error => {
      console.log(error);
  });
}

const queue = async (results) => {
    for(const result of results) {
        let name = await getContractName(result.contract)
        result.name = name
        console.log(name)
    }
    return results
}

queue(cleaned).then(results => {
    if(!fs.existsSync('./outputs')) {
        fs.mkdirSync('./outputs')
    }

    fs.writeFileSync(
        `./outputs/updated-results.json`,
        JSON.stringify(
            results, null, 1
        )
    );
})
