var Migrations = artifacts.require("./Migrations.sol");
var BookStore = artifacts.require("./BookStore.sol");

module.exports = async function(deployer) {
  deployer.deploy(Migrations);

  const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
  deployer.deploy(BookStore, account);

  // web3.eth.getAccounts((err, accounts) => {
  //   account = accounts[9];
  //   deployer.deploy(BookStore, account);
  // })
};
