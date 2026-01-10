import React from 'react'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t '>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img src={assets.about_img} className='w-full md:max-w-[450px]' alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A adipisci similique minus eligendi corrupti blanditiis quis vero molestias, amet minima?</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem id exercitationem fugiat omnis rem aliquid ducimus nihil. Laboriosam, molestiae architecto.</p>
          <b className='text-gray-800 '>Our Mission</b>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde deleniti, ut quo non dolores eum incidunt natus, ad sequi porro officiis? Quibusdam vel ex repellendus repudiandae voluptatibus odio quos? Culpa?</p>
        </div>
      </div>
      <div className='text-xl py-4 '>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border border-gray-300 px-10 md:px-16 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Quality you can feel in every stitch—each piece is carefully inspected to meet our highest standards.
            From fabric selection to final finish, we ensure lasting comfort, durability, and flawless craftsmanship.</p>
        </div>
        <div className='border border-gray-300 px-10 md:px-16 sm:py-20 flex flex-col gap-5'>
          <b>Convinience:</b>
          <p className='text-gray-600'>Designed to fit seamlessly into your lifestyle, every step from selection to delivery is made simple and effortless.</p>
        </div>
        <div className='border border-gray-300 px-10 md:px-16 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our dedicated team is always here to listen, assist, and ensure your experience with our brand exceeds expectations.</p>
        </div>
      </div>

      <NewsletterBox/>

    </div>
  )
}

export default About