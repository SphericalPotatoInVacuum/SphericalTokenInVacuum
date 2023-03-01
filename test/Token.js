// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const Token = await ethers.getContractFactory("SphericalTokenInVacuum");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens once its transaction has been
    // mined.
    const spvToken = await Token.deploy();

    await spvToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, spvToken, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { spvToken, owner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await spvToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { spvToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await spvToken.balanceOf(owner.address);
      expect(await spvToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Sack", function () {
    it("Should add potatoes", async function () {
      const { spvToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      await expect(spvToken.addPotato("Mr. Potato", 200)).to.emit(spvToken, "PotatoAdded").withArgs(0, owner.address);
      await expect(spvToken.connect(addr1).addPotato("Mrs. Potato", 150)).to.emit(spvToken, "PotatoAdded").withArgs(1, addr1.address);
    });

    it("Should allow owner to cook", async function () {
      const { spvToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      await expect(spvToken.connect(addr1).addPotato("Mr. Potato", 200)).to.emit(spvToken, "PotatoAdded").withArgs(0, addr1.address);
      await expect(spvToken.connect(addr1).cookPotato(0)).to.emit(spvToken, "PotatoCooked").withArgs(0, addr1.address);
    });

    it("Should not allow not owner to cook", async function () {
      const { spvToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      await expect(spvToken.connect(addr1).addPotato("Mr. Potato", 200)).to.emit(spvToken, "PotatoAdded").withArgs(0, addr1.address);
      await expect(spvToken.connect(addr2).cookPotato(0)).to.be.revertedWith("Can cook only your own potatoes!");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { spvToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        spvToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(spvToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        spvToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(spvToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { spvToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(spvToken.transfer(addr1.address, 50))
        .to.emit(spvToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(spvToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(spvToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { spvToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await spvToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        spvToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await spvToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
