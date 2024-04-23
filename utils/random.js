module.exports= ()=> {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const randomString = randomNumber.toString();
    return randomString;
  }
