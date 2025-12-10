<?php

/**
 * Email Template for Personalized Newsletter
 *
 * This template generates the HTML email content for personalized newsletters.
 * It expects the following variables to be available:
 * - $heroSection: Array with title, subtitle, imageUrl
 * - $coverSection: Array with title, intro, productPreview (array of products)
 * - $tipsSection: Array with intro, themeTitle, tips (array)
 * - $productsSection: Array with title, intro, products (array)
 * - $brandSpotlightSection: Array with intro, brands (array)
 * - $showroomStrategySection: Array with intro, questions, whatToBring
 * - $finalThoughtsSection: Array with personalNote, blogArticles, maintenance, secret, closingQuote, signatureName
 * - $closingSection: Array with title, text, appointmentUrl, appointmentText
 */

// Helper function to build full URL from relative path
function buildFullUrl($url)
{
    if (!$url) return '#';
    if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) {
        return $url;
    }
    $baseUrl = 'https://www.fcilondon.co.uk';
    $normalizedPath = strpos($url, '/') === 0 ? $url : '/' . $url;
    return $baseUrl . $normalizedPath;
}

// Helper function to build image URL
function buildImageUrl($imagePath)
{
    if (!$imagePath) return '';
    if (strpos($imagePath, 'http://') === 0 || strpos($imagePath, 'https://') === 0) {
        return $imagePath;
    }
    $baseUrl = 'https://www.fcilondon.co.uk';
    $normalizedPath = strpos($imagePath, '/') === 0 ? $imagePath : '/' . $imagePath;
    if (strpos($normalizedPath, '/site-assets/') === false) {
        if (strpos($normalizedPath, '/product-images/') === 0) {
            $normalizedPath = '/site-assets' . $normalizedPath;
        } else if (strpos($normalizedPath, '/site-assets/') !== 0) {
            $normalizedPath = '/site-assets/product-images' . $normalizedPath;
        }
    }
    return $baseUrl . $normalizedPath;
}

// Helper function to safely get array value
function getValue($array, $key, $default = '')
{
    return isset($array[$key]) ? $array[$key] : $default;
}

// Helper function to escape HTML while preserving line breaks
function escapeHtmlWithBreaks($text)
{
    if (!$text) return '';
    return nl2br(htmlspecialchars($text, ENT_QUOTES, 'UTF-8'));
}

// Helper function to add page break for PDF
function pageBreak()
{
    return '<div style="page-break-before: always; break-before: always; height: 0; margin: 0; padding: 0;"></div>';
}

// Initialize sections with empty arrays if not provided
$heroSection = isset($heroSection) ? $heroSection : [];
$coverSection = isset($coverSection) ? $coverSection : [];
$tipsSection = isset($tipsSection) ? $tipsSection : [];
$productsSection = isset($productsSection) ? $productsSection : [];
$brandSpotlightSection = isset($brandSpotlightSection) ? $brandSpotlightSection : [];
$showroomStrategySection = isset($showroomStrategySection) ? $showroomStrategySection : [];
$finalThoughtsSection = isset($finalThoughtsSection) ? $finalThoughtsSection : [];
$closingSection = isset($closingSection) ? $closingSection : [];

$emailContent = '';

// Hero Section
if (!empty($heroSection)) {
    $heroTitle = getValue($heroSection, 'title', '');
    $heroSubtitle = getValue($heroSection, 'subtitle', '');
    $heroImageUrl = getValue($heroSection, 'imageUrl', '');

    if ($heroImageUrl) {
        $heroImageUrl = buildImageUrl($heroImageUrl);
    }

    $heroTitleText = $heroTitle ? str_replace(["\r\n", "\r", "\n"], '<br>', htmlspecialchars($heroTitle)) : '';

    $emailContent .= '
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-bottom: 2px solid #000000;">
       <!-- Logo Header -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 2px solid #000000;">
                            <img src="https://www.fcilondon.co.uk/site-assets/automated-quiz/newsletter/logo-horizontal-text.png" alt="FCI LONDON Est. 1985" style="height: 50px; width: auto; display: inline-block; border: 0;" />
                        </td>
                    </tr>
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" class="stack-mobile">
            <tr>';

    if ($heroImageUrl) {
        $emailContent .= '
              <td width="45%" class="stack-mobile" style="padding: 0; vertical-align: top;">
                <img src="' . htmlspecialchars($heroImageUrl) . '" alt="Luxury living room" style="width: 100%; max-width: 100%; height: auto; display: block; border: 0;" />
              </td>';
    }

    $emailContent .= '
              <td width="' . ($heroImageUrl ? '55%' : '100%') . '" class="stack-mobile mobile-padding" style="padding: 25px 30px 25px 40px; vertical-align: middle; background-color: #ffffff;">
                <h1 style="margin: 0 0 16px; font-size: 2.5rem; font-weight: 400; line-height: 1.15; color: #000000; letter-spacing: -0.015em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $heroTitleText . '</h1>
                <p style="margin: 0; font-size: 1.125rem; font-weight: 400; color: #2c2c2c; line-height: 1.6; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($heroSubtitle) . '</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>';
}

