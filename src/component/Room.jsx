import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../providers/socket'
import ReactPlayer from "react-player";
import peer from '../service/peer';
import "../styles/room.css";

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId,setRemoteSocketId] = useState();
    const [myStream,setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [silentText, setSilentText] = useState("test-text");

    const handleCallUser = useCallback(async()=>{
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                audio:true,
                video:true
            });
            const offer = await peer.getOffer();
            socket.emit("user:call",{to:remoteSocketId, offer});
            setMyStream(stream);
        }catch(err){
            console.log("rejected.");
        }
    },[remoteSocketId,socket]);

    const handleUserJoined = useCallback(({email,id})=>{
        console.log(`Email ${email} joined the room`);
        setRemoteSocketId(id)
    },[]);

    const handleIncomingCall = useCallback(
      async ({from,offer}) => {
        setRemoteSocketId(from);
          const stream = await navigator.mediaDevices.getUserMedia({
              audio:true,
              video:true
          });
          setMyStream(stream);
        console.log("Incoming Call ",from,offer);
        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted',{to:from,ans});
      },[socket]);

    const sendStreams = useCallback(() => {
        try{
            for (const track of myStream.getTracks()){
                peer.peer.addTrack(track, myStream);
            }
        }catch(err){
            console.log("alredy exists!!");
        }
    },[myStream])

    const handelCallAccepted = useCallback(({from, ans})=>{
        peer.setLocalDescription(ans);
        console.log("Call Accepted");
        sendStreams();   
    },[sendStreams]);

    const handleNegoNeeded = useCallback(async ()=>{
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed',{offer, to: remoteSocketId})
    },[remoteSocketId, socket])

    const handleNegoNeededIcoming = useCallback(async ({from,offer})=>{
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done",{to:from,ans})
    },[socket]);

    const handleNegoFinal = useCallback( async({ans})=>{
        await peer.setLocalDescription(ans);
    },[])

    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded',handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded);
        };
    },[handleNegoNeeded])

    useEffect(()=>{
        peer.peer.addEventListener('track', async ev =>{
            const remoteStream = ev.streams;
            console.log("GOT TRACKS");
            setRemoteStream(remoteStream[0]);
        })
    },[])
    

    useEffect(()=>{
        socket.on("new-user-joined",handleUserJoined);
        socket.on("incoming:call",handleIncomingCall);
        socket.on("call:accepted",handelCallAccepted);
        socket.on("peer:nego:needed",handleNegoNeededIcoming);
        socket.on("peer:nego:final",handleNegoFinal);
        
        return () => {
            socket.off("new-user-joined",handleUserJoined);
            socket.off("incoming:call",handleIncomingCall);
            socket.off("call:accepted",handelCallAccepted);
            socket.off("peer:nego:needed",handleNegoNeededIcoming);
            socket.off("peer:nego:final",handleNegoFinal);  
        }
    },[socket,handleUserJoined,handleIncomingCall,handelCallAccepted,handleNegoNeededIcoming,handleNegoFinal]);

    const calluser = () =>{
        handleCallUser();
    }
  return (
    <div className='room-main'>
        <h1 className='room-title'>Silent Speak Room</h1>
        <h4 className='connect-status'>{remoteSocketId? "1 user Connected":"Connecting..."}</h4>

        <div className="display-section">
            <div className="call-icon">{remoteSocketId && !myStream && <button className='call-btn' onClick={calluser}>Call connected User</button>}</div>
            <div className="call-icon">{remoteSocketId && !myStream && <button className='exit-btn'>Exit to Home</button>}</div>
            <div className='start-stream-icon'>{myStream && <button className='start-stream-btn' onClick={sendStreams}>Start Streaming...</button> }</div>
            <div className="my-video">
                {!remoteSocketId && <h4>waiting for someone to join...</h4>}
                <div className="remote-video-main">
                    { 
                        remoteStream && <>
                            <div className='remote-video'>
                                <h1>Remote Video</h1>
                                <ReactPlayer playing muted url={remoteStream} height="100%" width="100%"/>
                            </div>
                            <div className="remote-silentSpeaker">
                                <div className="title"><h4>Silent-Speaker</h4></div>
                                <div className="div">
                                    <p>{silentText}</p>
                                </div>
                            </div>
                        </> 
                    }
                </div>
                <div className="host-video-main">
                    { 
                        myStream && <div className="host-video">
                            <h1>Your Video</h1>
                            <ReactPlayer playing muted url={myStream} height="100%" width="100%" />
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Room