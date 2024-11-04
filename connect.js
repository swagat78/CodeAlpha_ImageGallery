document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('mainImage');
    const imageCaption = document.getElementById('imageCaption');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const images = [
        { src: 'sr.jpg?height=600&width=800', alt: 'Image 1', caption: 'Beautiful landscape view' },
        { src: 'aa.jpg?height=600&width=800', alt: 'Image 2', caption: 'A reflection of its silent strength' },
        { src: 'ty.jpg?height=600&width=800', alt: 'Image 3', caption: 'Skydiving, where adventure meets the sky!' },
        { src: 'snap.jpg?height=600&width=800', alt: 'Image 4', caption: 'Himalayas, where spirituality meets the majesty of nature' },
        { src: 'er.jpg?height=600&width=800', alt: 'Image 5', caption: 'Ride the waves' }
    ];

    let currentIndex = 0;
    let isAnimating = false;

    function createThumbnails() {
        images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.classList.add('thumbnail');
            thumbnail.addEventListener('click', () => updateMainImage(index));
            thumbnailContainer.appendChild(thumbnail);
        });
    }

    function updateMainImage(index, direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        const outgoingImage = mainImage.cloneNode(true);
        outgoingImage.style.position = 'absolute';
        mainImage.parentNode.appendChild(outgoingImage);

        mainImage.style.opacity = '0';
        mainImage.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';

        setTimeout(() => {
            mainImage.src = images[index].src;
            mainImage.alt = images[index].alt;
            imageCaption.textContent = images[index].caption;
            mainImage.style.opacity = '1';
            mainImage.style.transform = 'translateX(0)';

            outgoingImage.style.opacity = '0';
            outgoingImage.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';

            setTimeout(() => {
                outgoingImage.remove();
                isAnimating = false;
            }, 500);

            updateThumbnails(index);
        }, 50);
    }

    function updateThumbnails(activeIndex) {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === activeIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateMainImage(currentIndex, 'next');
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateMainImage(currentIndex, 'prev');
    }

    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });


    let touchStartX = 0;
    let touchEndX = 0;

    mainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    mainImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) showNext();
        if (touchEndX > touchStartX + swipeThreshold) showPrev();
    }

    
    function preloadImages() {
        images.forEach(image => {
            const img = new Image();
            img.src = image.src;
        });
    }


    createThumbnails();
    updateMainImage(currentIndex);
    preloadImages();
});