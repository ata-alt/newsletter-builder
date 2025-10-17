<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the image URL from the request
$imageUrl = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($imageUrl)) {
    http_response_code(400);
    echo json_encode(['error' => 'No URL provided']);
    exit;
}

// Validate URL
if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

// Check if cURL is available
if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL is not enabled on this server']);
    exit;
}

// Initialize cURL with more robust settings
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $imageUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language: en-US,en;q=0.9',
    'Cache-Control: no-cache'
]);

// Execute request
$imageData = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$error = curl_error($ch);
$errno = curl_errno($ch);
curl_close($ch);

// Check for errors with detailed information
if ($imageData === false || $httpCode !== 200) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch image',
        'details' => $error,
        'errno' => $errno,
        'httpCode' => $httpCode,
        'url' => $imageUrl
    ]);
    exit;
}

// Convert to base64
$base64 = base64_encode($imageData);

// Determine MIME type
if (empty($contentType)) {
    $contentType = 'image/jpeg'; // Default
}

// Return base64 data URL
echo json_encode([
    'success' => true,
    'data' => 'data:' . $contentType . ';base64,' . $base64,
    'contentType' => $contentType,
    'size' => strlen($imageData)
]);