// Cover Section
if (!empty($coverSection)) {
 
    // Product Preview Grid
    $productPreview = getValue($coverSection, 'productPreview', []);
    $previewGridHTML = '';

    if (!empty($productPreview) && is_array($productPreview)) {
        // Flatten all images into a single array
        $allImages = [];
        foreach ($productPreview as $row) {
            if (is_array($row)) {
                foreach ($row as $product) {
                    if (isset($product['imageUrl']) && !empty($product['imageUrl'])) {
                        $allImages[] = [
                            'url' => buildImageUrl($product['imageUrl']),
                            'alt' => isset($product['alt']) ? htmlspecialchars($product['alt']) : 'Product'
                        ];
                    }
                }
            }
        }
        // Only generate HTML if we have at least 7 images
        if (count($allImages) >= 7) {
            $previewGridHTML = '
   <table width="100%" cellpadding="0" cellspacing="0" border="0" class="stack-mobile" style="max-width: 1000px; margin: 48px auto 0;">
  <!-- First Row: 2 wide + 1 narrow (40% + 40% + 20%) -->
  <tr>
    <td class="stack-mobile" style="width: 40%; padding: 0 6px 0 0;">
      <img src="' . $allImages[0]['url'] . '" alt="' . $allImages[0]['alt'] . '" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
    </td>
    <td class="stack-mobile" style="width: 40%; padding: 0 6px;">
      <img src="' . $allImages[1]['url'] . '" alt="' . $allImages[1]['alt'] . '" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
    </td>
    <td class="stack-mobile" style="width: 20%; padding: 0 0 0 6px;">
      <img src="' . $allImages[2]['url'] . '" alt="' . $allImages[2]['alt'] . '" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
    </td>
  </tr>
  <!-- Second Row: 1 narrow + 1 wide + 2 narrow (20% + 40% + 20% + 20%) - Using nested table for Gmail -->
  <tr>
    <td colspan="3" style="padding: 6px 0 0 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" class="stack-mobile">
        <tr>
          <td class="stack-mobile" style="width: 20%; padding: 0 6px 0 0;">
            <img src="' . $allImages[3]['url'] . '" alt="' . $allImages[3]['alt'] . '" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
          </td>
          <td class="stack-mobile" style="width: 40%; padding: 0 6px;">
            <img src="' . $allImages[4]['url'] . '" alt="' . $allImages[4]['alt'] . '" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
          </td>
          <td class="stack-mobile" style="width: 20%; padding: 0 6px;">
            <img src="' . $allImages[5]['url'] . '" alt="' . $allImages[5]['alt'] . '" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
          </td>
          <td class="stack-mobile" style="width: 20%; padding: 0 0 0 6px;">
            <img src="' . $allImages[6]['url'] . '" alt="' . $allImages[6]['alt'] . '" style="width: 100%; height: 150px; object-fit: cover; display: block; border: 0;" />
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>';
        }
    }

    $emailContent .= '
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
      <tr>
        <td class="mobile-padding" style="padding: 80px 60px 60px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; margin: 0 auto;">
            <tr>
              <td style="text-align: center;">
                <h2 style="margin: 0 0 32px; font-size: 2.5rem; font-weight: 400; color: #000000; text-align: right; letter-spacing: -0.01em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Introducing our<br>top picks for you</h2>
                <div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; text-align: left; max-width: 580px; margin: 0 auto 48px; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">
                  <p style="margin: 0 0 16px;">Hello there,</p>
                  <p style="margin: 0;">How delightful to hear you\'re in the market for exceptional furniture. Clearly, you\'ve got your priorities straight. Before we dive into the details, here\'s a quick look at our top picks for you.</p>
                </div>
                ' . $previewGridHTML . '
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>';
}

