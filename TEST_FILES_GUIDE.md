# Test Files Guide - Certificate Generator

## Overview
This guide helps you get test files to quickly test the certificate generator.

---

## 1. Sample CSV File

A sample CSV file (`sample_data.csv`) has been created with 10 test records.

**Required Columns:**
- `name` - Student name
- `course` - Course/training name
- `period` - Duration or dates
- `college` - College/Institution name (optional but recommended)

**Sample Data:**
```csv
name,course,period,college
John Doe,Python Basics,Jan 2026 - Dec 2026,ABC University
Jane Smith,Web Development,Feb 2026 - Jan 2027,XYZ College
Michael Johnson,Data Science,Mar 2026 - Feb 2027,Tech Institute
```

**How to use:**
1. Open `sample_data.csv` in your project folder
2. Add or modify student records as needed
3. Export as CSV from Excel: File → Save As → Format: CSV (Comma delimited)

---

## 2. Sample Images

You need 3 types of images:

### Logo Image
- **Purpose:** Top-right corner of certificate
- **Recommended Size:** 150-200px height
- **Format:** PNG, JPG, or JPEG
- **Background:** White or transparent

**Where to get:**
- Your institution logo (PNG/JPG)
- Online: [Logo.com](https://logo.com), [Canva](https://www.canva.com)
- Or use this free tool: [Logomakr](https://logomakr.com)

### Authorized Signature 1 & 2
- **Purpose:** Bottom signatures on certificate
- **Recommended Size:** 250-350px wide × 60-80px height
- **Format:** PNG on white background (for clarity)
- **Content:** Digital signature or name with signature line

**Where to get:**
- Create in Paint/Photoshop
- Online signature tool: [Signature Pad](https://signature-pad.github.io/signature_pad/)
- Use Canva template

**Quick DIY Option:**
1. Open Paint
2. Create 300x80 white canvas
3. Draw a line with pen tool
4. Write name below
5. Save as PNG

---

## 3. Quick Test Steps

### Step-by-Step Testing:

**Step 1: Load CSV Data**
1. Click "Choose File" under Step 1: Upload CSV
2. Select `sample_data.csv`
3. Verify: Should show "✅ Loaded 10 records"

**Step 2: Add Branding**
1. Upload your Logo image
2. Upload Signature 1 image
3. Upload Signature 2 image
4. Preview boxes should display your images

**Step 3: Add Custom Text** (Optional)
1. Enter any special instructions or text
2. Should appear below student name in preview

**Step 4: Template Editor** (Optional)
1. Click on text elements in the certificate preview
2. Adjust font size (10-60px)
3. Change text color
4. Modify position (X/Y)
5. See changes in real-time

**Step 5: Choose Certificate Mode**
- Select "Course Completed" or "Participation"
- See preview update with different wording

**Step 6: Generate**
1. Click "Generate all certificates"
2. 10 PNG files should download
3. Check file naming: `Certificate_[Name]_[Mode].png`

---

## 4. Creating Your Own Test Images

### Using Free Online Tools:

**For Logo:**
- [Logo Design Studio](https://www.logostudio.com)
- [Canva](https://www.canva.com) - Search "logo"
- [Brandmark](https://brandmark.io)

**For Signatures:**
- [SignatureGenerator](https://www.signaturegenerator.org) - Create digital signature
- [Paint Online](https://paint.js.org) - Draw signature
- [Photopea](https://www.photopea.com) - Free Photoshop alternative

### Quick Paint/Photoshop Steps:

**Create Signature Image:**
1. New image: 300px × 80px, white background
2. Use pen/brush tool to draw signature
3. Add text line if needed
4. Flatten image → Export as PNG

---

## 5. Sample File Formats

### CSV Format Example:
```
name,course,period,college
Alice Johnson,Advanced Python,Q1 2026,Tech University
Bob Wilson,Web Design,Jan-Mar 2026,Creative Academy
Carol Davis,Digital Marketing,Feb 2026 - Jan 2027,Business Institute
```

### Image Specifications:

| Image Type | Recommended Size | Background | Format |
|-----------|-----------------|------------|--------|
| Logo | 150-200px height | White/Transparent | PNG/JPG |
| Signature 1 | 250-300px × 60px | White | PNG |
| Signature 2 | 250-300px × 60px | White | PNG |

---

## 6. Troubleshooting Test Issues

| Issue | Solution |
|-------|----------|
| CSV not loading | Check column names (name, course, period, college) - must be lowercase |
| Images not showing | Ensure PNG/JPG format, reasonable file size (<5MB) |
| Text misaligned | Use template editor to adjust X/Y position |
| Certificates not generating | Check browser console (F12), clear cache & reload |

---

## 7. Where to Download Sample Images

**Pre-made Options:**
- [Pexels](https://www.pexels.com) - Free images
- [Unsplash](https://unsplash.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images

**For Organizations:**
- Use your institutional logo (typically available from your website)
- Create signatures using your branding guidelines

---

## 8. Tips for Best Results

✅ **Good practices:**
- Use high-resolution images (at least 150px for logos)
- Keep signatures on white/light background
- Test with 2-3 records first before bulk generation
- Use consistent date format in CSV (e.g., "Jan 2026 - Dec 2026")
- Save images as PNG for transparency support

❌ **Avoid:**
- Very large images (>5MB)
- Colored backgrounds on signatures (makes them hard to see)
- Special characters in student names
- Extra spaces or empty rows in CSV

---

## Getting Started

1. **Use sample_data.csv** - Already created in your project
2. **Create 3 images** - Logo + 2 signatures (or download samples)
3. **Run generator** - Follow Step-by-Step Testing above
4. **Check output** - Look for PNG files with certificates

Happy testing! 🎓
