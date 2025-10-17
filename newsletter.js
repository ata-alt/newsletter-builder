// Newsletter page functionality

// DOM elements
const saveEmailBtn = document.getElementById('saveEmailBtn');
const emailModal = document.getElementById('emailModal');
const modalClose = document.querySelector('.modal-close');
const emailForm = document.getElementById('emailForm');
const firstNameInput = document.getElementById('firstNameInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const privacyCheckbox = document.getElementById('privacyCheckbox');
const emailStatus = document.getElementById('emailStatus');

// Load newsletter content on page load
function loadNewsletterContent() {
  // Get newsletter data from sessionStorage
  const newsletterDataStr = sessionStorage.getItem('newsletterData');

  if (!newsletterDataStr) {
    console.warn('No newsletter data found');
    return;
  }

  try {
    const response = JSON.parse(newsletterDataStr);
    console.log('Newsletter data loaded:', response);

    // Extract newsletter content from the webhook response structure
    let newsletterData;
    if (Array.isArray(response) && response.length > 0) {
      // Get the data object from the first array element
      // Check if response has output wrapper (n8n format)
      const dataObj = response[0].output || response[0];
      newsletterData = dataObj.data || dataObj;
    } else {
      // Check if response has output wrapper (n8n format)
      const dataObj = response.output || response;
      newsletterData = dataObj.data || dataObj;
    }

    console.log('Extracted newsletter data:', newsletterData);

    // Update the page with the newsletter content
    if (newsletterData && newsletterData.products) {
      updateNewsletterPage(newsletterData);
    }
  } catch (error) {
    console.error('Error loading newsletter:', error);
  }
}

// Update the newsletter page with dynamic content
function updateNewsletterPage(content) {
  console.log('Updating newsletter page with:', content);
  console.log('Content type:', typeof content);
  console.log('Has products?', content.products);

  // If content is a string, it means we got the wrong data
  if (typeof content === 'string') {
    console.error(
      'Content is a string, not an object. Newsletter data not properly stored.'
    );
    return;
  }

  // Update products sections (dynamic count based on products available)
  if (content.products && Array.isArray(content.products)) {
    console.log('Found products:', content.products.length);

    // Get all pdf-section elements (the 8 main sections)
    const sections = document.querySelectorAll('.pdf-section');

    // Update sections with products and hide unused sections
    content.products.forEach((product, index) => {
      if (index < sections.length) {
        console.log(
          `Updating section ${index + 1} with product:`,
          product.product_name
        );
        updateSection(sections[index], product, index + 1);
        // Make sure the section is visible
        sections[index].style.display = '';
      }
    });

    // Hide sections that don't have products
    for (let i = content.products.length; i < sections.length; i++) {
      console.log(`Hiding unused section ${i + 1}`);
      sections[i].style.display = 'none';
    }
  } else {
    console.warn('No products array found in content');
  }

  // Update insights section if available
  if (content.insights && Object.keys(content.insights).length > 0) {
    console.log('Found insights');
    updateInsightsSection(content.insights);
  }

  // Re-initialize lightbox for dynamically loaded images
  if (typeof initializeLightbox === 'function') {
    initializeLightbox();
  }
}

// Update a single section with product data
function updateSection(section, product, sectionNumber) {
  // Update section number
  const sectionNumberElement = section.querySelector('.section-number');
  if (sectionNumberElement) {
    sectionNumberElement.textContent = String(sectionNumber).padStart(2, '0');
  }

  // Update section title
  const sectionTitle = section.querySelector('.section-title');
  if (sectionTitle) {
    sectionTitle.textContent = product.product_name;

    // Make section title clickable if product_url (product page URL) exists
    if (product.product_url) {
      // Remove existing link wrapper if any
      const existingLink = sectionTitle.closest('a');
      if (existingLink) {
        existingLink.remove();
      }

      // Create a clickable link
      const baseUrl = 'https://www.fcilondon.co.uk';
      const fullUrl = product.product_url.startsWith('http')
        ? product.product_url
        : `${baseUrl}${product.product_url}`;

      sectionTitle.style.cursor = 'pointer';
      sectionTitle.style.transition = 'color 0.3s ease';
      sectionTitle.dataset.productUrl = fullUrl;

      // Add hover effect
      sectionTitle.addEventListener('mouseenter', function () {
        this.style.color = '#666';
      });
      sectionTitle.addEventListener('mouseleave', function () {
        this.style.color = '';
      });

      // Add click handler
      sectionTitle.addEventListener('click', function (e) {
        e.preventDefault();
        window.open(fullUrl, '_blank');
      });
    }
  }

  // Update section category
  const sectionCategory = section.querySelector('.section-category');
  if (sectionCategory) {
    sectionCategory.textContent = product.category || 'FURNITURE';
  }

  // Update images
  const baseImageUrl = 'https://www.fcilondon.co.uk';
  // image_url contains the actual image path (can be full or short path)
  let imageUrl = null;
  if (product.image_url) {
    let imagePath = product.image_url;
    // If path doesn't include the full directory structure, add it
    if (!imagePath.includes('/site-assets/product-images/')) {
      // Remove leading slash if present to avoid double slashes
      imagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      // Check if path starts with 'product-images/' and add 'site-assets/' prefix
      if (imagePath.startsWith('product-images/')) {
        imagePath = `/site-assets/${imagePath}`;
      } else {
        imagePath = `/site-assets/product-images/${imagePath}`;
      }
    }
    imageUrl = `${baseImageUrl}${imagePath}`;
  }

  // Update large image if exists
  const largeImage = section.querySelector('.section-image-large img');
  if (largeImage && imageUrl) {
    largeImage.src = imageUrl;
    largeImage.alt = product.product_name;
    largeImage.onerror = function () {
      console.error('Failed to load image:', imageUrl);
      this.src =
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80';
    };
  }

  // Update half image if exists
  const halfImage = section.querySelector('.section-image-half img');
  if (halfImage && imageUrl) {
    halfImage.src = imageUrl;
    halfImage.alt = product.product_name;
    halfImage.onerror = function () {
      console.error('Failed to load image:', imageUrl);
      this.src =
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80';
    };
  }

  // Update section content text
  const sectionTextLarge = section.querySelector('.section-text-large');
  const sectionText = section.querySelectorAll('.section-text');

  // Use first_sentence for the large text and remaining_description for the main text
  const firstSentence = product.first_sentence || '';
  const remainingDescription = product.remaining_description || '';

  if (sectionTextLarge) {
    // First paragraph - highlighted (plain text, no HTML)
    sectionTextLarge.textContent = firstSentence;
  }

  if (sectionText.length > 0) {
    // Main description text (plain text, no HTML)
    sectionText[0].textContent = remainingDescription;

    // Add price and brand info in second paragraph
    if (sectionText.length > 1) {
      const priceText =
        product.price &&
        product.price !== 'Not specified' &&
        product.price !== 'N/A' &&
        product.price !== ''
          ? `Price: £${product.price}`
          : '';
      const brandText = product.brand_name
        ? `Brand: ${product.brand_name}`
        : '';
      sectionText[1].textContent = `${priceText}${
        priceText && brandText ? ' | ' : ''
      }${brandText}`;
    }
  }

  // Remove any existing "View Product" button/link if it exists
  const existingViewProductLink = section.querySelector('.view-product-link');
  if (existingViewProductLink) {
    existingViewProductLink.remove();
  }
}

// Update insights section
function updateInsightsSection(insights) {
  const insightItems = document.querySelectorAll('.insight-item');
  const insightKeys = Object.keys(insights);

  insightKeys.forEach((key, index) => {
    if (index < insightItems.length) {
      const item = insightItems[index];
      const titleElement = item.querySelector('.insight-title-text');
      const descElement = item.querySelector('.insight-description');

      if (titleElement) {
        titleElement.textContent = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }
      if (descElement) {
        descElement.textContent = insights[key];
      }
    }
  });
}

// Create product card element (from product data)
function createProductCard(product, isFeatured = false) {
  const articleElement = document.createElement('article');
  articleElement.className = `article-card ${isFeatured ? 'featured' : ''}`;

  const imageDiv = document.createElement('div');
  imageDiv.className = 'article-image';
  const img = document.createElement('img');

  // Construct full image URL
  const baseImageUrl =
    'https://www.fcilondon.co.uk/site-assets/product-images/';
  const imageUrl = product.product_image
    ? `${baseImageUrl}${product.product_image}`
    : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80';

  console.log('Loading image:', imageUrl);
  img.src = imageUrl;
  img.alt =
    product.product_image_alt || product.product_name || 'Product image';
  img.onerror = function () {
    console.error('Failed to load image:', imageUrl);
    this.src =
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80';
  };
  img.onload = function () {
    console.log('Successfully loaded image:', imageUrl);
  };
  imageDiv.appendChild(img);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'article-content';

  const category = document.createElement('span');
  category.className = 'article-category';
  category.textContent =
    product.brand_display_name || product.brand_name || 'FEATURED';

  const title = document.createElement('h3');
  title.className = 'article-title';
  title.textContent = product.product_name || 'Product';

  const excerpt = document.createElement('p');
  excerpt.className = 'article-excerpt';
  // Truncate description to first 150 characters
  const description = product.product_description || '';
  excerpt.textContent =
    description.length > 150
      ? description.substring(0, 150) + '...'
      : description;

  const price = document.createElement('p');
  price.className = 'article-price';
  price.style.cssText =
    'font-weight: 600; color: #000; margin: 10px 0; font-size: 1.1rem;';
  if (product.product_price) {
    price.textContent = `£${product.product_price.toLocaleString()}`;
  }

  const link = document.createElement('a');
  link.className = 'article-link';
  link.href =
    `https://www.fcilondon.co.uk/site-assets/product-images/${product.product_image}` ||
    '#';
  link.target = '_blank';
  link.textContent = 'View Product →';

  contentDiv.appendChild(category);
  contentDiv.appendChild(title);
  contentDiv.appendChild(excerpt);
  if (product.product_price) {
    contentDiv.appendChild(price);
  }
  contentDiv.appendChild(link);

  articleElement.appendChild(imageDiv);
  articleElement.appendChild(contentDiv);

  return articleElement;
}

// Create insight card element
function createInsightCard(insight) {
  const insightElement = document.createElement('div');
  insightElement.className = 'insight-card';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'insight-icon';
  iconDiv.innerHTML =
    insight.icon ||
    `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
    </svg>`;

  const title = document.createElement('h4');
  title.className = 'insight-title';
  title.textContent = insight.title || 'Insight';

  const text = document.createElement('p');
  text.className = 'insight-text';
  text.textContent = insight.text || insight.description || '';

  insightElement.appendChild(iconDiv);
  insightElement.appendChild(title);
  insightElement.appendChild(text);

  return insightElement;
}

// Initialize newsletter content on page load
document.addEventListener('DOMContentLoaded', () => {
  loadNewsletterContent();
});

// Download PDF button functionality
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Change button text to show it's working
    const originalText = downloadPdfBtn.innerHTML;
    downloadPdfBtn.innerHTML = '<span>Preparing images...</span>';
    downloadPdfBtn.disabled = true;

    try {
      // Short delay to show the preparing message
      await new Promise((resolve) => setTimeout(resolve, 100));
      downloadPdfBtn.innerHTML = '<span>Generating PDF...</span>';
      await generatePDF(true); // true = download only
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Restore button
      downloadPdfBtn.innerHTML = originalText;
      downloadPdfBtn.disabled = false;
    }
  });
}