// Tips Section
if (!empty($tipsSection)) {
    // Add page break before this section
    $emailContent .= pageBreak();
    
    $tipsIntro = getValue($tipsSection, 'intro', '');
    $tipsThemeTitle = getValue($tipsSection, 'themeTitle', '');
    $tipsThemeTitleHTML = $tipsThemeTitle ? str_replace(["\r\n", "\r", "\n"], '<br>', htmlspecialchars($tipsThemeTitle)) : '';
    $tips = getValue($tipsSection, 'tips', []);

    if (!empty($tips) && is_array($tips)) {
        $tipsHTML = '';
        foreach ($tips as $tip) {
            if (!is_array($tip)) continue;
            $tipTitle = getValue($tip, 'title', '');
            $tipBody = getValue($tip, 'body', '');

            if ($tipTitle && $tipBody) {
                $tipsHTML .= '
            <div style="margin-bottom: 40px; page-break-inside: avoid;">
              <h4 style="margin: 0 0 12px; font-size: 1.25rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($tipTitle) . '</h4>
              <p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($tipBody) . '</p>
            </div>';
            }
        }

        $emailContent .= '
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa;">
        <tr>
          <td class="mobile-padding" style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td>';

        if ($tipsIntro) {
            $emailContent .= '<p style="margin: 0 0 48px; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($tipsIntro) . '</p>';
        }

        if ($tipsThemeTitleHTML) {
            $emailContent .= '<h3 style="margin: 0 0 48px; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.01em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $tipsThemeTitleHTML . '</h3>';
        }

        $emailContent .= $tipsHTML . '
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>';
    }
}

