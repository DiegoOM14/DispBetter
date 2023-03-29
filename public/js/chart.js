const cv = require('opencv');

const MJPEG_CLIENT_TIMEOUT = 10 * 1000; // 10 segundos
const VIDEO_FEED_URL = 'http://192.168.100.159:8080/video_feed'; // cambiar por la dirección IP de tu Raspberry Pi

let timerId;
let videoFeed;

function startVideoFeed() {
  videoFeed = new cv.VideoCapture(VIDEO_FEED_URL);
  timerId = setInterval(() => {
    const frame = videoFeed.read();
    if (!frame.empty()) {
      // hacer algo con el marco capturado
    }
  }, 1);
}

function stopVideoFeed() {
  clearInterval(timerId);
  videoFeed.release();
}

setTimeout(() => {
  startVideoFeed();
  setTimeout(stopVideoFeed, MJPEG_CLIENT_TIMEOUT);
}, 1000);
