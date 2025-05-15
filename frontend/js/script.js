$(document).ready(function() {
    // Fetch daily fact using AJAX
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        method: 'GET',
        success: function(response) {
            $('#fact-content').html(response.text);
        },
        error: function(xhr, status, error) {
            $('#fact-content').html('Failed to load daily fact. Please try again later.');
        }
    });

    // Drag and drop functionality
    const dropZone = $('#drop-zone');
    const fileInput = $('#fileInput');
    const previewContainer = $('#preview-container');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.on(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        
        $(document).on(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Handle drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.on(eventName, function() {
            $(this).addClass('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.on(eventName, function() {
            $(this).removeClass('dragover');
        });
    });

    // Handle file drop
    dropZone.on('drop', function(e) {
        const files = e.originalEvent.dataTransfer.files;
        handleFiles(files);
    });

    // Handle click to upload
    dropZone.on('click', function() {
        fileInput.click();
    });

    fileInput.on('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            // Check file type
            if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/i)) {
                alert('Please upload only JPG, PNG, GIF, or WebP images.');
                return;
            }

            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB.');
                return;
            }

            const formData = new FormData();
            formData.append('image', file);

            // Show loading state
            const loadingDiv = $('<div>').addClass('col-md-4')
                .append($('<div>').addClass('loading'));
            previewContainer.append(loadingDiv);

            // Upload image
            $.ajax({
                url: 'http://localhost:3000/upload',  // Use full URL
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('Upload success:', response);
                    loadingDiv.remove();
                    
                    // Create preview
                    const previewDiv = $('<div>').addClass('col-md-4');
                    const img = $('<img>')
                        .addClass('preview-image')
                        .attr('src', 'http://localhost:3000' + response.path)  // Use full URL for image
                        .attr('alt', 'Uploaded Image');
                    
                    previewDiv.append(img);
                    previewContainer.append(previewDiv);
                },
                error: function(xhr, status, error) {
                    console.error('Upload failed:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        responseText: xhr.responseText,
                        error: error
                    });
                    
                    loadingDiv.remove();
                    let errorMessage = 'Failed to upload image. ';
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMessage += response.details || response.error || error;
                    } catch (e) {
                        errorMessage += `Server returned status ${xhr.status}. Please try again.`;
                    }
                    
                    alert(errorMessage);
                }
            });
        });
    }

    // Navbar animation
    $('.nav-link').hover(
        function() {
            $(this).css('transform', 'translateY(-2px)');
        },
        function() {
            $(this).css('transform', 'translateY(0)');
        }
    );

    // Smooth scroll for navigation links
    $('a.nav-link').on('click', function(e) {
        e.preventDefault();
        const targetId = $(this).attr('href');
        if (targetId !== '#') {
            $('html, body').animate({
                scrollTop: $(targetId).offset().top - 75
            }, 1000);
        }
    });

    // Feature box hover animation
    $('.feature-content').hover(
        function() {
            $(this).find('i').css('transform', 'scale(1.2)');
        },
        function() {
            $(this).find('i').css('transform', 'scale(1)');
        }
    );
}); 