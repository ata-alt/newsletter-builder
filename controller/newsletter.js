/**
 * Newsletter.js - Product Data Handler
 *
 * This file handles loading and displaying newsletter data from webhook responses.
 * It extracts product data from sessionStorage and updates the newsletter page dynamically.
 *
 * Key Features:
 * - Robust data extraction supporting multiple response formats
 * - Image URL construction with fallback handling
 * - Modular function design for maintainability
 * - Comprehensive error handling and validation
 * - Console logging for debugging
 *
 * Sections Updated:
 * - Product Items (5 max)
 * - Hero Section
 * - Cover Section
 * - Tips Section
 * - Brand Spotlight
 * - Insights/Style Profile
 */

// ===== DOM ELEMENT REFERENCES =====
const saveEmailBtn = document.getElementById('saveEmailBtn');
const emailModal = document.getElementById('emailModal');
const modalClose = document.querySelector('.modal-close');
const emailForm = document.getElementById('personalised-newsletter');
const firstNameInput = document.getElementById('fname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const privacyCheckbox = document.getElementById('privacyCheckbox');
const emailStatus = document.getElementById('emailStatus');

// ===== CONSTANTS =====
const BASE_IMAGE_URL = 'https://www.fcilondon.co.uk';
const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80';
const MAX_PRODUCTS = 7;

// ===== UTILITY FUNCTIONS =====

/**
 * Safely extracts newsletter data from various response formats
 * @param {string} dataStr - JSON string from sessionStorage
 * @returns {Object|null} Extracted newsletter data or null
 */
function extractNewsletterData(dataStr) {
  if (!dataStr) {
    console.warn('No newsletter data provided');
    return null;
  }

  try {
    const response = JSON.parse(dataStr);

    // Handle array response format
    if (Array.isArray(response) && response.length > 0) {
      const firstItem = response[0];
      return (
        firstItem?.output?.data ||
        firstItem?.data ||
        firstItem?.output ||
        firstItem
      );
    }

    // Handle object response format
    return (
      response?.output?.data || response?.data || response?.output || response
    );
  } catch (error) {
    console.error('Failed to parse newsletter data:', error);
    return null;
  }
}

/**
 * Constructs full image URL with proper path handling
 * @param {string} imagePath - Image path from product data
 * @returns {string} Full image URL
 */
function buildImageUrl(imagePath) {
  if (!imagePath) {
    return FALLBACK_IMAGE_URL;
  }

  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Ensure path starts with /
  let normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Add site-assets prefix if not present
  if (!normalizedPath.includes('/site-assets/')) {
    if (normalizedPath.startsWith('/product-images/')) {
      normalizedPath = `/site-assets${normalizedPath}`;
    } else if (!normalizedPath.startsWith('/site-assets/')) {
      normalizedPath = `/site-assets/product-images${normalizedPath}`;
    }
  }

  return `${BASE_IMAGE_URL}${normalizedPath}`;
}

/**
 * Validates product data structure
 * @param {Object} product - Product object to validate
 * @returns {boolean} True if valid
 */
function isValidProduct(product) {
  return (
    product && typeof product === 'object' && Object.keys(product).length > 0
  );
}

// ===== MAIN LOADER =====

function loadNewsletterContent() {
  const newsletterDataStr = sessionStorage.getItem('newsletterData');
  const newsletterData = extractNewsletterData(newsletterDataStr);

  if (!newsletterData) {
    console.warn('No valid newsletter data found');
    return;
  }

  console.log('Successfully extracted newsletter data:', newsletterData);

  if (newsletterData.products && Array.isArray(newsletterData.products)) {
    updateNewsletterPage(newsletterData);
  } else {
    console.warn('No products array found in newsletter data');
  }
}

// ===== PAGE UPDATER =====

/**
 * Main function to update all newsletter page sections
 * @param {Object} content - Newsletter content data
 */
function updateNewsletterPage(content) {
  if (!content || typeof content !== 'object') {
    console.error(
      'Invalid content format. Expected object, got:',
      typeof content
    );
    return;
  }

  // Update products section
  if (content.products && Array.isArray(content.products)) {
    updateProductsSection(content.products);
  } else {
    console.warn('No products array found in content');
  }

  // Update product preview grid
  if (content.products && Array.isArray(content.products)) {
    updateProductPreviewGrid(content.products);
  }

  // Update other sections (pass products to hero section for category extraction)
  updateHeroSection(content, content.products);
  updateCoverSection(content);
  updateTipsSection(content.tips);
  updateBrandSpotlight(content.brandSpotlight);
  updateInsightsSection(content.insights);
  updateBlogArticles(content.blogArticles);

  // Initialize lightbox for images
  if (typeof initializeLightbox === 'function') {
    initializeLightbox();
  }
}

/**
 * Updates all product items in the newsletter
 * @param {Array} products - Array of product objects
 */
function updateProductsSection(products) {
  console.log(`Found ${products.length} products to display`);

  const productItems = document.querySelectorAll('.product-item');

  if (productItems.length === 0) {
    console.error('No product items found in DOM');
    return;
  }

  console.log(`Found ${productItems.length} product item containers`);

  // Update each product item with data
  products.forEach((product, index) => {
    if (index >= MAX_PRODUCTS) {
      console.warn(
        `Skipping product ${index + 1}: exceeded maximum of ${MAX_PRODUCTS}`
      );
      return;
    }

    if (index < productItems.length && isValidProduct(product)) {
      console.log(
        `Updating product ${index + 1}:`,
        product.product_name || 'Unnamed Product'
      );
      updateProductItem(productItems[index], product, index + 1);
    }
  });

  // Hide unused product items
  for (let i = products.length; i < productItems.length; i++) {
    console.log(`Hiding unused product slot ${i + 1}`);
    productItems[i].style.display = 'none';
  }
}

// ===== PRODUCT UPDATERS =====

/**
 * Updates a single product item with product data
 * @param {HTMLElement} productItem - Product container element
 * @param {Object} product - Product data object
 * @param {number} productNumber - Display number for the product (1-5)
 */
function updateProductItem(productItem, product, productNumber) {
  if (!productItem) {
    console.error('Product item element is null');
    return;
  }

  if (!isValidProduct(product)) {
    console.error('Invalid product data for position', productNumber);
    return;
  }

  // Make sure product item is visible
  productItem.style.display = '';

  // Update product components
  updateProductNumber(productItem, productNumber);
  updateProductTitle(productItem, product);
  updateProductImages(productItem, product);
  updateProductDescriptions(productItem, product);

  console.log(`✓ Product ${productNumber} updated successfully`);
}

/**
 * Updates the product number display
 * @param {HTMLElement} productItem - Product container element
 * @param {number} productNumber - Display number for the product
 */
function updateProductNumber(productItem, productNumber) {
  const numberSpan = productItem.querySelector('h3 span');
  if (numberSpan) {
    numberSpan.textContent = productNumber;
  }
}

/**
 * Updates the product title and adds click handler for product URL
 * @param {HTMLElement} productItem - Product container element
 * @param {Object} product - Product data object
 */
function updateProductTitle(productItem, product) {
  const productTitle = productItem.querySelector('h3.product-title-link');
  if (!productTitle) {
    console.warn('Product title element not found');
    return;
  }

  const productName = product.product_name || 'Untitled Product';
  const titleParts = productTitle.textContent.split('–');

  if (titleParts.length > 0) {
    // Preserve the number part, update the name part
    productTitle.innerHTML = `${titleParts[0]}– ${productName}`;
  } else {
    productTitle.textContent = productName;
  }

  // Add click handler if product URL exists
  if (product.product_url) {
    const fullUrl = buildProductUrl(product.product_url);

    // Store URL in data attribute
    productTitle.dataset.productUrl = fullUrl;

    // Add clickable styling
    productTitle.style.cursor = 'pointer';
    productTitle.style.transition = 'color 0.3s ease';

    // Remove any existing click listeners
    const newTitle = productTitle.cloneNode(true);
    productTitle.parentNode.replaceChild(newTitle, productTitle);

    // Add click event listener
    newTitle.addEventListener('click', function () {
      window.open(fullUrl, '_blank');
      console.log('Opening product URL:', fullUrl);
    });

    // Add hover effects
    newTitle.addEventListener('mouseenter', function () {
      this.style.color = '#666666';
    });

    newTitle.addEventListener('mouseleave', function () {
      this.style.color = '#000000';
    });

    console.log(`Product title made clickable: ${fullUrl}`);
  }
}

/**
 * Builds full product URL from relative path
 * @param {string} productUrl - Product URL path
 * @returns {string} Full product URL
 */
function buildProductUrl(productUrl) {
  if (!productUrl) return '#';

  // If already a full URL, return as is
  if (productUrl.startsWith('http://') || productUrl.startsWith('https://')) {
    return productUrl;
  }

  // Ensure path starts with /
  const normalizedPath = productUrl.startsWith('/')
    ? productUrl
    : `/${productUrl}`;

  return `${BASE_IMAGE_URL}${normalizedPath}`;
}

/**
 * Updates all product images
 * @param {HTMLElement} productItem - Product container element
 * @param {Object} product - Product data object
 */
function updateProductImages(productItem, product) {
  const images = productItem.querySelectorAll('img');

  if (images.length === 0) {
    console.warn('No image elements found in product item');
    return;
  }

  const imageUrl = buildImageUrl(product.image_url);
  const altText = product.product_name || 'Product image';

  images.forEach((img, index) => {
    img.src = imageUrl;
    img.alt = altText;

    // Add error handler for each image
    img.onerror = function () {
      console.error(
        `Failed to load image for ${product.product_name}:`,
        imageUrl
      );
      this.src = FALLBACK_IMAGE_URL;
      this.onerror = null; // Prevent infinite loop
    };

    console.log(`Image ${index + 1} updated:`, imageUrl);
  });
}

/**
 * Updates product descriptions (first sentence and remaining text)
 * @param {HTMLElement} productItem - Product container element
 * @param {Object} product - Product data object
 */
function updateProductDescriptions(productItem, product) {
  // Update large description (first sentence)
  const sectionTextLarge = productItem.querySelector('.section-text-large');
  if (sectionTextLarge) {
    const firstSentence =
      product.first_sentence ||
      'Discover this exceptional piece crafted with attention to detail and quality.';
    sectionTextLarge.textContent = firstSentence;
  }

  // Update regular description (remaining text)
  const sectionText = productItem.querySelector('.section-text');
  if (sectionText) {
    const remainingDescription =
      product.remaining_description ||
      product.product_description ||
      'Contact us for more details about this beautiful piece.';
    sectionText.textContent = remainingDescription;
  }
}

// ===== PRODUCT PREVIEW GRID =====

/**
 * Updates the product preview grid with up to 7 product images
 * @param {Array} products - Array of product objects
 */
function updateProductPreviewGrid(products) {
  const productRows = document.querySelectorAll('.productRow');

  if (productRows.length === 0) {
    console.warn('Product preview grid not found');
    return;
  }

  // Get all image containers from both rows
  const allImageContainers = [];
  productRows.forEach((row) => {
    const containers = row.querySelectorAll('div');
    containers.forEach((container) => allImageContainers.push(container));
  });

  console.log(`Found ${allImageContainers.length} preview image slots`);

  // Determine how many products to show (up to 7 or available slots)
  const productsToShow = Math.min(
    products.length,
    allImageContainers.length,
    MAX_PRODUCTS
  );

  // Update products in the preview grid
  products.slice(0, productsToShow).forEach((product, index) => {
    if (index < allImageContainers.length && isValidProduct(product)) {
      const container = allImageContainers[index];
      const img = container.querySelector('img');

      if (img) {
        const imageUrl = buildImageUrl(product.image_url);
        const altText = product.product_name || `Product ${index + 1}`;

        img.src = imageUrl;
        img.alt = altText;

        img.onerror = function () {
          console.error(
            `Failed to load preview image for ${product.product_name}:`,
            imageUrl
          );
          this.src = FALLBACK_IMAGE_URL;
          this.onerror = null;
        };

        // Make container clickable to scroll to product details
        container.style.cursor = 'pointer';
        container.dataset.productIndex = index + 1;

        // Remove existing click handlers
        const newContainer = container.cloneNode(true);
        container.parentNode.replaceChild(newContainer, container);

        // Add click handler to scroll to corresponding product
        newContainer.addEventListener('click', function () {
          const productIndex = parseInt(this.dataset.productIndex);
          const productItems = document.querySelectorAll('.product-item');

          if (productIndex > 0 && productIndex <= productItems.length) {
            const targetProduct = productItems[productIndex - 1];
            targetProduct.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            console.log(`Scrolling to product ${productIndex}`);
          }
        });

        // Show the container
        newContainer.style.display = '';
        console.log(
          `✓ Preview image ${index + 1} updated with ${product.product_name}`
        );
      }
    }
  });

  // Hide unused preview slots
  for (let i = productsToShow; i < allImageContainers.length; i++) {
    allImageContainers[i].style.display = 'none';
    console.log(`Hiding preview slot ${i + 1}`);
  }

  console.log(`✓ Product preview grid updated with ${productsToShow} products`);
}

// ===== OTHER SECTION UPDATERS =====

/**
 * Updates the hero section with category and hero image
 * @param {Object} content - Newsletter content data
 * @param {Array} products - Array of product objects for category extraction
 */
function updateHeroSection(content, products) {
  if (!content) return;

  const handbookType = document.getElementById('handbookType');
  const heroImage = document.getElementById('heroImage');

  // Extract category from products or use content.category as fallback
  let categoryText = 'Products';

  if (products && Array.isArray(products) && products.length > 0) {
    // Get the category from the first product
    const firstProductCategory = products[0].category;

    if (firstProductCategory) {
      categoryText = firstProductCategory;
    }
  } else if (content.category) {
    categoryText = content.category;
  }

  if (handbookType) {
    handbookType.textContent = categoryText;
    console.log('✓ Hero category updated:', categoryText);
  }

  if (heroImage && content.heroImageUrl) {
    heroImage.src = content.heroImageUrl;
    heroImage.alt = categoryText + ' Hero image';
    console.log('✓ Hero image updated');
  }
}

/**
 * Updates the cover section with name and preferences
 * @param {Object} content - Newsletter content data
 */
function updateCoverSection(content) {
  if (!content) return;

  const nameElement = document.getElementById('name');
  const preferencesElement = document.getElementById('preferences');
  const coverIntroElement = document.getElementById('coverIntro');

  if (nameElement && content.name) {
    nameElement.textContent = content.name;
  }

  if (preferencesElement && content.preferences) {
    preferencesElement.textContent = content.preferences;
  }

  if (coverIntroElement && content.coverIntro) {
    coverIntroElement.innerHTML = content.coverIntro;
  }

  console.log('✓ Cover section updated');
}

/**
 * Updates the tips section with styling tips
 * @param {Object} tips - Tips data object
 */
function updateTipsSection(tips) {
  if (!tips) return;

  const tipsContent = document.getElementById('tipsContent');
  const tipsIntro = document.getElementById('tipsIntro');
  const tipsThemeTitle = document.getElementById('tipsThemeTitle');
  const tipsCategory = document.getElementById('tipsCategory');

  // Update intro paragraph
  if (tipsIntro && tips.intro) {
    tipsIntro.textContent = tips.intro;
    console.log('✓ Tips intro updated');
  }

  // Update theme title - handle both full title or category
  if (tipsThemeTitle && tips.theme_title) {
    // If theme_title contains <br>, we need to handle HTML
    if (tips.theme_title.includes('<br>')) {
      tipsThemeTitle.innerHTML = tips.theme_title;
    } else {
      // Replace entire content with the theme title
      tipsThemeTitle.innerHTML = tips.theme_title.replace(/\n/g, '<br>');
    }
    console.log('✓ Tips theme title updated:', tips.theme_title);
  } else if (tipsCategory && tips.category) {
    // Fallback to category if theme_title not provided
    tipsCategory.textContent = tips.category;
  }

  // Update tips list - check for both 'tips' and 'items' for backward compatibility
  const tipsArray = tips.tips || tips.items;
  if (tipsContent && tipsArray && Array.isArray(tipsArray)) {
    tipsContent.innerHTML = '';

    tipsArray.forEach((tip, index) => {
      const tipDiv = createTipElement(tip, index, tipsArray.length);
      tipsContent.appendChild(tipDiv);
    });

    console.log(`✓ Tips section updated with ${tipsArray.length} tips`);
  }
}

/**
 * Creates a single tip element
 * @param {Object} tip - Tip data object
 * @param {number} index - Tip index
 * @param {number} totalTips - Total number of tips
 * @returns {HTMLElement} Tip div element
 */
function createTipElement(tip, index, totalTips) {
  const tipDiv = document.createElement('div');
  tipDiv.style.marginBottom = index === totalTips - 1 ? '0' : '40px';

  const tipTitle = document.createElement('h4');
  tipTitle.style.cssText =
    'font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 12px;';
  tipTitle.textContent = `${index + 1} - ${tip.title}`;

  const tipText = document.createElement('p');
  tipText.style.cssText =
    'font-size: 1.125rem; line-height: 1.9; color: #333333;';
  // Support both 'body' and 'description' for backward compatibility
  tipText.textContent = tip.body || tip.description;

  tipDiv.appendChild(tipTitle);
  tipDiv.appendChild(tipText);

  return tipDiv;
}

/**
 * Updates the brand spotlight section
 * @param {Object} brandSpotlight - Brand spotlight data object with introduction, brands, and investment_note
 */
function updateBrandSpotlight(brandSpotlight) {
  if (!brandSpotlight) return;

  const brandSpotlightIntro = document.getElementById('brandSpotlightIntro');
  const brandSpotlightContent = document.getElementById(
    'brandSpotlightContent'
  );

  // Update introduction text
  if (brandSpotlightIntro && brandSpotlight.introduction) {
    brandSpotlightIntro.textContent = brandSpotlight.introduction;
    console.log('✓ Brand spotlight intro updated');
  }

  if (!brandSpotlightContent) {
    console.warn('Brand spotlight content element not found');
    return;
  }

  brandSpotlightContent.innerHTML = '';

  // Update brands array
  if (brandSpotlight.brands && Array.isArray(brandSpotlight.brands)) {
    brandSpotlight.brands.forEach((brand) => {
      const brandDiv = createBrandElement(brand);
      brandSpotlightContent.appendChild(brandDiv);
    });

    console.log(
      `✓ Brand spotlight updated with ${brandSpotlight.brands.length} brands`
    );
  }

  // Add investment note section
  if (brandSpotlight.investment_note) {
    const investmentDiv = createInvestmentNoteElement(
      brandSpotlight.investment_note
    );
    brandSpotlightContent.appendChild(investmentDiv);
    console.log('✓ Investment note added');
  }
}

/**
 * Creates a single brand spotlight element
 * @param {Object} brand - Brand data object with rank, name, opening, what_sets_apart, insider_tip
 * @returns {HTMLElement} Brand div element
 */
function createBrandElement(brand) {
  const brandDiv = document.createElement('div');
  brandDiv.style.marginBottom = '60px';

  // Create header with title and logo
  const headerDiv = document.createElement('div');
  headerDiv.style.cssText =
    'display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;';

  const brandTitle = document.createElement('h4');
  brandTitle.style.cssText =
    'font-size: 1.75rem; font-weight: 400; color: #000000; margin: 0;';
  // Use rank if available, otherwise use index
  const rank = brand.rank || '';
  brandTitle.textContent = rank ? `${rank} - ${brand.name}` : brand.name;
  headerDiv.appendChild(brandTitle);

  if (brand.logo) {
    const brandLogo = document.createElement('img');
    brandLogo.src = brand.logo;
    brandLogo.alt = `${brand.name} Logo`;
    brandLogo.style.cssText = 'height: 40px; object-fit: contain;';
    headerDiv.appendChild(brandLogo);
  }

  brandDiv.appendChild(headerDiv);

  // Add opening paragraph
  if (brand.opening) {
    const openingP = document.createElement('p');
    openingP.style.cssText =
      'font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;';
    openingP.textContent = brand.opening;
    brandDiv.appendChild(openingP);
  }

  // Add "what sets apart" paragraph
  if (brand.what_sets_apart) {
    const setsApartP = document.createElement('p');
    setsApartP.style.cssText =
      'font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;';
    setsApartP.textContent = brand.what_sets_apart;
    brandDiv.appendChild(setsApartP);
  }

  // Add insider tip
  if (brand.insider_tip) {
    const tipP = document.createElement('p');
    tipP.style.cssText =
      'font-size: 1rem; line-height: 1.8; color: #666666; font-style: italic; padding-left: 24px; border-left: 3px solid #000000; margin-top: 32px;';
    tipP.innerHTML = `<strong>Insider tip:</strong> ${brand.insider_tip}`;
    brandDiv.appendChild(tipP);
  }

  // Backward compatibility: support old format with description and insiderTip
  if (!brand.opening && brand.description) {
    const descP = document.createElement('p');
    descP.style.cssText =
      'font-size: 1.125rem; line-height: 1.9; color: #333333; margin-bottom: 20px;';
    descP.textContent = brand.description;
    brandDiv.appendChild(descP);
  }

  if (!brand.insider_tip && brand.insiderTip) {
    const tipP = document.createElement('p');
    tipP.style.cssText =
      'font-size: 1rem; line-height: 1.8; color: #666666; font-style: italic; padding-left: 24px; border-left: 3px solid #000000; margin-top: 32px;';
    tipP.innerHTML = `<strong>Insider tip:</strong> ${brand.insiderTip}`;
    brandDiv.appendChild(tipP);
  }

  return brandDiv;
}

/**
 * Creates the investment note element
 * @param {Object} investmentNote - Investment note object with title and content
 * @returns {HTMLElement} Investment note div element
 */
function createInvestmentNoteElement(investmentNote) {
  const investmentDiv = document.createElement('div');
  investmentDiv.style.marginBottom = '40px';

  if (investmentNote.title) {
    const titleH4 = document.createElement('h4');
    titleH4.style.cssText =
      'font-size: 1.5rem; font-weight: 600; color: #000000; margin-bottom: 16px;';
    titleH4.textContent = investmentNote.title;
    investmentDiv.appendChild(titleH4);
  }

  if (investmentNote.content) {
    const contentP = document.createElement('p');
    contentP.style.cssText =
      'font-size: 1.125rem; line-height: 1.9; color: #333333;';
    contentP.textContent = investmentNote.content;
    investmentDiv.appendChild(contentP);
  }

  return investmentDiv;
}

/**
 * Updates the insights section (style profile)
 * @param {Object} insights - Insights data object
 */
function updateInsightsSection(insights) {
  if (!insights || Object.keys(insights).length === 0) return;

  const insightItems = document.querySelectorAll('.insight-item');
  const insightKeys = Object.keys(insights);

  if (insightItems.length === 0) {
    console.warn('No insight items found in DOM');
    return;
  }

  insightKeys.forEach((key, index) => {
    if (index < insightItems.length) {
      const item = insightItems[index];
      const titleElement = item.querySelector('.insight-title-text');
      const descElement = item.querySelector('.insight-description');

      if (titleElement) {
        const formattedTitle = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
        titleElement.textContent = formattedTitle;
      }

      if (descElement) {
        descElement.textContent = insights[key];
      }
    }
  });

  console.log(`✓ Insights section updated with ${insightKeys.length} insights`);
}

/**
 * Updates the blog articles list in the Further Reading section
 * @param {Array} blogArticles - Array of blog article objects with id, title, and url
 */
function updateBlogArticles(blogArticles) {
  if (!blogArticles || !Array.isArray(blogArticles)) return;

  const blogArticlesList = document.getElementById('blogArticlesList');

  if (!blogArticlesList) {
    console.warn('Blog articles list element not found');
    return;
  }

  blogArticlesList.innerHTML = '';

  blogArticles.forEach((article) => {
    const listItem = document.createElement('li');
    listItem.style.cssText =
      'font-size: 1rem; line-height: 2; color: #333333; padding-left: 20px; position: relative;';

    const bulletSpan = document.createElement('span');
    bulletSpan.style.cssText = 'position: absolute; left: 0;';
    bulletSpan.textContent = '•';

    const articleLink = document.createElement('a');
    articleLink.href = buildProductUrl(article.url);
    articleLink.target = '_blank';
    articleLink.style.cssText = 'color: #333333; text-decoration: none;';
    articleLink.textContent = `"${article.title}"`;

    // Add hover effect
    articleLink.addEventListener('mouseenter', function () {
      this.style.textDecoration = 'underline';
      this.style.color = '#000000';
    });

    articleLink.addEventListener('mouseleave', function () {
      this.style.textDecoration = 'none';
      this.style.color = '#333333';
    });

    listItem.appendChild(bulletSpan);
    listItem.appendChild(articleLink);

    blogArticlesList.appendChild(listItem);
  });

  console.log(`✓ Blog articles updated with ${blogArticles.length} articles`);
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
  loadNewsletterContent();
});

