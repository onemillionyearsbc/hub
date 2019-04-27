import { elements, elementConsts, strings } from './base';

export const setCVSearchNumber = (num) => {
   var jobAdsNum = elements.jobadsnum;
   jobAdsNum.innerHTML = num;
}

export const getTokensToMint = () => {
   // example: total price for searches = £45 (two searches)

   // number of tokens to mint = total price * EXCHANGE RATE (100 tokens per pound)

   // 45 * 100 = 4500 new tokens
   let totalPrice = sessionStorage.getItem("totalprice");
   console.log("price = " + totalPrice);
   let newTokens = totalPrice * elementConsts.TOKENEXCHANGERATE * elementConsts.REWARDPERCENTAGE;
   console.log("Number of new tokens to mint: " + newTokens);
   return newTokens;
}

export const setTotalCVSearchPrice = (num) => {
   var saving = 0;
   var jobprice = elements.jobPrice;
   var savingLabel = elements.savingLabel;
   // for example...job costs 10 less than the one before down to min price of 49

   var price = getBasePrice();
   var totalPrice = price;
   for (var i = 1; i < num; i++) {
      price = price - elementConsts.CVDISCOUNT;
      if (price < elementConsts.CVMINPRICE) {
         price = elementConsts.CVMINPRICE;
      }
      totalPrice += price;
   }
   jobprice.innerHTML = `£${totalPrice}`;
   saving = (getBasePrice() * num) - totalPrice;
   if (num > 1) {
      savingLabel.innerHTML = `(saving £${saving})`;
      savingLabel.style.display = "block";
   } else {
      savingLabel.style.display = "none";
   }
   sessionStorage.setItem("totalprice", totalPrice);
}

function getBasePrice() {
   let price = sessionStorage.getItem("cvprice");
   if (price === null) {
      price = elementConsts.CVSEARCHPRICE;
   }
   return parseInt(price);
}

export const adjustSliderCV = (delta) => {
   var input = elements.slider;
   var oldValue = parseInt(input.value);
   var newValue;
   if (delta === -1) {
      newValue = oldValue == 1 ? 1 : oldValue - 1;
   } else {
      newValue = oldValue == elementConsts.MAXJOBS ? elementConsts.MAXJOBS : oldValue + 1;
   }
   document.querySelector('input[type=range]').value = newValue;
   setCVSearchNumber(input.value);
   setTotalCVSearchPrice(input.value);
   var sheet = document.createElement('style');
   sheet.textContent = getTrackStyle(input.value);
   document.body.appendChild(sheet);
}

export const restyleCV = (value) => {
   var sheet = document.createElement('style');
   sheet.textContent = getTrackStyle(value);
   document.body.appendChild(sheet);
}

// function to set the background slider gradient if the user clicks to change the slider position
var getTrackStyle = function (newValue) {
   var curVal = newValue,
      val = (curVal - 1) * (100 / (elementConsts.MAXJOBS - 1)), // THIS IS M
      style = '',
      prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];
   // Change background gradient
   for (var i = 0; i < prefs.length; i++) {
      style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
      style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
   }
   return style;
}

export const getBuyCVSearchData = (mail) => {
   var input = elements.slider;
   console.log("-----------> CREDITS = " + parseInt(input.value));
   var buyCreditsData = {
       $class: strings.buyJobAdsTransaction,
       email: mail,
       searches: parseInt(input.value),
   };
   return buyCreditsData;
}
