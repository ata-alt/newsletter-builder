<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Personalized Selection - FCI London</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="newsletter.css?v=5">
</head>

<body class="newsletter-page">
    <!-- PDF Document Container -->
    <div class="pdf-document">
        <!-- Document Header -->
        <header class="pdf-header">
            <div class="pdf-header-content">
                <img src="logo-horizontal-text.png" alt="FCI LONDON" class="pdf-brand-logo">
                <div class="pdf-header-actions">
                    <button class="pdf-action-btn" id="saveEmailBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email This
                    </button>
                    <a href="index.php" class="pdf-action-link">Reset Brief</a>
                    <a href="https://www.fcilondon.co.uk/" target="_blank" class="pdf-action-link">Visit Website</a>
                </div>
            </div>
        </header>

        <!-- Document Content -->
        <main class="pdf-content">
            <!-- Cover Section -->
            <section class="pdf-cover">
                <div class="pdf-cover-text">
                    <span class="pdf-date"><?php echo date('F Y'); ?></span>
                    <h2 class="pdf-title">Your Personalized<br>Furniture Selection</h2>
                    <p class="pdf-subtitle">A Curated Journey Through Contemporary Living</p>
                    <div class="pdf-divider"></div>
                    <p class="pdf-intro">Dear Valued Client,<br><br>We've carefully selected these pieces based on your unique preferences and style. Each item has been chosen to complement your vision of contemporary, elegant living.</p>
                </div>
            </section>

            <!-- Journey Section 1: Introduction -->
            <section class="pdf-section">
                <div class="section-header">
                    <span class="section-number">01</span>
                    <h3 class="section-title">Contemporary Living Spaces</h3>
                    <span class="section-category">INTERIOR DESIGN</span>
                </div>
                <div class="section-split reverse">
                    <div class="section-image-half">
                        <img src="unnamed.jpg" alt="Modern living room setup">
                    </div>
                    <div class="section-content-half">
                        <p class="section-text-large">Discover the latest trends in modern furniture design, featuring minimalist aesthetics and functional elegance for your home. Our contemporary living collection embodies the perfect balance between form and function, creating spaces that inspire and comfort.</p>
                        <p class="section-text">Each piece is thoughtfully designed to enhance your daily living experience, with clean lines and timeless appeal that transcends fleeting trends.</p>
                    </div>
                </div>
            </section>

            <!-- Journey Section 2: Luxury Sofas -->
            <section class="pdf-section alternate">
                <div class="section-header">
                    <span class="section-number">02</span>
                    <h3 class="section-title">Luxury Sofa Collections</h3>
                    <span class="section-category">SEATING</span>
                </div>
                <div class="section-split">
                    <div class="section-image-half">
                        <img src="unnamed.jpg" alt="Luxury sofa">
                    </div>
                    <div class="section-content-half">
                        <p class="section-text-large">Explore our curated selection of premium sofas crafted with exceptional materials and timeless design.</p>
                        <p class="section-text">Every sofa in our collection is a masterpiece of comfort and style, featuring hand-selected fabrics, precision engineering, and attention to detail that defines luxury furniture.</p>
                    </div>
                </div>
            </section>

            <!-- Journey Section 3: Dining -->
            <section class="pdf-section">
                <div class="section-header">
                    <span class="section-number">03</span>
                    <h3 class="section-title">Dining Room Essentials</h3>
                    <span class="section-category">DINING</span>
                </div>
                <div class="section-image-large">
                    <img src="unnamed.jpg" alt="Modern dining area">
                </div>
                <div class="section-content">
                    <p class="section-text-large">Transform your dining space with elegant tables and chairs that combine style with comfort. The dining room is where memories are made, conversations flow, and bonds are strengthened.</p>
                    <p class="section-text">Our dining collections feature solid wood construction, expert craftsmanship, and designs that welcome both intimate dinners and grand celebrations.</p>
                </div>
            </section>

            <!-- Journey Section 4: Bedroom -->
            <section class="pdf-section alternate">
                <div class="section-header">
                    <span class="section-number">04</span>
                    <h3 class="section-title">Bedroom Sanctuaries</h3>
                    <span class="section-category">BEDROOM</span>
                </div>
                <div class="section-split reverse">
                    <div class="section-content-half">
                        <p class="section-text-large">Create your perfect retreat with our collection of beds, nightstands, and bedroom accessories.</p>
                        <p class="section-text">Your bedroom should be a sanctuary—a place of rest, rejuvenation, and personal expression. Our bedroom furniture combines sophisticated design with ultimate comfort.</p>
                    </div>
                    <div class="section-image-half">
                        <img src="unnamed.jpg" alt="Bedroom furniture">
                    </div>
                </div>
            </section>

            <!-- Journey Section 5: Workspace -->
            <section class="pdf-section">
                <div class="section-header">
                    <span class="section-number">05</span>
                    <h3 class="section-title">Home Office Solutions</h3>
                    <span class="section-category">WORKSPACE</span>
                </div>
                <div class="section-image-large">
                    <img src="unnamed.jpg" alt="Office furniture">
                </div>
                <div class="section-content">
                    <p class="section-text-large">Design a productive workspace with our range of desks, chairs, and storage solutions. The modern home office demands furniture that inspires creativity while supporting productivity.</p>
                    <p class="section-text">From ergonomic seating to beautifully crafted desks, our workspace collection helps you create an environment where great work happens naturally.</p>
                </div>
            </section>

            <!-- Journey Section 6: Outdoor -->
            <section class="pdf-section alternate">
                <div class="section-header">
                    <span class="section-number">06</span>
                    <h3 class="section-title">Outdoor Living</h3>
                    <span class="section-category">OUTDOOR</span>
                </div>
                <div class="section-split">
                    <div class="section-image-half">
                        <img src="unnamed.jpg" alt="Outdoor furniture">
                    </div>
                    <div class="section-content-half">
                        <p class="section-text-large">Extend your living space outdoors with weather-resistant furniture designed for comfort and style.</p>
                        <p class="section-text">Our outdoor collections blur the line between interior and exterior living, featuring materials that withstand the elements while maintaining their beauty season after season.</p>
                    </div>
                </div>
            </section>

            <!-- Journey Section 7: Lighting -->
            <section class="pdf-section">
                <div class="section-header">
                    <span class="section-number">07</span>
                    <h3 class="section-title">Lighting & Ambiance</h3>
                    <span class="section-category">LIGHTING</span>
                </div>
                <div class="section-image-large">
                    <img src="unnamed.jpg" alt="Lighting solutions">
                </div>
                <div class="section-content">
                    <p class="section-text-large">Set the perfect mood with our designer lighting collection featuring contemporary and classic styles. Light transforms spaces, creating atmosphere and highlighting the beauty of your carefully chosen furniture.</p>
                    <p class="section-text">From statement chandeliers to subtle accent lighting, our collection offers pieces that are as functional as they are beautiful.</p>
                </div>
            </section>

            <!-- Journey Section 8: Accessories -->
            <section class="pdf-section alternate">
                <div class="section-header">
                    <span class="section-number">08</span>
                    <h3 class="section-title">Finishing Touches</h3>
                    <span class="section-category">ACCESSORIES</span>
                </div>
                <div class="section-split reverse">
                    <div class="section-content-half">
                        <p class="section-text-large">Complete your interior with carefully selected accessories, textiles, and decorative pieces.</p>
                        <p class="section-text">The details make the difference. Our accessory collection includes handpicked items that add personality, warmth, and character to your spaces.</p>
                    </div>
                    <div class="section-image-half">
                        <img src="unnamed.jpg" alt="Home accessories">
                    </div>
                </div>
            </section>

            <!-- Insights Section -->
            <section class="pdf-insights">
                <div class="insights-header">
                    <h3 class="insights-title">Your Style Profile</h3>
                    <p class="insights-subtitle">These selections are based on your unique preferences</p>
                </div>
                <div class="insights-cards">
                    <div class="insight-item">
                        <div class="insight-icon-box">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </div>
                        <h4 class="insight-title-text">Style Match</h4>
                        <p class="insight-description">Contemporary minimalist design with clean lines and neutral tones</p>
                    </div>
                    <div class="insight-item">
                        <div class="insight-icon-box">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        </div>
                        <h4 class="insight-title-text">Quality Focus</h4>
                        <p class="insight-description">Premium materials and craftsmanship for lasting investment pieces</p>
                    </div>
                    <div class="insight-item">
                        <div class="insight-icon-box">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                        </div>
                        <h4 class="insight-title-text">Timely Updates</h4>
                        <p class="insight-description">New arrivals and exclusive offers tailored to your taste</p>
                    </div>
                </div>
            </section>

            <!-- Closing Section -->
            <section class="pdf-closing">
                <div class="closing-content">
                    <h3 class="closing-title">Next Steps</h3>
                    <p class="closing-text">We invite you to visit our showroom to experience these pieces in person, or contact our design consultants to discuss your project in detail.</p>
                    <div class="closing-contact">
                        <div class="contact-item">
                            <span class="contact-label">Showroom</span>
                            <a href="https://www.fcilondon.co.uk/book-a-showroom-visit.html" target="_blank" class="appointment-btn">Book an Appointment</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Email Modal -->
    <div id="emailModal" class="modal">
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h3 class="modal-title">Save & Email Your Selection</h3>
            <p class="modal-description">Enter your details to receive this personalized selection</p>
            <form id="emailForm" class="email-form">
                <div class="form-field">
                    <label for="firstNameInput" class="form-label">First Name <span class="required-indicator">*</span></label>
                    <input type="text" id="firstNameInput" class="email-input" placeholder="First Name" required>
                </div>
                <div class="form-field">
                    <label for="emailInput" class="form-label">Email <span class="required-indicator">*</span></label>
                    <input type="email" id="emailInput" class="email-input" placeholder="Email" required>
                </div>
                <div class="form-field">
                    <label for="phoneInput" class="form-label">Phone Number <span class="required-indicator">*</span></label>
                    <input type="tel" id="phoneInput" class="email-input" placeholder="Phone Number" required>
                </div>
                <div class="form-field checkbox-field">
                    <label class="checkbox-label">
                        <input type="checkbox" id="privacyCheckbox" required>
                        <span class="checkbox-text"><a href="/privacy-policy.html" target="_blank"><u>Privacy Policy agreed</u></a> <span class="required-indicator">*</span></span>
                    </label>
                </div>
                <button type="submit" class="email-submit">SEND TO EMAIL</button>
            </form>
            <div id="emailStatus" class="email-status"></div>
        </div>
    </div>

    <!-- Image Lightbox Modal -->
    <div id="imageLightbox" class="lightbox">
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightboxImage">
        <div class="lightbox-caption" id="lightboxCaption"></div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="pdf-generator.js"></script>
    <script src="email-generator.js?v=9"></script>
    <script src="newsletter.js?v=13"></script>
</body>

</html>