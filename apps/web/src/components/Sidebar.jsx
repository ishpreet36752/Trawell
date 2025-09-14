import React from 'react'
import { Handshake ,UsersRound , HandHeart } from 'lucide-react';
import { Link } from 'react-router';


const Sidebar = ({isOpen}) => {

    const navigationItems = [
       {icon : Handshake , label : "Connections" ,path:"/connections"},
       {icon : UsersRound ,label: "Groups",path:"/groups"},
       {icon : HandHeart , label : "Requests" , path : "/requests"}
    ]

  return (
    <div className='sticky'>
        <nav className='mt-5'>
            {navigationItems.map((item , index) => (
                <div key={index} className='m-1'>
                   <Link to={item.path}> <button className='font-bold text-xl flex justify-center hover:bg-gray-100 rounded-lg m-2 p-2' >
                        <item.icon  className='mt-1 mx-2'/>
                        {isOpen && <span className=''>
                            {item.label}
                        </span>}
                    </button>
                    </Link>
                </div>
            ))}
        </nav>
    </div>
  )
}

export default Sidebar