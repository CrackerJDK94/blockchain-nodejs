const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const {v1: uuid} = require("uuid");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://root:root@cluster0.tiui038.mongodb.net/bitcoin?retryWrites=true&w=majority";
const mongo = new MongoClient(url, {useNewUrlParser: true});

mongo.connect((err, db) => {
  if(err) throw err;

  console.log('connect to database successfully')

  //choose database to use
  let dbo = db.db("bitcoin")
  //create table
  // dbo.createCollection("blockchain",(err, res) => {
  //   if(err) throw err;

  //   console.log('created table successfully')
  // })

  // dbo.collection("blockchain").insertOne(bitcoin.chain[bitcoin.chain.length - 1], (err, result) => {
  //   if(err) throw err;

  //   console.log('added block to chain')
  //   console.log(result);
  //   db.close()
  // })

  dbo.collection("blockchain").find().toArray((err, objs) => {
    if(err) throw err;

    if(objs.length!=0)
    console.log('get data successfully');
    console.log(objs);
    db.close();
  })

});

const bitcoin = new Blockchain();

const nodeAddress = uuid().split('-').join('');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/blockchain", function (req, res) {
  res.send(bitcoin);
});

// app.get("/blockchain/:id", function (req, res) {
//   console.log('id', req.params.id);
//   res.send(bitcoin);
// });


// console.log('id', req.query);

app.get("/get-block-by-height/:id", function (req, res) {
    res.send(bitcoin.chain[req.params.id-1]);
});

app.get("/get-block-by-hash/:hash", (req, res) => {
    for(let block of bitcoin.chain) {
      if(block.hash == req.params.hash) {
            res.send(block);
            return;
        }
    }
})

app.post("/transaction", function (req, res) {
  const blockIndex = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.get("/mine", function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock.index + 1,
};

  bitcoin.createNewTransaction(12.5, "00", nodeAddress)

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({ 
    note: "New block mined successfully",
    block: newBlock 
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
