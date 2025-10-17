// Email HTML Generator
// This file handles generating email-friendly HTML with inline styles

// Function to capture HTML content for email
function captureHTMLContent() {
  // Get the PDF document
  const pdfDocument = document.querySelector('.pdf-document');
  if (!pdfDocument) {
    console.error('PDF document not found');
    return null;
  }

  // Extract content from the document
  const coverSection = pdfDocument.querySelector('.pdf-cover');
  const sections = pdfDocument.querySelectorAll('.pdf-section');
  const closingSection = pdfDocument.querySelector('.pdf-closing');

  // Build email-friendly HTML from scratch using tables
  let emailContent = '';

  // Cover section
  if (coverSection) {
    const date = coverSection.querySelector('.pdf-date')?.textContent || '';
    const title = coverSection.querySelector('.pdf-title')?.textContent || '';
    const subtitle =
      coverSection.querySelector('.pdf-subtitle')?.textContent || '';
    const intro = coverSection.querySelector('.pdf-intro')?.textContent || '';

    emailContent += `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%); border-bottom: 1px solid #e0e0e0;">
      <tr>
        <td style="padding: 50px 30px 40px; text-align: center;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase; color: #666666; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${date}</p>
          <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 300; line-height: 1.2; color: #000000; letter-spacing: -0.02em; font-family: Georgia, 'Times New Roman', serif;">${title}</h1>
          <p style="margin: 0 0 24px; font-size: 16px; font-weight: 400; color: #666666; font-style: italic; font-family: Georgia, 'Times New Roman', serif;">${subtitle}</p>
          <div style="width: 60px; height: 2px; background-color: #000000; margin: 24px auto;"></div>
          <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333333; text-align: left; max-width: 500px; margin: 0 auto; font-family: Georgia, 'Times New Roman', serif;">${intro}</p>
        </td>
      </tr>
    </table>`;
  }

  // Product sections
  sections.forEach((section, index) => {
    const sectionNumber =
      section.querySelector('.section-number')?.textContent || '';
    const sectionCategory =
      section.querySelector('.section-category')?.textContent || '';
    const sectionTitleElement = section.querySelector('.section-title');
    const sectionTitle = sectionTitleElement?.textContent || '';
    const productUrl = sectionTitleElement?.dataset?.productUrl || '';
    const sectionText =
      section.querySelector('.section-text, .section-text-large')
        ?.textContent || '';
    const sectionImage = section.querySelector(
      '.section-image-large img, .section-image-half img'
    );
    const imageUrl = sectionImage?.src || '';
    const imageAlt = sectionImage?.alt || 'Product image';

    const bgColor = index % 2 === 1 ? '#fafafa' : '#ffffff';

    emailContent += `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${bgColor}; border-bottom: 1px solid #e0e0e0;">
      <tr>
        <td style="padding: 40px 30px;">
          <!-- Section Header -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
            <tr>
              <td>
                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${sectionCategory}</p>
                <h2 style="margin: 0; font-size: 26px; font-weight: 400; color: #000000; letter-spacing: -0.01em; font-family: Georgia, 'Times New Roman', serif;">
                  <span style="font-size: 32px; font-weight: 200; color: #cccccc; margin-right: 12px;">${sectionNumber}</span>${
      productUrl
        ? `<a href="${productUrl}" style="color: #000000; text-decoration: none;">${sectionTitle}</a>`
        : sectionTitle
    }
                </h2>
              </td>
            </tr>
          </table>

          <!-- Section Image -->
          ${
            imageUrl
              ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td>
                <img src="${imageUrl}" alt="${imageAlt}" style="width: 100%; max-width: 540px; height: auto; display: block; border: 0;" />
              </td>
            </tr>
          </table>`
              : ''
          }

          <!-- Section Text -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size: 15px; line-height: 1.8; color: #333333; font-family: Georgia, 'Times New Roman', serif;">
                ${sectionText}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  });

  // Closing section
  if (closingSection) {
    const closingTitle =
      closingSection.querySelector('.closing-title')?.textContent ||
      'Next Steps';
    const closingText =
      closingSection.querySelector('.closing-text')?.textContent || '';
    const appointmentBtn = closingSection.querySelector('.appointment-btn');
    const appointmentUrl = appointmentBtn?.href || '#';
    const appointmentText =
      appointmentBtn?.textContent || 'BOOK AN APPOINTMENT';

    // Get contact info
    const contactItems = closingSection.querySelectorAll('.contact-item');
    let contactHTML = '';
    contactItems.forEach((item) => {
      const label = item.querySelector('.contact-label')?.textContent || '';
      const value = item.querySelector('.contact-value')?.textContent || '';
      contactHTML += `
        <td style="padding: 12px 20px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${label}</p>
          <p style="margin: 0; font-size: 15px; font-weight: 400; color: #000000; font-family: Georgia, 'Times New Roman', serif;">${value}</p>
        </td>`;
    });

    emailContent += `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border-bottom: 2px solid #000000;">
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: -0.01em; font-family: Georgia, 'Times New Roman', serif;">${closingTitle}</h2>
          <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #333333; font-family: Georgia, 'Times New Roman', serif;">${closingText}</p>

          <!-- Contact Info -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
            <tr>
              ${contactHTML}
            </tr>
          </table>

          <!-- CTA Button -->
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
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Georgia, 'Times New Roman', serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
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

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    captureHTMLContent,
  };
}
