document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const soundToggle = document.getElementById('sound-toggle');
    const soundOn = document.getElementById('sound-on');
    const soundOff = document.getElementById('sound-off');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    // Fix for mobile viewport height
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set initial viewport height and update on resize
    setVH();
    window.addEventListener('resize', setVH);
    
    // By default browsers block autoplay with sound, so we start muted but will try to unmute
    video.muted = true;
    
    // Make sure other attributes are set programmatically
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true; // For iOS
    
    // Function to play video with sound if possible
    function playVideoWithSound() {
        // First try to play with sound
        video.muted = false;
        
        let playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Playback with sound succeeded!
                soundOn.classList.remove('hidden');
                soundOff.classList.add('hidden');
                console.log('Video playing with sound');
            }).catch(e => {
                // Autoplay with sound was prevented, try muted
                console.log('Autoplay with sound failed, trying muted', e);
                video.muted = true;
                video.play().then(_ => {
                    soundOn.classList.add('hidden');
                    soundOff.classList.remove('hidden');
                }).catch(e => {
                    console.log('Even muted autoplay failed:', e);
                });
            });
        }
    }
    
    // Function to toggle sound
    function toggleSound() {
        if (video.muted) {
            video.muted = false;
            soundOn.classList.remove('hidden');
            soundOff.classList.add('hidden');
        } else {
            video.muted = true;
            soundOn.classList.add('hidden');
            soundOff.classList.remove('hidden');
        }
    }
    
    // Attempt to play immediately (will likely be muted)
    video.play().catch(e => console.log('Initial autoplay prevented:', e));
    
    // Set up event listeners for user interactions to enable sound
    
    // For the sound toggle button
    soundToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSound();
        
        // Ensure video is playing
        if (video.paused) {
            video.play();
        }
    });
    
    // For the mobile overlay
    mobileOverlay.addEventListener('click', function() {
        if (video.paused) {
            playVideoWithSound();
        } else if (video.muted) {
            toggleSound();
        }
    });
    
    // Handle various user interactions to enable sound
    const userInteractions = ['click', 'touchstart', 'keydown'];
    userInteractions.forEach(event => {
        document.addEventListener(event, function interactionHandler() {
            playVideoWithSound();
            
            // Remove these listeners after first interaction to avoid repetitive calls
            userInteractions.forEach(e => {
                document.removeEventListener(e, interactionHandler);
            });
        }, { once: true });
    });
    
    // If video ends for any reason, restart it
    video.addEventListener('ended', function() {
        video.currentTime = 0;
        video.play();
    });
    
    // For iOS wake from sleep/backgrounding
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            video.play();
        }
    });
    
    // Ensure video always takes up full vertical space, horizontal is automatic
    function resizeVideo() {
        // Always prioritize height to take up full vertical space
        video.style.height = '100%';
        video.style.width = 'auto';
        
        // Center the video horizontally
        video.style.left = '50%';
        video.style.transform = 'translateX(-50%)';
    }
    
    window.addEventListener('resize', resizeVideo);
    resizeVideo();
});
