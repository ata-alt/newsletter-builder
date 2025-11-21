// Email HTML Generator
// This file handles generating email-friendly HTML with inline styles
// Updated to match the exact format of newsletter.php

// Function to capture HTML content for email
function captureHTMLContent() {
  // Get the PDF document
  const pdfDocument = document.querySelector('.pdf-document');
  if (!pdfDocument) {
    console.error('PDF document not found');
    return null;
  }

  let emailContent = '';

  // Hero Section
  const heroSection = pdfDocument.querySelector('.pdf-hero');
  if (heroSection) {
    const heroTitle = heroSection.querySelector('.hero-title');
    const heroTitleText = heroTitle
      ? heroTitle.innerHTML.replace(/\n/g, '<br>')
      : '';
    const heroSubtitle =
      heroSection.querySelector('.hero-subtitle')?.textContent || '';
    const heroImage = heroSection.querySelector('#heroImage');
    const heroImageUrl = heroImage?.src || '';

    emailContent += `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-bottom: 2px solid #000000;">
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${
                heroImageUrl
                  ? `<td width="45%" style="padding: 0; vertical-align: top;">
                <img src="${heroImageUrl}" alt="Luxury living room" style="width: 100%; max-width: 100%; height: auto; display: block; border: 0;" />
              </td>`
                  : ''
              }
              <td width="${
                heroImageUrl ? '55%' : '100%'
              }" style="padding: 25px 30px 25px 40px; vertical-align: middle; background-color: #ffffff;">
                <h1 style="margin: 0 0 16px; font-size: 2.5rem; font-weight: 400; line-height: 1.15; color: #000000; letter-spacing: -0.015em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${heroTitleText}</h1>
                <p style="margin: 0; font-size: 1.125rem; font-weight: 400; color: #2c2c2c; line-height: 1.6; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${heroSubtitle}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }

  // Cover Section
  const coverSection = pdfDocument.querySelector('.pdf-cover');
  if (coverSection) {
    const coverTitle = coverSection.querySelector('h2');
    const coverTitleText = coverTitle
      ? coverTitle.innerHTML.replace(/\n/g, '<br>')
      : '';
    const coverIntro = coverSection.querySelector('#coverIntro');
    const coverIntroHTML = coverIntro ? coverIntro.innerHTML : '';

    // Product Preview Grid - Hardcoded 7-image structure
    const productPreviewContainer = coverSection.querySelector(
      '#productPreviewContainer'
    );
    let previewGridHTML = '';

    if (productPreviewContainer) {
      // Collect all images from the container
      const allImages = [];
      const productRows =
        productPreviewContainer.querySelectorAll('.productRow');

      productRows.forEach((row) => {
        const imageDivs = Array.from(row.children).filter(
          (child) => child.tagName === 'DIV' && child.querySelector('img')
        );

        imageDivs.forEach((div) => {
          const img = div.querySelector('img');
          if (img) {
            allImages.push({
              src: img.src,
              alt: img.alt || 'Product',
            });
          }
        });
      });

      // Only generate HTML if we have at least 7 images
      if (allImages.length >= 7) {
        previewGridHTML = `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1000px; margin: 48px auto 0;">
          <!-- First Row: 2 wide + 1 narrow (40% + 40% + 20%) -->
          <tr>
            <td width="40%" style="padding: 0 6px 0 0;">
              <img src="${allImages[0].src}" alt="${allImages[0].alt}" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
            </td>
            <td width="40%" style="padding: 0 6px;">
              <img src="${allImages[1].src}" alt="${allImages[1].alt}" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
            </td>
            <td width="20%" style="padding: 0 0 0 6px;">
              <img src="${allImages[2].src}" alt="${allImages[2].alt}" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
            </td>
          </tr>
          <!-- Second Row: 1 narrow + 1 wide + 2 narrow (20% + 40% + 20% + 20%) -->
          <tr>
            <td width="20%" style="padding: 6px 6px 0 0;">
              <img src="${allImages[3].src}" alt="${allImages[3].alt}" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
            </td>
            <td width="40%" style="padding: 6px 6px 0 6px;">
              <img src="${allImages[4].src}" alt="${allImages[4].alt}" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
            </td>
            <td width="20%" style="padding: 6px 6px 0 6px;">
              <img src="${allImages[5].src}" alt="${allImages[5].alt}" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
            </td>
            <td width="20%" style="padding: 6px 0 0 6px;">
              <img src="${allImages[6].src}" alt="${allImages[6].alt}" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
            </td>
          </tr>
        </table>`;
      }
    }

    emailContent += `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
    <tr>
      <td style="padding: 80px 60px 60px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; margin: 0 auto;">
          <tr>
            <td style="text-align: center;">
              <h2 style="margin: 0 0 32px; font-size: 2.5rem; font-weight: 400; color: #000000; text-align: right; letter-spacing: -0.01em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${coverTitleText}</h2>
              <div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; text-align: left; max-width: 580px; margin: 0 auto 48px; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${coverIntroHTML}</div>
              ${previewGridHTML}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
  }

  // Tips Section
  const tipsSection = pdfDocument.querySelector('.pdf-section.alternate');
  if (tipsSection && tipsSection.querySelector('#tipsContent')) {
    const tipsIntro =
      tipsSection.querySelector('#tipsIntro')?.textContent || '';
    const tipsThemeTitle = tipsSection.querySelector('#tipsThemeTitle');
    const tipsThemeTitleHTML = tipsThemeTitle
      ? tipsThemeTitle.innerHTML.replace(/\n/g, '<br>')
      : '';
    const tipsContent = tipsSection.querySelector('#tipsContent');

    if (tipsContent) {
      const tips = tipsContent.querySelectorAll('div[style*="margin-bottom"]');
      let tipsHTML = '';
      tips.forEach((tip) => {
        const tipTitle = tip.querySelector('h4')?.textContent || '';
        const tipBody = tip.querySelector('p')?.textContent || '';
        if (tipTitle && tipBody) {
          tipsHTML += `
            <div style="margin-bottom: 40px;">
              <h4 style="margin: 0 0 12px; font-size: 1.25rem; font-weight: 600; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${tipTitle}</h4>
              <p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${tipBody}</p>
            </div>`;
        }
      });

      emailContent += `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa;">
        <tr>
          <td style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td>
                  ${
                    tipsIntro
                      ? `<p style="margin: 0 0 48px; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${tipsIntro}</p>`
                      : ''
                  }
                  ${
                    tipsThemeTitleHTML
                      ? `<h3 style="margin: 0 0 48px; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.01em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${tipsThemeTitleHTML}</h3>`
                      : ''
                  }
                  ${tipsHTML}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
    }
  }

  // Products Section
  const productsSection = pdfDocument.querySelector('.products-section');
  if (productsSection) {
    const bespokeTitle = productsSection.querySelector('h3')?.textContent || '';
    const bespokeIntro = productsSection.querySelector(
      '#bespoke Selection Intro'
    );
    const bespokeIntroHTML = bespokeIntro ? bespokeIntro.innerHTML : '';
    const productItems = productsSection.querySelectorAll('.product-item');

    let productsHTML = '';
    productItems.forEach((item, index) => {
      if (item.style.display === 'none') return; // Skip hidden items

      const productTitle = item.querySelector('.product-title-link');
      const titleHTML = productTitle ? productTitle.innerHTML : '';
      const productUrl = productTitle?.dataset?.productUrl || '';

      // Check layout type
      const hasSectionSplit = item.querySelector('.section-split');
      const hasImageLarge = item.querySelector('.section-image-large');
      const imageBeforeTitle =
        item.querySelector('.section-image-large') &&
        item
          .querySelector('.section-image-large')
          .compareDocumentPosition(item.querySelector('.product-title-link')) &
          Node.DOCUMENT_POSITION_PRECEDING;

      const images = item.querySelectorAll('img');
      const imageUrl = images.length > 0 ? images[0].src : '';
      const imageAlt = images.length > 0 ? images[0].alt : 'Product image';
      const sectionTextLarge =
        item.querySelector('.section-text-large')?.textContent || '';
      const sectionText = item.querySelector('.section-text');
      const sectionTextHTML = sectionText ? sectionText.innerHTML : '';

      const marginBottom = index < productItems.length - 1 ? '80px' : '0';

      // Build title with link if URL exists
      let titleHTMLFinal = titleHTML;
      if (productUrl && titleHTML) {
        titleHTMLFinal = titleHTML.replace(
          />([^<]+)</,
          `><a href="${productUrl}" style="color: #000000; text-decoration: none;">$1</a><`
        );
      }

      if (hasSectionSplit && !imageBeforeTitle) {
        // Layout: Title Center, Image Left + Text Right
        productsHTML += `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ${marginBottom};">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td style="padding: 0 0 40px; text-align: center;">
                    <h3 style="margin: 0; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${titleHTMLFinal}</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="45%" style="padding-right: 28px; vertical-align: top;">
                          ${
                            imageUrl
                              ? `<img src="${imageUrl}" alt="${imageAlt}" style="width: 100%; max-width: 400px; height: auto; display: block; border: 0;" />`
                              : ''
                          }
                        </td>
                        <td width="55%" style="padding-left: 28px; vertical-align: top;">
                          ${
                            sectionTextLarge
                              ? `<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextLarge}</p>`
                              : ''
                          }
                          ${
                            sectionTextHTML
                              ? `<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextHTML}</div>`
                              : ''
                          }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
      } else if (hasImageLarge && imageBeforeTitle) {
        // Layout: Full Width Image + Title Below
        productsHTML += `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ${marginBottom};">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td style="padding: 0 0 40px;">
                    ${
                      imageUrl
                        ? `<img src="${imageUrl}" alt="${imageAlt}" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto; border: 0;" />`
                        : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 40px; text-align: center;">
                    <h3 style="margin: 0; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${titleHTMLFinal}</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 900px; margin: 0 auto;">
                      <tr>
                        <td>
                          ${
                            sectionTextLarge
                              ? `<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextLarge}</p>`
                              : ''
                          }
                          ${
                            sectionTextHTML
                              ? `<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextHTML}</div>`
                              : ''
                          }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
      } else if (hasSectionSplit && imageBeforeTitle) {
        // Layout: Image Left + Title/Text Right
        productsHTML += `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ${marginBottom};">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td width="45%" style="padding-right: 28px; vertical-align: top;">
                    ${
                      imageUrl
                        ? `<img src="${imageUrl}" alt="${imageAlt}" style="width: 100%; max-width: 400px; height: auto; display: block; border: 0;" />`
                        : ''
                    }
                  </td>
                  <td width="55%" style="padding-left: 28px; vertical-align: top;">
                    <h3 style="margin: 0 0 28px; font-size: 2.25rem; font-weight: 400; color: #000000; letter-spacing: -0.005em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${titleHTMLFinal}</h3>
                    ${
                      sectionTextLarge
                        ? `<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextLarge}</p>`
                        : ''
                    }
                    ${
                      sectionTextHTML
                        ? `<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextHTML}</div>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
      } else {
        // Default: Title Center, Full Width Image + Text Below
        productsHTML += `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ${marginBottom};">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td style="padding: 0 0 40px; text-align: center;">
                    <h3 style="margin: 0; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${titleHTMLFinal}</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 40px;">
                    ${
                      imageUrl
                        ? `<img src="${imageUrl}" alt="${imageAlt}" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto; border: 0;" />`
                        : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 900px; margin: 0 auto;">
                      <tr>
                        <td>
                          ${
                            sectionTextLarge
                              ? `<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextLarge}</p>`
                              : ''
                          }
                          ${
                            sectionTextHTML
                              ? `<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${sectionTextHTML}</div>`
                              : ''
                          }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
      }
    });

    emailContent += `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
      <tr>
        <td style="padding: 70px 60px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto; text-align: center;">
            <tr>
              <td style="padding: 0 0 10px;">
                ${
                  bespokeTitle
                    ? `<h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${bespokeTitle}</h3>`
                    : ''
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 60px;">
                ${
                  bespokeIntroHTML
                    ? `<div style="font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${bespokeIntroHTML}</div>`
                    : ''
                }
              </td>
            </tr>
          </table>
          ${productsHTML}
        </td>
      </tr>
    </table>`;
  }

  // Brand Spotlight Section
  const brandSpotlightSection = pdfDocument.querySelectorAll('.pdf-section');
  brandSpotlightSection.forEach((section) => {
    const brandSpotlightContent = section.querySelector(
      '#brandSpotlightContent'
    );
    if (brandSpotlightContent) {
      const intro =
        section.querySelector('#brandSpotlightIntro')?.textContent || '';
      const brands = brandSpotlightContent.querySelectorAll(
        'div[style*="margin-bottom: 60px"]'
      );

      let brandsHTML = '';
      brands.forEach((brandDiv) => {
        const brandHeader = brandDiv.querySelector(
          'div[style*="display: flex"]'
        );
        const brandTitle = brandHeader
          ? brandHeader.querySelector('h4')?.textContent
          : brandDiv.querySelector('h4')?.textContent || '';
        const brandLogo = brandHeader ? brandHeader.querySelector('img') : null;
        const brandLogoUrl = brandLogo ? brandLogo.src : '';

        const paragraphs = brandDiv.querySelectorAll('p');
        let brandText = '';
        paragraphs.forEach((p) => {
          const text = p.textContent || '';
          const style = p.getAttribute('style') || '';
          if (style.includes('Insider tip') || text.includes('Insider tip:')) {
            brandText += `<p style="margin: 32px 0 0; font-size: 1rem; line-height: 1.8; color: #666666; font-style: italic; padding-left: 24px; border-left: 3px solid #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${p.innerHTML}</p>`;
          } else {
            brandText += `<p style="margin: 0 0 20px; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${p.innerHTML}</p>`;
          }
        });

        if (brandTitle) {
          brandsHTML += `
          <div style="margin-bottom: 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
              <tr>
                <td style="padding: 0;">
                  <h4 style="margin: 0; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${brandTitle}</h4>
                </td>
                ${
                  brandLogoUrl
                    ? `<td align="right" style="padding: 0;">
                  <img src="${brandLogoUrl}" alt="Brand Logo" style="height: 40px; object-fit: contain; border: 0;" />
                </td>`
                    : ''
                }
              </tr>
            </table>
            ${brandText}
          </div>`;
        }
      });

      // Investment note
      const investmentNote = brandSpotlightContent.querySelector(
        'div[style*="margin-bottom: 40px"]:last-child'
      );
      let investmentHTML = '';
      if (investmentNote) {
        const invTitle = investmentNote.querySelector('h4')?.textContent || '';
        const invContent = investmentNote.querySelector('p')?.textContent || '';
        if (invTitle && invContent && !invTitle.includes('-')) {
          investmentHTML = `
          <div style="margin-bottom: 40px;">
            <h4 style="margin: 0 0 16px; font-size: 1.5rem; font-weight: 600; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${invTitle}</h4>
            <p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${invContent}</p>
          </div>`;
        }
      }

      emailContent += `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
        <tr>
          <td style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td style="padding: 0 0 24px; text-align: center;">
                  <h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Brand Spotlight: Your Perfect Match</h3>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 60px; text-align: center;">
                  ${
                    intro
                      ? `<p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${intro}</p>`
                      : ''
                  }
                </td>
              </tr>
              <tr>
                <td>
                  ${brandsHTML}
                  ${investmentHTML}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
    }
  });

  // Showroom Strategy Section
  const showroomStrategySection = pdfDocument.querySelectorAll(
    '.pdf-section.alternate'
  );
  showroomStrategySection.forEach((section) => {
    // Check if this is the showroom strategy section (has the title "Your Showroom Strategy")
    const sectionTitle = section.querySelector('h3');
    if (
      sectionTitle &&
      sectionTitle.textContent.includes('Your Showroom Strategy')
    ) {
      const introText =
        section.querySelector('p[style*="text-align: center"]')?.textContent ||
        '';

      // Questions to Ask section
      const questionsHeading = Array.from(section.querySelectorAll('h4')).find(
        (h) => h.textContent.trim().includes('Questions to Ask')
      );
      let questionsHTML = '';
      if (questionsHeading) {
        // Find all sibling divs after the heading until we hit another h4/h5 or end
        let currentElement = questionsHeading.nextElementSibling;
        const questionDivs = [];

        while (currentElement) {
          if (
            currentElement.tagName === 'H4' ||
            currentElement.tagName === 'H5'
          ) {
            break; // Stop at next heading
          }
          if (currentElement.tagName === 'DIV') {
            // Check if this div contains question content
            const hasQuestion =
              currentElement.querySelector('p[style*="font-weight: 600"]') ||
              currentElement.querySelector('p[style*="font-weight:600"]');
            if (hasQuestion) {
              questionDivs.push(currentElement);
            }
          }
          currentElement = currentElement.nextElementSibling;
        }

        // Process each question div
        questionDivs.forEach((item) => {
          // Get all paragraphs in the item
          const paragraphs = item.querySelectorAll('p');
          let question = '';
          let answer = '';

          paragraphs.forEach((p) => {
            const style = p.getAttribute('style') || '';
            const text = p.textContent.trim();

            if (text) {
              // Check for question (bold/600 weight)
              if (
                style.includes('font-weight: 600') ||
                style.includes('font-weight:600')
              ) {
                question = text;
              }
              // Check for answer (has padding-left)
              else if (style.includes('padding-left')) {
                answer = text;
              }
            }
          });

          if (question && answer) {
            questionsHTML += `
        <div style="margin-bottom: 32px;">
          <p style="margin: 0 0 12px; font-size: 1.125rem; font-weight: 600; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${question}</p>
          <p style="margin: 0; font-size: 1rem; line-height: 1.8; color: #666666; padding-left: 20px; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${answer}</p>
        </div>`;
          }
        });
      }

      // What to Bring section
      const whatToBringHeading = Array.from(
        section.querySelectorAll('h4')
      ).find((h) => h.textContent.includes('What to Bring'));
      let whatToBringHTML = '';
      if (whatToBringHeading) {
        const whatToBringContainer = whatToBringHeading.nextElementSibling;
        if (whatToBringContainer) {
          const items = whatToBringContainer.querySelectorAll(
            'div[style*="background-color: #ffffff"]'
          );
          const itemRows = [];
          for (let i = 0; i < items.length; i += 2) {
            itemRows.push(Array.from(items).slice(i, i + 2));
          }

          itemRows.forEach((row, rowIndex) => {
            let rowHTML = '<tr>';
            row.forEach((item, colIndex) => {
              const title =
                item.querySelector('p[style*="font-weight: 600"]')
                  ?.textContent || '';
              const allParagraphs = item.querySelectorAll('p');
              let description = '';
              allParagraphs.forEach((p) => {
                const style = p.getAttribute('style') || '';
                if (!style.includes('font-weight: 600') && !description) {
                  description = p.textContent || '';
                }
              });
              if (title && description) {
                const padding =
                  colIndex === 0 ? '0 12px 24px 0' : '0 0 24px 12px';
                rowHTML += `
                <td width="50%" style="padding: ${padding}; vertical-align: top;">
                  <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 8px; font-size: 1rem; font-weight: 600; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${title}</p>
                    <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: #666666; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${description}</p>
                  </div>
                </td>`;
              }
            });
            rowHTML += '</tr>';
            whatToBringHTML += rowHTML;
          });
        }
      }

      emailContent += `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa;">
        <tr>
          <td style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td style="padding: 0 0 24px; text-align: center;">
                  <h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Your Showroom Strategy</h3>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 60px; text-align: center;">
                  ${
                    introText
                      ? `<p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${introText}</p>`
                      : ''
                  }
                </td>
              </tr>
              ${
                questionsHTML
                  ? `
              <tr>
                <td style="padding: 0 0 60px;">
                  <h4 style="margin: 0 0 32px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Questions to Ask (The Ones That Really Matter)</h4>
                  ${questionsHTML}
                </td>
              </tr>`
                  : ''
              }
              ${
                whatToBringHTML
                  ? `
              <tr>
                <td>
                  <h4 style="margin: 0 0 32px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">What to Bring to the Showroom</h4>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${whatToBringHTML}
                  </table>
                </td>
              </tr>`
                  : ''
              }
            </table>
          </td>
        </tr>
      </table>`;
    }
  });

  // Final Thoughts & Resources Section
  const finalThoughtsSection = pdfDocument.querySelectorAll('.pdf-section');
  finalThoughtsSection.forEach((section) => {
    if (section.querySelector('#blogArticlesList')) {
      const personalNoteHeading = Array.from(
        section.querySelectorAll('h4')
      ).find((h) => h.textContent === 'A Personal Note');
      const personalNoteDiv = personalNoteHeading
        ? personalNoteHeading.nextElementSibling
        : null;
      const personalNoteParagraphs = personalNoteDiv
        ? personalNoteDiv.querySelectorAll('p')
        : [];
      const personalNoteText = Array.from(personalNoteParagraphs)
        .map((p) => p.textContent)
        .join(' ');

      const blogArticlesList = section.querySelector('#blogArticlesList');
      let blogHTML = '';
      if (blogArticlesList) {
        const articles = blogArticlesList.querySelectorAll('li');
        articles.forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const title = link.textContent || '';
            const url = link.href || '#';
            blogHTML += `<li style="margin: 0 0 16px; padding-left: 20px; position: relative; font-size: 1rem; line-height: 2; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">
              <span style="position: absolute; left: 0;">•</span> <a href="${url}" style="color: #333333; text-decoration: none;">${title}</a>
            </li>`;
          } else {
            const text = li.textContent || '';
            blogHTML += `<li style="margin: 0 0 16px; padding-left: 20px; position: relative; font-size: 1rem; line-height: 2; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">
              <span style="position: absolute; left: 0;">•</span> ${text}
            </li>`;
          }
        });
      }

      const maintenanceHeading = Array.from(
        section.querySelectorAll('h5')
      ).find((h) => h.textContent === 'Maintenance Essentials');
      const maintenanceList = maintenanceHeading
        ? maintenanceHeading.nextElementSibling
        : null;
      let maintenanceHTML = '';
      if (maintenanceList) {
        const items = maintenanceList.querySelectorAll('li');
        items.forEach((li) => {
          const text = li.textContent || '';
          maintenanceHTML += `<li style="margin: 0 0 16px; padding-left: 20px; position: relative; font-size: 1rem; line-height: 2; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">
            <span style="position: absolute; left: 0;">•</span> ${text}
          </li>`;
        });
      }

      const finalSecret = section.querySelector(
        'div[style*="background-color: #fafafa"]'
      );
      const secretTitle = finalSecret?.querySelector('h5')?.textContent || '';
      const secretText = finalSecret?.querySelector('p')?.textContent || '';

      const closingText = section.querySelector(
        'div[style*="text-align: center"]'
      );
      const closingQuote =
        closingText?.querySelector('p[style*="font-style: italic"]')
          ?.textContent || '';
      const signature = closingText?.querySelectorAll('p');
      const signatureName =
        signature && signature.length > 0
          ? signature[signature.length - 1]?.textContent
          : '';

      emailContent += `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
        <tr>
          <td style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td style="padding: 0 0 24px; text-align: center;">
                  <h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Final Thoughts & Resources</h3>
                </td>
              </tr>
              ${
                personalNoteText
                  ? `
              <tr>
                <td style="padding: 0 0 60px;">
                  <h4 style="margin: 0 0 24px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">A Personal Note</h4>
                  <p style="margin: 0 0 20px; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${personalNoteText}</p>
                </td>
              </tr>`
                  : ''
              }
              <tr>
                <td style="padding: 0 0 60px;">
                  <h4 style="margin: 0 0 24px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Useful Resources</h4>
                  
                  ${
                    blogHTML
                      ? `
                  <div style="margin-bottom: 32px;">
                    <h5 style="margin: 0 0 16px; font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Further Reading</h5>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      ${blogHTML}
                    </ul>
                  </div>`
                      : ''
                  }

                  ${
                    maintenanceHTML
                      ? `
                  <div style="margin-bottom: 32px;">
                    <h5 style="margin: 0 0 16px; font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Maintenance Essentials</h5>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      ${maintenanceHTML}
                    </ul>
                  </div>`
                      : ''
                  }

                  ${
                    secretTitle && secretText
                      ? `
                  <div style="background-color: #fafafa; padding: 32px; margin-top: 40px;">
                    <h5 style="margin: 0 0 16px; font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${secretTitle}</h5>
                    <p style="margin: 0; font-size: 1rem; line-height: 1.8; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${secretText}</p>
                  </div>`
                      : ''
                  }
                </td>
              </tr>
              ${
                closingQuote || signatureName
                  ? `
              <tr>
                <td style="padding: 60px 0 0; text-align: center;">
                  ${
                    closingQuote
                      ? `<p style="margin: 0 0 32px; font-size: 1.25rem; line-height: 1.8; color: #333333; font-style: italic; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${closingQuote}</p>`
                      : ''
                  }
                  ${
                    signatureName
                      ? `<p style="margin: 0 0 8px; font-size: 1.125rem; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">Warmest regards,</p>
                  <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #000000; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${signatureName}</p>`
                      : ''
                  }
                </td>
              </tr>`
                  : ''
              }
            </table>
          </td>
        </tr>
      </table>`;
    }
  });

  // Closing Section
  const closingSection = pdfDocument.querySelector('.pdf-closing');
  if (closingSection) {
    const closingTitle =
      closingSection.querySelector('.closing-title')?.textContent ||
      'Next Steps';
    const closingText =
      closingSection.querySelector('.closing-text')?.textContent || '';
    const appointmentBtn = closingSection.querySelector('.appointment-btn');
    const appointmentUrl = appointmentBtn?.href || '#';
    const appointmentText =
      appointmentBtn?.textContent || 'Book an Appointment';

    emailContent += `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border-bottom: 2px solid #000000;">
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h3 style="margin: 0 0 16px; font-size: 22px; font-weight: 400; color: #000000; letter-spacing: -0.01em; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${closingTitle}</h3>
          <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #333333; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">${closingText}</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center">
            <tr>
              <td style="background-color: #000000; border: 2px solid #000000;">
                <a href="${appointmentUrl}" style="display: inline-block; padding: 12px 28px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${appointmentText}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }

  // Build complete HTML document
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your Personalized Selection - FCI London</title>
    <!--[if mso]>
    <style type="text/css">
        table {border-collapse: collapse;}
        body {font-family: 'Crimson Text', Georgia, 'Times New Roman', serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1200px; width: 100%; background-color: #ffffff;">
            <tr>
              <td>
                ${emailContent}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
</body>
</html>`;

  return htmlContent;
}

