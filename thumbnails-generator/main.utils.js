function loadVideoFromFileInput(video, fileInput, callback = null) {
    if (fileInput.files.length) {
        let file = fileInput.files[0];
        let fileURL = URL.createObjectURL(file);
        if (callback) {
            on(video, "canplay", callback, {once:true});
        }
        video.src = fileURL;
    }
}

function drawSpecificFrameFromVideo(video, canvas, time) {
    on(video, "seeked", () => drawFrameFromVideo(video, canvas), {once:true});
    video.currentTime = time;
}

function drawFrameFromVideo(video, canvas) {
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function getVideoFrameAsDataURL(video) {
    let canvas = elem("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let dataURL = canvas.toDataURL();
    return dataURL;
}

function updateSeekbar() {
    stepLength  = Math.floor(video.duration) / markCount;
    marksValues = range(0, video.duration, stepLength);
    marksValues = marksValues.map(value => Math.round(value));
    seekbar.max = video.duration;
    seekbar.value = 0;
    seekbarMarks.innerHTML = null;
    marksValues.forEach(value => seekbarMarks.append(elem("option", value)));
}