// Products Section
if (!empty($productsSection)) {
    // Add page break before this section
     $emailContent .= pageBreak();
    $bespokeTitle = getValue($productsSection, 'title', '');
    $bespokeIntro = getValue($productsSection, 'intro', '');
    $bespokeIntroHTML = $bespokeIntro ? nl2br(htmlspecialchars($bespokeIntro)) : '';
    $products = getValue($productsSection, 'products', []);

    $productsHTML = '';
    if (!empty($products) && is_array($products)) {
        $productCount = count($products);
        foreach ($products as $index => $item) {
            if (!is_array($item)) continue;

            // Skip if hidden
            if (isset($item['hidden']) && $item['hidden']) continue;

            $productTitle = getValue($item, 'title', '');
            $titleHTML = $productTitle ? htmlspecialchars($productTitle) : '';
            $productUrl = getValue($item, 'url', '');

            // Check layout type
            $hasSectionSplit = isset($item['layout']) && $item['layout'] === 'split';
            $hasImageLarge = isset($item['layout']) && $item['layout'] === 'imageLarge';
            $imageBeforeTitle = isset($item['imageBeforeTitle']) && $item['imageBeforeTitle'];

            $imageUrl = getValue($item, 'imageUrl', '');
            if ($imageUrl) {
                $imageUrl = buildImageUrl($imageUrl);
            }
            $imageAlt = getValue($item, 'imageAlt', 'Product image');
            $sectionTextLarge = getValue($item, 'textLarge', '');
            $sectionText = getValue($item, 'text', '');
            $sectionTextHTML = $sectionText ? nl2br(htmlspecialchars($sectionText)) : '';

            $marginBottom = $index < $productCount - 1 ? '80px' : '0';

            // Build title with link if URL exists
            $titleHTMLFinal = $titleHTML;
            if ($productUrl && $titleHTML) {
                $productUrl = buildFullUrl($productUrl);
                $titleHTMLFinal = '<a href="' . htmlspecialchars($productUrl) . '" style="color: #000000; text-decoration: none;">' . $titleHTML . '</a>';
            }

            if ($hasSectionSplit && !$imageBeforeTitle) {
                // Layout: Title Center, Image Left + Text Right
                $productsHTML .= '
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ' . $marginBottom . '; page-break-inside: avoid;">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td style="padding: 0 0 40px; text-align: center;">
                    <h3 style="margin: 0; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $titleHTMLFinal . '</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="stack-mobile">
                      <tr>
                        <td width="45%" class="stack-mobile" style="padding-right: 28px; vertical-align: top;">';

                if ($imageUrl) {
                    $productsHTML .= '<img src="' . htmlspecialchars($imageUrl) . '" alt="' . htmlspecialchars($imageAlt) . '" style="width: 100%; max-width: 400px; height: auto; display: block; border: 0;" />';
                }

                $productsHTML .= '
                        </td>
                        <td width="55%" class="stack-mobile mobile-padding" style="padding-left: 28px; vertical-align: top;">';

                if ($sectionTextLarge) {
                    $productsHTML .= '<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($sectionTextLarge) . '</p>';
                }

                if ($sectionTextHTML) {
                    $productsHTML .= '<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $sectionTextHTML . '</div>';
                }

                $productsHTML .= '
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>';
            } else if ($hasImageLarge && $imageBeforeTitle) {
                // Layout: Full Width Image + Title Below
                $productsHTML .= '
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ' . $marginBottom . '; page-break-inside: avoid;">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td style="padding: 0 0 40px;">';

                if ($imageUrl) {
                    $productsHTML .= '<img src="' . htmlspecialchars($imageUrl) . '" alt="' . htmlspecialchars($imageAlt) . '" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto; border: 0;" />';
                }

                $productsHTML .= '
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 40px; text-align: center;">
                    <h3 style="margin: 0; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $titleHTMLFinal . '</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 900px; margin: 0 auto;">
                      <tr>
                        <td>';

                if ($sectionTextLarge) {
                    $productsHTML .= '<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($sectionTextLarge) . '</p>';
                }

                if ($sectionTextHTML) {
                    $productsHTML .= '<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $sectionTextHTML . '</div>';
                }

                $productsHTML .= '
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>';
            } else if ($hasSectionSplit && $imageBeforeTitle) {
                // Layout: Image Left + Title/Text Right
                $productsHTML .= '
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ' . $marginBottom . '; page-break-inside: avoid;">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" class="stack-mobile" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td width="45%" class="stack-mobile" style="padding-right: 28px; vertical-align: top;">';

                if ($imageUrl) {
                    $productsHTML .= '<img src="' . htmlspecialchars($imageUrl) . '" alt="' . htmlspecialchars($imageAlt) . '" style="width: 100%; max-width: 400px; height: auto; display: block; border: 0;" />';
                }

                $productsHTML .= '
                  </td>
                  <td width="55%" class="stack-mobile mobile-padding" style="padding-left: 28px; vertical-align: top;">
                    <h3 style="margin: 0 0 28px; font-size: 2.25rem; font-weight: 400; color: #000000; letter-spacing: -0.005em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $titleHTMLFinal . '</h3>';

                if ($sectionTextLarge) {
                    $productsHTML .= '<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($sectionTextLarge) . '</p>';
                }

                if ($sectionTextHTML) {
                    $productsHTML .= '<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $sectionTextHTML . '</div>';
                }

                $productsHTML .= '
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>';
            } else {
                // Default: Title Center, Full Width Image + Text Below
                $productsHTML .= '
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: ' . $marginBottom . '; page-break-inside: avoid;">
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 1100px; margin: 0 auto;">
                <tr>
                  <td style="padding: 0 0 40px; text-align: center;">
                    <h3 style="margin: 0; font-size: 2.25rem; font-weight: 400; color: #000000; text-align: center; letter-spacing: -0.005em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $titleHTMLFinal . '</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 40px;">';

                if ($imageUrl) {
                    $productsHTML .= '<img src="' . htmlspecialchars($imageUrl) . '" alt="' . htmlspecialchars($imageAlt) . '" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto; border: 0;" />';
                }

                $productsHTML .= '
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 900px; margin: 0 auto;">
                      <tr>
                        <td>';

                if ($sectionTextLarge) {
                    $productsHTML .= '<p style="margin: 0 0 24px; font-size: 1.375rem; line-height: 1.5; color: #000000; font-weight: 400; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($sectionTextLarge) . '</p>';
                }

                if ($sectionTextHTML) {
                    $productsHTML .= '<div style="font-size: 1.0625rem; line-height: 1.75; color: #2c2c2c; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $sectionTextHTML . '</div>';
                }

                $productsHTML .= '
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>';
            }
        }
    }

    $emailContent .= '
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
      <tr>
        <td class="mobile-padding" style="padding: 70px 60px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto; text-align: center;">
            <tr>
              <td style="padding: 0 0 10px;">';

    if ($bespokeTitle) {
        $emailContent .= '<h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($bespokeTitle) . '</h3>';
    }

    $emailContent .= '
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 60px;">';

    if ($bespokeIntroHTML) {
        $emailContent .= '<div style="font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $bespokeIntroHTML . '</div>';
    }

    $emailContent .= '
              </td>
            </tr>
          </table>
          ' . $productsHTML . '
        </td>
      </tr>
    </table>';
}

