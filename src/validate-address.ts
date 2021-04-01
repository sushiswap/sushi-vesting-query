import outputs from '../outputs/amounts-10959148-12148193.json'
import { BigNumber, providers } from 'ethers'
import fs from "fs"
import { alchemyKey } from './constants'

let keys = Object.keys(outputs)
let provider = new providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/' + alchemyKey)

type Contract = {
    contract: string,
    balance: string
}

const queueQuery = async () => {
    let contracts = <Contract[]>[]

    let i = 0
    for(const [key, value] of Object.entries(outputs)){
        let code = await provider.getCode(key)
        if(code !== '0x') {
            let contract: Contract = {
                contract: key,
                balance: value
            }
            contracts.push(contract)
        }
        i++
        if(i % 200 === 0) console.log("Completed: ", i/keys.length)
    }
    contracts.sort((a, b) => (BigNumber.from(a.balance).lt(BigNumber.from(b.balance))) ? 1 : -1)
    return contracts
}

queueQuery().then((results) => {
    if(!fs.existsSync('./outputs')) {
        fs.mkdirSync('./outputs')
    }

    fs.writeFileSync(
        `./outputs/results.json`,
        JSON.stringify(
            results, null, 1
        )
    );
})