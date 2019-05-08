
/**
 * Set the total supply of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.SetERC20TotalSupply} tokenData
 * @transaction
 */
async function SetERC20TotalSupply(tokenData) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    let token = await tokenRegistry.get(tokenData.tokenName);

    token.supply = tokenData.amount;
    token.totalMinted += tokenData.amount;

    await tokenRegistry.update(token);
}


/**
 * Get the total supply of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetERC20TotalSupply} tokenData
 * @returns {Double} the ERC20 supply
 * @transaction
 */
async function GetERC20TotalSupply(tokenData) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    const token = await tokenRegistry.get(tokenData.tokenName);
    return token.supply;
}

/**
 * Get the total supply in circulation of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetERC20TokenTotal} tokenData
 * @returns {Double} the ERC20 supply in circulation
 * @transaction
 */
async function GetERC20TokenTotal(tokenData) {
    let results = await query('selectERC20Token', {
    });

    let total = 0.0;
    for (let i = 0; i < results.length; i++) {
        total += results[i].balance;
    }
    return total;
}

/**
 * Get the total minted (historic total supply) of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetERC20TotalMinted} tokenData
 * @returns {Double} the ERC20 supply
 * @transaction
 */
async function GetERC20TotalMinted(tokenData) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    const token = await tokenRegistry.get(tokenData.tokenName);
    return token.totalMinted;
}


/**
 * Increase the total supply of an ERC20 Token by the specified amount
 * @param {io.onemillionyearsbc.hubtutorial.tokens.MintERC20} tokenData
 * @transaction
 */
async function MintERC20(tokenData) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');

    let token = await tokenRegistry.get(tokenData.tokenName);

    token.supply = token.supply + tokenData.newSupply;
    token.totalMinted = token.totalMinted + tokenData.newMint;
    await tokenRegistry.update(token);
}


/**
 * Get the balance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetERC20Balance} credentials
 * @returns {Double} the ERC20 balance
 * @transaction
 */
async function GetERC20Balance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    const token = await tokenRegistry.get(credentials.email);
    return token.balance;
}

/**
 * Set the balance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.SetERC20Balance} credentials
 * @transaction
 */
async function SetERC20Balance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    let token = await tokenRegistry.get(credentials.email);
    if (credentials.balance > token.allowance) {
        throw new Error("balance must not exceed allowance (" + token.allowance + ")");
    }

    if (credentials.balance < 0) {
        throw new Error("balance must not be negative");
    }
    token.balance = credentials.balance;
    // Update the asset in the asset registry.
    await tokenRegistry.update(token);
}

/**
 * transfer from the token supply to the owner 
 * @param {io.onemillionyearsbc.hubtutorial.tokens.TransferERC20To} credentials
 * @transaction
 */
async function TransferERC20To(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const erc20Registry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');

    let token = await tokenRegistry.get(credentials.email);
    let tokenSupply = await erc20Registry.get("hub");

    if (credentials.amount > tokenSupply.supply + credentials.limit) {
        throw new Error("transfer amount must not exceed total supply (" + tokenSupply.supply + ")");
    }

    if (token.balance + credentials.amount > token.allowance) {
        throw new Error("new balance must not exceed allowance (" + token.allowance + ")");
    }

    token.balance += credentials.amount;
   
    // Update the assets in the asset registries.
    await tokenRegistry.update(token);

    if (credentials.updateSupply === true) {
       
        tokenSupply.supply -= credentials.amount;
        await erc20Registry.update(tokenSupply);
    }
    
}

/**
 * Get the allowance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetERC20Balance} credentials
 * @transaction
 */
async function GetERC20Allowance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    const token = await tokenRegistry.get(credentials.email);
    return token.allowance;
}

/**
 * Set the allowance for a holder of an ERC20 Token
 * @param {io.onemillionyearsbc.hubtutorial.tokens.SetERC20Allowance} credentials
 * @transaction
 */
async function SetERC20Allowance(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');
    let token = await tokenRegistry.get(credentials.email);

    token.allowance = credentials.allowance;

    // Update the asset in the asset registry.
    await tokenRegistry.update(token);
}

/**
 * transfer from the token sender to the token receiver
 * @param {io.onemillionyearsbc.hubtutorial.tokens.TransferERC20} credentials
 * @transaction
 */
