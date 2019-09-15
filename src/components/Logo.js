import React from 'react'
import LogoIcon from '../assets/logo-icon.png'
import LogoText from '../assets/logo-text.png'

const Logo = () => {
    return (
        <div>
            <img src={LogoIcon} alt="Logo" height="25px" className="float-left m-3" />
            <img src={LogoText} alt="We Keep Secret" height="25px" className="float-left mb-2 mt-3" />
        </div>
    )
}

export default Logo