// Brand Spotlight Section
if (!empty($brandSpotlightSection)) {
    // Add page break before this section

    $intro = getValue($brandSpotlightSection, 'intro', '');
    $brands = getValue($brandSpotlightSection, 'brands', []);

    $brandsHTML = '';
    if (!empty($brands) && is_array($brands)) {
        foreach ($brands as $brand) {
            if (!is_array($brand)) continue;

            $brandTitle = getValue($brand, 'title', '');
            $brandLogoUrl = getValue($brand, 'logoUrl', '');
            if ($brandLogoUrl) {
                $brandLogoUrl = buildImageUrl($brandLogoUrl);
            }
            $brandText = getValue($brand, 'text', '');
            $brandTextHTML = $brandText ? nl2br(htmlspecialchars($brandText)) : '';

            // Check for insider tip (styled differently)
            $insiderTip = getValue($brand, 'insiderTip', '');

            if ($brandTitle) {
                $brandsHTML .= '
          <div style="margin-bottom: 60px; page-break-inside: avoid;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" class="stack-mobile" style="margin-bottom: 24px;">
              <tr>
                <td class="stack-mobile" style="padding: 0;">
                  <h4 style="margin: 0; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($brandTitle) . '</h4>
                </td>';

                if ($brandLogoUrl) {
                    $brandsHTML .= '<td class="stack-mobile" align="right" style="padding: 0;">
                  <img src="' . htmlspecialchars($brandLogoUrl) . '" alt="Brand Logo" style="height: 40px; object-fit: contain; border: 0;" />
                </td>';
                }

                $brandsHTML .= '
              </tr>
            </table>';

                if ($brandTextHTML) {
                    $brandsHTML .= '<p style="margin: 0 0 20px; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $brandTextHTML . '</p>';
                }

                if ($insiderTip) {
                    $insiderTipHTML = nl2br(htmlspecialchars($insiderTip));
                    $brandsHTML .= '<p style="margin: 32px 0 0; font-size: 1rem; line-height: 1.8; color: #666666; font-style: italic; padding-left: 24px; border-left: 3px solid #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . $insiderTipHTML . '</p>';
                }

                $brandsHTML .= '
          </div>';
            }
        }
    }

    // Investment note
    $investmentNote = getValue($brandSpotlightSection, 'investmentNote', []);
    $investmentHTML = '';
    if (!empty($investmentNote) && is_array($investmentNote)) {
        $invTitle = getValue($investmentNote, 'title', '');
        $invContent = getValue($investmentNote, 'content', '');
        if ($invTitle && $invContent && strpos($invTitle, '-') === false) {
            $investmentHTML = '
          <div style="margin-bottom: 40px; page-break-inside: avoid;">
            <h4 style="margin: 0 0 16px; font-size: 1.5rem; font-weight: 600; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($invTitle) . '</h4>
            <p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($invContent) . '</p>
          </div>';
        }
    }

    if ($brandsHTML || $investmentHTML) {
        $emailContent .= '
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
        <tr>
          <td class="mobile-padding" style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td style="padding: 0 0 24px; text-align: center;">
                  <h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Brand Spotlight: Your Perfect Match</h3>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 60px; text-align: center;">';

        if ($intro) {
            $emailContent .= '<p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($intro) . '</p>';
        }

        $emailContent .= '
                </td>
              </tr>
              <tr>
                <td>
                  ' . $brandsHTML . '
                  ' . $investmentHTML . '
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>';
    }
}

