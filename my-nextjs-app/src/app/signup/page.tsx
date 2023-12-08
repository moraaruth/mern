"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignUpPage() {

  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      // const response =  axios.post("api/users/signup", user)
    axios.post("api/users/signup", user)
      // console.log("Signup success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed", error.message);
     
    } finally {
      setLoading(false);
    }
  };

  useEffect (() => {
      if(user.email.length > 0 && user.username.length > 0 && user.password.length > 0){
          setButtonDisabled(false)

      } else {
          setButtonDisabled(true)

      }
  }, [user]);


  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2"
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        Sign Up
      </h1>
      <div style={{ width: '300px', marginBottom: '15px', marginLeft: '40%' }}>
        <label htmlFor="username">Username</label>
        <input
          style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          id="username"
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Enter your username"
        />
      </div>
      <div style={{ width: '300px', marginBottom: '15px', marginLeft: '40%' }}>
        <label htmlFor="email">Email</label>
        <input
          style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          id="email"
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your email"
        />
      </div>
      <div style={{ width: '300px', marginBottom: '15px', marginLeft: '40%' }}>
        <label htmlFor="password">Password</label>
        <input
          style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
        />
      </div>
      <button
        onClick={onSignup}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: buttonDisabled ? '#ccc' : '#007bff',
          color: '#fff',
          cursor: buttonDisabled ? 'not-allowed' : 'pointer',
        }}
        disabled={buttonDisabled}
      >
        {loading ? 'Processing' : 'Sign Up'}
      </button>
      <p style={{ marginTop: '10px', fontSize: '14px' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
          Log In
        </Link>
      </p>
    </div>
  );
}
