pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FeeCollector  {
    address public owner;
    uint256 public balance;
    address public contractAddr;
    
    event TransferReceived(address _from, uint _amount);
    event TransferSent(address _from, address _destAddr, uint _amount);
    
    constructor() {
        owner = msg.sender;
        contractAddr = address(this);
    }
    
    receive() payable external {
        balance += msg.value;
        emit TransferReceived(msg.sender, msg.value);
    }    
    
    //for admin only - bnb
    function withdraw(uint amount, address payable destAddr) public {
        require(msg.sender == owner, "Only owner can withdraw funds"); 
        require(amount <= balance, "Insufficient funds");
        destAddr.transfer(amount);
        balance -= amount;
        emit TransferSent(msg.sender, destAddr, amount);
    }

    function transferBNB(uint totalAmount, uint receiverAmount, uint adminProfit, address payable destAddr, address payable adminAddr) public {
        // require(msg.sender == owner, "Only owner can withdraw funds");
        uint256 fromBalance = msg.sender.balance; //balanceOf[msg.sender];
        require(totalAmount <= fromBalance, "Insufficient funds");
        destAddr.transfer(receiverAmount);
        adminAddr.transfer(adminProfit);
        //balanceOf[msg.sender] -= totalAmount;// Subtract from the sender
        emit TransferSent(msg.sender, destAddr, totalAmount);
        emit TransferReceived(destAddr, receiverAmount);
    }
    
    //for admin only - token. To transfer token when unfreeze and transfer tokens are called from cloud functions
    function transferERC20(IERC20 token, address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can withdraw funds");
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "balance is low");
        token.transfer(to, amount);
        emit TransferSent(msg.sender, to, amount);
    }

    function transferFromERC20(IERC20 token, address from, address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can withdraw funds");
        uint256 erc20balance = token.balanceOf(from);
        require(amount <= erc20balance, "balance is low");
        // token.approve(address(this), amount);
        token.transferFrom(from, to, amount);
        // emit token.Transfer(from, to, amount);
        emit TransferSent(from, to, amount);
    }

    function transferToManyERC20(IERC20 token, address fromAddr, address toAddr, address adminAddr, uint256 totalAmount, uint256 receiverAmount, uint256 adminProfit) public {
        require(msg.sender == owner, "Only owner can withdraw funds");
        uint256 erc20balance = token.balanceOf(fromAddr);
        require(totalAmount <= erc20balance, "balance is low");
        token.transferFrom(fromAddr, toAddr, receiverAmount);
        token.transferFrom(fromAddr, adminAddr, adminProfit);
        emit TransferSent(fromAddr, toAddr, totalAmount);
        emit TransferReceived(toAddr, receiverAmount);
        // uint256 i = 0;
        // while (i < to.length) {
        //     // ERC20(_tokenAddr).transfer(dests[i], values[i]);
            
        //     i += 1;
        // }
        // return(i);
    }    
}