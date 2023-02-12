pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SphericalTokenInVacuum is Ownable, ERC20 {
    string private constant _name = "SphericalTokenInVacuum";
    string private constant _symbol = "STV";
    uint8 private constant _decimals = 18;
    uint256 private constant _totalSupply =
        299792458 * (10**uint256(_decimals));

    constructor() public ERC20("SphericalTokenInVacuum", "STV") {
        _mint(msg.sender, _totalSupply);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
}
