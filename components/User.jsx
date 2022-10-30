import React from 'react';
import {useState,useEffect} from 'react';

function User(props) {

    const [os,setOs] = useState(null)
    const [browser,setBrowser]=useState(null)

    // to display user operating system
    useEffect(()=>{
    if(window.navigator.appVersion.indexOf('Win')){
        setOs("Window OS")
    }else if(window.navigator.appVersion.indexOf("Mac")){
        setOs("Mac OS")
    }else if(window.navigator.appVersion.indexOf('Linux')){
        setOs("Linux")
    }else{
        setOs("Others")
    }
    })
    // to displau user browser details
    useEffect(()=>{
        if(window.navigator.userAgent.indexOf("Chrome")){
            setBrowser("Chrome")
        }else if(window.navigator.userAgent.indexOf("Safari")){
            setBrowser("Safari")
        }else if(window.navigator.userAgent.indexOf("Edge")){
            setBrowser("MicroSoft Edge")
        }
        else if(window.navigator.userAgent.indexOf("Firefox")){
            setBrowser("Firefox")
        }else if(window.navigator.userAgent.indexOf("Opera")){
            setBrowser("Opera")
        }else if(window.navigator.userAgent.indexOf("Brave")){
            setBrowser("Brave")
        }else{
            setBrowser("Others")
        }    
    })


    return(
        <>
        <h4>{props.account}</h4>
        <h4>{props.balance}</h4>
        <h4>{os}</h4>
        <h4>{browser}</h4>
        </>
    )
}

export default User;
