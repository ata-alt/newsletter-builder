<?php
/*
 * Personalized Newsletter Handler with PDF Generation
 *
 * POST Handler Service: Client POST endpoint
 * Processes newsletter data, generates PDF, and sends personalized email with attachment
 *
 * Author: Gabriel Maturan
 * Date: 2025-01-XX
 */

// Security: Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Invalid Request Method.');
}

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers for webhook integration
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load database helper class
require_once(__DIR__ . "/../../../includes/app.class.php");
$app = new app();

// Load PDF generator function
require_once(__DIR__ . "/pdf.newsletter.php");

// ============================================
// CONFIGURATION
// ============================================

// PDF storage path
define('PDF_STORAGE_PATH', __DIR__ . '/uploads/newsletters/');

// Ensure storage directory exists
if (!file_exists(PDF_STORAGE_PATH)) {
    mkdir(PDF_STORAGE_PATH, 0755, true);
}

// ============================================
// STEP 1: RETRIEVE AND VALIDATE POST DATA
// ============================================

// Get raw POST data
$rawData = file_get_contents('php://input');

// Log received data for debugging
error_log("Received newsletter data: " . $rawData);

// Decode JSON data
$postData = json_decode($rawData, true);

// Validate JSON was received
if (!$postData) {
    http_response_code(400);
    echo json_encode([
        'error' => 'No data received or invalid JSON',
        'received' => $rawData
    ]);
    exit;
}

// ============================================
// STEP 2: EXTRACT AND SANITIZE USER DATA
// ============================================

// Extract user information with safe defaults
$firstName = isset($postData['firstName']) ? htmlspecialchars(trim($postData['firstName'])) : '';
$userEmail = isset($postData['email']) ? htmlspecialchars(trim($postData['email'])) : '';
$userPhone = isset($postData['phone']) ? htmlspecialchars(trim($postData['phone'])) : '';
$privacyAgreed = isset($postData['privacyAgreed']) ? (bool)$postData['privacyAgreed'] : false;
$newsletterDataJson = isset($postData['newsletterData']) ? $postData['newsletterData'] : null;
$domData = isset($postData['domData']) ? $postData['domData'] : [];

// Build user name (use firstName as full name for now)
$userName = $firstName;

// ============================================
// STEP 3: VALIDATE REQUIRED FIELDS
// ============================================

$validationErrors = [];

// Validate user name
if (empty($firstName)) {
    $validationErrors[] = 'First name is required';
} elseif (strlen($firstName) > 255) {
    $validationErrors[] = 'First name is too long (max 255 characters)';
}

// Validate email
if (empty($userEmail)) {
    $validationErrors[] = 'Email is required';
} elseif (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    $validationErrors[] = 'Invalid email format';
} elseif (strlen($userEmail) > 255) {
    $validationErrors[] = 'Email is too long (max 255 characters)';
}

// Validate phone (optional but if provided, must be valid)
if (!empty($userPhone)) {
    $phoneLength = strlen($userPhone);
    if ($phoneLength < 6 || $phoneLength > 98) {
        $validationErrors[] = 'Phone number must be between 6 and 98 characters';
    }
}

// Validate privacy agreement
if (!$privacyAgreed) {
    $validationErrors[] = 'Privacy policy agreement is required';
}

// If validation fails, return error
if (!empty($validationErrors)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Validation failed',
        'errors' => $validationErrors
    ]);
    exit;
}

// ============================================
// STEP 4: PARSE NEWSLETTER DATA
// ============================================

// Parse newsletter data from JSON string
$newsletterData = [];
if ($newsletterDataJson) {
    $parsedData = json_decode($newsletterDataJson, true);
    if ($parsedData) {
        // Handle array response format (from webhook)
        if (is_array($parsedData) && isset($parsedData[0])) {
            $firstItem = $parsedData[0];
            $newsletterData = $firstItem['output']['data'] ?? $firstItem['data'] ?? $firstItem['output'] ?? $firstItem ?? [];
        } else {
            // Handle object response format
            $newsletterData = $parsedData['output']['data'] ?? $parsedData['data'] ?? $parsedData['output'] ?? $parsedData ?? [];
        }
    }
}

