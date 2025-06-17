# Video Instructions

To complete the setup of your fullscreen video website, you need to add a video file:

1. Rename your video file to `video.mp4` and place it in the root directory (same folder as index.html).

## Alternative Options:

1. **Use a stock video**: You can download free stock videos from websites like Pexels, Pixabay, or Unsplash.

2. **Use a YouTube video**: Modify the HTML to use a YouTube iframe instead of a local video file:

```html
<div class="video-container">
    <iframe 
        src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID&controls=0&showinfo=0" 
        frameborder="0" 
        allowfullscreen
    ></iframe>
</div>
```

Then update the CSS for iframe:

```css
iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    transform: translate(-50%, -50%);
    pointer-events: none;
}
```

3. **Use a placeholder**: Until you have your video, you can use a colorful gradient background by adding this to your CSS:

```css
.video-container {
    background: linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4, #a1c4fd);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
```