// Open modal when "Save & Email" is clicked
if (saveEmailBtn) {
  saveEmailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    emailModal.classList.add('active');
    firstNameInput.focus();
  });
}

// Close modal when X is clicked
if (modalClose) {
  modalClose.addEventListener('click', () => {
    emailModal.classList.remove('active');
    emailForm.reset();
    emailStatus.textContent = '';
    emailStatus.className = 'email-status';
  });
}

// Close modal when clicking outside
if (emailModal) {
  emailModal.addEventListener('click', (e) => {
    if (e.target === emailModal) {
      emailModal.classList.remove('active');
      emailForm.reset();
      emailStatus.textContent = '';
      emailStatus.className = 'email-status';
    }
  });
}

// Handle form submission
if (emailForm) {
  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = firstNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const privacyAgreed = privacyCheckbox.checked;

    // Validate all required fields
    if (!firstName) {
      showEmailStatus('Please enter your first name', 'error');
      return;
    }

    if (!email) {
      showEmailStatus('Please enter a valid email address', 'error');
      return;
    }

    if (!phone) {
      showEmailStatus('Please enter your phone number', 'error');
      return;
    }

    if (!privacyAgreed) {
      showEmailStatus('Please agree to the privacy policy', 'error');
      return;
    }

    // Disable submit button during processing
    const submitBtn = emailForm.querySelector('.email-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'GENERATING PDF...';

    try {
      // Generate PDF as blob
      showEmailStatus('Generating PDF...', 'info');
      const pdfBlob = await generatePDF(false);

      if (!pdfBlob) {
        throw new Error('Failed to generate PDF');
      }

      submitBtn.textContent = 'SENDING...';
      showEmailStatus('Sending to your email...', 'info');

      // Capture the HTML content
      const htmlContent = captureHTMLContent();

      // Convert PDF blob to base64 for sending
      const reader = new FileReader();
      const base64PDF = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // TODO: Replace with your actual API endpoint
      const webhookUrl =
        'https://n8n.srv983823.hstgr.cloud/webhook/save-newsletter';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          email: email,
          phone: phone,
          privacyAgreed: privacyAgreed,
          timestamp: new Date().toISOString(),
          selection: 'personalized-newsletter',
          htmlContent: htmlContent,
          pdfBase64: base64PDF,
          newsletterData: sessionStorage.getItem('newsletterData'),
        }),
      });

      if (response.ok) {
        showEmailStatus('Successfully sent to your email!', 'success');
        setTimeout(() => {
          emailModal.classList.remove('active');
          emailForm.reset();
          emailStatus.textContent = '';
          emailStatus.className = 'email-status';
        }, 2000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      showEmailStatus('Failed to send. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SEND TO EMAIL';
    }
  });
}

