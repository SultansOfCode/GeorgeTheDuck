// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;

contract GeorgeTheDuck {
    address private owner;
    uint256 private georgePrice;
    uint256 private scenarioPrice;
    mapping(address => uint16) private permissions;

    event ItemBought(address buyer, uint8 itemIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");

        _;
    }

    constructor() {
        owner = msg.sender;

        georgePrice = 0.001 ether;
        scenarioPrice = 0.001 ether;
    }

    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner should not be the zero address");

        owner = newOwner;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawMoney() external onlyOwner {
        require(address(this).balance > 0, "No funds to withdraw");

        payable(owner).transfer(address(this).balance);
    }

    function getGeorgePrice() external view returns (uint256) {
        return georgePrice;
    }

    function setGeorgePrice(uint256 newGeorgePrice) external onlyOwner {
        georgePrice = newGeorgePrice;
    }

    function getScenarioPrice() external view returns (uint256) {
        return scenarioPrice;
    }

    function setScenarioPrice(uint256 newScenarioPrice) external onlyOwner {
        scenarioPrice = newScenarioPrice;
    }

    function getPermissions() external view returns (uint16) {
        return permissions[msg.sender];
    }

    function buyItem(uint8 itemIndex) external payable {
        require(itemIndex < 11, "Invalid item index");

        if (itemIndex < 8) {
            require(msg.value == georgePrice, "Wrong value");
        }
        else {
            require(msg.value == scenarioPrice, "Wrong value");
        }

        permissions[msg.sender] |= uint16(1 << itemIndex);

        emit ItemBought(msg.sender, itemIndex);
    }
}
