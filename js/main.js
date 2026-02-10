// Intersection Observer for staggered fade-in and lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.masonry-item');

    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger fade-in animation
                entry.target.classList.add('visible');

                // Lazy load images if they exist
                const img = entry.target.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }

                // Stop observing this item once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each masonry item with a staggered delay
    items.forEach((item, index) => {
        // Add staggered transition delay
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
});
