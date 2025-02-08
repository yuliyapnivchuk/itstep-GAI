function showImage(element) {
    var imageSrc = element.querySelector('img').src; // Get source from clicked img tag inside .column div
    
    document.getElementById("product-grid").innerHTML = `
        <div class="row">
            <!-- Image will be shown here -->
        </div>
    `.replace(/\n/g, ''); // Remove newlines for cleaner HTML structure (if necessary)
    
    var imageElement = document.createElement('img');
    imageElement.src = imageSrc;
    imageElement.alt = "Product Image"; 
    imageElement.style.width = '100%';
    imageElement.style.maxWidth = '350px'; // Set max width for better control over presentation size on different devices/screen resolutions
    
    document.getElementById("product-grid").appendChild(imageElement); 
}
