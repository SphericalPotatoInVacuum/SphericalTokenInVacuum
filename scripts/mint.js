async function main() {
  const contractAddress = 'TO_REPLACE';
  const receiverAddress = 'TO_REPLACE';
  const amount = ethers.utils.parseEther('228');

  const STV = await (await ethers.getContractFactory("SphericalTokenInVacuum")).attach(contractAddress);
  console.log(STV)
  const mint = await STV.mint(receiverAddress, amount);

  console.log(`Successfully minted ${amount} tokens, tx: ${mint.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
