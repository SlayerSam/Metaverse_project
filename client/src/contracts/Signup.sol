// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserStorage {
    struct User {
        string username;
        string email;
    }

    mapping(address => User) private users;
    mapping(string => bool) private emailExists; // Track for email is already exist
    address[] private userAddresses;

    event UserRegistered(address userAddress, string username, string email);

    function registerUser (string memory _username, string memory _email) public {
        require(bytes(users[msg.sender].username).length == 0, "User already registered.");
        require(!emailExists[_email], "Email already registered."); 

        users[msg.sender] = User(_username, _email);
        emailExists[_email] = true; 
        userAddresses.push(msg.sender);

        emit UserRegistered(msg.sender, _username, _email);
    }

    function getUser (address _userAddress) public view returns (string memory, string memory) {
        require(bytes(users[_userAddress].username).length != 0, "User not found.");
        User memory user = users[_userAddress];
        return (user.username, user.email);
    }

    function getAllUsers() public view returns (address[] memory) {
        return userAddresses;
    }
}
