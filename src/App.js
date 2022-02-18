import logo from './logo.svg';
import './App.css';
import NFT from "./contracts/scABI.json";
import { Component } from 'react';
import Web3 from 'web3';
import Contract from "web3-eth-contract"; 
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import db from "./Firestore";
import MerkleTree from "merkletreejs";
const keccak256 = require('keccak256');

// firebase

let tree, root, contract;
// contract address = 0x7365872a2b26EBaefa8A0349b2b0208BE30f0275

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {keyId: '', 
      newAddress: '', 
      found: "Check First",
      address: null, 
      whiteListData: [null, null, null],
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
  
    db.collection("proof").doc("8bzCEUlSYJh3NHHwhktV").update({
     first: whiteList[0],
     second: whiteList[1],
     third: whiteList[2]
    });

    root = tree.getHexRoot();
    
    contract.methods.setRoot(root).send({
      from : this.state.address
    }).then((_) => {
      console.log("new root set");
    })
  }
  
  // mint 
  checkWhiteList(event) {
    event.preventDefault();
    var addr = keccak256(this.state.address);
    var proof = tree.getProof(addr)
    
    contract.methods.mintSquares(4, proof)
     
    
    console.log(tree.verify(proof, addr, root));  

    if (tree.verify(proof, addr, root) == true) {
      this.setState({found: "Found"});
    } else {
      this.setState({found: "Not Found"});
    }
  }


  componentDidMount = async () => {
    const web3 = new Web3(window.ethereum);
    
    // if account exists
    web3.eth.getAccounts().then((accounts) => {
      if (accounts[0] == null) {return 0;}

      var accountAdd = accounts[0].toLocaleLowerCase();
      console.log("account", accountAdd);
      
      this.setState({address: accountAdd});
      
      db.collection("proof").get().then((querySnapshot) => {
         querySnapshot.forEach(element => {
           var d = element.data(); 
           var newList = [d["first"], d["second"], d["thrid"]];            

            this.setState({
              whiteListData : newList 
            });
            
         });
      });
    });   
    
    contract = new web3.eth.Contract(
      NFT, "0x7365872a2b26EBaefa8A0349b2b0208BE30f0275"
    );
    
    var leaves = this.state.whiteListData.map(v => keccak256(v));
    tree = new MerkleTree(leaves, keccak256, { sort: true });

    root = await contract.methods.root().call();
    console.log(root, tree); 
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

