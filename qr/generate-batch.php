<?php
// Ensure JSON output
header('Content-Type: application/json; charset=utf-8');

// Connect to database
require_once 'config.php';

// Generate unique 8-digit ID (mix of uppercase, lowercase, numbers)
function generateUniqueID() {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $id = '';
    for ($i = 0; $i < 8; $i++) {
        $id .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $id;
}

// Generate QR Code Image
function generateQRCode($certificateId) {
    $qrDir = __DIR__ . '/qr_codes';
    if (!is_dir($qrDir)) {
        mkdir($qrDir, 0755, true);
    }
    
    $qrPath = $qrDir . '/' . $certificateId . '.png';
    $verificationUrl = BASE_URL . 'view-certificate.php?id=' . $certificateId;
    
    // Using QR code generation via external API (or you can use a library)
    // Using QR Server API (free, no library needed)
    $qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($verificationUrl);
    $qrImageData = file_get_contents($qrImageUrl);
    file_put_contents($qrPath, $qrImageData);
    
    return $certificateId . '.png';
}

// Main handler
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'generate-batch') {
        $studentName = $_POST['studentName'] ?? '';
        $course = $_POST['course'] ?? '';
        $issueDate = $_POST['issueDate'] ?? date('Y-m-d');
        $expiryDate = $_POST['expiryDate'] ?? null;
        $description = $_POST['description'] ?? '';
        
        if (empty($studentName) || empty($course)) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit;
        }
        
        // Generate unique certificate ID
        $certificateId = generateUniqueID();
        
        // Check if ID already exists
        $checkQuery = "SELECT id FROM certificates WHERE certificate_id = '$certificateId'";
        while (mysqli_fetch_assoc(mysqli_query($conn, $checkQuery))) {
            $certificateId = generateUniqueID();
        }
        
        // Generate QR Code
        $qrFile = generateQRCode($certificateId);
        
        // Insert into database
        $query = "INSERT INTO certificates (certificate_id, student_name, course, qr_code_file, issue_date, expiry_date, description, created_at) 
                  VALUES ('$certificateId', '" . mysqli_real_escape_string($conn, $studentName) . "', 
                          '" . mysqli_real_escape_string($conn, $course) . "', '$qrFile', '$issueDate', 
                          " . ($expiryDate ? "'$expiryDate'" : "NULL") . ", 
                          '" . mysqli_real_escape_string($conn, $description) . "', NOW())";
        
        if (mysqli_query($conn, $query)) {
            echo json_encode([
                'success' => true,
                'message' => 'Certificate generated successfully',
                'certificateId' => $certificateId,
                'qrCode' => $qrFile,
                'verificationUrl' => BASE_URL . 'view-certificate.php?id=' . $certificateId
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
        }
    } elseif ($action === 'save-batch') {
        $records = json_decode($_POST['records'] ?? '[]', true);
        $issueDate = $_POST['issueDate'] ?? date('Y-m-d');
        
        if (empty($records)) {
            echo json_encode(['success' => false, 'message' => 'No records to save']);
            exit;
        }
        
        $saved = 0;
        $errors = [];
        
        foreach ($records as $record) {
            $certId = $record['certificateId'] ?? '';
            $studentName = $record['studentName'] ?? '';
            $course = $record['course'] ?? '';
            
            if (empty($certId) || empty($studentName)) {
                $errors[] = "Skipped record: missing certificateId or studentName";
                continue;
            }
            
            // Escape strings for database
            $certId = mysqli_real_escape_string($conn, $certId);
            $studentName = mysqli_real_escape_string($conn, $studentName);
            $course = mysqli_real_escape_string($conn, $course);
            $issueDate = mysqli_real_escape_string($conn, $issueDate);
            
            // Check if certificate ID already exists
            $checkQuery = "SELECT id FROM certificates WHERE certificate_id = '$certId'";
            $checkResult = mysqli_query($conn, $checkQuery);
            
            if (!$checkResult) {
                $errors[] = "Database error checking existing record: " . mysqli_error($conn);
                continue;
            }
            
            if (mysqli_num_rows($checkResult) > 0) {
                continue; // Skip if already exists
            }
            
            // Generate QR Code
            $qrFile = generateQRCode($certId);
            
            // Insert into database (PDF will be added later by upload-pdf action)
            $query = "INSERT INTO certificates (certificate_id, student_name, course, qr_code_file, issue_date, created_at, status) 
                      VALUES ('$certId', '$studentName', '$course', '$qrFile', '$issueDate', NOW(), 'active')";
            
            if (mysqli_query($conn, $query)) {
                $saved++;
            } else {
                $errors[] = "Error saving $certId: " . mysqli_error($conn);
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => "Saved $saved certificates to database",
            'saved' => $saved,
            'errors' => $errors,
            'totalRecords' => count($records)
        ]);
    } elseif ($action === 'upload-pdf') {
        // Handle PDF file upload for a specific certificate
        $certificateId = $_POST['certificateId'] ?? '';
        
        if (empty($certificateId)) {
            echo json_encode(['success' => false, 'message' => 'Certificate ID not provided']);
            exit;
        }
        
        if (!isset($_FILES['pdfFile'])) {
            echo json_encode(['success' => false, 'message' => 'PDF file not provided']);
            exit;
        }
        
        // Create PDF storage directory
        $pdfDir = __DIR__ . '/certificates_pdf';
        if (!is_dir($pdfDir)) {
            mkdir($pdfDir, 0755, true);
        }
        
        $pdfFile = $_FILES['pdfFile'];
        $fileName = $certificateId . '_Certificate.pdf';
        $filePath = $pdfDir . '/' . $fileName;
        
        // Save uploaded file
        if (!move_uploaded_file($pdfFile['tmp_name'], $filePath)) {
            echo json_encode(['success' => false, 'message' => 'Failed to save PDF file']);
            exit;
        }
        
        // Update certificate record with PDF filename
        $certificateId = mysqli_real_escape_string($conn, $certificateId);
        $query = "UPDATE certificates SET pdf_file = '$fileName' WHERE certificate_id = '$certificateId'";
        
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true, 'message' => 'PDF uploaded successfully', 'fileName' => $fileName]);
        } else {
            // Delete the uploaded file if database update fails
            @unlink($filePath);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

if (isset($conn)) {
    mysqli_close($conn);
}
?>
