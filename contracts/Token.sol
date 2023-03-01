// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SphericalTokenInVacuum is Ownable, ERC20 {
    struct Potato {
        uint256 id;
        address owner;
        string name;
        uint32 weight;
    }
    mapping(uint256 => Potato) public sack;

    event PotatoAdded(uint256 id, address owner);
    event PotatoCooked(uint256 id, address owner);

    uint256 private nextId = 0;

    constructor() ERC20("SphericalTokenInVacuum", "STV") {
        _mint(msg.sender, 299792458 * (10**uint256(18)));
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function addPotato(string memory name, uint32 weight) public {
        sack[nextId] = Potato(nextId, msg.sender, name, weight);
        emit PotatoAdded(nextId, msg.sender);
        nextId++;
    }

    function cookPotato(uint256 id) public {
        require(
            sack[id].owner == msg.sender,
            "Can cook only your own potatoes!"
        );
        delete sack[id];
        emit PotatoCooked(id, msg.sender);
    }
}
