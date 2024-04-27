module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./client/src/abis/",
  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 1000     // Default: 200
        },
        evmVersion: "homestead"  // Default: "byzantium"
      }
    }
}
}
