<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Personalized Selection - FCI London</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="newsletter.css?v=6">
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
            <!-- Hero Section with Image -->
            <section class="pdf-hero">
                <div class="hero-split">
                    <div class="hero-image">
                        <img src="unnamed.jpg" alt="Luxury living room" id="heroImage">
                    </div>
                    <div class="hero-content">
                        <h1 class="hero-title">
                            Your Personalised<br>
                            <span class="hero-title-italic" id="handbookType">Leather Sofa</span> Handbook
                        </h1>
                        <p class="hero-subtitle">Expert insights from London's largest luxury showroom.</p>
                    </div>
                </div>
            </section>

            <!-- Cover Section -->
            <section class="pdf-cover">
                <div class="pdf-cover-text">
                    <h2 style="font-size: 2.5rem; font-weight: 400; color: #000000; margin-bottom: 32px; text-align: right; letter-spacing: -0.01em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                        Introducing our<br>top picks for you
                    </h2>
                    <p class="pdf-intro" id="coverIntro">Hello there,<br><br>How delightful to hear you're in the market for <span>exceptional furniture.</span> Clearly, you've got your priorities straight. Before we dive into the details, here's a quick look at our top picks for you.</p>
                    <!-- Product Preview Grid -->
                    <div id="productPreviewContainer">
                        <!-- First Row: 3 images -->
                        <div class="productRow">
                            <div class="wide"><img src="unnamed.jpg" alt="Product 1"></div>
                            <div class="wide"><img src="unnamed.jpg" alt="Product 2"></div>
                            <div class="narrow"><img src="unnamed.jpg" alt="Product 3"></div>
                        </div>

                        <!-- Second Row: 4 images -->
                        <div class="productRow">
                            <div class="narrow"><img src="unnamed.jpg" alt="Product 4"></div>
                            <div class="wide"><img src="unnamed.jpg" alt="Product 5"></div>
                            <div class="narrow"><img src="unnamed.jpg" alt="Product 6"></div>
                            <div class="narrow"><img src="unnamed.jpg" alt="Product 7"></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tips Section -->
            <section class="pdf-section alternate">
                <div style="max-width: 800px; margin: 0 auto;">
                    <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 48px;">
                        Now, before we dive into my carefully curated selection, let me share a few insider secrets that will save you both time and potential disappointment. These are the sorts of things I tell my clients over champagne at the showroom. Consider yourself part of the inner circle.
                    </p>

                    <h3 style="font-size: 2.25rem; font-weight: 400; color: #000000; margin-bottom: 48px; text-align: center; letter-spacing: -0.01em;">
                        Five Essential Tips for Choosing Your Perfect<br><span id="tipsCategory">Furniture</span>
                    </h3>

                    <div id="tipsContent">
                        <!-- Tips will be dynamically inserted here, or default tips -->
                        <div style="margin-bottom: 40px;">
                            <h4 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 12px;">1 - The Leather Litmus Test</h4>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333;">
                                Not all furniture is created equal. Premium materials and expert craftsmanship ensure your investment stands the test of time, developing character and beauty with age.
                            </p>
                        </div>

                        <div style="margin-bottom: 40px;">
                            <h4 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 12px;">2 - Module Mathematics</h4>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333;">
                                Measure twice, order once. But here's the clever bit: always order one extra ottoman or corner piece. Trust me, the day will come when you're hosting and think "If only i had one more section". Future you will thank present you.
                            </p>
                        </div>

                        <div style="margin-bottom: 40px;">
                            <h4 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 12px;">3 - The Sit Test</h4>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333;">
                                Never buy furniture without experiencing it in person. Spend at least ten minutes testing comfort, build quality, and how it feels in use. Any reputable dealer will understand completely.
                            </p>
                        </div>

                        <div style="margin-bottom: 40px;">
                            <h4 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 12px;">4 - Frame Fundamentals</h4>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333;">
                                Quality frames are essential. Look for kiln-dried hardwood or premium engineered materials. If they can't tell you what the frame is made of, walk away. A beautiful piece on a poor frame simply won't hold up.
                            </p>
                        </div>

                        <div>
                            <h4 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 12px;">5 - Lifestyle Reality Check</h4>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333;">
                                Consider how you actually live, not how you think you should live. Choose furniture that enhances your daily routine and complements your genuine lifestyle needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            <!-- Products Section - All products in one section -->
            <section class="pdf-section products-section">
                <!-- Bespoke Selection Header -->

                <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                    <h3 style="font-size: 2.5rem; font-weight: 300; color: #000000; margin-bottom: 10px; letter-spacing: -0.02em;">
                        Your Bespoke Selection
                    </h3>
                    <p style="font-size: 1.125rem; line-height: 1.9; color: #333333;" id="bespoke Selection Intro">
                        Based on your preferences <span id="preferences">furniture</span>, I've selected five exceptional pieces that tick every box, and then some.
                    </p>
                </div>
                <!-- Product 1 - Title Center, Image Left + Text Right -->
                <div class="product-item" style="max-width: 1100px; margin: 0 auto;">
                    <h3 class="product-title-link" style="font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                        <span style="font-size: 2.75rem; font-weight: 300; color: #d0d0d0; margin-right: 16px;">1</span>– Product Name
                    </h3>
                    <div class="section-split" style="gap: 56px; align-items: flex-start;">
                        <div class="section-image-half">
                            <img src="unnamed.jpg" alt="Product image">
                        </div>
                        <div class="section-content-half">
                            <p class="section-text-large">The Italians do many things well, but this is pure poetry in craftsmanship.</p>
                            <p class="section-text">Exceptional design meets timeless elegance. This carefully selected piece represents the perfect balance of form and function, crafted with premium materials and attention to detail that defines luxury furniture.</p>
                        </div>
                    </div>
                </div>

                <!-- Product 2 - Title Center, Full Width Image + Text Below -->
                <div class="product-item" style="max-width: 1100px; margin: 0 auto;">
                    <h3 class="product-title-link" style="font-size: 2.25rem; font-weight: 400; color: #000000;  text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                        <span style="font-size: 2.75rem; font-weight: 300; color: #d0d0d0; margin-right: 16px;">2</span>– Product Name
                    </h3>
                    <div class="section-image-large" style="margin-bottom: 40px;">
                        <img src="unnamed.jpg" alt="Product image">
                    </div>
                    <div style="max-width: 900px; margin: 0 auto;">
                        <p class="section-text-large">The Italians do many things well, but this is pure poetry in craftsmanship.</p>
                        <p class="section-text" style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c;">
                            Dutch precision meets unbridled comfort. This piece offers that rare combination of sink-in softness with proper support. The system is brilliantly intuitive, featuring exceptional materials and craftsmanship. Available in multiple configurations, including options that age beautifully over time.
                        </p>
                    </div>
                </div>

                <!-- Product 3 - Image Left + Title/Text Right -->
                <div class="product-item" style="max-width: 1100px; margin: 0 auto 80px;">
                    <div class="section-split" style="gap: 56px; align-items: flex-start;">
                        <div class="section-image-half" style="flex: 1;">
                            <img src="unnamed.jpg" alt="Product image">
                        </div>
                        <div style="flex: 1; padding-top: 0;">
                            <h3 class="product-title-link" style="font-size: 2.25rem; font-weight: 400; color: #000000; margin-bottom: 28px; letter-spacing: -0.005em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                                <span style="font-size: 2.75rem; font-weight: 300; color: #d0d0d0; margin-right: 16px;">3</span>– Product Name
                            </h3>
                            <p class="section-text-large">The Italians do many things well, but this is pure poetry in craftsmanship.</p>
                            <p class="section-text" style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; margin-bottom: 16px;">
                                If James Bond furnished a flat, this would be his choice. Sleek and sophisticated. The materials are treated with advanced technology making it virtually stain-proof. Perfect for those who like their style impeccable.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Product 4 - Full Width Image + Title Below Centered -->
                <div class="product-item" style="max-width: 1100px; margin: 0 auto;">
                    <div class="section-image-large">
                        <img src="unnamed.jpg" alt="Product image">
                    </div>
                    <h3 class="product-title-link" style="font-size: 2.25rem; font-weight: 400; color: #000000;  text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                        <span style="font-size: 2.75rem; font-weight: 300; color: #d0d0d0; margin-right: 16px;">4</span>– Product Name
                    </h3>
                    <div style="max-width: 900px; margin: 0 auto;">
                        <p class="section-text-large">The Italians do many things well, but this is pure poetry in craftsmanship.</p>
                        <p class="section-text" style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c;">
                            Contemporary design at its finest. This system offers multiple configurations, from standard arrangements to ingenious modular sections. Features advanced cushioning that somehow manages to be both cloud-soft and supportive, perfect for any interior.
                        </p>
                    </div>
                </div>

                <!-- Product 5 - Full Width Image + Title Below -->
                <div class="product-item" style="max-width: 1100px; margin: 0 auto 80px;">
                    <div class="section-image-large">
                        <img src="unnamed.jpg" alt="Product image">
                    </div>
                    <h3 class="product-title-link" style="font-size: 2.25rem; font-weight: 400; color: #000000;  text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                        <span style="font-size: 2.75rem; font-weight: 300; color: #d0d0d0; margin-right: 16px;">5</span>– Product Name
                    </h3>
                    <div style="max-width: 900px; margin: 0 auto;">
                        <p class="section-text-large">The Italians do many things well, but this is pure poetry in craftsmanship.</p>
                        <p class="section-text" style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c;">
                            The dark horse of the collection. Less well-known outside design circles, but absolutely worthy of your attention. This piece's party trick? Innovation that adapts to different users. Revolutionary engineering meets timeless aesthetics, really.
                        </p>
                    </div>
                </div>

                <!-- Product 6 - Title Center, Image Left + Text Right -->
                <div class="product-item" style="max-width: 1100px; margin: 0 auto;">
                    <h3 class="product-title-link" style="font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                        <span style="font-size: 2.75rem; font-weight: 300; color: #d0d0d0; margin-right: 16px;">6</span>– Product Name
                    </h3>
                    <div class="section-split" style="display: flex; gap: 60px; align-items: flex-start; flex-wrap: wrap;">
                        <div class="section-image-half" style="flex: 1; min-width: 320px; max-width: 50%; height: auto; overflow: hidden; background-color: #ffffff;">
                            <img src="unnamed.jpg" alt="Product image">
                        </div>
                        <div class="section-content-half" style="flex: 1; min-width: 300px;">
                            <p class="section-text-large">The Italians do many things well, but this is pure poetry in craftsmanship.</p>
                            <p class="section-text" style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; margin-bottom: 24px;">
                                An exceptional piece that combines elegance with functionality.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Product 7 - Title Center, Full Width Image + Text Below -->
                <div class="product-item" style="max-width: 1100px; margin: 0 auto;">
                    <h3 class="product-title-link" style="font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', 'Georgia', 'Times New Roman', serif;">
                        <span style="font-size: 2.75rem; font-weight: 300; color: #d0d0d0; margin-right: 16px;">7</span>– Product Name
                    </h3>
                    <div class="section-image-large" style="margin-bottom: 40px;">
                        <img src="unnamed.jpg" alt="Product image">
                    </div>
                    <div style="max-width: 900px; margin: 0 auto;">
                        <p class="section-text-large">The Italians do many things well, but this is pure poetry in craftsmanship.</p>
                        <p class="section-text" style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c;">
                            A remarkable addition to any collection, showcasing exceptional craftsmanship and timeless design.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Brand Spotlight Section -->
            <section class="pdf-section">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h3 style="font-size: 2.5rem; font-weight: 300; color: #000000; margin-bottom: 24px; text-align: center; letter-spacing: -0.02em;">
                        Brand Spotlight: Your Perfect Match
                    </h3>
                    <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 60px; text-align: center;">
                        Given your requirements, two brands stand head and shoulders above the rest. Allow me to elaborate on why these should be at the top of your list.
                    </p>

                    <div id="brandSpotlightContent">
                        <!-- Brand spotlights will be inserted here, or default content -->

                        <!-- Brand 1: Gamma & Dandy -->
                        <div style="margin-bottom: 60px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                                <h4 style="font-size: 1.75rem; font-weight: 400; color: #000000; margin: 0;">1 - Gamma & Dandy</h4>
                                <img src="unnamed.jpg" alt="Gamma & Dandy Logo" style="height: 40px; object-fit: contain;">
                            </div>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;">
                                In the forty years I've been specifying furniture, Gamma has never once disappointed. They're the Hermès of the sofa world: uncompromising on quality, innovative without being gimmicky, and their leather processing is genuinely unmatched.
                            </p>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;">
                                What sets them apart? Their 'Soft Touch' leather treatment creates a surface that's both butter-soft and remarkably durable. They also offer a bespoke service where you can adjust depths, heights, and even cushion firmness. Yes, it's an investment, but consider cost-per-sit over the next decade, and suddenly it seems rather reasonable.
                            </p>
                            <p style="font-size: 1rem; line-height: 1.8; color: #666666; font-style: italic; padding-left: 24px; border-left: 3px solid #000000; margin-top: 32px;">
                                <strong>Insider tip:</strong> Ask to see their limited edition leathers. They don't advertise these, but they're absolutely extraordinary, and only marginally more expensive than their standard range.
                            </p>
                        </div>

                        <!-- Brand 2: Ditre Italia -->
                        <div style="margin-bottom: 60px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                                <h4 style="font-size: 1.75rem; font-weight: 400; color: #000000; margin: 0;">2 - Ditre Italia</h4>
                                <img src="unnamed.jpg" alt="Ditre Italia Logo" style="height: 40px; object-fit: contain;">
                            </div>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;">
                                The thinking person's choice. While everyone else is chasing the latest trends, Ditre quietly creates exceptional furniture that works brilliantly forever. They're particularly clever with their modular systems. The engineering is impeccable.
                            </p>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;">
                                Their leather comes from the same region as many luxury fashion houses (though they'd never be so vulgar as to mention which ones). The quality is exceptional, and they offer a ten-year warranty on both frame and leather, almost unheard of in this industry.
                            </p>
                            <p style="font-size: 1rem; line-height: 1.8; color: #666666; font-style: italic; padding-left: 24px; border-left: 3px solid #000000; margin-top: 32px;">
                                <strong>Insider tip:</strong> Ditre's lead times are typically 8-10 weeks, significantly faster than most Italian manufacturers. If you're in a hurry (though good taste should never be rushed), they're your best bet.
                            </p>
                        </div>

                        <!-- A Note on Investment Furniture -->
                        <div style="margin-bottom: 40px;">
                            <h4 style="font-size: 1.5rem; font-weight: 600; color: #000000; margin-bottom: 16px;">A Note on Investment Furniture</h4>
                            <p style="font-size: 1.125rem; line-height: 1.9; color: #333333;">
                                Quality leather modulars from these brands typically range from £8,000 to £25,000, depending on configuration and leather selection. Yes, it's a significant investment. But divide that by the 5,000-plus evenings you'll spend on it over the next decade, and suddenly we're talking about £1.60 per night of sublime comfort. Rather puts things in perspective, doesn't it?
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Showroom Strategy Section -->
            <section class="pdf-section alternate">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h3 style="font-size: 2.5rem; font-weight: 300; color: #000000; margin-bottom: 24px; text-align: center; letter-spacing: -0.02em;">
                        Your Showroom Strategy
                    </h3>
                    <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 60px; text-align: center;">
                        I understand you'll be doing the rounds, and quite right too. This is not a decision to be taken lightly. To ensure you make the most of your showroom visits, I've prepared your essential reconnaissance kit.
                    </p>

                    <div style="margin-bottom: 60px;">
                        <h4 style="font-size: 1.75rem; font-weight: 400; color: #000000; margin-bottom: 32px;">Questions to Ask (The Ones That Really Matter)</h4>

                        <div style="margin-bottom: 32px;">
                            <p style="font-size: 1.125rem; font-weight: 600; color: #000000; margin-bottom: 12px;">"What's the frame made of, specifically?"</p>
                            <p style="font-size: 1rem; line-height: 1.8; color: #666666; padding-left: 20px;">
                                If they waffle or say "quality wood," dig deeper. You want specifics: kiln-dried hardwood, steel reinforcements, etc.
                            </p>
                        </div>

                        <div style="margin-bottom: 32px;">
                            <p style="font-size: 1.125rem; font-weight: 600; color: #000000; margin-bottom: 12px;">"Can I see the materials in natural light?"</p>
                            <p style="font-size: 1rem; line-height: 1.8; color: #666666; padding-left: 20px;">
                                Showroom lighting is designed to flatter. Take those samples to a window or, better yet, outside.
                            </p>
                        </div>

                        <div style="margin-bottom: 32px;">
                            <p style="font-size: 1.125rem; font-weight: 600; color: #000000; margin-bottom: 12px;">"What's your returns policy if it doesn't fit?"</p>
                            <p style="font-size: 1rem; line-height: 1.8; color: #666666; padding-left: 20px;">
                                Even with careful measuring, things happen. Know your options before you commit.
                            </p>
                        </div>

                        <div style="margin-bottom: 32px;">
                            <p style="font-size: 1.125rem; font-weight: 600; color: #000000; margin-bottom: 12px;">"Is this delivered from factory or warehouse?"</p>
                            <p style="font-size: 1rem; line-height: 1.8; color: #666666; padding-left: 20px;">
                                You want factory-fresh, not something that's been sitting in a warehouse for months. Factory delivery means your furniture is made to order, properly wrapped, and hasn't been handled by countless browsers.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 style="font-size: 1.75rem; font-weight: 400; color: #000000; margin-bottom: 32px;">What to Bring to the Showroom</h4>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
                            <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0;">
                                <p style="font-size: 1rem; font-weight: 600; color: #000000; margin-bottom: 8px;">Your room measurements</p>
                                <p style="font-size: 0.9rem; line-height: 1.6; color: #666666;">Including doorways, stairs, and lift dimensions. Don't forget ceiling height.</p>
                            </div>
                            <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0;">
                                <p style="font-size: 1rem; font-weight: 600; color: #000000; margin-bottom: 8px;">Photos of your space</p>
                                <p style="font-size: 0.9rem; line-height: 1.6; color: #666666;">From multiple angles, in different lights. Include existing furniture you're keeping.</p>
                            </div>
                            <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0;">
                                <p style="font-size: 1rem; font-weight: 600; color: #000000; margin-bottom: 8px;">Your lifestyle reality check</p>
                                <p style="font-size: 0.9rem; line-height: 1.6; color: #666666;">Photos of your room on a typical day. Be honest about how you actually live.</p>
                            </div>
                            <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0;">
                                <p style="font-size: 1rem; font-weight: 600; color: #000000; margin-bottom: 8px;">A trusted friend</p>
                                <p style="font-size: 0.9rem; line-height: 1.6; color: #666666;">Someone who'll tell you if you're making a mistake. Preferably someone who's familiar with your space.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Final Thoughts Section -->
            <section class="pdf-section">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h3 style="font-size: 2.5rem; font-weight: 300; color: #000000; margin-bottom: 24px; text-align: center; letter-spacing: -0.02em;">
                        Final Thoughts & Resources
                    </h3>

                    <div style="margin-bottom: 60px;">
                        <h4 style="font-size: 1.75rem; font-weight: 400; color: #000000; margin-bottom: 24px;">A Personal Note</h4>
                        <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;">
                            After decades in this business, I've learned that the perfect furniture isn't just about aesthetics or even comfort. It's about finding something that enhances your life. The right pieces should adapt to your needs, age gracefully with your family, and still make you smile every time you walk into the room.
                        </p>
                        <p style="font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;">
                            Don't rush this decision. Visit the showrooms, experience everything in person, ask the difficult questions. And please, don't let anyone pressure you into a quick decision with "limited time offers". Quality furniture is never truly on sale, and if it is, one rather has to wonder why.
                        </p>
                    </div>

                    <div style="margin-bottom: 60px;">
                        <h4 style="font-size: 1.75rem; font-weight: 400; color: #000000; margin-bottom: 24px;">Useful Resources</h4>

                        <div style="margin-bottom: 32px;">
                            <h5 style="font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; margin-bottom: 16px;">Further Reading</h5>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span> "Modern Furniture: A Design Evolution" - Our latest blog post
                                </li>
                                <li style="font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span> "Care & Maintenance: The Definitive Guide" - Essential reading for furniture owners
                                </li>
                                <li style="font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span> "Space Planning for Your Home" - Includes downloadable templates
                                </li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 32px;">
                            <h5 style="font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; margin-bottom: 16px;">Maintenance Essentials</h5>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span> Protection: Apply quality protection every 6-12 months
                                </li>
                                <li style="font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span> Cleaning: Use only products specifically designed for your materials
                                </li>
                                <li style="font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span> Conditioning: Essential for longevity, like moisturiser for your furniture
                                </li>
                                <li style="font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;">
                                    <span style="position: absolute; left: 0;">•</span> Professional cleaning: Annual deep clean by specialists is worth every penny
                                </li>
                            </ul>
                        </div>

                        <div style="background-color: #fafafa; padding: 32px; margin-top: 40px;">
                            <h5 style="font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; margin-bottom: 16px;">One Final Secret</h5>
                            <p style="font-size: 1rem; line-height: 1.8; color: #333333;">
                                The best time to purchase luxury furniture? January and July. That's when new collections arrive and showrooms need space. You didn't hear it from me, but discounts of 15-20% aren't uncommon if you're confident enough to ask. Simply enquire about "ex-display pieces" or "clearance offers". Use those exact phrases, and watch their eyebrows raise with newfound respect.
                            </p>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 60px;">
                        <p style="font-size: 1.25rem; line-height: 1.8; color: #333333; font-style: italic; margin-bottom: 32px;">
                            Here's to finding your perfect match. May your home be beautiful and your style impeccable.
                        </p>
                        <p style="font-size: 1.125rem; color: #000000; margin-bottom: 8px;">
                            Warmest regards,
                        </p>
                        <p style="font-size: 1.125rem; font-weight: 600; color: #000000;">
                            Chloe Rance
                        </p>
                    </div>
                </div>
            </section>

            <!-- Your Style Profile Section -->
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
    <script src="newsletter.js?v=14"></script>
</body>

</html>