// Debug: Log received data
error_log("DOM Data received: " . json_encode($domData));
error_log("Newsletter Data parsed: " . json_encode($newsletterData));

// ============================================
// STEP 5: PREPARE DATA FOR EMAIL TEMPLATE
// ============================================

// Helper function to safely get nested array values
function getNestedValue($array, $keys, $default = '')
{
    foreach ($keys as $key) {
        if (!isset($array[$key])) {
            return $default;
        }
        $array = $array[$key];
    }
    return $array;
}

// Extract hero section (DOM data takes precedence)
$heroSection = [];
if (!empty($domData['heroSection']) && is_array($domData['heroSection'])) {
    $heroSection = $domData['heroSection'];
} else if (isset($newsletterData['hero'])) {
    $heroSection = [
        'title' => getNestedValue($newsletterData, ['hero', 'title'], ''),
        'subtitle' => getNestedValue($newsletterData, ['hero', 'subtitle'], ''),
        'imageUrl' => getNestedValue($newsletterData, ['hero', 'imageUrl'], '')
    ];
}

// Extract cover section (DOM data takes precedence)
$coverSection = [];
if (!empty($domData['coverSection']) && is_array($domData['coverSection'])) {
    $coverSection = $domData['coverSection'];
} else if (isset($newsletterData['cover'])) {
    $coverSection = [
        'title' => getNestedValue($newsletterData, ['cover', 'title'], ''),
        'intro' => getNestedValue($newsletterData, ['cover', 'intro'], ''),
        'productPreview' => getNestedValue($newsletterData, ['cover', 'productPreview'], [])
    ];
}

// Extract tips section (DOM data takes precedence)
$tipsSection = [];
if (!empty($domData['tipsSection']) && is_array($domData['tipsSection'])) {
    $tipsSection = $domData['tipsSection'];
} else if (isset($newsletterData['tips'])) {
    $tipsSection = [
        'intro' => getNestedValue($newsletterData, ['tips', 'intro'], ''),
        'themeTitle' => getNestedValue($newsletterData, ['tips', 'themeTitle'], ''),
        'tips' => getNestedValue($newsletterData, ['tips', 'items'], [])
    ];
}

// Extract products section (DOM data takes precedence)
$productsSection = [];
if (!empty($domData['productsSection']) && is_array($domData['productsSection'])) {
    $productsSection = $domData['productsSection'];
} else if (isset($newsletterData['products'])) {
    $products = [];
    if (is_array($newsletterData['products'])) {
        foreach ($newsletterData['products'] as $product) {
            if (!is_array($product)) continue;
            $products[] = [
                'title' => getNestedValue($product, ['title'], ''),
                'url' => getNestedValue($product, ['url'], ''),
                'imageUrl' => getNestedValue($product, ['imageUrl'], ''),
                'imageAlt' => getNestedValue($product, ['imageAlt'], 'Product image'),
                'textLarge' => getNestedValue($product, ['textLarge'], ''),
                'text' => getNestedValue($product, ['text'], ''),
                'layout' => getNestedValue($product, ['layout'], 'default'),
                'imageBeforeTitle' => getNestedValue($product, ['imageBeforeTitle'], false),
                'hidden' => getNestedValue($product, ['hidden'], false)
            ];
        }
    }
    $productsSection = [
        'title' => getNestedValue($newsletterData, ['productsSection', 'title'], ''),
        'intro' => getNestedValue($newsletterData, ['productsSection', 'intro'], ''),
        'products' => $products
    ];
}

// Extract brand spotlight section (DOM data takes precedence)
$brandSpotlightSection = [];
if (!empty($domData['brandSpotlightSection']) && is_array($domData['brandSpotlightSection'])) {
    $brandSpotlightSection = $domData['brandSpotlightSection'];
} else if (isset($newsletterData['brandSpotlight'])) {
    $brandSpotlightSection = [
        'intro' => getNestedValue($newsletterData, ['brandSpotlight', 'intro'], ''),
        'brands' => getNestedValue($newsletterData, ['brandSpotlight', 'brands'], []),
        'investmentNote' => getNestedValue($newsletterData, ['brandSpotlight', 'investmentNote'], [])
    ];
}

