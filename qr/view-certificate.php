<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate Details</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #ffffff;
            --bg-soft: #f8f9fa;
            --panel: #ffffff;
            --accent: #7c3aed;
            --accent-soft: rgba(124, 58, 237, 0.08);
            --border: #e5e7eb;
            --text: #1f2937;
            --muted: #6b7280;
            --success: #10b981;
            --light-grey: #f3f4f6;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ede9fe 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            min-height: 100vh;
            padding: 24px 16px;
            color: var(--text);
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: var(--panel);
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            border: 1px solid var(--border);
        }

        .header {
            background: linear-gradient(135deg, var(--accent) 0%, #9333ea 100%);
            color: white;
            padding: 40px 32px;
            text-align: center;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        .cert-section {
            margin-bottom: 32px;
            padding-bottom: 32px;
            border-bottom: 1px solid var(--border);
        }

        .cert-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .section-title {
            color: var(--accent);
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid var(--light-grey);
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: var(--muted);
            font-weight: 500;
            font-size: 14px;
            flex: 0 0 200px;
        }

        .detail-value {
            color: var(--text);
            flex: 1;
            text-align: right;
            font-weight: 500;
        }

        .status-active {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }

        .status-inactive {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }

        .not-found {
            text-align: center;
            padding: 60px 40px;
        }

        .not-found h2 {
            color: #ef4444;
            margin-bottom: 12px;
            font-size: 20px;
        }

        .not-found p {
            color: var(--muted);
        }

        .button-group {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 40px;
            flex-wrap: wrap;
        }

        button {
            padding: 12px 24px;
            background: linear-gradient(135deg, var(--accent) 0%, #9333ea 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            font-family: "Poppins", sans-serif;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(124, 58, 237, 0.3);
        }

        button:active {
            transform: translateY(0);
        }

        .qr-verification {
            background: var(--accent-soft);
            border-left: 4px solid var(--accent);
            padding: 16px;
            margin-bottom: 24px;
            border-radius: 8px;
        }

        .qr-verification h3 {
            color: var(--accent);
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .qr-verification p {
            color: var(--text);
            font-size: 14px;
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
                <h1>Invalid Access</h1>
                <p>No certificate ID provided</p>
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
                <h1>Certificate Not Found</h1>
                <p>Unable to retrieve certificate details</p>
            </div>
            <div class="content">
                <div class="not-found">
                    <h2>Certificate Not Found</h2>
                    <p>ID: <?php echo htmlspecialchars($cert_id); ?></p>
                    <p>This certificate does not exist in our database.</p>
                </div>
            </div>
            <?php
            exit();
        }
        
        $cert = mysqli_fetch_assoc($result);
        ?>
        
        <div class="header">
            <h1>Certificate of Achievement</h1>
            <p>Verified Certificate Record</p>
        </div>
        
        <div class="content">
            <div class="qr-verification">
                <h3>Verified Certificate</h3>
                <p>This certificate has been verified. Certificate ID: <strong><?php echo htmlspecialchars($cert['certificate_id']); ?></strong></p>
            </div>

            <!-- Certificate Details -->
            <div class="cert-section">
                <div class="section-title">Certificate Information</div>
                
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
                            <span class="status-active">Active</span>
                        <?php else: ?>
                            <span class="status-inactive">Inactive</span>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Dates -->
            <div class="cert-section">
                <div class="section-title">Validity Period</div>
                
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
                    <div class="section-title">Description</div>
                    <p style="color: var(--text); line-height: 1.6; font-size: 14px;"><?php echo nl2br(htmlspecialchars($cert['description'])); ?></p>
                </div>
            <?php endif; ?>

            <!-- Verification -->
            <div class="cert-section">
                <div class="section-title">Verification Details</div>
                
                <div class="detail-row">
                    <div class="detail-label">Issued On</div>
                    <div class="detail-value"><?php echo date('d M Y H:i', strtotime($cert['created_at'])); ?></div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Verification URL</div>
                    <div class="detail-value" style="font-size: 12px; font-family: 'Courier New', monospace; word-break: break-all;">
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
                    <button onclick="window.location.href='./download-certificate.php?id=<?php echo urlencode($cert['certificate_id']); ?>'">Download PDF</button>
                    <button onclick="window.open('./view-pdf.php?id=<?php echo urlencode($cert['certificate_id']); ?>', '_blank')">View PDF</button>
                <?php else: ?>
                    <button onclick="alert('PDF not available for this certificate')" style="opacity: 0.6; cursor: not-allowed;">PDF Not Available</button>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
