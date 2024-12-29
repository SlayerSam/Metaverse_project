// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {
    struct User {
        string name;
        string email;
        string password;
        uint256 created_at;
    }

    mapping(address => User) private users;
    mapping(string => bool) private emailExists; // Track for email is already exist
    address[] private userAddresses;

    event UserRegistered(address userAddress, string name, string email);

    function registerUser(
        string memory _name,
        string memory _email,
        string memory password
    ) public {
        require(bytes(_name).length > 0, "Name must be present");
        require(bytes(_email).length > 0, "Email must be present");
        require(bytes(password).length > 6, "Password must be more than 6 characters");
        require(!isUserPresent(_email), "User is already present");

        users[msg.sender] = User(_name, _email, password, block.timestamp);
        emailExists[_email] = true;
        userAddresses.push(msg.sender);

        emit UserRegistered(msg.sender, _name, _email);
    }

    function getUser(
        address _userAddress
    ) public view returns (string memory, string memory) {
        require(bytes(users[_userAddress].name).length != 0, "User not found.");
        User memory user = users[_userAddress];
        return (user.name, user.email);
    }

    function getUserByEmail(
        string memory _email
    ) public view returns (User memory) {
        if (
            isUserPresent(_email) &&
            bytes(users[msg.sender].email).length == bytes(_email).length
        ) {
            return users[msg.sender];
        }
        return User({email: "", name: "", password: "", created_at: 0}); // Assuming these are the struct properties
    }

    function isUserPresent(string memory _email) public view returns (bool) {
        if (bytes(users[msg.sender].name).length > 0 || emailExists[_email]) {
            return true;
        }
        return false;
    }

    function getAllUsers() public view returns (address[] memory) {
        return userAddresses;
    }
}
