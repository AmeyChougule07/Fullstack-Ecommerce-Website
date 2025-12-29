import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Cart = () => {

  const { products,currency,cartItems,updateQuantity } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  
  useEffect(() => {

    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData);
  }, [cartItems])

{/*------------------------------I stopped here previously --------------------------*/}


  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'Your'} text2={'CART'} />
      </div>
      <div className=''>
        {
          cartData.map((item,index)=>{
            const productData = products.find((product)=> product ._id === item._id);
            return (
                <div key={index} className='py-4 "border-t border-b border-gray-400  text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                      <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                      <div>
                        <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                        <div className='flex items-center gap-5 mt-2'>
                          <p>{currency}{productData.price}</p>
                          <p className='px-2 sm:px-3 sm:py-1 border-none bg-slate-100'>{item.size}</p>
                        </div>
                      </div>
                  </div>
                  <input className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 outline-none border-nono' type="number" min={1} defaultValue={item.quantity} />
                  <img onClick={()=>updateQuantity(item._id,item.size,0)} src={assets.bin_icon} className='w-4 mr-4 cursor-pointer sm:w-5' alt="" />
                </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Cart