// Showroom Strategy Section
if (!empty($showroomStrategySection)) {

    
    $introText = getValue($showroomStrategySection, 'intro', '');
    $questions = getValue($showroomStrategySection, 'questions', []);
    $whatToBring = getValue($showroomStrategySection, 'whatToBring', []);

    $questionsHTML = '';
    if (!empty($questions) && is_array($questions)) {
        foreach ($questions as $qa) {
            if (!is_array($qa)) continue;
            $question = getValue($qa, 'question', '');
            $answer = getValue($qa, 'answer', '');

            if ($question && $answer) {
                $questionsHTML .= '
        <div style="margin-bottom: 32px; page-break-inside: avoid;">
          <p style="margin: 0 0 12px; font-size: 1.125rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($question) . '</p>
          <p style="margin: 0; font-size: 1rem; line-height: 1.8; color: #666666; padding-left: 20px; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($answer) . '</p>
        </div>';
            }
        }
    }

    $whatToBringHTML = '';
    if (!empty($whatToBring) && is_array($whatToBring)) {
        // Group items into rows of 2
        $itemRows = array_chunk($whatToBring, 2);

        foreach ($itemRows as $row) {
            $rowHTML = '<tr>';
            foreach ($row as $colIndex => $item) {
                if (!is_array($item)) continue;
                $title = getValue($item, 'title', '');
                $description = getValue($item, 'description', '');

                if ($title && $description) {
                    $padding = $colIndex === 0 ? '0 12px 24px 0' : '0 0 24px 12px';
                    $rowHTML .= '
                <td width="50%" class="stack-mobile mobile-padding" style="padding: ' . $padding . '; vertical-align: top;">
                  <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0; page-break-inside: avoid;">
                    <p style="margin: 0 0 8px; font-size: 1rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($title) . '</p>
                    <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: #666666; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($description) . '</p>
                  </div>
                </td>';
                }
            }
            $rowHTML .= '</tr>';
            $whatToBringHTML .= $rowHTML;
        }
    }

    if ($questionsHTML || $whatToBringHTML) {
        $emailContent .= '
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa;">
        <tr>
          <td class="mobile-padding" style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td style="padding: 0 0 24px; text-align: center;">
                  <h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Your Showroom Strategy</h3>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 60px; text-align: center;">';

        if ($introText) {
            $emailContent .= '<p style="margin: 0; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($introText) . '</p>';
        }

        $emailContent .= '
                </td>
              </tr>';

        if ($questionsHTML) {
            $emailContent .= '
              <tr>
                <td style="padding: 0 0 60px;">
                  <h4 style="margin: 0 0 32px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Questions to Ask (The Ones That Really Matter)</h4>
                  ' . $questionsHTML . '
                </td>
              </tr>';
        }

        if ($whatToBringHTML) {
            $emailContent .= '
              <tr>
                <td>
                  <h4 style="margin: 0 0 32px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">What to Bring to the Showroom</h4>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="stack-mobile">
                    ' . $whatToBringHTML . '
                  </table>
                </td>
              </tr>';
        }

        $emailContent .= '
            </table>
          </td>
        </tr>
      </table>';
    }
}

