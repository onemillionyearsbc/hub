import { elements, elementConsts } from './base';

export const setJobAdsNumber = (num) => {
    var jobAdsNum = elements.jobadsnum;
    jobAdsNum.innerHTML = num;
}

export const setTotalJobPrice = (num) => {

    var saving=0;
    var jobprice = elements.jobPrice;
    var savingLabel = elements.savingLabel;
     // for example...job costs 10 less than the one before down to min price of 49
     var price = elementConsts.JOBADPRICE;
     var totalPrice = price;
     for (var i = 1; i < num; i++) {
        price = price - elementConsts.JOBDISCOUNT;
        if (price < elementConsts.JOBMINPRICE) {
            price = elementConsts.JOBDISCOUNT;
        }
        totalPrice += price;
     }
     jobprice.innerHTML = `£${totalPrice}`;
     saving = (elementConsts.JOBADPRICE * num) - totalPrice;
     if (num > 1) {
        savingLabel.innerHTML= `(saving £${saving} per ad)`;
        savingLabel.style.display = "block";
     } else {
        savingLabel.style.display = "none";
     }
}