async function TransferERC20(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';

    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20Token');

    let sender = await tokenRegistry.get(credentials.emailFrom);
    let receiver = await tokenRegistry.get(credentials.emailTo);

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


/**
 * create a transaction for the ERC20 token like transaction on a bank statement
 * @param {io.onemillionyearsbc.hubtutorial.tokens.CreateERC20Transaction} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.tokens.ERC20TokenTransaction} The newly created transaction
 * @transaction
 */
async function CreateERC20Transaction(credentials) {
    var factory = getFactory();
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';

    const tokenRegistry = await getAssetRegistry(NSTOK + '.ERC20TokenTransaction');

    // // create the transaction asset
    let id = new Date().getTime().toString().substr(-8);
    var transaction = factory.newResource(NSTOK, 'ERC20TokenTransaction', id);
    transaction.type = credentials.type;
    transaction.date = new Date();

    if (credentials.newBalance === undefined) {
        let cred1 = {};
        cred1.email = credentials.email;

        // get the user balance and set to balance +- amount
        let balance = await GetERC20Balance(cred1);
        let cred = {};
        cred.email = credentials.email;
        cred.balance = parseFloat(balance) + credentials.amount;
       
        await SetERC20Balance(cred);
        transaction.balance = cred.balance;
    } else {
        transaction.balance = credentials.newBalance;
    }

    transaction.email = credentials.email;
    transaction.amount = credentials.amount;

    // Update the assets in the asset registries.
    await tokenRegistry.addAll([transaction]);

    return transaction;
}

/**
 * return a list of transactions like on a bank statement
 * @param {io.onemillionyearsbc.hubtutorial.tokens.GetTransactionHistoryForUser} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.tokens.ERC20TokenTransaction[]} The history of transactions for the user
 * @transaction
 */
async function GetTransactionHistoryForUser(credentials) {
    let results = await query('selectERC20TokenTransactionsByEmail', {
        "email": credentials.email
    });

    results.sort(function(a, b) {
        var dateA = new Date(a.date), dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    return results;
}

/**
 * Update user token balance and add a new transaction to the user transacition history
 * @param {io.onemillionyearsbc.hubtutorial.tokens.UpdateTokensForUser} credentials
 * @transaction
 */
async function UpdateTokensForUser(credentials) {
    const NS = 'io.onemillionyearsbc.hubtutorial';
    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');

    let user = await participantRegistry.get(credentials.email);

    // Update the user ERC20 balance
    // create token transaction and add to history
    let cred = {};
    cred.email = credentials.email;
    cred.type = credentials.transactionType; // SEARCH
    cred.updateSupply = credentials.updateSupply;
    
    cred.amount = parseFloat(credentials.amount);

    await TransferERC20To(cred);

    // add to transaction history

    let transaction = await CreateERC20Transaction(cred);

    if (user.history === undefined) {
        user.history = new Array();
    }
    user.history.push(transaction);
    await participantRegistry.update(user);
}

/**
 * users can buy tokens...mint plus update user balance & history
 * @param {io.onemillionyearsbc.hubtutorial.tokens.BuyTokens} credentials
 * @transaction
 */
async function BuyTokens(credentials) {
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    const erc20Registry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');

    let tokenSupply = await erc20Registry.get("hub");
  
    let cred2 = {};
    cred2.email = credentials.email;
    cred2.transactionType = "LOADUP";
    cred2.amount = credentials.amount;

    // include the tokens to be minted in the allowable amount to transfer to this user
    // this is to avoid the situation where supply is lower thnz
    cred2.limit = credentials.amount + tokenSupply.supply;

    await UpdateTokensForUser(cred2);

    let cred = {};
    cred.tokenName = "hub";
    cred.newSupply = 0.0;
    cred.newMint = credentials.amount;

    await MintERC20(cred);
}


/**
 * users can cash out tokens...reduce their balance in exchange for cash: here we just reduce the balance
 * @param {io.onemillionyearsbc.hubtutorial.tokens.CashOutTokens} credentials
 * @transaction
 */
async function CashOutTokens(credentials) {
    // 1. get the user balance
    let cred = {};
    cred.email = credentials.email;

    let balance = await GetERC20Balance(cred);

    // 2. if the amount does not make the new balance -ve deduct amount from balance
    if (credentials.amount > balance) {
        throw new Error("Cannot cash out: amount is greater than balance (" + balance + ")");
    }

    // 3. update registry with new balance
    let newcred = {};
    newcred.email = credentials.email;
    newcred.balance = parseFloat(balance - credentials.amount);
    await SetERC20Balance(newcred);

    // 4. create a transaction
    let tcred = {};
    tcred.email = credentials.email;
    tcred.type = "CASHOUT";
    
    tcred.amount = parseFloat(credentials.amount);
    tcred.amount = -tcred.amount;

    await CreateERC20Transaction(tcred);    
}

/**
 * users can exchange tokens for "ranking" points to push them up the list of search results
 * @param {io.onemillionyearsbc.hubtutorial.tokens.BuyRankingPoints} credentials
 * @transaction
 */
async function BuyRankingPoints(credentials) {
    // 1. get the user balance
    let cred = {};
    cred.email = credentials.email;

    let balance = await GetERC20Balance(cred);

    // 2. if the amount does not make the new balance -ve deduct amount from balance
    if (credentials.amount > balance) {
        throw new Error("Cannot cash out: amount is greater than balance (" + balance + ")");
    }

    // 3. update registry with new balance
    let newcred = {};
    newcred.email = credentials.email;
    newcred.balance = parseFloat(balance - credentials.amount);
    await SetERC20Balance(newcred);

    // 4. create a transaction
    let tcred = {};
    tcred.email = credentials.email;
    tcred.type = "RANKPOINTS";
    
    tcred.amount = parseFloat(credentials.amount);
    tcred.amount = -tcred.amount;

    let transaction = await CreateERC20Transaction(tcred);    

    var NS = 'io.onemillionyearsbc.hubtutorial';
   
    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');
    var seeker = await participantRegistry.get(credentials.email);

    if (seeker.history == undefined) {
        seeker.history = new Array();
        seeker.history[0] = transaction;
    } else {
        seeker.history.push(transaction);
    }
    seeker.params.rankingpoints += credentials.amount;
    await participantRegistry.update(seeker);
}