// Extract showroom strategy section (DOM data takes precedence)
$showroomStrategySection = [];
if (!empty($domData['showroomStrategySection']) && is_array($domData['showroomStrategySection'])) {
    $showroomStrategySection = $domData['showroomStrategySection'];
} else if (isset($newsletterData['showroomStrategy'])) {
    $showroomStrategySection = [
        'intro' => getNestedValue($newsletterData, ['showroomStrategy', 'intro'], ''),
        'questions' => getNestedValue($newsletterData, ['showroomStrategy', 'questions'], []),
        'whatToBring' => getNestedValue($newsletterData, ['showroomStrategy', 'whatToBring'], [])
    ];
}

// Extract final thoughts section (DOM data takes precedence)
$finalThoughtsSection = [];
if (!empty($domData['finalThoughtsSection']) && is_array($domData['finalThoughtsSection'])) {
    $finalThoughtsSection = $domData['finalThoughtsSection'];
} else if (isset($newsletterData['finalThoughts'])) {
    $finalThoughtsSection = [
        'personalNote' => getNestedValue($newsletterData, ['finalThoughts', 'personalNote'], ''),
        'blogArticles' => getNestedValue($newsletterData, ['finalThoughts', 'blogArticles'], []),
        'maintenance' => getNestedValue($newsletterData, ['finalThoughts', 'maintenance'], []),
        'secretTitle' => getNestedValue($newsletterData, ['finalThoughts', 'secretTitle'], ''),
        'secretText' => getNestedValue($newsletterData, ['finalThoughts', 'secretText'], ''),
        'closingQuote' => getNestedValue($newsletterData, ['finalThoughts', 'closingQuote'], ''),
        'signatureName' => getNestedValue($newsletterData, ['finalThoughts', 'signatureName'], '')
    ];
}

// Extract closing section (DOM data takes precedence)
$closingSection = [];
if (!empty($domData['closingSection']) && is_array($domData['closingSection'])) {
    $closingSection = $domData['closingSection'];
} else if (isset($newsletterData['closing'])) {
    $closingSection = [
        'title' => getNestedValue($newsletterData, ['closing', 'title'], 'Next Steps'),
        'text' => getNestedValue($newsletterData, ['closing', 'text'], ''),
        'appointmentUrl' => getNestedValue($newsletterData, ['closing', 'appointmentUrl'], '#'),
        'appointmentText' => getNestedValue($newsletterData, ['closing', 'appointmentText'], 'Book an Appointment')
    ];
}

// ============================================
// STEP 6: GENERATE EMAIL HTML
// ============================================

// Start output buffering to capture email template HTML
ob_start();
include(__DIR__ . "/email.personalize-newsletter.php");
$emailHtml = ob_get_clean();

// Debug: Check if email HTML was generated
error_log("Email HTML length: " . strlen($emailHtml));

// ============================================
// STEP 7: GENERATE PDF ATTACHMENT
// ============================================

$pdfGenerated = false;
$pdfFilePath = null;
$pdfBase64 = null;
$pdfDebugInfo = [
    'attempted' => false,
    'success' => false,
    'error' => null
];

