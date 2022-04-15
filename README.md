# Envoys Farming

```sh
# install deps
yarn 

# Put ur private key in .env file
mv .env.example .env
nano .env

# Try deploy ur in local node
npx hardhat run scripts/deploy.js

# Deploy to network
npx hardhat run scripts/deploy.js --network bsctest
```