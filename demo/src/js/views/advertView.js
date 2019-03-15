import { elements, elementConsts } from './base';

export const setPrices = () => {
    elements.price1.innerHTML = `£${elementConsts.STANDARDPRICE}`;
    elements.price2.innerHTML = `£${elementConsts.PREMIUMPRICE}`;
}