<?php
// Create Database & Tables
include 'config.php';

// Create Database
$createDB = "CREATE DATABASE IF NOT EXISTS qr_certificates";
mysqli_query($conn, $createDB);

// Select Database
mysqli_select_db($conn, 'qr_certificates');

// Create Certificates Table
$createTable = "
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cert_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    description TEXT,
    issuer_name VARCHAR(255),
    qr_code_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active'
)";

$result = mysqli_query($conn, $createTable);

if ($result) {
    echo "✅ Database & Table created successfully!<br>";
    echo "📊 Table: <strong>certificates</strong><br>";
    echo "🔗 <a href='create-certificate.php'>Go to Create Certificate</a>";
} else {
    echo "❌ Error: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
