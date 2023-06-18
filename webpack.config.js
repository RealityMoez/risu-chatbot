const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './script.js', 
    mode: 'production',
    plugins: [
        new Dotenv()
    ]
};