// Function to extract structured data from DOM for PHP handler
function extractNewsletterDataFromDOM() {
  // Get the PDF document
  const pdfDocument = document.querySelector('.pdf-document');
  if (!pdfDocument) {
    console.error('PDF document not found');
    return null;
  }

  const data = {};

  // Hero Section
  const heroSection = pdfDocument.querySelector('.pdf-hero');
  if (heroSection) {
    const heroTitle = heroSection.querySelector('.hero-title');
    const heroTitleText = heroTitle ? heroTitle.textContent : '';
    const heroSubtitle =
      heroSection.querySelector('.hero-subtitle')?.textContent || '';
    const heroImage = heroSection.querySelector('#heroImage');
    const heroImageUrl = heroImage?.src || '';

    data.heroSection = {
      title: heroTitleText,
      subtitle: heroSubtitle,
      imageUrl: heroImageUrl,
    };
  }

  // Cover Section
  const coverSection = pdfDocument.querySelector('.pdf-cover');
  if (coverSection) {
    const coverTitle = coverSection.querySelector('h2');
    const coverTitleText = coverTitle ? coverTitle.textContent : '';
    const coverIntro = coverSection.querySelector('#coverIntro');
    const coverIntroHTML = coverIntro ? coverIntro.textContent : '';

    // Product Preview Grid - Collect all images in order
    const productPreviewContainer = coverSection.querySelector(
      '#productPreviewContainer'
    );
    const productPreview = [];

    if (productPreviewContainer) {
      // Collect all images from all rows into a single flat array
      const allImages = [];
      const productRows =
        productPreviewContainer.querySelectorAll('.productRow');

      productRows.forEach((row) => {
        const imageDivs = Array.from(row.children).filter(
          (child) => child.tagName === 'DIV' && child.querySelector('img')
        );

        imageDivs.forEach((div) => {
          const img = div.querySelector('img');
          if (img) {
            allImages.push({
              imageUrl: img.src,
              alt: img.alt || 'Product',
              wide: false, // Ignore classes, we'll use hardcoded structure
              narrow: false,
            });
          }
        });
      });

      // Add all images as a single row so PHP can handle the structure
      if (allImages.length > 0) {
        productPreview.push(allImages);
      }
    }

    data.coverSection = {
      title: coverTitleText,
      intro: coverIntroHTML,
      productPreview: productPreview,
    };
  }

  // Tips Section
  const tipsSection = pdfDocument.querySelector('.pdf-section.alternate');
  if (tipsSection && tipsSection.querySelector('#tipsContent')) {
    const tipsIntro =
      tipsSection.querySelector('#tipsIntro')?.textContent || '';
    const tipsThemeTitle = tipsSection.querySelector('#tipsThemeTitle');
    const tipsThemeTitleText = tipsThemeTitle ? tipsThemeTitle.textContent : '';
    const tipsContent = tipsSection.querySelector('#tipsContent');
    const tips = [];

    if (tipsContent) {
      const tipDivs = tipsContent.querySelectorAll(
        'div[style*="margin-bottom"]'
      );
      tipDivs.forEach((tip) => {
        const tipTitle = tip.querySelector('h4')?.textContent || '';
        const tipBody = tip.querySelector('p')?.textContent || '';
        if (tipTitle && tipBody) {
          tips.push({
            title: tipTitle,
            body: tipBody,
          });
        }
      });
    }

    data.tipsSection = {
      intro: tipsIntro,
      themeTitle: tipsThemeTitleText,
      tips: tips,
    };
  }

  // Products Section
  const productsSection = pdfDocument.querySelector('.products-section');
  if (productsSection) {
    const bespokeTitle = productsSection.querySelector('h3')?.textContent || '';
    const bespokeIntro = productsSection.querySelector(
      '#bespoke Selection Intro'
    );
    const bespokeIntroHTML = bespokeIntro ? bespokeIntro.textContent : '';
    const productItems = productsSection.querySelectorAll('.product-item');
    const products = [];

    productItems.forEach((item) => {
      if (item.style.display === 'none') return; // Skip hidden items

      const productTitle = item.querySelector('.product-title-link');
      const title = productTitle ? productTitle.textContent : '';
      const productUrl = productTitle?.dataset?.productUrl || '';

      // Check layout type
      const hasSectionSplit = item.querySelector('.section-split');
      const hasImageLarge = item.querySelector('.section-image-large');
      const imageBeforeTitle =
        item.querySelector('.section-image-large') &&
        item
          .querySelector('.section-image-large')
          .compareDocumentPosition(item.querySelector('.product-title-link')) &
          Node.DOCUMENT_POSITION_PRECEDING;

      const images = item.querySelectorAll('img');
      const imageUrl = images.length > 0 ? images[0].src : '';
      const imageAlt = images.length > 0 ? images[0].alt : 'Product image';
      const sectionTextLarge =
        item.querySelector('.section-text-large')?.textContent || '';
      const sectionText = item.querySelector('.section-text');
      const sectionTextHTML = sectionText ? sectionText.textContent : '';

      let layout = 'default';
      if (hasSectionSplit && !imageBeforeTitle) {
        layout = 'split';
      } else if (hasImageLarge && imageBeforeTitle) {
        layout = 'imageLarge';
      } else if (hasSectionSplit && imageBeforeTitle) {
        layout = 'split';
      }

      products.push({
        title: title,
        url: productUrl,
        imageUrl: imageUrl,
        imageAlt: imageAlt,
        textLarge: sectionTextLarge,
        text: sectionTextHTML,
        layout: layout,
        imageBeforeTitle: imageBeforeTitle || false,
        hidden: false,
      });
    });

    data.productsSection = {
      title: bespokeTitle,
      intro: bespokeIntroHTML,
      products: products,
    };
  }

  // Brand Spotlight Section
  const brandSpotlightSections = pdfDocument.querySelectorAll('.pdf-section');
  brandSpotlightSections.forEach((section) => {
    const brandSpotlightContent = section.querySelector(
      '#brandSpotlightContent'
    );
    if (brandSpotlightContent) {
      const intro =
        section.querySelector('#brandSpotlightIntro')?.textContent || '';
      const brands = brandSpotlightContent.querySelectorAll(
        'div[style*="margin-bottom: 60px"]'
      );
      const brandsArray = [];

      brands.forEach((brandDiv) => {
        const brandHeader = brandDiv.querySelector(
          'div[style*="display: flex"]'
        );
        const brandTitle = brandHeader
          ? brandHeader.querySelector('h4')?.textContent
          : brandDiv.querySelector('h4')?.textContent || '';
        const brandLogo = brandHeader ? brandHeader.querySelector('img') : null;
        const brandLogoUrl = brandLogo ? brandLogo.src : '';

        const paragraphs = brandDiv.querySelectorAll('p');
        let brandText = '';
        let insiderTip = '';
        paragraphs.forEach((p) => {
          const text = p.textContent || '';
          const style = p.getAttribute('style') || '';
          if (style.includes('Insider tip') || text.includes('Insider tip:')) {
            insiderTip = p.textContent || '';
          } else {
            brandText += (brandText ? ' ' : '') + text;
          }
        });

        if (brandTitle) {
          brandsArray.push({
            title: brandTitle,
            logoUrl: brandLogoUrl,
            text: brandText,
            insiderTip: insiderTip,
          });
        }
      });

      // Investment note
      const investmentNote = brandSpotlightContent.querySelector(
        'div[style*="margin-bottom: 40px"]:last-child'
      );
      let investmentNoteData = null;
      if (investmentNote) {
        const invTitle = investmentNote.querySelector('h4')?.textContent || '';
        const invContent = investmentNote.querySelector('p')?.textContent || '';
        if (invTitle && invContent && !invTitle.includes('-')) {
          investmentNoteData = {
            title: invTitle,
            content: invContent,
          };
        }
      }

      data.brandSpotlightSection = {
        intro: intro,
        brands: brandsArray,
        investmentNote: investmentNoteData,
      };
    }
  });

  // Showroom Strategy Section
  const showroomStrategySections = pdfDocument.querySelectorAll(
    '.pdf-section.alternate'
  );
  showroomStrategySections.forEach((section) => {
    const sectionTitle = section.querySelector('h3');
    if (
      sectionTitle &&
      sectionTitle.textContent.includes('Your Showroom Strategy')
    ) {
      const introText =
        section.querySelector('p[style*="text-align: center"]')?.textContent ||
        '';

      // Questions to Ask section
      const questionsHeading = Array.from(section.querySelectorAll('h4')).find(
        (h) => h.textContent.trim().includes('Questions to Ask')
      );
      const questions = [];
      if (questionsHeading) {
        let currentElement = questionsHeading.nextElementSibling;
        const questionDivs = [];

        while (currentElement) {
          if (
            currentElement.tagName === 'H4' ||
            currentElement.tagName === 'H5'
          ) {
            break;
          }
          if (currentElement.tagName === 'DIV') {
            const hasQuestion =
              currentElement.querySelector('p[style*="font-weight: 600"]') ||
              currentElement.querySelector('p[style*="font-weight:600"]');
            if (hasQuestion) {
              questionDivs.push(currentElement);
            }
          }
          currentElement = currentElement.nextElementSibling;
        }

        questionDivs.forEach((item) => {
          const paragraphs = item.querySelectorAll('p');
          let question = '';
          let answer = '';

          paragraphs.forEach((p) => {
            const style = p.getAttribute('style') || '';
            const text = p.textContent.trim();

            if (text) {
              if (
                style.includes('font-weight: 600') ||
                style.includes('font-weight:600')
              ) {
                question = text;
              } else if (style.includes('padding-left')) {
                answer = text;
              }
            }
          });

          if (question && answer) {
            questions.push({
              question: question,
              answer: answer,
            });
          }
        });
      }

      // What to Bring section
      const whatToBringHeading = Array.from(
        section.querySelectorAll('h4')
      ).find((h) => h.textContent.includes('What to Bring'));
      const whatToBring = [];
      if (whatToBringHeading) {
        const whatToBringContainer = whatToBringHeading.nextElementSibling;
        if (whatToBringContainer) {
          const items = whatToBringContainer.querySelectorAll(
            'div[style*="background-color: #ffffff"]'
          );
          items.forEach((item) => {
            const title =
              item.querySelector('p[style*="font-weight: 600"]')?.textContent ||
              '';
            const allParagraphs = item.querySelectorAll('p');
            let description = '';
            allParagraphs.forEach((p) => {
              const style = p.getAttribute('style') || '';
              if (!style.includes('font-weight: 600') && !description) {
                description = p.textContent || '';
              }
            });
            if (title && description) {
              whatToBring.push({
                title: title,
                description: description,
              });
            }
          });
        }
      }

      data.showroomStrategySection = {
        intro: introText,
        questions: questions,
        whatToBring: whatToBring,
      };
    }
  });

  // Final Thoughts & Resources Section
  const finalThoughtsSections = pdfDocument.querySelectorAll('.pdf-section');
  finalThoughtsSections.forEach((section) => {
    if (section.querySelector('#blogArticlesList')) {
      // Look for "A Personal Note" heading - try multiple variations
      const personalNoteHeading = Array.from(
        section.querySelectorAll('h4')
      ).find((h) => {
        const text = h.textContent.trim();
        return text === 'A Personal Note' || text.includes('Personal Note');
      });

      let personalNoteText = '';
      if (personalNoteHeading) {
        // The heading is inside a div, so get the parent div that contains both the heading and paragraphs
        let personalNoteContainer = personalNoteHeading.parentElement;

        // Check if parent is a div with margin-bottom (the container div)
        if (personalNoteContainer && personalNoteContainer.tagName === 'DIV') {
          // Get all paragraphs within this div (excluding the heading)
          const personalNoteParagraphs =
            personalNoteContainer.querySelectorAll('p');
          if (personalNoteParagraphs.length > 0) {
            // Join paragraphs with double line breaks to preserve spacing
            personalNoteText = Array.from(personalNoteParagraphs)
              .map((p) => p.textContent.trim())
              .filter((text) => text.length > 0)
              .join('\n\n');
          }
        }

        // Fallback: if we didn't find paragraphs in parent, try next sibling
        if (!personalNoteText && personalNoteHeading.nextElementSibling) {
          const nextSibling = personalNoteHeading.nextElementSibling;
          if (nextSibling.tagName === 'P') {
            // If next sibling is a paragraph, get all following paragraphs until next heading or div
            const paragraphs = [];
            let current = nextSibling;
            while (current && current.tagName === 'P') {
              const text = current.textContent.trim();
              if (text) paragraphs.push(text);
              current = current.nextElementSibling;
            }
            if (paragraphs.length > 0) {
              personalNoteText = paragraphs.join('\n\n');
            }
          } else if (
            nextSibling.querySelector &&
            nextSibling.querySelector('p')
          ) {
            // Next sibling is a container with paragraphs
            const paragraphs = nextSibling.querySelectorAll('p');
            personalNoteText = Array.from(paragraphs)
              .map((p) => p.textContent.trim())
              .filter((text) => text.length > 0)
              .join('\n\n');
          }
        }

        // Another fallback: search within the section for the div containing the personal note
        if (!personalNoteText) {
          // Find the div that contains the heading and its paragraphs
          const sectionDivs = section.querySelectorAll('div');
          for (const div of sectionDivs) {
            if (div.contains(personalNoteHeading) && div.querySelector('p')) {
              const paragraphs = div.querySelectorAll('p');
              personalNoteText = Array.from(paragraphs)
                .map((p) => p.textContent.trim())
                .filter((text) => text.length > 0)
                .join('\n\n');
              break;
            }
          }
        }
      }

      const blogArticlesList = section.querySelector('#blogArticlesList');
      const blogArticles = [];
      if (blogArticlesList) {
        const articles = blogArticlesList.querySelectorAll('li');
        articles.forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            blogArticles.push({
              title: link.textContent || '',
              url: link.href || '#',
            });
          } else {
            blogArticles.push(li.textContent || '');
          }
        });
      }

      const maintenanceHeading = Array.from(
        section.querySelectorAll('h5')
      ).find((h) => h.textContent === 'Maintenance Essentials');
      const maintenanceList = maintenanceHeading
        ? maintenanceHeading.nextElementSibling
        : null;
      const maintenance = [];
      if (maintenanceList) {
        const items = maintenanceList.querySelectorAll('li');
        items.forEach((li) => {
          maintenance.push(li.textContent || '');
        });
      }

      const finalSecret = section.querySelector(
        'div[style*="background-color: #fafafa"]'
      );
      const secretTitle = finalSecret?.querySelector('h5')?.textContent || '';
      const secretText = finalSecret?.querySelector('p')?.textContent || '';

      const closingText = section.querySelector(
        'div[style*="text-align: center"]'
      );
      const closingQuote =
        closingText?.querySelector('p[style*="font-style: italic"]')
          ?.textContent || '';
      const signature = closingText?.querySelectorAll('p');
      const signatureName =
        signature && signature.length > 0
          ? signature[signature.length - 1]?.textContent
          : '';

      data.finalThoughtsSection = {
        personalNote: personalNoteText,
        blogArticles: blogArticles,
        maintenance: maintenance,
        secretTitle: secretTitle,
        secretText: secretText,
        closingQuote: closingQuote,
        signatureName: signatureName,
      };
    }
  });

  // Closing Section
  const closingSection = pdfDocument.querySelector('.pdf-closing');
  if (closingSection) {
    const closingTitle =
      closingSection.querySelector('.closing-title')?.textContent ||
      'Next Steps';
    const closingText =
      closingSection.querySelector('.closing-text')?.textContent || '';
    const appointmentBtn = closingSection.querySelector('.appointment-btn');
    const appointmentUrl = appointmentBtn?.href || '#';
    const appointmentText =
      appointmentBtn?.textContent || 'Book an Appointment';

    data.closingSection = {
      title: closingTitle,
      text: closingText,
      appointmentUrl: appointmentUrl,
      appointmentText: appointmentText,
    };
  }

  return data;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    captureHTMLContent,
    extractNewsletterDataFromDOM,
  };
}
