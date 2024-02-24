import Hero from "./hero";
import React, {useCallback, useState, useEffect } from 'react'
import '../styles/main-sec.css'
import { useSocket } from '../providers/socket'
import { useNavigate } from "react-router-dom";
import boy from '../boy.jpg';
import { GitHub } from "@mui/icons-material";
const Home = () => {
    const [email,setEmail] = useState("");
    const [roomName,setRoomName] = useState("");
    const socket = useSocket();
    const navigate = useNavigate();
    // console.log(socket);
    const handleSubmit = useCallback((e) => {
      e.preventDefault();
      socket.emit('join-room',{email,roomName});
    },[email,roomName,socket]);
    
    const handleRoomJoin = useCallback((data) => {
      const {email, roomName} = data;
      console.log(email,roomName);
      navigate(`/room/${roomName}`);
    },[navigate])

    useEffect(()=>{
      socket.on('join-room',handleRoomJoin);
      return () => {
        socket.off('join-room',handleRoomJoin);
      }
    },[socket,handleRoomJoin]);
  return (
    <>
        <Hero/>
        <form onSubmit={handleSubmit}>
          <div className='main-container' id='session'>
          <div className="main-header">
              <h1>SilentSpeak Session</h1>
          </div>
          <div className="main-section">
              <div className="create-room">
                  <h1>Create / Join a Room</h1>
                  <input type='email' className='user-email input-field' placeholder='Enter Your Email...' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                  <input type='text' className='room-name input-field' placeholder='Enter a Room ID...' value={roomName} onChange={(e)=>setRoomName(e.target.value)}/>
                  <button className='rm-btn create-btn' type="submit">create / join room</button>
              </div>
              <div className="cr-jn-img">
                <img src={boy} alt="boy" height={250} width={400} className="boy-img"/>
              </div>
          </div>
          </div>
        </form>
        <div className="footer">
          <p>SilentSpeak - Is a WebRTC and Socket io A.I video chat app that enables you to skip communication barrier as it bridges the gap that an person who cannot speak faces with someone who does not understands Sign Language <br /> ©Team-SilentSpeak-2024</p>
          <div className="f-icons">
            <a href="https://github.com/Kr-Gagandeo1025/SilentSpeakFrontend"><GitHub/></a>
            {/* <a href="#"><LinkedIn/></a>
            <a href="#"><Twitter/></a> */}
          </div>
        </div>
    </>
  )
}

export default Home