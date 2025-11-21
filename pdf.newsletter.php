<?php
/*
 * PDF Newsletter Generator
 * 
 * Generates a PDF version of the personalized newsletter using Html2Pdf
 * Uses data extracted from handler.personalize-newsletter.php
 * Aligned with email.personalize-newsletter.php styling
 * 
 * Author: Gabriel Maturan
 * Date: 2025-01-XX
 */

require_once __DIR__ . '/../../../vendor/autoload.php';

use Spipu\Html2Pdf\Html2Pdf;
use Spipu\Html2Pdf\Exception\Html2PdfException;

// Helper function to build full URL from relative path
function buildFullUrlPDF($url)
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
function buildImageUrlPDF($imagePath)
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
function getValuePDF($array, $key, $default = '')
{
    return isset($array[$key]) ? $array[$key] : $default;
}

// Function to generate PDF from newsletter data
function generateNewsletterPDF($data, $outputPath = null)
{
    try {
        // Extract data with safe defaults
        $userName = $data['userName'] ?? 'Valued Customer';
        $userEmail = $data['userEmail'] ?? '';
        $heroSection = $data['heroSection'] ?? [];
        $coverSection = $data['coverSection'] ?? [];
        $tipsSection = $data['tipsSection'] ?? [];
        $productsSection = $data['productsSection'] ?? [];
        $brandSpotlightSection = $data['brandSpotlightSection'] ?? [];
        $showroomStrategySection = $data['showroomStrategySection'] ?? [];
        $finalThoughtsSection = $data['finalThoughtsSection'] ?? [];
        $closingSection = $data['closingSection'] ?? [];

        // Start HTML content for PDF
        ob_start();
?>
        <page backtop="7mm" backbottom="7mm" backleft="7mm" backright="7mm">
            <style type="text/css">
                /* Base Typography - Matching Email */
                body {
                    color: #2c2c2c;
                    font-size: 10.5pt;
                    line-height: 1.75;
                    margin: 0;
                    padding: 0;
                }

                /* Headings - Matching Email Exactly */
                h1 {
                    font-size: 24pt;
                    font-weight: 400;
                    color: #000000;
                    margin: 0 0 12pt 0;
                    letter-spacing: -0.36pt;
                    line-height: 1.15;
                }

                h2 {
                    font-size: 20pt;
                    font-weight: 400;
                    color: #000000;
                    margin: 0 0 10pt 0;
                    letter-spacing: -0.2pt;
                }

                h3 {
                    font-size: 18pt;
                    font-weight: 300;
                    color: #000000;
                    margin: 0 0 8pt 0;
                    letter-spacing: -0.36pt;
                }

                h4 {
                    font-size: 13pt;
                    font-weight: 400;
                    color: #000000;
                    margin: 0 0 8pt 0;
                }

                h5 {
                    font-size: 11pt;
                    font-weight: 600;
                    color: #000000;
                    margin: 0 0 6pt 0;
                    font-style: italic;
                }

                /* Paragraph Styles */
                p {
                    font-size: 10.5pt;
                    line-height: 1.75;
                    margin: 0 0 10pt 0;
                    color: #2c2c2c;
                    text-align: justify;
                }

                .text-large {
                    font-size: 13pt;
                    font-weight: 400;
                    line-height: 1.5;
                    color: #000000;
                    margin: 0 0 12pt 0;
                }

                /* Utility Classes */
                .text-center {
                    text-align: center;
                }

                .text-right {
                    text-align: right;
                }

                /* Lists - Matching Email */
                ul {
                    margin: 0;
                    padding-left: 0;
                    list-style: none;
                }

                li {
                    margin-bottom: 8pt;
                    padding-left: 15pt;
                    position: relative;
                    font-size: 10pt;
                    line-height: 2;
                    color: #333333;
                }

                li:before {
                    content: "•";
                    position: absolute;
                    left: 0;
                }

                /* Special Sections */
                .insider-tip {
                    font-size: 10pt;
                    font-style: italic;
                    padding: 8pt 0 8pt 15pt;
                    border-left: 3px solid #000000;
                    margin-top: 20pt;
                    line-height: 1.8;
                }

                .secret-box {
                    background-color: #fafafa;
                    padding: 20pt;
                    margin-top: 20pt;
                }

                /* Background Colors */
                .bg-fafafa {
                    background-color: #fafafa;
                }

                .bg-white {
                    background-color: #ffffff;
                }

                /* Page Break Controls */
                .page-break {
                    page-break-after: always;
                }

                .keep-together {
                    page-break-inside: avoid;
                }

                /* Question Answer Styles */
                .question {
                    font-size: 10.5pt;
                    font-weight: 400;
                    color: #000000;
                    margin: 0 0 8pt 0;
                }

                .answer {
                    font-size: 10pt;
                    line-height: 1.8;
                    color: #666666;
                    padding-left: 15pt;
                    margin: 0 0 20pt 0;
                }

                /* Product Number Styling */
                .product-number {
                    font-size: 18pt;
                    font-weight: 300;
                    color: #d0d0d0;
                }

                /* Section Spacing */
                .section-spacing {
                    margin-bottom: 40pt;
                }

                .section-spacing-small {
                    margin-bottom: 25pt;
                }
            </style>
            <!-- Logo Header - Simplest Version -->
            <div style="width: 100%; text-align: center; padding: 10pt 0; border-bottom: 1px solid #000000; ">
                <img src="https://www.fcilondon.co.uk/site-assets/automated-quiz/newsletter/logo-horizontal-text.png"
                    alt="FCI LONDON Est. 1985"
                    style="height: 35pt; width: auto;" />
            </div>

            <?php
            // Hero Section - FIXED VERSION
            if (!empty($heroSection)) {
                $heroTitle = getValuePDF($heroSection, 'title', '');
                $heroSubtitle = getValuePDF($heroSection, 'subtitle', '');
                $heroImageUrl = getValuePDF($heroSection, 'imageUrl', '');

                if ($heroImageUrl) {
                    $heroImageUrl = buildImageUrlPDF($heroImageUrl);
                }

                $heroTitleText = $heroTitle ? str_replace(["\r\n", "\r", "\n"], '<br>', htmlspecialchars($heroTitle)) : '';
            ?>
                <table style="width: 100%; margin-bottom: 25pt; border-bottom: 1px solid #000000;" class="keep-together">
                    <tr>
                        <?php if ($heroImageUrl): ?>
                            <td style="width: 40%; vertical-align: middle; padding-right: 20pt;">
                                <img src="<?php echo htmlspecialchars($heroImageUrl); ?>"
                                    alt="Hero Image"
                                    style="width: 100%; max-width: 200pt; height: auto; display: block;" />
                            </td>
                            <td style="width: 60%; vertical-align: middle; padding-left: 0;">
                                <?php if ($heroTitleText): ?>
                                    <h1 style="font-size: 24pt; font-weight: 400; color: #000000; margin: 0 0 12pt 0; letter-spacing: -0.36pt; line-height: 1.2;">
                                        <?php echo $heroTitleText; ?>
                                    </h1>
                                <?php endif; ?>
                                <?php if ($heroSubtitle): ?>
                                    <p style="font-size: 11pt; line-height: 1.6; margin: 0; color: #333333;">
                                        <?php echo htmlspecialchars($heroSubtitle); ?>
                                    </p>
                                <?php endif; ?>
                            </td>
                        <?php else: ?>
                            <!-- No image version - centered text -->
                            <td style="width: 100%; vertical-align: middle; text-align: center; padding: 20pt 40pt;">
                                <?php if ($heroTitleText): ?>
                                    <h1 style="font-size: 28pt; font-weight: 400; color: #000000; margin: 0 0 15pt 0; letter-spacing: -0.36pt; line-height: 1.2;">
                                        <?php echo $heroTitleText; ?>
                                    </h1>
                                <?php endif; ?>
                                <?php if ($heroSubtitle): ?>
                                    <p style="font-size: 12pt; line-height: 1.6; margin: 0; color: #333333;">
                                        <?php echo htmlspecialchars($heroSubtitle); ?>
                                    </p>
                                <?php endif; ?>
                            </td>
                        <?php endif; ?>
                    </tr>
                </table>
            <?php
            }
            ?>
            <?php
            // Cover Section - HYBRID APPROACH (Table structure with minimal nesting)
            if (!empty($coverSection)) {
                $productPreview = getValuePDF($coverSection, 'productPreview', []);

                // Flatten all images
                $allImages = [];
                if (!empty($productPreview) && is_array($productPreview)) {
                    foreach ($productPreview as $row) {
                        if (is_array($row)) {
                            foreach ($row as $product) {
                                if (isset($product['imageUrl']) && !empty($product['imageUrl'])) {
                                    $allImages[] = [
                                        'url' => buildImageUrlPDF($product['imageUrl']),
                                        'alt' => isset($product['alt']) ? htmlspecialchars($product['alt']) : 'Product'
                                    ];
                                }
                            }
                        }
                    }
                }
            ?>
                <table style="width: 100%; margin-bottom: 30pt;" class="keep-together">
                    <tr>
                        <td>
                            <h2 style="text-align: right; margin-bottom: 20pt; font-size: 20pt; line-height: 1.3;">
                                Introducing our<br>top picks for you
                            </h2>
                            <p style="margin-bottom: 8pt;"><strong>Hello there,</strong></p>
                            <p style="margin-bottom: 25pt;">How delightful to hear you're in the market for exceptional furniture. Clearly, you've got your priorities straight. Before we dive into the details, here's a quick look at our top picks for you.</p>
                        </td>
                    </tr>
                </table>

                <?php if (count($allImages) >= 7): ?>
                    <!-- Image Grid - 7 Images Using Divs -->
                    <div style="width: 100%; margin-top: 15pt; margin-bottom: 20pt; position: relative; height: 180pt;">
                        <!-- First Row: 3 images (2 wide + 1 narrow) -->
                        <div style="position: absolute; left: 0; top: 0; width: 39%; height: 110pt; padding: 3pt;">
                            <img src="<?php echo $allImages[0]['url']; ?>"
                                alt="<?php echo $allImages[0]['alt']; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </div>
                        <div style="position: absolute; left: 40%; top: 0; width: 39%; height: 110pt; padding: 3pt;">
                            <img src="<?php echo $allImages[1]['url']; ?>"
                                alt="<?php echo $allImages[1]['alt']; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </div>
                        <div style="position: absolute; left: 80%; top: 0; width: 20%; height: 110pt; padding: 3pt;">
                            <img src="<?php echo $allImages[2]['url']; ?>"
                                alt="<?php echo $allImages[2]['alt']; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </div>

                        <!-- Second Row: 4 images (1 narrow + 1 wide + 2 narrow) -->
                        <div style="position: absolute; left: 0; top: 115pt; width: 20%; height: 110pt; padding: 3pt;">
                            <img src="<?php echo $allImages[3]['url']; ?>"
                                alt="<?php echo $allImages[3]['alt']; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </div>
                        <div style="position: absolute; left: 21%; top: 115pt; width: 39%; height: 110pt; padding: 3pt;">
                            <img src="<?php echo $allImages[4]['url']; ?>"
                                alt="<?php echo $allImages[4]['alt']; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </div>
                        <div style="position: absolute; left: 61%; top: 115pt; width: 19%; height: 110pt; padding: 3pt;">
                            <img src="<?php echo $allImages[5]['url']; ?>"
                                alt="<?php echo $allImages[5]['alt']; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </div>
                        <div style="position: absolute; left: 81%; top: 115pt; width: 19%; height: 110pt; padding: 3pt;">
                            <img src="<?php echo $allImages[6]['url']; ?>"
                                alt="<?php echo $allImages[6]['alt']; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </div>
                    </div>
                <?php endif; ?>
            <?php
            }
            ?>
        </page>

        <!-- Tips Section -->
        <?php
        if (!empty($tipsSection)) {
            $tipsIntro = getValuePDF($tipsSection, 'intro', '');
            $tipsThemeTitle = getValuePDF($tipsSection, 'themeTitle', '');
            $tips = getValuePDF($tipsSection, 'tips', []);
        ?>
            <page backtop="7mm" backbottom="7mm" backleft="7mm" backright="7mm">
                <div style="width: 100%; min-height: 100%;">
                    <?php if ($tipsIntro): ?>
                        <p style="margin-bottom: 25pt; font-size: 11pt; line-height: 1.9; color: #2c2c2c; text-align: justify;">
                            <?php echo htmlspecialchars($tipsIntro); ?>
                        </p>
                    <?php endif; ?>

                    <?php if ($tipsThemeTitle): ?>
                        <h3 style="text-align: center; margin-bottom: 30pt; font-size: 18pt; font-weight: 300; color: #000000; letter-spacing: -0.36pt; line-height: 1.3;">
                            <?php echo str_replace(["\r\n", "\r", "\n"], '<br>', htmlspecialchars($tipsThemeTitle)); ?>
                        </h3>
                    <?php endif; ?>

                    <?php
                    if (!empty($tips) && is_array($tips)) {
                        foreach ($tips as $tip) {
                            if (!is_array($tip)) continue;
                            $tipTitle = getValuePDF($tip, 'title', '');
                            $tipBody = getValuePDF($tip, 'body', '');

                            if ($tipTitle && $tipBody):
                    ?>
                                <div style="margin-bottom: 28pt; page-break-inside: avoid;">
                                    <h4 style="font-size: 12pt; font-weight: 400; color: #000000; margin: 0 0 10pt 0;">
                                        <?php echo htmlspecialchars($tipTitle); ?>
                                    </h4>
                                    <p style="font-size: 11pt; line-height: 1.9; color: #333333; margin: 0; text-align: justify;">
                                        <?php echo htmlspecialchars($tipBody); ?>
                                    </p>
                                </div>
                    <?php
                            endif;
                        }
                    }
                    ?>
                </div>
            </page>
        <?php
        }

        // Products Section
        if (!empty($productsSection)) {
            $bespokeTitle = getValuePDF($productsSection, 'title', '');
            $bespokeIntro = getValuePDF($productsSection, 'intro', '');
            $products = getValuePDF($productsSection, 'products', []);

            $visibleProducts = array_filter($products, function ($product) {
                return empty($product['hidden']);
            });
        ?>
            <page backtop="7mm" backbottom="7mm" backleft="7mm" backright="7mm">
                <table style="width: 100%; margin-bottom: 20pt;" class="keep-together">
                    <tr>
                        <td class="text-center">
                            <?php if ($bespokeTitle): ?>
                                <h3 style="margin-bottom: 10pt; font-size: 20pt; font-weight: 300; text-align: center;"><?php echo htmlspecialchars($bespokeTitle); ?></h3>
                            <?php endif; ?>
                            <?php if ($bespokeIntro): ?>
                                <p style="margin-bottom: 35pt; font-size: 11pt; line-height: 1.9; color: #333333;"><?php echo nl2br(htmlspecialchars($bespokeIntro)); ?></p>
                            <?php endif; ?>
                        </td>
                    </tr>
                </table>

                <?php
                $productIndex = 0;
                foreach ($visibleProducts as $item) {
                    if (!is_array($item)) continue;

                    $productTitle = getValuePDF($item, 'title', '');
                    $productUrl = getValuePDF($item, 'url', '');
                    $imageUrl = getValuePDF($item, 'imageUrl', '');
                    if ($imageUrl) {
                        $imageUrl = buildImageUrlPDF($imageUrl);
                    }
                    $imageAlt = getValuePDF($item, 'imageAlt', 'Product');
                    $textLarge = getValuePDF($item, 'textLarge', '');
                    $text = getValuePDF($item, 'text', '');

                    $hasSectionSplit = isset($item['layout']) && $item['layout'] === 'split';
                    $hasImageLarge = isset($item['layout']) && $item['layout'] === 'imageLarge';
                    $imageBeforeTitle = isset($item['imageBeforeTitle']) && $item['imageBeforeTitle'];

                    $productIndex++;
                ?>
                    <table style="width: 100%; margin-bottom: 25pt;" class="keep-together">
                        <tr>
                            <td>
                                <?php if ($hasSectionSplit && !$imageBeforeTitle): ?>
                                    <!-- Title Center, Image Left + Text Right -->
                                    <h3 class="text-center" style="margin-bottom: 25pt; font-size: 18pt;"><?php echo htmlspecialchars($productTitle); ?></h3>
                                    <table style="width: 100%;">
                                        <tr>
                                            <td style="width: 45%; vertical-align: top; padding-right: 15pt;">
                                                <?php if ($imageUrl): ?>
                                                    <img src="<?php echo htmlspecialchars($imageUrl); ?>" alt="<?php echo htmlspecialchars($imageAlt); ?>" style="width: 100%; max-width: 200pt; height: auto;" />
                                                <?php endif; ?>
                                            </td>
                                            <td style="width: 55%; vertical-align: top; padding-left: 15pt;">
                                                <?php if ($textLarge): ?>
                                                    <p class="text-large"><?php echo htmlspecialchars($textLarge); ?></p>
                                                <?php endif; ?>
                                                <?php if ($text): ?>
                                                    <p style="font-size: 10.5pt; line-height: 1.75; color: #2c2c2c;"><?php echo nl2br(htmlspecialchars($text)); ?></p>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    </table>

                                <?php elseif ($hasImageLarge && $imageBeforeTitle): ?>
                                    <!-- Full Width Image + Title Below - FIXED -->
                                    <?php if ($imageUrl): ?>
                                        <div style="text-align: center; margin-bottom: 15pt;">
                                            <img src="<?php echo htmlspecialchars($imageUrl); ?>"
                                                alt="<?php echo htmlspecialchars($imageAlt); ?>"
                                                style="max-width: 180pt; height: auto; display: inline-block;" />
                                        </div>
                                    <?php endif; ?>
                                    <h3 class="text-center" style="margin-bottom: 25pt; font-size: 18pt;"><?php echo htmlspecialchars($productTitle); ?></h3>
                                    <div style="max-width: 450pt; margin: 0 auto;">
                                        <?php if ($textLarge): ?>
                                            <p class="text-large"><?php echo htmlspecialchars($textLarge); ?></p>
                                        <?php endif; ?>
                                        <?php if ($text): ?>
                                            <p style="font-size: 10.5pt; line-height: 1.75; color: #2c2c2c;"><?php echo nl2br(htmlspecialchars($text)); ?></p>
                                        <?php endif; ?>
                                    </div>

                                <?php elseif ($hasSectionSplit && $imageBeforeTitle): ?>
                                    <!-- Image Left + Title/Text Right -->
                                    <table style="width: 100%;">
                                        <tr>
                                            <td style="width: 45%; vertical-align: top; padding-right: 15pt;">
                                                <?php if ($imageUrl): ?>
                                                    <img src="<?php echo htmlspecialchars($imageUrl); ?>" alt="<?php echo htmlspecialchars($imageAlt); ?>" style="width: 100%; max-width: 200pt; height: auto;" />
                                                <?php endif; ?>
                                            </td>
                                            <td style="width: 55%; vertical-align: top; padding-left: 15pt;">
                                                <h3 style="margin-bottom: 15pt; font-size: 18pt;"><?php echo htmlspecialchars($productTitle); ?></h3>
                                                <?php if ($textLarge): ?>
                                                    <p class="text-large"><?php echo htmlspecialchars($textLarge); ?></p>
                                                <?php endif; ?>
                                                <?php if ($text): ?>
                                                    <p style="font-size: 10.5pt; line-height: 1.75; color: #2c2c2c;"><?php echo nl2br(htmlspecialchars($text)); ?></p>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    </table>

                                <?php else: ?>
                                    <!-- Default: Title Center, Image + Text Below - FIXED -->
                                    <h3 class="text-center" style="margin-bottom: 15pt; font-size: 18pt;"><?php echo htmlspecialchars($productTitle); ?></h3>
                                    <?php if ($imageUrl): ?>
                                        <div style="text-align: center; margin-bottom: 15pt;">
                                            <img src="<?php echo htmlspecialchars($imageUrl); ?>"
                                                alt="<?php echo htmlspecialchars($imageAlt); ?>"
                                                style="max-width: 180pt; height: auto; display: inline-block;" />
                                        </div>
                                    <?php endif; ?>
                                    <div style="max-width: 450pt; margin: 0 auto;">
                                        <?php if ($textLarge): ?>
                                            <p class="text-large"><?php echo htmlspecialchars($textLarge); ?></p>
                                        <?php endif; ?>
                                        <?php if ($text): ?>
                                            <p style="font-size: 10.5pt; line-height: 1.75; color: #2c2c2c;"><?php echo nl2br(htmlspecialchars($text)); ?></p>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            </td>
                        </tr>
                    </table>
                <?php
                }
                ?>
            </page>
        <?php
        }

        // Brand Spotlight Section
        if (!empty($brandSpotlightSection)) {
            $intro = getValuePDF($brandSpotlightSection, 'intro', '');
            $brands = getValuePDF($brandSpotlightSection, 'brands', []);
            $investmentNote = getValuePDF($brandSpotlightSection, 'investmentNote', []);
        ?>
            <page backtop="7mm" backbottom="7mm" backleft="7mm" backright="7mm">
                <h3 class="text-center" style="margin-bottom: 15pt; font-size: 20pt; font-weight: 300;">Brand Spotlight: Your Perfect Match</h3>
                <?php if ($intro): ?>
                    <p class="text-center" style="margin-bottom: 35pt; font-size: 11pt; line-height: 1.9; color: #333333;"><?php echo htmlspecialchars($intro); ?></p>
                <?php endif; ?>

                <?php
                if (!empty($brands) && is_array($brands)) {
                    foreach ($brands as $brand) {
                        if (!is_array($brand)) continue;

                        $brandTitle = getValuePDF($brand, 'title', '');
                        $brandText = getValuePDF($brand, 'text', '');
                        $brandLogoUrl = getValuePDF($brand, 'logoUrl', '');
                        if ($brandLogoUrl) {
                            $brandLogoUrl = buildImageUrlPDF($brandLogoUrl);
                        }
                        $insiderTip = getValuePDF($brand, 'insiderTip', '');
                ?>
                        <div style="margin-bottom: 35pt;" class="keep-together">
                            <table style="width: 100%; margin-bottom: 12pt;" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <h4 style="font-size: 14pt; margin: 0;"><?php echo htmlspecialchars($brandTitle); ?></h4>
                                    </td>
                                    <?php if ($brandLogoUrl): ?>
                                        <td style="text-align: right; vertical-align: middle;">
                                            <img src="<?php echo htmlspecialchars($brandLogoUrl); ?>" alt="Brand Logo" style="height: 25pt; object-fit: contain;" />
                                        </td>
                                    <?php endif; ?>
                                </tr>
                            </table>

                            <?php if ($brandText): ?>
                                <p style="font-size: 11pt; line-height: 1.9; color: #333333; margin-bottom: 12pt;"><?php echo nl2br(htmlspecialchars($brandText)); ?></p>
                            <?php endif; ?>

                            <?php if ($insiderTip): ?>
                                <div class="insider-tip">
                                    <?php echo nl2br(htmlspecialchars($insiderTip)); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php
                    }
                }

                // Investment Note
                if (!empty($investmentNote) && is_array($investmentNote)) {
                    $invTitle = getValuePDF($investmentNote, 'title', '');
                    $invContent = getValuePDF($investmentNote, 'content', '');

                    if ($invTitle && $invContent && strpos($invTitle, '-') === false):
                    ?>
                        <div style="margin-top: 25pt;" class="keep-together">
                            <h4 style="font-size: 13pt; font-weight: 600; margin-bottom: 10pt;"><?php echo htmlspecialchars($invTitle); ?></h4>
                            <p style="font-size: 11pt; line-height: 1.9; color: #333333;"><?php echo htmlspecialchars($invContent); ?></p>
                        </div>
                <?php
                    endif;
                }
                ?>
            </page>
        <?php
        }

        // Showroom Strategy Section
        if (!empty($showroomStrategySection)) {
            $introText = getValuePDF($showroomStrategySection, 'intro', '');
            $questions = getValuePDF($showroomStrategySection, 'questions', []);
            $whatToBring = getValuePDF($showroomStrategySection, 'whatToBring', []);
        ?>
            <page backtop="7mm" backbottom="7mm" backleft="7mm" backright="7mm" style="background-color: #fafafa;">
                <table style="width: 100%;">
                    <tr>
                        <td>
                            <h3 class="text-center" style="margin-bottom: 15pt; font-size: 20pt; font-weight: 300;">Your Showroom Strategy</h3>
                            <?php if ($introText): ?>
                                <p class="text-center" style="margin-bottom: 35pt; font-size: 11pt; line-height: 1.9; color: #333333;"><?php echo htmlspecialchars($introText); ?></p>
                            <?php endif; ?>

                            <?php if (!empty($questions) && is_array($questions)): ?>
                                <h4 style="margin-bottom: 20pt; font-size: 14pt;">Questions to Ask (The Ones That Really Matter)</h4>
                                <?php
                                foreach ($questions as $qa) {
                                    if (!is_array($qa)) continue;
                                    $question = getValuePDF($qa, 'question', '');
                                    $answer = getValuePDF($qa, 'answer', '');

                                    if ($question && $answer):
                                ?>
                                        <div style="margin-bottom: 20pt;" class="keep-together">
                                            <p class="question"><?php echo htmlspecialchars($question); ?></p>
                                            <p class="answer"><?php echo htmlspecialchars($answer); ?></p>
                                        </div>
                                <?php
                                    endif;
                                }
                                ?>
                            <?php endif; ?>

                            <?php if (!empty($whatToBring) && is_array($whatToBring)): ?>
                                <h4 style="margin-top: 30pt; margin-bottom: 20pt; font-size: 14pt;">What to Bring to the Showroom</h4>
                                <table style="width: 100%;">
                                    <?php
                                    $itemRows = array_chunk($whatToBring, 2);
                                    foreach ($itemRows as $row):
                                    ?>
                                        <tr>
                                            <?php foreach ($row as $item):
                                                if (!is_array($item)) continue;
                                                $title = getValuePDF($item, 'title', '');
                                                $description = getValuePDF($item, 'description', '');

                                                if ($title && $description):
                                            ?>
                                                    <td style="width: 48%; vertical-align: top; padding: 12pt; border: 1pt solid #e0e0e0; background-color: #ffffff; margin-bottom: 12pt;" class="keep-together">
                                                        <p style="font-weight: 400; margin-bottom: 5pt; font-size: 10pt; color: #000000;"><?php echo htmlspecialchars($title); ?></p>
                                                        <p style="font-size: 9pt; color: #666666; margin: 0; line-height: 1.6;"><?php echo htmlspecialchars($description); ?></p>
                                                    </td>
                                                <?php
                                                endif;
                                            endforeach;
                                            if (count($row) === 1): ?>
                                                <td style="width: 48%;"></td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endforeach; ?>
                                </table>
                            <?php endif; ?>
                        </td>
                    </tr>
                </table>


            </page>
        <?php
        }

        // Final Thoughts Section
        if (!empty($finalThoughtsSection)) {
            $personalNote = getValuePDF($finalThoughtsSection, 'personalNote', '');
            $blogArticles = getValuePDF($finalThoughtsSection, 'blogArticles', []);
            $maintenance = getValuePDF($finalThoughtsSection, 'maintenance', []);
            $secretTitle = getValuePDF($finalThoughtsSection, 'secretTitle', '');
            $secretText = getValuePDF($finalThoughtsSection, 'secretText', '');
            $closingQuote = getValuePDF($finalThoughtsSection, 'closingQuote', '');
            $signatureName = getValuePDF($finalThoughtsSection, 'signatureName', '');
        ?>
            <page backtop="7mm" backbottom="7mm" backleft="7mm" backright="7mm">
                <table style="width: 100%;">
                    <tr>
                        <td>
                            <h3 class="text-center" style="margin-bottom: 15pt; font-size: 20pt; font-weight: 300;">Final Thoughts & Resources</h3>

                            <?php if ($personalNote): ?>
                                <div style="margin-bottom: 35pt;">
                                    <h4 style="font-size: 14pt; margin-bottom: 15pt;">A Personal Note</h4>
                                    <?php
                                    $personalNoteParagraphs = preg_split('/\n\s*\n/', $personalNote);
                                    foreach ($personalNoteParagraphs as $index => $paragraph) {
                                        $paragraph = trim($paragraph);
                                        if (!empty($paragraph)):
                                            $marginBottom = ($index < count($personalNoteParagraphs) - 1) ? '12pt' : '0';
                                    ?>
                                            <p style="font-size: 11pt; line-height: 1.9; color: #333333; margin-bottom: <?php echo $marginBottom; ?>;"><?php echo nl2br(htmlspecialchars($paragraph)); ?></p>
                                    <?php
                                        endif;
                                    }
                                    ?>
                                </div>
                            <?php endif; ?>

                            <h4 style="font-size: 14pt; margin-bottom: 15pt;">Useful Resources</h4>

                            <?php if (!empty($blogArticles) && is_array($blogArticles)): ?>
                                <h5 style="margin-bottom: 10pt;">Further Reading</h5>
                                <ul style="margin-bottom: 20pt;">
                                    <?php
                                    foreach ($blogArticles as $article) {
                                        if (is_array($article)) {
                                            $title = getValuePDF($article, 'title', '');
                                            echo '<li>' . htmlspecialchars($title) . '</li>';
                                        } else {
                                            echo '<li>' . htmlspecialchars($article) . '</li>';
                                        }
                                    }
                                    ?>
                                </ul>
                            <?php endif; ?>

                            <?php if (!empty($maintenance) && is_array($maintenance)): ?>
                                <h5 style="margin-bottom: 10pt;">Maintenance Essentials</h5>
                                <ul style="margin-bottom: 20pt;">
                                    <?php
                                    foreach ($maintenance as $item) {
                                        echo '<li>' . htmlspecialchars($item) . '</li>';
                                    }
                                    ?>
                                </ul>
                            <?php endif; ?>

                            <?php if ($secretTitle && $secretText): ?>
                                <div class="secret-box keep-together">
                                    <h5 style="margin-bottom: 10pt;"><?php echo htmlspecialchars($secretTitle); ?></h5>
                                    <p style="font-size: 10pt; line-height: 1.8; color: #333333; margin: 0;"><?php echo nl2br(htmlspecialchars($secretText)); ?></p>
                                </div>
                            <?php endif; ?>

                            <?php if ($closingQuote || $signatureName): ?>
                                <div style="width: 100%; margin-top: 10pt; text-align: center;">
                                    <?php if ($closingQuote): ?>
                                        <p style="font-style: italic; margin-bottom: 20pt; font-size: 12pt; line-height: 1.8; color: #333333; text-align: center;"><?php echo nl2br(htmlspecialchars($closingQuote)); ?></p>
                                    <?php endif; ?>
                                    <p style="margin-bottom: 5pt; font-size: 11pt; color: #2c2c2c; text-align: center;">Warmest regards,</p>
                                    <p style="font-weight: 600; font-size: 11pt; margin: 0; color: #000000; text-align: center;"><?php echo htmlspecialchars($signatureName); ?></p>
                                </div>
                            <?php endif; ?>
                        </td>
                    </tr>
                </table>
            </page>
        <?php
        }
        ?>

<?php
        $htmlContent = ob_get_clean();

        // Initialize Html2Pdf
        $html2pdf = new Html2Pdf('P', 'A4', 'en', true, 'UTF-8', [7, 7, 7, 7]);

        // Set display mode
        $html2pdf->pdf->SetDisplayMode('fullpage');

        // Write HTML content
        $html2pdf->writeHTML($htmlContent);

        // Output or save PDF
        if ($outputPath) {
            // Save to file
            $html2pdf->output($outputPath, 'F');
            return [
                'success' => true,
                'filepath' => $outputPath,
                'filename' => basename($outputPath)
            ];
        } else {
            // Output to browser
            $html2pdf->output('FCI_London_Personalized_Selection.pdf', 'D');
            return ['success' => true];
        }
    } catch (Html2PdfException $e) {
        error_log("Html2Pdf Exception: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    } catch (Exception $e) {
        error_log("PDF Generation Exception: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}
?>