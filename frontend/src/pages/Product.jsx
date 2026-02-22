import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from "react-toastify"; // ⭐ ADDED

const Product = () => {

  const {productId} = useParams();
  const {products, currency, addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    products.map((item)=>{
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0]);
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  // ⭐ NEW FUNCTION (toast feature)
  const handleAddToCart = () => {

    if (!size) {
      toast.error("Please select a size first 👕");
      return;
    }

    addToCart(productData._id, size);
    toast.success("🛒 Product added to cart!");
  };

  return productData ? (
    <div className='border-t pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*---------------Product data-------------*/}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------------Product images-------------------*/}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full '>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24 sm:w-full sm:mb-3 shrink-0 cursor-pointer ' />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='h-auto w-full' src={image} alt="" />
          </div>
        </div>

        {/* ---------- Product Info ----------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

          <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
          </div>

          <p className='text-3xl mt-5 font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 w-4/5'>{productData.description}</p>

          <div className='flex flex-col gap-4 my-8'>
              <p className='whitespace-nowrap'>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button
                    onClick={()=>setSize(item)}
                    className={`${item === size ? 'border-orange-500' : ' border-none'} border py-2 px-4 bg-gray-100 cursor-pointer`}
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
          </div>

          {/* ⭐ ONLY THIS BUTTON CHANGED */}
          <button
            onClick={handleAddToCart}
            className='bg-black text-white px-8 py-3 text-sm cursor-pointer active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />

          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                <p>100% Original product</p>
                <p>Cash on delivery is available on this product</p>
                <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & review section ----------- */}
      <div className='mt-20 '>
        <div className='flex'>
            <p className='text-sm border border-gray-300 bg-gray-50 font-semibold px-5 py-2'>Description</p>
            <p className='text-sm border border-gray-200 px-5 py-2 text-gray-500'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border border-gray-200 p-6 text-sm text-gray-600 leading-6'>
            <p>Our website is dedicated to providing high-quality products and a smooth shopping experience for every customer...</p>
            <p>Our team continually works to improve our services and bring you new, innovative solutions...</p>
        </div>
      </div>

      {/* ---------- Related products ----------- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product