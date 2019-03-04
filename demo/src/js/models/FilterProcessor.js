import { strings } from '../views/base';

export default class FilterProcessor {
    constructor(jobs) {
        this.jobs = jobs;
    }

    getTotals() {
        let totals = {}
        totals.blockchain.ethereum = this.jobs.filter(job => job.blockchainName == "ETHEREUM");
    }

    getBlockchainTotals() {
        const bcTotals = this.jobs.reduce((total, bc) => {
            total[bc.blockchainName] = total[bc.blockchainName] || 0;
            total[bc.blockchainName] += 1;
            return total;
        }, {});
        return bcTotals;
    }
}






