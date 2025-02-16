const token = generate('my private key', { // Pass your generated private key
    id: uuid(), // You can generate your own id and replace uuid()
    name: "my user name", // Set the user name
    email: "my user email", // Set the user email
    avatar: "my avatar url", // Set the user avatar
    appId: "my app id", // Your AppID
    kid: "my api key" // Set the api key, see https://jaas.8x8.vc/#/apikeys for more info.
});

console.log(token); // Write JWT to console.