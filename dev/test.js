const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

const previousBlockHash = "ykahdkashdiuqwiy12y123";
const currentBlockData = [
  {
    amount: 10,
    sender: "fasfduyq68t821tasd",
    recipient: "734878qyroahiug971t2",
  },
  {
    amount: 30,
    sender: "436egegwfgt6hytf",
    recipient: "978560yiqewwefw1t2",
  },
  {
    amount: 200,
    sender: "krtuyo0u9u40854",
    recipient: "elkrhg9t3y843htiu3h",
  },
];

// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 20176));