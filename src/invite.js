import db from './Firestore';
import { Component } from 'react';
import Web3 from 'web3';

class Invite extends Component {

  constructor(props) {
    super(props);
    this.state = {keyId: '', value: '', address: null};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
  }

  componentDidMount() {
    const web3 = new Web3(window.ethereum);
    
    // if account exists
    web3.eth.getAccounts().then((accounts) => {
      console.log("account", accounts);
      this.setState({address: accounts[0]});
    });
  }

  connectWallet(event) {
    let provider = window.ethereum;
    console.log(provider);
    
    if (typeof provider !== 'undefined') {
      provider.request({method: 'eth_requestAccounts'}).then((accounts) => {
        console.log(accounts);
        this.setState({address: accounts[0]});
        //this.setState({keyId: accounts[0]});

      }).catch((err) => {
        console.log("error", err);
      });
    }
  } 

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // store the public id in the firestore database
    event.preventDefault();

    console.log("public id", this.state.value);
    if (this.state.value !== "") {
      db.collection("sharks").add({
        publicKey : this.state.value,
        points: 0,
        authorized: false,
        referrer: false,
      }).then(function(data) {
        console.log("public key added");
        var dataId = toString(data.id);
        console.log(dataId);
        this.setState({keyId: data.id});
      }).catch((err) => {
        console.log("error", err);
      });
    } else {
      alert("empty public address!");
    }
  }

  render() {
      return(
          <h1> Invite link</h1>
      );
  }
}

export default Invite;