try {
    $pdfDebugInfo['attempted'] = true;
    error_log("Starting PDF generation...");

    // Prepare PDF data structure
    $pdfData = [
        'userName' => $userName,
        'userEmail' => $userEmail,
        'heroSection' => $heroSection,
        'coverSection' => $coverSection,
        'tipsSection' => $tipsSection,
        'productsSection' => $productsSection,
        'brandSpotlightSection' => $brandSpotlightSection,
        'showroomStrategySection' => $showroomStrategySection,
        'finalThoughtsSection' => $finalThoughtsSection,
        'closingSection' => $closingSection
    ];

    // Generate unique filename
    $timestamp = time();
    $sanitizedEmail = preg_replace('/[^a-z0-9]/i', '_', $userEmail);
    $pdfFileName = "newsletter_{$sanitizedEmail}_{$timestamp}.pdf";
    $pdfFilePath = PDF_STORAGE_PATH . $pdfFileName;

    error_log("Generating PDF: " . $pdfFilePath);

    // Generate PDF
    $pdfResult = generateNewsletterPDF($pdfData, $pdfFilePath);

    if ($pdfResult['success']) {
        $pdfGenerated = true;
        $pdfDebugInfo['success'] = true;
        $pdfDebugInfo['filepath'] = $pdfFilePath;
        $pdfDebugInfo['filename'] = $pdfFileName;
        $pdfDebugInfo['filesize'] = filesize($pdfFilePath);

        // Convert PDF to base64 for email attachment
        $pdfContent = file_get_contents($pdfFilePath);
        $pdfBase64 = base64_encode($pdfContent);

        error_log("PDF generated successfully: " . $pdfFilePath . " (" . filesize($pdfFilePath) . " bytes)");
    } else {
        $pdfDebugInfo['error'] = $pdfResult['error'] ?? 'Unknown error';
        error_log("PDF generation failed: " . $pdfDebugInfo['error']);
    }
} catch (Exception $e) {
    $pdfDebugInfo['error'] = $e->getMessage();
    error_log("PDF generation exception: " . $e->getMessage());
}

// ============================================
// STEP 8: SEND EMAIL VIA SENDINBLUE
// ============================================

$emailData = [];
$emailData['sender'] = [
    'name' => 'FCI London',
    'email' => 'info@fcilondon.co.uk'
];
$emailData['to'] = [
    [
        'name' => $userName,
        'email' => $userEmail
    ]
];

$emailData['subject'] = 'Your Personalized Selection - FCI London';
$emailData['htmlContent'] = $emailHtml;

// Add PDF attachment if generated successfully
if ($pdfGenerated && $pdfBase64) {
    $emailData['attachment'] = [
        [
            'name' => 'FCI_London_Personalized_Selection.pdf',
            'content' => $pdfBase64
        ]
    ];
    error_log("PDF attachment added to email");
}

// Send email
try {
    $emailResult = $app->sendInBlueEmail($emailData);
    error_log("Email sent successfully to: " . $userEmail);
} catch (Exception $e) {
    error_log("Email sending failed: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'error' => 'Email sending failed',
        'message' => $e->getMessage()
    ]);
    exit;
}

// ============================================
// STEP 9: CLEANUP (OPTIONAL)
// ============================================

// Optional: Delete PDF file after sending email
$deletePdfAfterSend = false; // Set to true if you want to delete PDFs after sending

if ($deletePdfAfterSend && $pdfGenerated && $pdfFilePath && file_exists($pdfFilePath)) {
    unlink($pdfFilePath);
    error_log("PDF file deleted: " . $pdfFilePath);
}

// ============================================
// STEP 10: RETURN SUCCESS RESPONSE
// ============================================

$responseData = [
    'success' => true,
    'message' => 'Newsletter processed and email sent successfully',
    'timestamp' => date('Y-m-d H:i:s'),
    'user' => [
        'email' => $userEmail,
        'name' => $userName,
        'phone' => $userPhone
    ],
    'email' => [
        'sent' => true,
        'to' => $userEmail,
        'subject' => $emailData['subject'],
        'attachmentIncluded' => $pdfGenerated
    ],
    'pdf' => [
        'generated' => $pdfGenerated,
        'filepath' => $pdfGenerated ? $pdfFilePath : null,
        'filename' => $pdfGenerated ? $pdfFileName : null,
        'filesize' => $pdfGenerated ? filesize($pdfFilePath) : null,
        'debug' => $pdfDebugInfo
    ],
    'database' => [
        'saved' => false,
        'error' => 'Database save disabled for testing'
    ]
];

http_response_code(200);
echo json_encode($responseData, JSON_PRETTY_PRINT);

error_log("Newsletter handler completed successfully for: " . $userEmail);
