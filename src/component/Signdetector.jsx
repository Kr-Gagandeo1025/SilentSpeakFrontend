// Import dependencies
import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import Webcam from "react-webcam";
import { drawRect } from "../utilities";

const Signdetector = (props) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef();

    // Main function
    const runCoco = async () => {
        // 3. TODO - Load network 
        // e.g. const net = await cocossd.load();
        const net = await tf.loadGraphModel('https://silentspeakrealtimemodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json');
        //  Loop and detect hands
        setInterval(() => {
        detect(net);
        }, 10);
    };

    const detect = async (net) => {
        // Check data is available
        if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
        ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // 4. TODO - Make Detections
        // e.g. const obj = await net.detect(video);
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeBilinear(img,[480,640]);
        const casted = resized.cast('int32');
        const expanded = casted.expandDims(0);
        const obj = await net.executeAsync(expanded);
        // console.log(obj);

        const boxes = await obj[1].array();
        const classes = await obj[2].array();
        const scores = await obj[4].array();

        // Draw mesh
        const ctx = canvasRef.current?.getContext("2d");

        // 5. TODO - Update drawing utility
        // drawSomething(obj, ctx) 
        requestAnimationFrame(()=>{drawRect(boxes[0], classes[0], scores[0],0.5, videoWidth, videoHeight, ctx, props.setSilentText)});
        
        tf.dispose(img);
        tf.dispose(resized);
        tf.dispose(casted);
        tf.dispose(expanded);
        }
    };

    useEffect(()=>{runCoco()});
    return (
        <>
            <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
        </>
    )
}

export default Signdetector