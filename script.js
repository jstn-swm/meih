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
    
    // Start with sound enabled
    video.muted = false;
    
    // Make sure other attributes are set programmatically
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true; // For iOS
    video.volume = 1.0;

    // Play with sound function that tries different approaches
    function forcePlayWithSound() {
        // Try Promise-based approach first
        let playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Playback started successfully, unmute if needed
                if (video.muted) {
                    video.muted = false;
                    // Update UI
                    soundOn.classList.remove('hidden');
                    soundOff.classList.add('hidden');
                }
                console.log('Video playing with sound');
            }).catch(error => {
                // Auto-play was prevented, try with user gesture emulation
                console.log('Autoplay with sound prevented:', error);
                tryWithEmulatedGesture();
            });
        } else {
            // Older browsers that don't return promise
            video.play();
            video.muted = false;
        }
    }
    
    // Try using simulated user gestures
    function tryWithEmulatedGesture() {
        // Create and dispatch various events that might unlock audio
        const events = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown', 'pointerdown'];
        const videoEl = document.getElementById('background-video');
        
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            videoEl.dispatchEvent(event);
            document.documentElement.dispatchEvent(event);
            
            // Also try with MouseEvent for click
            if (eventType === 'click') {
                const mouseEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: Math.floor(Math.random() * 100),
                    clientY: Math.floor(Math.random() * 100)
                });
                videoEl.dispatchEvent(mouseEvent);
            }
        });
        
        // Try again to play with sound
        setTimeout(() => {
            videoEl.muted = false;
            videoEl.play().catch(e => console.log('Still failed after gesture emulation:', e));
        }, 100);
    }
    
    // Use Intersection Observer to detect when video is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                forcePlayWithSound();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(video);
    
    // Try to play immediately
    forcePlayWithSound();
    
    // Try on canplay event
    video.addEventListener('canplay', forcePlayWithSound);
    
    // Try after a small delay
    setTimeout(forcePlayWithSound, 500);
    setTimeout(forcePlayWithSound, 1500);
    setTimeout(forcePlayWithSound, 3000);
    
    // Set up audio session for iOS
    function setupIOSAudio() {
        // Create an audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const audioCtx = new AudioContext();
        
        // Create a silent oscillator
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.01; // Nearly silent
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Play and stop to "unlock" the audio context
        oscillator.start(0);
        oscillator.stop(0.5);
        
        // Resume the audio context
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    // Set up iOS audio
    setupIOSAudio();
    
    // Handle the sound toggle button
    soundToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (video.muted) {
            video.muted = false;
            soundOn.classList.remove('hidden');
            soundOff.classList.add('hidden');
        } else {
            video.muted = true;
            soundOn.classList.add('hidden');
            soundOff.classList.remove('hidden');
        }
        
        // Ensure video is playing
        if (video.paused) {
            video.play();
        }
    });
    
    // For iOS wake from sleep/backgrounding
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            forcePlayWithSound();
        }
    });
    
    // Ensure video always takes up full vertical space
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
    
    // Add listener to the whole document for any user interaction
    document.addEventListener('click', function() {
        forcePlayWithSound();
    }, { once: true });
    
    document.addEventListener('touchstart', function() {
        forcePlayWithSound();
    }, { once: true });
});