// Final Thoughts & Resources Section
if (!empty($finalThoughtsSection)) {

    
    $personalNote = getValue($finalThoughtsSection, 'personalNote', '');
    $blogArticles = getValue($finalThoughtsSection, 'blogArticles', []);
    $maintenance = getValue($finalThoughtsSection, 'maintenance', []);
    $secretTitle = getValue($finalThoughtsSection, 'secretTitle', '');
    $secretText = getValue($finalThoughtsSection, 'secretText', '');
    $closingQuote = getValue($finalThoughtsSection, 'closingQuote', '');
    $signatureName = getValue($finalThoughtsSection, 'signatureName', '');

    $blogHTML = '';
    if (!empty($blogArticles) && is_array($blogArticles)) {
        foreach ($blogArticles as $article) {
            if (is_array($article)) {
                $title = getValue($article, 'title', '');
                $url = getValue($article, 'url', '#');
                $url = buildFullUrl($url);
                $blogHTML .= '<li style="margin: 0 0 16px; padding-left: 20px; position: relative; font-size: 1rem; line-height: 2; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">
              <span style="position: absolute; left: 0;">•</span> <a href="' . htmlspecialchars($url) . '" style="color: #333333; text-decoration: none;">' . htmlspecialchars($title) . '</a>
            </li>';
            } else {
                // Plain text item
                $blogHTML .= '<li style="margin: 0 0 16px; padding-left: 20px; position: relative; font-size: 1rem; line-height: 2; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">
              <span style="position: absolute; left: 0;">•</span> ' . htmlspecialchars($article) . '
            </li>';
            }
        }
    }

    $maintenanceHTML = '';
    if (!empty($maintenance) && is_array($maintenance)) {
        foreach ($maintenance as $item) {
            $maintenanceHTML .= '<li style="margin: 0 0 16px; padding-left: 20px; position: relative; font-size: 1rem; line-height: 2; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">
            <span style="position: absolute; left: 0;"></span> ' . htmlspecialchars($item) . '
          </li>';
        }
    }

    $emailContent .= '
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
        <tr>
          <td class="mobile-padding" style="padding: 70px 60px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto;">
              <tr>
                <td style="padding: 0 0 24px; text-align: center;">
                  <h3 style="margin: 0; font-size: 2.5rem; font-weight: 300; color: #000000; letter-spacing: -0.02em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Final Thoughts & Resources</h3>
                </td>
              </tr>';

    if ($personalNote) {
        // Split personal note into paragraphs (preserving double line breaks)
        $personalNoteParagraphs = preg_split('/\n\s*\n/', $personalNote);
        $personalNoteHTML = '';

        foreach ($personalNoteParagraphs as $index => $paragraph) {
            $paragraph = trim($paragraph);
            if (!empty($paragraph)) {
                $marginBottom = ($index < count($personalNoteParagraphs) - 1) ? '20px' : '0';
                $personalNoteHTML .= '<p style="margin: 0 0 ' . $marginBottom . '; font-size: 1.125rem; line-height: 1.9; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . nl2br(htmlspecialchars($paragraph)) . '</p>';
            }
        }

        $emailContent .= '
              <tr>
                <td style="padding: 0 0 60px;">
                  <h4 style="margin: 0 0 24px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">A Personal Note</h4>
                  ' . $personalNoteHTML . '
                </td>
              </tr>';
    }

    $emailContent .= '
              <tr>
                <td style="padding: 0 0 60px;">
                  <h4 style="margin: 0 0 24px; font-size: 1.75rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Useful Resources</h4>';

    if ($blogHTML) {
        $emailContent .= '
                  <div style="margin-bottom: 32px;">
                    <h5 style="margin: 0 0 16px; font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Further Reading</h5>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      ' . $blogHTML . '
                    </ul>
                  </div>';
    }

    if ($maintenanceHTML) {
        $emailContent .= '
                  <div style="margin-bottom: 32px;">
                    <h5 style="margin: 0 0 16px; font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Maintenance Essentials</h5>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      ' . $maintenanceHTML . '
                    </ul>
                  </div>';
    }

    if ($secretTitle && $secretText) {
        $emailContent .= '
                  <div style="background-color: #fafafa; padding: 32px; margin-top: 40px; page-break-inside: avoid;">
                    <h5 style="margin: 0 0 16px; font-size: 1.25rem; font-weight: 600; font-style: italic; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($secretTitle) . '</h5>
                    <p style="margin: 0; font-size: 1rem; line-height: 1.8; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($secretText) . '</p>
                  </div>';
    }

    $emailContent .= '
                </td>
              </tr>';

    if ($closingQuote || $signatureName) {
        $emailContent .= '
              <tr>
                <td style="padding: 60px 0 0; text-align: center;">';

        if ($closingQuote) {
            $emailContent .= '<p style="margin: 0 0 32px; font-size: 1.25rem; line-height: 1.8; color: #333333; font-style: italic; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($closingQuote) . '</p>';
        }

        if ($signatureName) {
            $emailContent .= '<p style="margin: 0 0 8px; font-size: 1.125rem; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Warmest regards,</p>
                  <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($signatureName) . '</p>';
        }

        $emailContent .= '
                </td>
              </tr>';
    }

    $emailContent .= '
            </table>
          </td>
        </tr>
      </table>';
}

