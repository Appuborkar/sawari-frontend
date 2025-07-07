import React,{ createContext,useContext,useState,useEffect} from 'react'
import axios from 'axios'

const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
const [user,setUser]=useState(null);
const [token,setToken]=useState(localStorage.getItem('token'));

const login=(userData,jwt)=>{
setUser(userData)
setToken(jwt);
localStorage.setItem('token',jwt)
}

const logout=()=>{
  setUser(null)
  setToken(null)
  localStorage.removeItem('token')
}

useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          logout()
        });
    }
  }, [token]);


return(
  <AuthContext.Provider value={{login,logout,token,user}}>
      {children}
  </AuthContext.Provider>
)
}
export const useAuth=()=>useContext(AuthContext)