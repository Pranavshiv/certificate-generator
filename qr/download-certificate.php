<?php
require_once 'config.php';

// Get certificate ID from URL
$cert_id = $_GET['id'] ?? '';

if (empty($cert_id)) {
    die('Certificate ID not provided');
}

// Fetch certificate from database
$cert_id = mysqli_real_escape_string($conn, $cert_id);
$query = "SELECT * FROM certificates WHERE certificate_id = '$cert_id'";
$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) == 0) {
    die('Certificate not found');
}

$cert = mysqli_fetch_assoc($result);

// Check if PDF file exists
if (empty($cert['pdf_file'])) {
    die('PDF file not available for this certificate');
}

$pdfPath = __DIR__ . '/certificates_pdf/' . $cert['pdf_file'];

if (!file_exists($pdfPath)) {
    error_log("PDF file not found at: " . $pdfPath);
    die('PDF file not found on server');
}

// Set headers for download
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . basename($cert['pdf_file']) . '"');
header('Content-Length: ' . filesize($pdfPath));
header('Cache-Control: private');

// Read and output file
readfile($pdfPath);

mysqli_close($conn);
?>
