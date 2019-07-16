import web3 from 'web3';
import { XDCValidatorABI } from './abi/xdcValidator';
import { TransactionReceipt } from 'web3/types';

const Web3 = new web3(new web3.providers.HttpProvider('http://192.168.1.207:8645'));

class Demo {
  // get balance of xdcc300195A5a48Ae53B317DDF90823ee749A027390
  public getBalance () {
    Web3.eth.getBalance(
      '0xc300195A5a48Ae53B317DDF90823ee749A027390'
    ).then((balance: any) => {
      console.log(`Balance:`, balance.toString());
    });
  }

  public propose() {
    // load XDC validator contract at address xdc0000000000000000000000000000000000000088
    const contract = new Web3.eth.Contract(XDCValidatorABI.abi, '0x0000000000000000000000000000000000000088');
    // generate encode ABI
    // propose address xdc0104DbDF95782e92bbb82c60a3DA5dC66127cdCb to masternodes
    const data = contract.methods.propose('0x0104DbDF95782e92bbb82c60a3DA5dC66127cdCb').encodeABI();
    // sign transaction from candidates of address xdcc300195A5a48Ae53B317DDF90823ee749A027390
    Web3.eth.accounts.signTransaction({
      from: '0xc300195A5a48Ae53B317DDF90823ee749A027390', // candidate address
      gas: web3.utils.toHex(300000),
      gasPrice: web3.utils.toWei('4', 'Gwei'),
      to: '0x0000000000000000000000000000000000000088', // XDC validator contract address
      value: '10000000000000000000000000', // stake value
      data: data,
    }, '0x5f15e172b9cf59089739bd2c2b2001897a5e05608cd68419af578eedf6579dfd').then((result) => { // private key of xdcc300195A5a48Ae53B317DDF90823ee749A027390
      console.log(result);
      // send signed tx
      Web3.eth.sendSignedTransaction(result.rawTransaction)
      .on('transactionHash', (hash: String) => {
        console.log(`txHash`, hash);
      })
      .on('receipt', (receipt: TransactionReceipt) => {
        console.log(`success`, receipt.status);
      })
      .on('error', (err: Error) => {
        console.log(`err`, err);
      });
    });
  }

  public uploadKYC() {
    // load XDC validator contract at address xdc0000000000000000000000000000000000000088
    const contract = new Web3.eth.Contract(XDCValidatorABI.abi, '0x0000000000000000000000000000000000000088');
    // generate encode ABI
    // add kyc as string
    const data = contract.methods.uploadKYC('hello').encodeABI();
    Web3.eth.accounts.signTransaction({
      from: '0xD33DB4D88A1d51c918A2D4e23135225952038e7b', // candidate address
      gas: web3.utils.toHex(300000),
      gasPrice: web3.utils.toWei('4', 'Gwei'),
      to: '0x0000000000000000000000000000000000000088', // XDC validator contract address
      data: data,
    }, '0xfba37211f57258dc455d4643af07da640756caa85c2b1afeeea500c7c3ba5c96').then((result) => { // private key of xdcD33DB4D88A1d51c918A2D4e23135225952038e7b
      console.log(result);
      // send signed tx
      Web3.eth.sendSignedTransaction(result.rawTransaction)
      .on('transactionHash', (hash: String) => {
        console.log(`txHash`, hash);
      })
      .on('receipt', (receipt: TransactionReceipt) => {
        console.log(`success`, receipt.status);
      })
      .on('error', (err: Error) => {
        console.log(`err`, err);
      });
    });
  }
}

const test = new Demo();
// get balance from address
// test.getBalance();

// propose new masternodes
test.propose();

// upload kyc
// test.uploadKYC();