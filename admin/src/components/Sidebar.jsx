import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-white border border-gray-200">
      <div className="flex flex-col gap-4 pt-6 px-4">
        
        <NavLink
          to="/add"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p>ADD ITEMS</p>
        </NavLink>

        <NavLink
          to="/list"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p>LIST ITEMS</p>
        </NavLink>

        <NavLink
          to="/orders"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p>ORDERS</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
