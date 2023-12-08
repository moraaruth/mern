"use client";
import Link from "next/link";
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios  from "axios";




export default function LoginPage(){ 
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false)


    const onLogin = async () => {
        try {
            setLoading(true);
        
           
             const response = await axios.post("api/users/login", user)           
          
              console.log("Login success", response.data);
            
             router.push("/profile");
           

            
        } catch (error: any) {
            console.log("login failed", error.message);
      
            
        } finally {
            setLoading(false)
        }

    }

    useEffect (() => {
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false)

        } else {
            setButtonDisabled(true)
        }
    }, [user])
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>Welcome Back!</h1>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold' }}>{loading ? "Processing" : "Logged in"}</h1>
            <label htmlFor="email" style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>email</label>
            <input
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="email"
            />
            <label htmlFor="password" style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>password</label>
            <input
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
            />
            <button onClick={onLogin} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>Login</button>
            <Link href="/signup" style={{ fontSize: '14px', color: 'blue', textDecoration: 'underline' }}>Visit Sign Up here</Link>
        </div>
    )
}