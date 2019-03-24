
/**
 * Set the total supply of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.SetTotalSupply} tokenData
 * @transaction
 */
async function SetTotalSupply(tokenData) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    const token = await tokenRegistry.get(tokenData.tokenName);

    token.supply = tokenData.amount;

    tokenRegistry.update(token);
}


/**
 * Get the total supply of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetTotalSupply} tokenData
 * @transaction
 */
async function GetTotalSupply(tokenData) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    const token = await tokenRegistry.get(tokenData.tokenName);
    return token.supply;
}


/**
 * Increase the total supply of an ERC20 Token by the specified amount
 * @param {io.onemillionyearsbc.hubtutorial.tokens.Mint} tokenData
 * @transaction
 */
async function Mint(tokenData) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    const token = await tokenRegistry.get(tokenData.tokenName);

    token.supply += tokenData.amount;

    tokenRegistry.update(token);
}
  
  
/**
 * Get the balance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetBalance} credentials
 * @transaction
 */
async function GetBalance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    const token = await tokenRegistry.get(credentials.email);
    return token.balance;
}

/**
 * Set the balance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.SetBalance} credentials
 * @transaction
 */
async function SetBalance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    const token = await tokenRegistry.get(credentials.email);
    if (credentials.balance > token.allowance) {
        throw new Error("balance must not exceed allowance (" + token.allowance + ")");
    }
    token.balance = credentials.balance;
    // Update the asset in the asset registry.
    await tokenRegistry.update(token);
}

/**
 * transfer from the token supply to the owner 
 * @param {io.onemillionyearsbc.hubtutorial.tokens.TransferTo} credentials
 * @transaction
 */
async function TransferTo(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const erc20Registry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    
    const token = await tokenRegistry.get(credentials.email);
    const tokenSupply = await erc20Registry.get("hub");
    if (credentials.amount > tokenSupply.supply) {
        throw new Error("transfer amount must not exceed total supply (" + tokenSupply.supply + ")");
    }

    if (token.balance + credentials.amount > token.allowance) {
        throw new Error("new balance must not exceed allowance (" + token.allowance + ")");
    }
    token.balance += credentials.amount;
    tokenSupply.supply -= credentials.amount;

    // Update the assets in the asset registries.
    await tokenRegistry.update(token);

    await erc20Registry.update(tokenSupply);
}

/**
 * Get the allowance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetBalance} credentials
 * @transaction
 */
async function GetAllowance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    const token = await tokenRegistry.get(credentials.email);
    return token.allowance;
}

/**
 * Set the allowance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.SetAllowance} credentials
 * @transaction
 */
async function SetAllowance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    const token = await tokenRegistry.get(credentials.email);
   
    token.allowance = credentials.allowance;

    // Update the asset in the asset registry.
    await tokenRegistry.update(token);
}

/**
 * transfer from the token sender to the token receiver
 * @param {io.onemillionyearsbc.hubtutorial.tokens.Transfer} credentials
 * @transaction
 */
async function Transfer(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
   
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    
    const sender = await tokenRegistry.get(credentials.emailFrom);
    const receiver = await tokenRegistry.get(credentials.emailTo);

    if (sender === receiver) {
        throw new Error("Cannot transfer tokens within the same account");
    }

    if (receiver.balance + credentials.amount > receiver.allowance) {
        throw new Error("new balance must not exceed allowance (" + receiver.allowance + ")");
    }

    if (credentials.amount > sender.balance) {
        throw new Error("Insufficient tokens in account of sender for transfer of " + credentials.amount);
    }

    receiver.balance += credentials.amount;
    sender.balance -= credentials.amount;

    // Update the assets in the asset registries.
    await tokenRegistry.update(receiver);
    await tokenRegistry.update(sender);

}
