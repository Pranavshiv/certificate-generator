# Certificate Generator

A powerful, web-based **bulk certificate generator** with real-time template editing. Create, customize, and download professional certificates as PNG files in just a few clicks.

## Features

✨ **Key Features:**
- 📋 **Bulk CSV Import** - Load student data (name, course, period) from CSV files
- 🎨 **Dual Certificate Modes** - Generate "Course Completed" or "Participation" certificates
- 🖼️ **Custom Branding** - Upload logo and up to 2 authorized signatures
- ✏️ **Text Editor** - Add custom text/instructions to all certificates
- 🎛️ **Visual Template Editor** - Click elements to adjust:
  - Font size (10-60px)
  - Text color (color picker)
  - Position (X/Y coordinates)
  - Reset to defaults
- 🔄 **Live Preview** - See changes instantly as you customize
- 📥 **PNG Export** - Download certificates with all customizations applied
- 📱 **Responsive Design** - Works on desktop and tablets

## Project Structure

```
certificate/
├── index.html              # Main HTML template
├── main.js                 # Core JavaScript logic
├── script.js               # Alternative script (legacy)
├── style.css               # Styling and layout
├── certificate_template.png # Certificate background template
├── README.md               # This file
└── generated-certificates/ # Output folder for generated PNGs
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- CSV file with student data

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pranavshiv/certificate-generator.git
   cd certificate
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

## Usage Guide

### Step 1: Upload Student Data (CSV)
- Prepare a CSV file with columns: `name`, `course`, `period`
- Example:
  ```csv
  name,course,period
  John Doe,Python Basics,Jan 2026 - Dec 2026
  Jane Smith,Web Development,Feb 2026 - Jan 2027
  ```
- Upload the CSV file in **Step 1: Upload CSV**

### Step 2: Add Branding
- Upload your **Logo** (top-right corner)
- Upload **Authorized Signature 1** (bottom-left)
- Upload **Authorized Signature 2** (bottom-right)
- Preview images appear with white backgrounds

### Step 3: Add Custom Content
- Enter optional text in the **Custom Text** textarea
- Text appears below student name on certificate
- Updates in real-time as you type

### Step 4: Template Editor (Optional)
- Click on certificate elements to select them
- **Selected Element Dropdown** - Choose which element to edit
- **Font Size Slider** - Adjust from 10px to 60px
- **Text Color Picker** - Change text color
- **X/Y Position Inputs** - Fine-tune element placement
- **Reset Button** - Restore default styling

### Step 5: Choose Certificate Mode
- **Course Completed** - For completion certificates
- **Participation** - For participation certificates

### Step 6: Generate Certificates
- Click **Generate all certificates**
- Certificates download as PNG files with naming format:
  ```
  Certificate_[StudentName]_[Mode].png
  ```

## CSV Format

**Required columns (case-insensitive):**
- `name` - Student's full name
- `course` - Course or training name
- `period` - Duration or dates

**Example CSV:**
```csv
name,course,period
Alice Johnson,Advanced Python,Q1 2026
Bob Wilson,Machine Learning,Q1-Q2 2026
Carol Davis,Data Science,Jan - Mar 2026
```

## Template Customization

### Default Font Sizes
- **Certificate Title**: 56px
- **Student Name**: 48px
- **Course Name**: 28px
- **Custom Text**: 14px

### Adjusting Positions
1. Click on any text element in the certificate preview
2. A blue dashed border highlights the selected element
3. Use **X Position** and **Y Position** fields to move it
4. Changes update instantly

### Resetting Template
- Click **Reset to Default** button to restore original styling
- Confirmation dialog will appear

## Technologies Used

- **HTML5** - Structure and markup
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - Logic and DOM manipulation
- **html2canvas** - Convert certificate to PNG image
- **Local Storage Ready** - Template settings can be persisted

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

## File Upload Limits

- **CSV**: Text file (typically <10MB)
- **Images (Logo/Signatures)**: PNG, JPG, JPEG (recommended <5MB each)
- **Certificate Template**: PNG image (background template)

## Tips & Tricks

🎯 **Best Practices:**
- Use high-resolution logo (min 150px height)
- Use clear signature images on white background
- Test with 2-3 records before bulk generation
- Use descriptive course names for clarity
- Keep custom text concise (fits better on certificate)

⚠️ **Known Limitations:**
- Signatures must be pre-positioned images (no draw functionality)
- Certificate template is PNG-based (static background)
- Maximum 100+ certificates recommended per batch
- Text positioning may vary based on font rendering

## Troubleshooting

**Q: Certificates not downloading?**
- Check browser console for errors (F12)
- Ensure pop-ups are not blocked
- Try a different browser

**Q: Template editor not responding?**
- Reload the page
- Check browser console for JavaScript errors
- Ensure all required files are in the same directory

**Q: Images not showing in preview?**
- Re-upload the image file
- Check file format (PNG, JPG, JPEG only)
- Verify file size is reasonable

**Q: CSV not loading?**
- Ensure CSV has correct column headers: `name`, `course`, `period`
- Check for extra spaces or formatting issues
- Verify file is saved as `.csv` format

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, feature requests, or questions:
- Open an issue on [GitHub Issues](https://github.com/Pranavshiv/certificate-generator/issues)
- Check existing documentation
- Review browser console for error messages

## Changelog

### v1.0.0 (Current)
- ✨ Initial release
- 📋 Bulk CSV import
- 🎨 Logo and signature uploads
- ✏️ Custom text editor
- 🎛️ Visual template editor
- 🔄 Live preview
- 📥 PNG export
- 🎯 Dual certificate modes

---

**Made with ❤️ by Certificate Generator Team**

Happy certificate generating! 🎓
