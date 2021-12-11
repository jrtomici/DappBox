import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5 text-center" >
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              
              {/* Creating the form for user to upload file with */}
              <div className="card mb-3 mx-auto bg-light" style={{ maxWidth: "512px" }}>
                <h2 className="text-blue bg-light"><b>Welcome to DappBox</b></h2>
                <br></br>
                <p>Select a file to upload.</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const fDesc = this.fDesc.value
                  const fPerm = this.fPerm.value

                  this.props.upload(fDesc, fPerm)
                  }} >
                  
                  {/* Prepare file as buffer once chose to add to IPFS */}
                  <br></br>
                  <input type="file" onChange={this.props.prepare} className="text-blue" />
                  
                  {/* User can include custom file description when uploading */}
                  <div className="formGroup">
                    <br></br>
                    <input
                      id="fDesc"
                      type="text"
                      ref={(input) => { this.fDesc = input }}
                      className="form-control"
                      placeholder="File description"
                      autocomplete="off"
                      required />
                  </div>
                  <br></br>

                  {/* User can pick file permission */}
                  <select
                    ref={(select) => { this.fPerm = select }}
                    name="fPerm"
                    className="form-control">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                  <br></br>
                  <button type="submit" className="btn-success btn-block"><i>UPLOAD</i></button>
                </form>
              </div>

              <p>&nbsp;</p>

              {/* Creating table to display all publicly uploaded files */}
              <table className="table-sm table-bordered" style={{ width: '1000px', maxHeight: '450px'}}>
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className="bg-light text-blue">
                    <th scope="col" style={{ width: '15px'}}>ID</th>
                    <th scope="col" style={{ width: '100px'}}>Permission</th>
                    <th scope="col" style={{ width: '100px'}}>Hash</th>
                    <th scope="col" style={{ width: '150px'}}>File Name</th>
                    <th scope="col" style={{ width: '200px'}}>Description</th>
                    <th scope="col" style={{ width: '80px'}}>Type</th>
                    <th scope="col" style={{ width: '70px'}}>Size</th>
                    <th scope="col" style={{ width: '150px'}}>Uploader</th>
                    <th scope="col" style={{ width: '150px'}}>Upload Time</th>
                  </tr>
                </thead>
                { this.props.files.map((file, key) => {
                  return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{file.fID}</td>
                        <td>{file.fPerm}</td>
                        <td>{(file.uAddr === this.props.account && file.fPerm === "Private") || file.fPerm === "Public" ?
                          <a
                            href={"https://ipfs.infura.io/ipfs/" + file.fHash}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.fHash.substring(0,10)}...
                          </a>
                          : <td>[Private]</td>
                        }
                        </td>
                        {(file.uAddr === this.props.account && file.fPerm === "Private") || file.fPerm === "Public" ? <td>{file.fName}</td> : <td>[Private]</td>}
                        {(file.uAddr === this.props.account && file.fPerm === "Private") || file.fPerm === "Public" ? <td>{file.fDesc}</td> : <td>[Private]</td>}
                        <td>{file.fType}</td>
                        <td>{convertBytes(file.fSize)}</td>
                        <td>
                          <a
                            href={"https://etherscan.io/address/" + file.uAddr}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.uAddr.substring(0,10)}...
                          </a>
                        </td>
                        <td>{moment.unix(file.uTime).format("h:mm:ss A M/D/Y")}</td>
                      </tr>
                    </thead>
                  )
                })}
              </table>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;