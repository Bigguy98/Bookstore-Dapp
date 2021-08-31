# Bookstore - dApp
An dApp example, implement for manage bookstore case.
Languages: solidity, javascript

# Dependencies
Install these prerequisites to run the example:
 - Npm, NodeJs
 - Truffle: a javascript lib for developing smart contracts
 - Ganache: an app to create local blockchain network
 - Metamask: browser extension to access blockchain networks

### Step 1. Clone the project
```
git clone 
```
### Step 2. Install dependencies
```
cd bookstore
npm install
```
### Step 3. Start Ganache
![ganache example](https://drive.google.com/file/d/15GvwAluTw9R8Q57Kvh6M5Iur7j9v19Ft/view?usp=sharing)
### Step 4. Compile and Deploy Smart Contracts
```
truffle migrate --reset
```
### Step 5. Config Metamask
Open browser and click to extension Metamask:
 - Unlock metamask
 - Connect your account to local ethereum blockchain provide by Ganache
 - Import an account provided by ganache
### Step 6. Run the Frontend Application
```
npm run dev
```
You'll see the result at http://localhost:3000 , something like this:
![application's UI](https://drive.google.com/file/d/1abpnNRXyqQxJfqA_W_bcgXKZ0oFrG9tt/view?usp=sharing)