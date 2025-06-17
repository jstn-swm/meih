document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    
    // Make sure autoplay and loop attributes are set programmatically
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // Most browsers require muting for autoplay
    video.setAttribute('playsinline', ''); // Required for autoplay on iOS
    
    // Force play on different user interactions to bypass autoplay restrictions
    function playVideo() {
        video.play().catch(e => {
            console.log('Auto-play was prevented by the browser:', e);
            // We'll try again when the user interacts with the page
        });
    }
    
    // Play video as soon as possible
    playVideo();
    
    // Try to play video again on these events
    video.addEventListener('canplay', playVideo);
    document.addEventListener('click', playVideo);
    document.addEventListener('touchstart', playVideo);
    window.addEventListener('load', playVideo);
    
    // If video ends for any reason, restart it (extra safeguard beyond the loop attribute)
    video.addEventListener('ended', function() {
        video.currentTime = 0;
        playVideo();
    });
    
    // Ensure video always covers the entire screen
    function resizeVideo() {
        if (window.innerWidth / window.innerHeight > 16 / 9) {
            video.style.width = '100%';
            video.style.height = 'auto';
        } else {
            video.style.width = 'auto';
            video.style.height = '100%';
        }
    }
    
    window.addEventListener('resize', resizeVideo);
    resizeVideo();
});