// Show status message
function showEmailStatus(message, type) {
  emailStatus.textContent = message;
  emailStatus.className = `email-status ${type}`;

  if (type === 'error') {
    setTimeout(() => {
      emailStatus.textContent = '';
      emailStatus.className = 'email-status';
    }, 3000);
  }
}

// Add smooth scroll behavior for article links
document.querySelectorAll('.article-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    // If links point to actual pages, remove preventDefault
    // For now, they're placeholder links
    e.preventDefault();
    console.log(
      'Article link clicked:',
      e.target.closest('.article-card').querySelector('.article-title')
        .textContent
    );
  });
});

// Log page load
console.log('Newsletter page loaded successfully');

// ===== IMAGE LIGHTBOX FUNCTIONALITY =====

// Lightbox elements
const imageLightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');

// Function to open lightbox
function openLightbox(imageSrc, imageAlt) {
  lightboxImage.src = imageSrc;
  lightboxCaption.textContent = imageAlt || '';
  imageLightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to close lightbox
function closeLightbox() {
  imageLightbox.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
  // Clear image after animation
  setTimeout(() => {
    lightboxImage.src = '';
    lightboxCaption.textContent = '';
  }, 300);
}

// Add click listeners to all section images
function initializeLightbox() {
  // Select all images in sections
  const sectionImages = document.querySelectorAll(
    '.section-image-large img, .section-image-half img'
  );

  sectionImages.forEach((img) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });
}

// Close lightbox when clicking the close button
if (lightboxClose) {
  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
}

// Close lightbox when clicking outside the image
if (imageLightbox) {
  imageLightbox.addEventListener('click', (e) => {
    if (e.target === imageLightbox) {
      closeLightbox();
    }
  });
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageLightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// Initialize lightbox on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeLightbox();
});