const downloadPdfBtn = document.getElementById('downloadPdfBtn');
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const originalText = downloadPdfBtn.innerHTML;
    downloadPdfBtn.innerHTML = '<span>Preparing images...</span>';
    downloadPdfBtn.disabled = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      downloadPdfBtn.innerHTML = '<span>Generating PDF...</span>';
      await generatePDF(true);
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      downloadPdfBtn.innerHTML = originalText;
      downloadPdfBtn.disabled = false;
    }
  });
}

if (saveEmailBtn) {
  saveEmailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    emailModal.classList.add('active');
    firstNameInput.focus();
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    emailModal.classList.remove('active');
    emailForm.reset();
    emailStatus.textContent = '';
    emailStatus.className = 'email-status';
  });
}

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

if (emailForm) {
  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = firstNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const privacyAgreed = privacyCheckbox.checked;

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

    const submitBtn = emailForm.querySelector('.email-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...';

    try {
      showEmailStatus('Sending to your email...', 'info');

      // Check if PDF document exists before extracting
      const pdfDocument = document.querySelector('.pdf-document');
      if (!pdfDocument) {
        console.error('PDF document (.pdf-document) not found in DOM');
        console.log(
          'Available elements:',
          document.querySelectorAll('section, .pdf-hero, .pdf-cover')
        );
        showEmailStatus(
          'Error: Newsletter content not found. Please refresh the page.',
          'error'
        );
        submitBtn.disabled = false;
        submitBtn.textContent = 'SEND TO EMAIL';
        return;
      }

      // Extract structured data from DOM
      // Use extractNewsletterDataFromDOM from email-generator.js
      let domData = {};
      if (typeof extractNewsletterDataFromDOM === 'function') {
        try {
          domData = extractNewsletterDataFromDOM() || {};
          console.log('DOM Data extracted:', domData);
          console.log('DOM Data sections:', Object.keys(domData));

          // ADD THESE NEW CONSOLE LOGS:
          console.log('=== DEBUGGING COVER SECTION ===');
          console.log('Cover Section exists:', !!domData.coverSection);
          console.log(
            'Product Preview data:',
            domData.coverSection?.productPreview
          );
          console.log(
            'Number of rows:',
            domData.coverSection?.productPreview?.length
          );
          if (domData.coverSection?.productPreview) {
            domData.coverSection.productPreview.forEach((row, i) => {
              console.log(`Row ${i} has ${row.length} images`);
              row.forEach((img, j) => {
                console.log(`  Image ${j}:`, img.alt || 'No alt');
              });
            });
          }
          console.log('=== END DEBUG ===');

          // Check if we got any data
          if (!domData || Object.keys(domData).length === 0) {
            console.warn('Warning: DOM extraction returned empty data');
            console.log(
              'PDF document HTML:',
              pdfDocument.innerHTML.substring(0, 500)
            );
          }
        } catch (error) {
          console.error('Error extracting DOM data:', error);
          console.error('Error stack:', error.stack);
          domData = {};
        }
      } else {
        console.error('extractNewsletterDataFromDOM function not found!');
        console.log(
          'Available functions:',
          typeof captureHTMLContent,
          typeof extractNewsletterData
        );
        showEmailStatus(
          'Error: Extraction function not available. Please refresh the page.',
          'error'
        );
        submitBtn.disabled = false;
        submitBtn.textContent = 'SEND TO EMAIL';
        return;
      }

      const newsletterData = sessionStorage.getItem('newsletterData');
      console.log(
        'Newsletter Data from sessionStorage:',
        newsletterData ? 'Found' : 'Not found'
      );

      // Call PHP handler instead of webhook
      const handlerUrl = 'handler.personalize-newsletter.php';

      const response = await fetch(handlerUrl, {
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
          newsletterData: newsletterData,
          domData: domData || {},
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showEmailStatus('Successfully sent to your email!', 'success');
          setTimeout(() => {
            emailModal.classList.remove('active');
            emailForm.reset();
            emailStatus.textContent = '';
            emailStatus.className = 'email-status';
          }, 2000);
        } else {
          throw new Error(result.message || 'Failed to send email');
        }
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to send email');
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

console.log('Newsletter page loaded successfully');

// ===== IMAGE LIGHTBOX FUNCTIONALITY =====

const imageLightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(imageSrc, imageAlt) {
  lightboxImage.src = imageSrc;
  lightboxCaption.textContent = imageAlt || '';
  imageLightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  imageLightbox.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    lightboxImage.src = '';
    lightboxCaption.textContent = '';
  }, 300);
}

function initializeLightbox() {
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

if (lightboxClose) {
  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
}

if (imageLightbox) {
  imageLightbox.addEventListener('click', (e) => {
    if (e.target === imageLightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageLightbox.classList.contains('active')) {
    closeLightbox();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initializeLightbox();
});
