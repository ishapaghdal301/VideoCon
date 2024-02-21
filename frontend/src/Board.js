import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

import './board.css';

const Board = (props) => {
    const socket = useRef(io.connect("http://localhost:8000"));
    const ctx = useRef(null);
    const isDrawing = useRef(false);
    const timeout = useRef(null);

    useEffect(() => {
        const drawOnCanvas = () => {
            const canvas = document.querySelector('#board');
            ctx.current = canvas.getContext('2d');
            const ctxRef = ctx.current;

            const sketch = document.querySelector('#sketch');
            const sketchStyle = getComputedStyle(sketch);
            canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
            canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

            const mouse = { x: 0, y: 0 };
            const lastMouse = { x: 0, y: 0 };

            canvas.addEventListener('mousemove', (e) => {
                lastMouse.x = mouse.x;
                lastMouse.y = mouse.y;

                mouse.x = e.pageX - canvas.offsetLeft;
                mouse.y = e.pageY - canvas.offsetTop;
            }, false);

            ctxRef.lineWidth = props.size;
            ctxRef.lineJoin = 'round';
            ctxRef.lineCap = 'round';
            ctxRef.strokeStyle = props.color;

            canvas.addEventListener('mousedown', (e) => {
                canvas.addEventListener('mousemove', onPaint, false);
            }, false);

            canvas.addEventListener('mouseup', () => {
                canvas.removeEventListener('mousemove', onPaint, false);
            }, false);

            const onPaint = () => {
                ctxRef.beginPath();
                ctxRef.moveTo(lastMouse.x, lastMouse.y);
                ctxRef.lineTo(mouse.x, mouse.y);
                ctxRef.closePath();
                ctxRef.stroke();

                if (timeout.current !== undefined) clearTimeout(timeout.current);
                timeout.current = setTimeout(() => {
                    const base64ImageData = canvas.toDataURL("image/png");
                    socket.current.emit("canvas-data", base64ImageData);
                }, 1000);
            };
        };

        drawOnCanvas();

        socket.current.on("canvas-data", (data) => {
            const interval = setInterval(() => {
                if (isDrawing.current) return;
                isDrawing.current = true;
                clearInterval(interval);
                const image = new Image();
                const canvas = document.querySelector('#board');
                const ctx = canvas.getContext('2d');
                image.onload = () => {
                    ctx.drawImage(image, 0, 0);
                    isDrawing.current = false;
                };
                image.src = data;
            }, 200);
        });
    }, [props.color, props.size]);

    return (
        <div className="sketch" id="sketch">
            <canvas className="board" id="board"></canvas>
        </div>
    );
};

export default Board;
