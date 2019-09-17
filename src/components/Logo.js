import React from 'react'
import LogoText from '../assets/logo-text.png'

const Logo = () => {
    return (
        <div>
            <img src={LogoText} alt="We Keep Secret" height="25px" className="float-left mb-2 mt-3" />
        </div>
    )
}

export default Logo
