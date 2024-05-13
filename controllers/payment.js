const axios = require("axios");
const prisma = require("../db/prisma");




const add = async (req,res) => {
    const url = "https://developers.flouci.com/api/generate_payment";
    const payload =  {
        "app_token": "6ac0cf92-49c3-4b83-aba4-3930df0ba1f7",
        "app_secret": process.env.FLOUCI_SECRET,
        "amount": 200000,
        "accept_card": "true",
        "session_timeout_secs": 1200,
        "success_link":`http://localhost:5173/#/login`,
        "fail_link": "http://localhost:5173/fail",
        "developer_tracking_id": "0f16959d-5914-46ee-9e10-f4fc934f5020"
      }


await axios
.post(url, payload)
.then( async(result) => {
    res.json(result.data);
  })
  .catch((err) => {
    res.json(err);
  });

}

const verifypayment = async (req,res) => {
const paymentId = req.params.id
const url = `https://developers.flouci.com/api/verify_payment/ ${paymentId}`
await axios.get(url,{headers : {
    'Content-Type': 'application/json',
    'apppublic': "6ac0cf92-49c3-4b83-aba4-3930df0ba1f7",
    'appsecret': process.env.FLOUCI_SECRET
  }}).
then( async(result) => {
    res.json(result.data);
  })
  .catch((err) => {
    res.json(err.message);
  });


}
module.exports = {
    add,verifypayment
  };