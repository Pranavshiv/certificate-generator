<!DOCTYPE html>
<html>
<head>
    <title>Certificate Details</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px;
        }
        .cert-section {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 2px solid #f0f0f0;
        }
        .cert-section:last-child {
            border-bottom: none;
        }
        .section-title {
            color: #667eea;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #666;
            font-weight: 600;
            flex: 0 0 200px;
        }
        .detail-value {
            color: #333;
            flex: 1;
            text-align: right;
        }
        .status-active {
            background: #f0fdf4;
            color: #27ae60;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }
        .status-inactive {
            background: #fef2f2;
            color: #e74c3c;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }
        .not-found {
            text-align: center;
            padding: 60px 40px;
            color: #e74c3c;
        }
        .not-found h2 {
            margin-bottom: 10px;
        }
        .button-group {
            text-align: center;
            margin-top: 40px;
        }
        button {
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        .qr-verification {
            background: #f0fdf4;
            border-left: 4px solid #27ae60;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .qr-verification h3 {
            color: #27ae60;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php
        include 'config.php';
        
        // Get certificate ID from URL
        $cert_id = $_GET['id'] ?? '';
        
        // DEBUG
        // error_log("DEBUG: cert_id from URL = " . $cert_id);
        
        if (empty($cert_id)) {
            ?>
            <div class="header">
                <h1>❌ Invalid Access</h1>
            </div>
            <div class="content">
                <div class="not-found">
                    <h2>No Certificate ID Provided</h2>
                    <p>Please scan a valid QR code or provide a certificate ID.</p>
                </div>
            </div>
            <?php
            exit();
        }
        
        // Fetch certificate from database
        $cert_id = mysqli_real_escape_string($conn, $cert_id);
        $query = "SELECT * FROM certificates WHERE certificate_id = '$cert_id'";
        
        // DEBUG
        // error_log("DEBUG: SQL Query = " . $query);
        
        $result = mysqli_query($conn, $query);
        
        // DEBUG
        // if (!$result) {
        //     error_log("DEBUG: Database error = " . mysqli_error($conn));
        // } else {
        //     error_log("DEBUG: Query successful, rows = " . mysqli_num_rows($result));
        // }
        
        if (mysqli_num_rows($result) == 0) {
            ?>
            <div class="header">
                <h1>❌ Certificate Not Found</h1>
            </div>
            <div class="content">
                <div class="not-found">
                    <h2>Certificate ID: <?php echo htmlspecialchars($cert_id); ?></h2>
                    <p>This certificate does not exist in our database.</p>
                </div>
            </div>
            <?php
            exit();
        }
        
        $cert = mysqli_fetch_assoc($result);
        ?>
        
        <div class="header">
            <h1>🎓 Certificate of Achievement</h1>
        </div>
        
        <div class="content">
            <div class="qr-verification">
                <h3>✅ Certificate Verified</h3>
                <p>This certificate has been verified through a secure QR code. Certificate ID: <strong><?php echo htmlspecialchars($cert['certificate_id']); ?></strong></p>
            </div>

            <!-- Certificate Details -->
            <div class="cert-section">
                <div class="section-title">📋 Certificate Information</div>
                
                <div class="detail-row">
                    <div class="detail-label">Certificate ID</div>
                    <div class="detail-value"><strong><?php echo htmlspecialchars($cert['certificate_id']); ?></strong></div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Student Name</div>
                    <div class="detail-value"><strong><?php echo htmlspecialchars($cert['student_name']); ?></strong></div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Course</div>
                    <div class="detail-value"><strong><?php echo htmlspecialchars($cert['course']); ?></strong></div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <?php if ($cert['status'] === 'active'): ?>
                            <span class="status-active">✓ ACTIVE</span>
                        <?php else: ?>
                            <span class="status-inactive">✗ INACTIVE</span>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Dates -->
            <div class="cert-section">
                <div class="section-title">📅 Validity Period</div>
                
                <div class="detail-row">
                    <div class="detail-label">Issue Date</div>
                    <div class="detail-value"><strong><?php echo date('d M Y', strtotime($cert['issue_date'])); ?></strong></div>
                </div>
                
                <?php if (!empty($cert['expiry_date'])): ?>
                    <div class="detail-row">
                        <div class="detail-label">Expiry Date</div>
                        <div class="detail-value"><strong><?php echo date('d M Y', strtotime($cert['expiry_date'])); ?></strong></div>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Description -->
            <?php if (!empty($cert['description'])): ?>
                <div class="cert-section">
                    <div class="section-title">📝 Description</div>
                    <p style="color: #555; line-height: 1.6;"><?php echo nl2br(htmlspecialchars($cert['description'])); ?></p>
                </div>
            <?php endif; ?>

            <!-- Verification -->
            <div class="cert-section">
                <div class="section-title">🔒 Verification Details</div>
                
                <div class="detail-row">
                    <div class="detail-label">Issued On</div>
                    <div class="detail-value"><?php echo date('d M Y H:i', strtotime($cert['created_at'])); ?></div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">QR Code URL</div>
                    <div class="detail-value" style="font-size: 12px; font-family: monospace;">
                        <?php 
                        // DEBUG
                        // error_log("DEBUG: CERTIFICATE_VIEW_URL defined = " . (defined('CERTIFICATE_VIEW_URL') ? 'yes' : 'no'));
                        echo htmlspecialchars((defined('CERTIFICATE_VIEW_URL') ? CERTIFICATE_VIEW_URL : BASE_URL . 'view-certificate.php?id=') . $cert['certificate_id']); 
                        ?>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="button-group">
                <?php if (!empty($cert['pdf_file'])): ?>
                    <button onclick="window.location.href='./download-certificate.php?id=<?php echo urlencode($cert['certificate_id']); ?>'">⬇️ Download PDF</button>
                    <button onclick="window.open('./view-pdf.php?id=<?php echo urlencode($cert['certificate_id']); ?>', '_blank')">👁️ View PDF</button>
                <?php else: ?>
                    <button onclick="alert('PDF not available for this certificate')">📄 PDF Not Available</button>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
