// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {
    struct User {
        string name;
        string email;
        string password;
        uint256 created_at;
    }

    struct Product {
        uint256 id;
        uint256 price;
        uint256 payment_date;
        address payment_address;
        uint256 quantity;
        string status;
    }

    mapping(address => User) private users;
    mapping(string => bool) private emailExists;
    mapping(string => address) private emailToAddress;
    address[] private userAddresses;

    mapping(uint256 => Product) public products;
    mapping(address => mapping(uint256 => Product)) public userPurchases;
    mapping(address => uint256[]) public userProductIds;

    event UserRegistered(address userAddress, string name, string email);
    event ProductPurchased(
        address indexed buyer,
        uint256 productId,
        uint256 price,
        uint256 paymentDate,
        uint256 quantity
    );

    function registerUser(
        string memory _name,
        string memory _email,
        string memory password
    ) public {
        require(bytes(_name).length > 0, "Name must be present");
        require(bytes(_email).length > 0, "Email must be present");
        require(
            bytes(password).length > 6,
            "Password must be more than 6 characters"
        );
        require(!isUserPresent(_email), "User is already present");

        users[msg.sender] = User(_name, _email, password, block.timestamp);
        emailExists[_email] = true;
        emailToAddress[_email] = msg.sender;
        userAddresses.push(msg.sender);

        emit UserRegistered(msg.sender, _name, _email);
    }

    function getUserByEmail(
        string memory _email
    ) public view returns (string memory, string memory , string memory) {
        address userAddr = emailToAddress[_email];
        require(userAddr != address(0), "User not found.");
        User memory user = users[userAddr];
        return (user.name, user.email , user.password);
    }

    function getUser(
        address _userAddress
    ) public view returns (string memory, string memory) {
        require(bytes(users[_userAddress].name).length != 0, "User not found.");
        User memory user = users[_userAddress];
        return (user.name, user.email);
    }

    function isUserPresent(string memory _email) public view returns (bool) {
        return bytes(users[msg.sender].name).length > 0 || emailExists[_email];
    }

    function getAllUsers() public view returns (address[] memory) {
        return userAddresses;
    }

    function buyProduct(uint256 productId) public payable {
        require(msg.value > 0, "Payment required");

        if (userPurchases[msg.sender][productId].id == productId) {
            userPurchases[msg.sender][productId].quantity += 1;
        } else {
            products[productId] = Product({
                id: productId,
                price: msg.value,
                payment_date: block.timestamp,
                payment_address: msg.sender,
                quantity: 1,
                status: "Paid"
            });
            userPurchases[msg.sender][productId] = products[productId];
            userProductIds[msg.sender].push(productId);
        }

        emit ProductPurchased(
            msg.sender,
            productId,
            msg.value,
            block.timestamp,
            userPurchases[msg.sender][productId].quantity
        );
    }

    function getUserPurchases(
        address user
    ) public view returns (Product[] memory) {
        uint256[] memory productIds = userProductIds[user];
        Product[] memory purchasedProducts = new Product[](productIds.length);

        for (uint256 i = 0; i < productIds.length; i++) {
            purchasedProducts[i] = userPurchases[user][productIds[i]];
        }

        return purchasedProducts;
    }
}
