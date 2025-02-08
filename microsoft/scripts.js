document.addEventListener('DOMContentLoaded', function() {
    const sockImages = [
        'https://placeclaim.com/400x275?text=%F0%9D%8C%8C', // Example placeholder image URL
        'https://placehold.co/400x275?text=Sock1_Placeholder',
        'https://placehold.co/400x275?text=Sock2_Placeholder',
        'https://placehold.co/400x275?text=Sock3_Placeholder',
    ];
    
    const gallery = document.getElementById('gallery');
    
    sockImages.forEach((imageUrl, index) => {
        let imgElement = document.createElement('img');
        
        imgElement.src = imageUrl; // Set the src to our placeholder images
        imgElement.alt = `Sock ${index + 1}`; // Alternate text for accessibility
        imgElement.onclick = () => {
            alert(`You clicked on Sock Number: ${index + 1}`); // Simple click event example
        };
        
        gallery.appendChild(imgElement);
    });
});
