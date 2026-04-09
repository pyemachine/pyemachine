document.addEventListener('DOMContentLoaded', function () {

    const gallery = document.querySelector('.masonry');
    const items = Array.from(document.querySelectorAll('.masonry-item'));
    const GAP = 20; // gap between items in px

    // Determine number of columns based on viewport width
    function getColumnCount() {
        const width = window.innerWidth;
        if (width >= 1200) return 4;
        if (width >= 768) return 3;
        return 2;
    }

    // Calculate column width based on container and gap
    function getColumnWidth(colCount) {
        const containerWidth = gallery.offsetWidth;
        return (containerWidth - (GAP * (colCount - 1))) / colCount;
    }

    // Position all items using JS masonry layout
    function layoutMasonry() {
        const colCount = getColumnCount();
        const colWidth = getColumnWidth(colCount);
        const colHeights = new Array(colCount).fill(0);

        items.forEach(item => {
            item.style.width = colWidth + 'px';

            // Find the shortest column
            const shortestCol = colHeights.indexOf(Math.min(...colHeights));

            // Position the item
            const x = shortestCol * (colWidth + GAP);
            const y = colHeights[shortestCol];
            item.style.left = x + 'px';
            item.style.top = y + 'px';

            // Update column height
            colHeights[shortestCol] += item.offsetHeight + GAP;
        });

        // Set container height to tallest column
        gallery.style.height = Math.max(...colHeights) + 'px';
    }

    // Staggered fade-in + lazy load via Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Lazy load image
                const img = entry.target.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');

                    // Re-layout once image has loaded to get correct height
                    img.addEventListener('load', layoutMasonry);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Set staggered delay and observe each item
    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(item);
    });

    // Set gallery top padding based on actual nav height
    function setGalleryPadding() {
        const nav = document.querySelector('.top-nav');
        const gallerySection = document.querySelector('.gallery-section');
        const navHeight = nav.offsetHeight;
        gallerySection.style.paddingTop = (navHeight + 20) + 'px';
    }

    // Initial layout
    setGalleryPadding();
    layoutMasonry();

    // Re-layout on window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            setGalleryPadding();
            layoutMasonry();
        }, 100);
    });

});
