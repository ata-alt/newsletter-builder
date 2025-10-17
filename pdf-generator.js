// PDF Generator
// This file handles PDF generation functionality

// Function to convert image URL to base64
async function convertImageToBase64(imgElement) {
  // Skip if image is already a data URL
  if (imgElement.src.startsWith('data:')) {
    return imgElement.src;
  }

  // For external images, always use the PHP proxy to avoid CORS
  // This is more reliable than trying to use canvas
  return await fetchImageAsBase64(imgElement.src);
}
// Function to fetch image through PHP proxy and convert to base64
async function fetchImageAsBase64(imageUrl) {
  try {
    // Use PHP proxy to fetch the image (bypasses CORS)
    const proxyUrl = `image-proxy.php?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      return data.data; // Already a base64 data URL
    } else {
      throw new Error(data.error || 'Unknown error');
    }
  } catch (error) {
    console.warn('Failed to fetch image via proxy, using placeholder:', error);
    // Return a small placeholder image as base64
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  }
}
// Function to generate PDF from the newsletter
async function generatePDF(downloadOnly = false) {
  const pdfDocument = document.querySelector('.pdf-document');
  if (!pdfDocument) {
    console.error('PDF document not found');
    alert('Error: Cannot find newsletter content');
    return null;
  }

  console.log('Starting PDF generation...');
  console.log('Original document:', pdfDocument);
  console.log('Original document HTML length:', pdfDocument.innerHTML.length);

  // Convert all images to base64 first (in the original document)
  console.log('Converting images to base64...');
  const allImages = pdfDocument.querySelectorAll('img');
  console.log(`Found ${allImages.length} images`);

  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
    try {
      const base64 = await convertImageToBase64(img);
      img.setAttribute('data-original-src', img.src);
      img.src = base64;
      console.log(`Converted image ${i + 1} of ${allImages.length}`);
    } catch (error) {
      console.error(`Failed to convert image ${i + 1}:`, error);
    }
  }

  // Clone the entire PDF document
  const pdfContainer = pdfDocument.cloneNode(true);
  console.log('Cloned document HTML length:', pdfContainer.innerHTML.length);

  // Remove buttons and interactive elements from the clone
  const buttonsToRemove = pdfContainer.querySelectorAll(
    '.pdf-action-btn, .pdf-action-link, .view-product-link'
  );
  console.log(`Removing ${buttonsToRemove.length} interactive elements`);
  buttonsToRemove.forEach((btn) => btn.remove());

  // Remove the header actions section
  const headerActions = pdfContainer.querySelector('.pdf-header-actions');
  if (headerActions) {
    console.log('Removing header actions');
    headerActions.remove();
  }

  // Apply PDF-specific styling to optimize layout
  console.log('Applying PDF-specific styles');

  // Reduce padding for better fit
  const pdfHeader = pdfContainer.querySelector('.pdf-header');
  if (pdfHeader) {
    pdfHeader.style.padding = '15px 40px';
    pdfHeader.style.position = 'static';
  }

  // Reduce cover section padding
  const pdfCover = pdfContainer.querySelector('.pdf-cover');
  if (pdfCover) {
    pdfCover.style.padding = '50px 40px 40px 40px';
  }

  // Reduce all section padding
  const allSections = pdfContainer.querySelectorAll('.pdf-section');
  allSections.forEach((section) => {
    section.style.padding = '40px 40px';
    section.style.pageBreakInside = 'avoid';
  });

  // Reduce image heights
  const largeImages = pdfContainer.querySelectorAll('.section-image-large');
  largeImages.forEach((img) => {
    img.style.height = '300px';
    img.style.width = '100%';
    img.style.marginBottom = '25px';
  });

  const halfImages = pdfContainer.querySelectorAll('.section-image-half');
  halfImages.forEach((img) => {
    img.style.height = '280px';
    img.style.width = '100%';
    img.style.minWidth = '250px';
  });

  // Reduce insights section padding
  const insightsSection = pdfContainer.querySelector('.pdf-insights');
  if (insightsSection) {
    insightsSection.style.padding = '40px 40px';
  }

  // Reduce closing section padding
  const closingSection = pdfContainer.querySelector('.pdf-closing');
  if (closingSection) {
    closingSection.style.padding = '40px 40px';
  }

  // Reduce footer padding
  const pdfFooter = pdfContainer.querySelector('.pdf-footer');
  if (pdfFooter) {
    pdfFooter.style.padding = '25px 40px';
  }

  // Reduce title sizes
  const pdfTitle = pdfContainer.querySelector('.pdf-title');
  if (pdfTitle) {
    pdfTitle.style.fontSize = '2.3rem';
    pdfTitle.style.lineHeight = '1.2';
    pdfTitle.style.marginBottom = '18px';
  }

  const sectionTitles = pdfContainer.querySelectorAll('.section-title');
  sectionTitles.forEach((title) => {
    title.style.fontSize = '1.5rem';
    title.style.lineHeight = '1.2';
    title.style.fontWeight = '400';
    title.style.color = '#000000';
    title.style.flex = '1';
    title.style.minWidth = '0';
    title.style.whiteSpace = 'nowrap';
    title.style.overflow = 'hidden';
    title.style.textOverflow = 'ellipsis';
  });

  const sectionTextLarge = pdfContainer.querySelectorAll('.section-text-large');
  sectionTextLarge.forEach((text) => {
    text.style.fontSize = '1.05rem';
    text.style.lineHeight = '1.6';
    text.style.marginBottom = '14px';
    text.style.fontWeight = '400';
    text.style.color = '#000000';
  });

  // Reduce paragraph text
  const sectionText = pdfContainer.querySelectorAll('.section-text');
  sectionText.forEach((text) => {
    text.style.fontSize = '0.95rem';
    text.style.lineHeight = '1.7';
    text.style.marginBottom = '14px';
    text.style.color = '#333333';
    text.style.textAlign = 'left';
  });

  // Reduce intro text on cover
  const pdfIntro = pdfContainer.querySelector('.pdf-intro');
  if (pdfIntro) {
    pdfIntro.style.fontSize = '0.95rem';
    pdfIntro.style.lineHeight = '1.7';
  }

  // Reduce subtitle
  const pdfSubtitle = pdfContainer.querySelector('.pdf-subtitle');
  if (pdfSubtitle) {
    pdfSubtitle.style.fontSize = '1.05rem';
    pdfSubtitle.style.marginBottom = '28px';
  }

  // Fix section header layout - single line with smaller spacing
  const sectionHeaders = pdfContainer.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    header.style.marginBottom = '25px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '12px';
    header.style.flexWrap = 'nowrap';
    header.style.justifyContent = 'flex-start';
    header.style.width = '100%';
  });

  // Reduce section numbers
  const sectionNumbers = pdfContainer.querySelectorAll('.section-number');
  sectionNumbers.forEach((num) => {
    num.style.fontSize = '2.5rem';
    num.style.fontWeight = '200';
    num.style.color = '#e0e0e0';
    num.style.lineHeight = '1';
    num.style.flexShrink = '0';
    num.style.marginRight = '5px';
  });

  // Style section categories - position on far right
  const sectionCategories = pdfContainer.querySelectorAll('.section-category');
  sectionCategories.forEach((cat) => {
    cat.style.fontSize = '0.7rem';
    cat.style.textTransform = 'uppercase';
    cat.style.letterSpacing = '0.2em';
    cat.style.color = '#999999';
    cat.style.marginLeft = 'auto';
    cat.style.flexShrink = '0';
    cat.style.fontWeight = '400';
  });

  // Optimize section content layout
  const sectionContents = pdfContainer.querySelectorAll('.section-content');
  sectionContents.forEach((content) => {
    content.style.maxWidth = '100%';
  });

  // Fix split section layouts - text left, image right
  const splitSections = pdfContainer.querySelectorAll('.section-split');
  splitSections.forEach((split) => {
    split.style.display = 'flex';
    split.style.gap = '50px';
    split.style.alignItems = 'flex-start';
    split.style.flexWrap = 'nowrap';
  });

  // Ensure reverse sections show image on right
  const reverseSplits = pdfContainer.querySelectorAll('.section-split.reverse');
  reverseSplits.forEach((split) => {
    split.style.flexDirection = 'row'; // Override reverse - text always left
  });

  // Optimize content half sections - text side
  const contentHalves = pdfContainer.querySelectorAll('.section-content-half');
  contentHalves.forEach((half) => {
    half.style.flex = '0 0 45%';
    half.style.maxWidth = '45%';
  });

  // Optimize image half sections - image side
  const imageHalves = pdfContainer.querySelectorAll('.section-image-half');
  imageHalves.forEach((half) => {
    half.style.flex = '0 0 50%';
    half.style.maxWidth = '50%';
  });

  // Fix word wrapping for all text elements
  const allTextElements = pdfContainer.querySelectorAll(
    'p, h1, h2, h3, h4, span'
  );
  allTextElements.forEach((el) => {
    el.style.wordWrap = 'break-word';
    el.style.overflowWrap = 'break-word';
    el.style.whiteSpace = 'normal';
  });

  // Hide the original document temporarily
  const originalDisplay = pdfDocument.style.display;
  pdfDocument.style.display = 'none';

  // Set proper styling for PDF rendering
  pdfContainer.style.cssText = `
    width: 794px !important;
    max-width: 794px !important;
    min-height: 1123px !important;
    height: auto !important;
    margin: 0 auto !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
    display: block !important;
    visibility: visible !important;
    font-family: Georgia, 'Times New Roman', serif !important;
    box-sizing: border-box !important;
  `;

  // Add a temporary wrapper to isolate the PDF content
  const tempWrapper = document.createElement('div');
  tempWrapper.id = 'pdf-temp-wrapper';
  tempWrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 99999;
    overflow: auto;
    padding: 0;
    margin: 0;
  `;
  tempWrapper.appendChild(pdfContainer);

  console.log('Appending container to body');
  document.body.appendChild(tempWrapper);

  console.log('Container appended. Dimensions:', {
    width: pdfContainer.offsetWidth,
    height: pdfContainer.offsetHeight,
    scrollHeight: pdfContainer.scrollHeight,
  });

  // Wait for DOM to update and render
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('Generating PDF from container...');

  const opt = {
    margin: [0, 0, 0, 0], // No margins - content will handle its own padding
    filename: 'FCI-London-Personalized-Selection.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98, // Increased quality for better image clarity
    },
    html2canvas: {
      scale: 2,
      useCORS: false,
      allowTaint: true,
      logging: true,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      windowHeight: 1123,
      imageTimeout: 15000,
      removeContainer: true,
      letterRendering: true,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true, // Enable compression for smaller file size
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'], // Better page break handling
    },
  };

  try {
    if (downloadOnly) {
      await html2pdf().set(opt).from(pdfContainer).save();
      console.log('PDF saved successfully');
      return true;
    } else {
      const pdfBlob = await html2pdf()
        .set(opt)
        .from(pdfContainer)
        .outputPdf('blob');
      console.log('PDF blob generated successfully');
      return pdfBlob;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Clean up - remove the temporary wrapper and container
    const wrapper = document.getElementById('pdf-temp-wrapper');
    if (wrapper && wrapper.parentNode) {
      document.body.removeChild(wrapper);
    }

    // Restore the original document display
    pdfDocument.style.display = originalDisplay;

    // Restore original image sources in the main document
    const imagesToRestore = pdfDocument.querySelectorAll(
      'img[data-original-src]'
    );
    imagesToRestore.forEach((img) => {
      img.src = img.getAttribute('data-original-src');
      img.removeAttribute('data-original-src');
    });

    console.log('PDF generation cleanup complete');
  }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generatePDF,
    convertImageToBase64,
    fetchImageAsBase64,
  };
}
