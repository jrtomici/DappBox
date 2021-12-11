pragma solidity ^0.5.0;

// This smart contract will serve to store hashes for 
// uploaded files on IPFS.

contract DappBox{
  // Smart contract name
  string public name = "DappBox";

  // Create counter cache to keep track of file IDs
  uint public fCount = 0;

  // Mapping is a reference type that acts as a hash table for 
  // key-value pairs. The key will be an unsigned integer uint,
  // and the value is File, a data type we will define ourselves
  // using a Struct.
  mapping(uint => File) public files;

  // Struct for defining the File data type, with relevant attributes
  struct File{
    uint fID; // key
    string fPerm; // file permission
    string fHash; // unique hash for locating file on IPFS
    string fName; // name of file
    string fDesc; // decription of file
    string fType; // file type
    uint fSize; // size of file
    address payable uAddr; // address of user who uploaded file
    uint uTime; // time of upload
  }

  // Define event to know when new files are uploaded
  event UploadFile(
    uint fID,
    string fPerm,
    string fHash,
    string fName,
    string fDesc,
    string fType,
    uint fSize,
    address payable uAddr,
    uint uTime
  );

  // Constructor instance of smart contract
  constructor() public{
  }

  // Function for uploading files, with file attributes as parameters
  function upload(string memory fPerm, string memory fHash, string memory fName, string memory fDesc, string memory fType, uint fSize) public{

    // require function is used to check if stipulations are satisfied
    // to ensure an authentic transaction. In each of these cases,
    // confirm the file attributes exist
    require(bytes(fPerm).length > 0);
    require(bytes(fHash).length > 0);
    require(bytes(fName).length > 0);
    require(bytes(fDesc).length > 0);
    require(bytes(fType).length > 0);
    require(fSize > 0);
    require(msg.sender != address(0));

    // Increment file ID by 1
    fCount++;

    // Create new File
    // msg. sender fetches us the uploader's address
    // now returns the current time
    files[fCount] = File(fCount, fPerm, fHash, fName, fDesc, fType, fSize, msg.sender, now);

    // Trigger event
    emit UploadFile(fCount, fPerm, fHash, fName, fDesc, fType, fSize, msg.sender, now);
  }

}