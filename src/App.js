import logo from './logo.svg';
import './App.css';
import SimpleStorageContract from "./contracts/Test.json";
import { Component } from 'react';
import Web3 from 'web3';
import Contract from "web3-eth-contract"; 
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MerkleTree from "merkletreejs";
const keccak256 = require('keccak256');

let tree, root;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {keyId: '', 
      newAddress: '', 
      found: "Check First",
      address: null, 
      whiteListData: [
        "0x81E3CBA331c2036044A62B54524a44D319D0E1ae",
        "0xf9351CFAB08d72e873424708A817A067fA33F45F",
        "0xf48eE0Ed0E8408307571583d016cd618D36a93b0"
      ]
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.checkWhiteList= this.checkWhiteList.bind(this);
    this.whiteListAddress = this.whiteListAddress.bind(this);
  }

  whiteListAddress(event) {
    event.preventDefault();
    console.log("whitelist address");
    console.log("new address: ", this.state.newAddress);
    var whiteList = this.state.whiteListData;
  
    console.log("white list addresses", whiteList);

    const leaves = whiteList.map(v => keccak256(v));
    tree = new MerkleTree(leaves, keccak256, { sort: true });
    root = tree.getHexRoot();
  }

  checkWhiteList(event) {
    event.preventDefault();
    var addr = keccak256(this.state.address);
    var proof = tree.getProof(addr)
    console.log(tree.verify(proof, addr, root));  

    if (tree.verify(proof, addr, root) == true) {
      this.setState({found: "Found"});
    } else {
      this.setState({found: "Not Found"});
    }
  }
  
  componentDidMount() {
    const web3 = new Web3(window.ethereum);
    
    var contract = new web3.eth.Contract(
      SimpleStorageContract.abi, 
      "0x5876357559DfF776835423840b807D126D92eE6d");
    console.log(contract); 
    
    // if account exists
    web3.eth.getAccounts().then((accounts) => {
      if (accounts[0] == null) {return 0;}

      var accountAdd = accounts[0].toLocaleLowerCase();
      console.log("account", accountAdd);
      
      this.setState({address: accountAdd});
    });   
  }

  connectWallet(event) {
    let provider = window.ethereum;
    
    if (typeof provider !== 'undefined') {
      provider.request({method: 'eth_requestAccounts'}).then((accounts) => {
        this.setState({address: accounts[0]});
        // this.setState({keyId: accounts[0]});
      }).catch((err) => {
        console.log("error", err);
      });
    }
  }
  
  handleChange(event) {
    var arr = this.state.whiteListData;
    arr[0] = event.target.value;
    this.setState({whiteListData: arr});
  }
  
  handleChange2(event) {
    var arr = this.state.whiteListData;
    arr[1] = event.target.value;
    this.setState({whiteListData: arr});
  }
  
  handleChange3(event) {
    var arr = this.state.whiteListData;
    arr[2] = event.target.value;
    this.setState({whiteListData: arr});
  }

  handleSubmit(event) {
    // store the public id in the firestore database
    event.preventDefault();
    console.log("public id", this.state.value);
  }

  render(){
    return(
      <div>
        <h1 color="red"> Account Connected: {this.state.address} </h1>
        <button onClick={this.connectWallet}> ConnectWallet </button>

        <br/>
        <br/>
        <br/>
      
        <h1> WhiteList Addresses </h1> 
        <form onSubmit={this.whiteListAddress}>
            <label>
              <input
                type="address 1"
                onChange={this.handleChange}
                placeholder="enter address"
              />
            </label> <br/>
            <label>
              <input
                type="address 2"
                onChange={this.handleChange2}
                placeholder="enter address"
              />
            </label> <br/>
            <label>
              <input
                type="address 3"
                onChange={this.handleChange3}
                placeholder="enter address"
              />
            </label>
            <br />  
      
             <div>
              <input type="submit" value="Submit" />
            </div>
          </form>
      <br/>
      <br/>
      <br/>
      
      <h2> Check if you wallet is on the whitelist : <h1> {this.state.found} </h1> </h2> 
      {root == null? <button> Connect Wallet First </button> : <button onClick={this.checkWhiteList}> Check </button>}
      </div>
    );
  }
}

export default App;

