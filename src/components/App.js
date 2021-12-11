import DappBox from '../abis/DappBox.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

// Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: "ipfs.infura.io", port: 5001, protocol: "https" })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchain()
  }

  // web3.js is a collection of libraries used to connect the
  // web application to connect with an ethereum node. It essentially
  // takes the browser's connection to the MetaMask cryptocurrency
  // wallet and puts it into the application (provided by MetaMask)
  async loadWeb3() {
    // window.ethereum is used for injecting MetaMask's API for allowing
    // the application to see the user's blockchain data
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("Non-Ethereum browser detected. Consider trying MetaMask.")
    }
  }

  async loadBlockchain() {
    // Confirm the app is communicating with web3
    const web3 = window.web3
    console.log(web3)

    // Fetch account addresses
    const account = await web3.eth.getAccounts()
    this.setState({ account: account[0] })

    // Fetch network ID of Ganache blockchain from MetaMask
    const netID = await web3.eth.net.getId()
    const netData = DappBox.networks[netID]

    // Use the web3.eth.Contract object to give json interface
    // to respective smart contract on the blockchain. This way
    // the smart contract can be interacted with as if it were a 
    // JavaScript object.
    if (netData){
      const dappbox = new web3.eth.Contract(DappBox.abi, netData.address)
      this.setState({ dappbox })

      // Fetch amount of files on the application
      const fCount = await dappbox.methods.fCount().call()
      this.setState({ fCount })

      // Loop backwards through file IDs and sort for displaying on
      // frontend web page
      for (var i = fCount; i > 0; i--){
        const file = await dappbox.methods.files(i).call()
        this.setState({ files: [...this.state.files, file] })
      }
    }
    // If network ID for blockchain isn't found, then contract is not there
    else{
      window.alert("DappBox contract not deployed.")
    }
    this.setState({ loading: false })

  }

  // Retrieve file from form field on application and convert to
  // buffer for IPFS
  prepare = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        name: file.name,
        type: file.type
      })
      console.log("buffer", this.state.buffer)
    }
  }

  // Function to upload file, get hash from IPFS, and put file on the
  // blockchain
  upload = (desc, perm) => {
    console.log("Submitting file to IPFS...")

    // Add file to IPFS and get unique hash for file
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("IPFS result", result)
      if (error){
        console.error(error)
        return
      }

      // Set React app state to loading and set the file type
      this.setState({ loading: true })
      if (this.state.type === ""){
        this.setState({ type: "none" })
      }

      // Use upload function and get hash and other file information
      // from IPFS
      this.state.dappbox.methods.upload(perm, result[0].hash, this.state.name, desc, this.state.type, result[0].size).send({ from: this.state.account }).on("transactionHash", (hash) => {
        this.setState({
          name: null,
          type: null,
          loading: false
        })
        window.location.reload()
      }).on("error", (e) => {
        window.alert("Error")
        this.setState({ loading: false })
      })
    })
  }

  // Setting state for the application component
  constructor(props) {
    super(props)
    this.state = {
      account: "",
      dappbox: null,
      files: [],
      name: null,
      type: null,
      loading: false
    }

    // Bind functions for use in other components
    this.upload = this.upload.bind(this)
    this.prepare = this.prepare.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              account={this.state.account}
              prepare={this.prepare}
              upload={this.upload}
            />
        }
      </div>
    );
  }
}

export default App;