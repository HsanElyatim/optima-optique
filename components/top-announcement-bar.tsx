'use client'
import React, { useEffect, useState } from 'react'

const messages = [
    "LIVRAISON GRATUITE À PARTIR DE 149 DT",
    "RETOURS GRATUITS PENDANT 14 JOURS",
    "NOUVELLES COLLECTIONS DISPONIBLES",
]

const TopAnnouncementBar = () => {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % messages.length)
        }, 4000) // Change every 4 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-black text-white text-sm md:text-base font-semibold text-center py-2 overflow-hidden h-10">
            <div
                key={index}
                className="transition-all duration-700 ease-in-out animate-fade"
            >
                {messages[index]}
            </div>
        </div>
    )
}

export default TopAnnouncementBar
