import { elements, elementConsts, strings } from './base';

export const setJobAdsNumber = (num) => {
   var jobAdsNum = elements.jobadsnum;
   jobAdsNum.innerHTML = num;
}

export const setTotalJobPrice = (num) => {

   var saving = 0;
   var jobprice = elements.jobPrice;
   var savingLabel = elements.savingLabel;
   // for example...job costs 10 less than the one before down to min price of 49

   var price = getBasePrice();
   var totalPrice = price;
   for (var i = 1; i < num; i++) {
      price = price - elementConsts.CVDISCOUNT;
      if (price < elementConsts.CVMINPRICE) {
         price = elementConsts.CVDISCOUNT;
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
}

function getBasePrice() {
   let price = sessionStorage.getItem("price");
   console.log("MEOW! price = " + price);
   if (price === null) {
      price = elementConsts.JOBADPRICE;
   }
   return parseInt(price);
}

export const adjustSlider = (delta) => {
   var input = elements.slider;
   var oldValue = parseInt(input.value);
   var newValue;
   if (delta === -1) {
      newValue = oldValue == 1 ? 1 : oldValue - 1;
   } else {
      newValue = oldValue == elementConsts.MAXJOBS ? elementConsts.MAXJOBS : oldValue + 1;
   }
   document.querySelector('input[type=range]').value = newValue;
   setJobAdsNumber(input.value);
   setTotalJobPrice(input.value);
   var sheet = document.createElement('style');
   sheet.textContent = getTrackStyle(input.value);
   document.body.appendChild(sheet);
}

export const restyle = (value) => {
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

export const getBuyJobCreditsData = (mail) => {
   var input = elements.slider;
   console.log("-----------> CREDITS = " + parseInt(input.value));
   var buyCreditsData = {
       $class: strings.buyJobAdsTransaction,
       email: mail,
       credits: parseInt(input.value),
   };
   return buyCreditsData;
}
