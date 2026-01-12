<?php
// Database Connection
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'qr_certificates';

$conn = mysqli_connect($host, $user, $password, $database);

if (!$conn) {
    // Check if this is a JSON request
    if (isset($_POST['action'])) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
        exit;
    } else {
        die("Connection failed: " . mysqli_connect_error());
    }
}

mysqli_set_charset($conn, "utf8");

// Base URL for QR codes
define('BASE_URL', 'http://localhost/certificate-generator/qr/');
define('CERTIFICATE_VIEW_URL', BASE_URL . 'view-certificate.php?id=');

?>