// Closing Section
if (!empty($closingSection)) {

    
    $closingTitle = getValue($closingSection, 'title', 'Next Steps');
    $closingText = getValue($closingSection, 'text', '');
    $appointmentUrl = getValue($closingSection, 'appointmentUrl', '#');
    $appointmentUrl = buildFullUrl($appointmentUrl);
    $appointmentText = getValue($closingSection, 'appointmentText', 'Book an Appointment');

    $emailContent .= '
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border-bottom: 2px solid #000000;">
      <tr>
        <td class="mobile-padding" style="padding: 40px 30px; text-align: center;">
          <h3 style="margin: 0 0 16px; font-size: 22px; font-weight: 400; color: #000000; letter-spacing: -0.01em; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($closingTitle) . '</h3>
          <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #333333; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">' . htmlspecialchars($closingText) . '</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center">
            <tr>
              <td style="background-color: #000000; border: 2px solid #000000;">
                <a href="' . htmlspecialchars($appointmentUrl) . '" style="display: inline-block; padding: 12px 28px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', sans-serif;">' . htmlspecialchars($appointmentText) . '</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>';
}

// Build complete HTML document
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your Personalized Selection - FCI London</title>
    
    <style type="text/css">
        /* ===== PDF PAGE BREAK CONTROLS ===== */

        /* Force new page before major sections */
        .page-break-before {
            page-break-before: always;
            break-before: always;
        }

        /* Prevent breaking inside sections */
        .keep-together {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Keep tips section items together */
        div[style*="margin-bottom: 40px"] {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Keep brand items together */
        div[style*="margin-bottom: 60px"] {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Keep Q&A items together */
        div[style*="margin-bottom: 32px"] {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Prevent heading orphans */
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Keep heading with next content */
        h2 + table,
        h3 + table,
        h4 + table {
            page-break-before: avoid;
            break-before: avoid;
        }

        /* Prevent widows and orphans */
        p {
            orphans: 3;
            widows: 3;
        }

        /* Keep images with their content */
        img {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Prevent breaking inside lists */
        ul, ol, li {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Keep product items together */
        table[style*="margin-bottom"] {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Better spacing for PDF */
        @media print {
            body {
                line-height: 1.6;
            }

            img {
                max-width: 100%;
                height: auto;
            }
        }

        /* ===== MOBILE RESPONSIVE STYLES ===== */
        @media only screen and (max-width: 600px) {
            /* Force tables to stack vertically */
            table[class="stack-mobile"] {
                width: 100% !important;
            }

            td[class="stack-mobile"] {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }

            /* Reset padding for mobile */
            td[class="mobile-padding"] {
                padding: 20px !important;
            }

            /* Adjust font sizes for mobile */
            h1 {
                font-size: 1.75rem !important;
            }

            h2 {
                font-size: 1.5rem !important;
            }

            h3 {
                font-size: 1.375rem !important;
            }

            h4 {
                font-size: 1.125rem !important;
            }

            /* Full width images on mobile */
            img {
                max-width: 100% !important;
                height: auto !important;
            }

            /* Hide empty space cells on mobile */
            td[class="hide-mobile"] {
                display: none !important;
            }
        }
    </style>
    
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
                            <?php
                            // Check if email content is empty and provide fallback
                            if (empty($emailContent)) {
                                echo '
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px;">
                                    <tr>
                                        <td style="text-align: center; padding: 40px;">
                                            <h2 style="margin: 0 0 20px; font-size: 1.5rem; font-weight: 400; color: #000000; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Your Personalized Newsletter</h2>
                                            <p style="margin: 0; font-size: 1rem; color: #666666; font-family: \'Crimson Text\', Georgia, \'Times New Roman\', serif;">Content is being prepared. Please check back later.</p>
                                        </td>
                                    </tr>
                                </table>';
                            } else {
                                echo $emailContent;
                            }
                            ?>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>