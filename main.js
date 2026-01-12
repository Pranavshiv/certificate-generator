// =====================
// Global State
// =====================
let csvData = [];
let logoImg = null;
let logo2Img = null;
let sign1ImgData = null;
let sign2ImgData = null;
let logoUploaded = false;
let customTextAdded = false;

// Image sizes (in percentage)
let imageSizes = {
  logo: 100,
  logo2: 100,
  sign1: 100,
  sign2: 100
};

// Template styling storage
let templateConfig = {
  studentName: { fontSize: 48, color: '#1a1a1a', posX: 0, posY: 0, width: 600, fontFamily: 'Poppins', bold: false },
  customTextDisplay: { fontSize: 14, color: '#333333', posX: 0, posY: 0, width: 800, fontFamily: 'Poppins', bold: false },
  sign1PositionDisplay: { fontSize: 13, color: '#333333', posX: 100, posY: 0, width: 200, fontFamily: 'Poppins', bold: false },
  sign2PositionDisplay: { fontSize: 13, color: '#333333', posX: 100, posY: 0, width: 200, fontFamily: 'Poppins', bold: false }
};

let selectedElement = null;

// =====================
// DOM Elements
// =====================
const dataFileInput = document.getElementById('dataFile');
const logoFileInput = document.getElementById('logoFile');
const logo2FileInput = document.getElementById('logoFile2');
const sign1FileInput = document.getElementById('signFile');
const sign2FileInput = document.getElementById('signFile2');

const csvStatus = document.getElementById('csvStatus');
const generateBtn = document.getElementById('generateBtn');
const recordsBadge = document.getElementById('recordsBadge');

const studentNameEl = document.getElementById('studentName');

const customTextEl = document.getElementById('customText');
const customTextDisplayEl = document.getElementById('customTextDisplay');

const logoImgEl = document.getElementById('logoPreview');
const logo2ImgEl = document.getElementById('logoPreview2');
const sign1ImgEl = document.getElementById('signPreview');
const sign2ImgEl = document.getElementById('signPreview2');

// Logo position controls
const logoPositionXInput = document.getElementById('logoPositionX');
const logoPositionYInput = document.getElementById('logoPositionY');
const logo2PositionXInput = document.getElementById('logo2PositionX');
const logo2PositionYInput = document.getElementById('logo2PositionY');

// Signature position/title inputs
const sign1PositionInput = document.getElementById('sign1Position');
const sign2PositionInput = document.getElementById('sign2Position');

// Template editor elements
const elementSelect = document.getElementById('elementSelect');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const fontStyleInput = document.getElementById('fontStyle');
const boldToggleBtn = document.getElementById('boldToggleBtn');
const textColorInput = document.getElementById('textColor');
const posXInput = document.getElementById('posX');
const posYInput = document.getElementById('posY');
const resetTemplateBtn = document.getElementById('resetTemplateBtn');

// Step status elements
const step1Status = document.getElementById('step1Status');
const step2Status = document.getElementById('step2Status');
const step3Status = document.getElementById('step3Status');
const step5Status = document.getElementById('step5Status');
const generateHint = document.getElementById('generateHint');

// Width control elements
const elementWidth = document.getElementById('elementWidth');
const elementWidthValue = document.getElementById('elementWidthValue');

// Sidebar controls
const controlsSidebar = document.getElementById('controlsSidebar');
const minimizePreviewBtn = document.getElementById('minimizePreviewBtn');

// =====================
// Sidebar Toggle Functionality
// =====================
minimizePreviewBtn.addEventListener('click', () => {
  const isMinimized = controlsSidebar.classList.contains('minimized');
  
  if (isMinimized) {
    // Open sidebar
    controlsSidebar.classList.remove('minimized');
    // Change arrow to point left (hide)
    minimizePreviewBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
    `;
    localStorage.setItem('sidebarMinimized', 'false');
  } else {
    // Close sidebar
    controlsSidebar.classList.add('minimized');
    // Change arrow to point right (open)
    minimizePreviewBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 5l7 7m0 0l-7 7m7-7H2"></path>
      </svg>
    `;
    localStorage.setItem('sidebarMinimized', 'true');
  }
});

// Restore sidebar state on load
if (localStorage.getItem('sidebarMinimized') === 'true') {
  controlsSidebar.classList.add('minimized');
  // Set arrow to point right
  minimizePreviewBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 5l7 7m0 0l-7 7m7-7H2"></path>
    </svg>
  `;
} else {
  // Set arrow to point left
  minimizePreviewBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 19l-7-7m0 0l7-7m-7 7h18"></path>
    </svg>
  `;
}

// =====================
// Image Size Controls
// =====================
const logoSizeInput = document.getElementById('logoSize');
const logoSizeValue = document.getElementById('logoSizeValue');
const logo2SizeInput = document.getElementById('logo2Size');
const logo2SizeValue = document.getElementById('logo2SizeValue');
const sign1SizeInput = document.getElementById('sign1Size');
const sign1SizeValue = document.getElementById('sign1SizeValue');
const sign2SizeInput = document.getElementById('sign2Size');
const sign2SizeValue = document.getElementById('sign2SizeValue');

logoSizeInput.addEventListener('input', (e) => {
  const size = parseInt(e.target.value);
  imageSizes.logo = size;
  logoSizeValue.textContent = size;
  const logoEl = document.getElementById('logoImg');
  logoEl.style.transform = `scale(${size / 100})`;
  logoEl.style.transformOrigin = 'top right';
});

logo2SizeInput.addEventListener('input', (e) => {
  const size = parseInt(e.target.value);
  imageSizes.logo2 = size;
  logo2SizeValue.textContent = size;
  const logoEl = document.getElementById('logoImg2');
  logoEl.style.transform = `scale(${size / 100})`;
  logoEl.style.transformOrigin = 'top left';
});

sign1SizeInput.addEventListener('input', (e) => {
  const size = parseInt(e.target.value);
  imageSizes.sign1 = size;
  sign1SizeValue.textContent = size;
  const signEl = document.getElementById('signImg');
  signEl.style.transform = `scale(${size / 100})`;
  signEl.style.transformOrigin = 'bottom left';
});

sign2SizeInput.addEventListener('input', (e) => {
  const size = parseInt(e.target.value);
  imageSizes.sign2 = size;
  sign2SizeValue.textContent = size;
  const signEl = document.getElementById('signImg2');
  signEl.style.transform = `scale(${size / 100})`;
  signEl.style.transformOrigin = 'bottom right';
});

// =====================
// Logo Position Controls
// =====================
logoPositionXInput.addEventListener('input', (e) => {
  const logoEl = document.getElementById('logoImg');
  const posX = parseInt(e.target.value) || 0;
  logoEl.style.right = 'auto';
  logoEl.style.left = posX + 'px';
});

logoPositionYInput.addEventListener('input', (e) => {
  const logoEl = document.getElementById('logoImg');
  const posY = parseInt(e.target.value) || 0;
  logoEl.style.top = posY + 'px';
});

logo2PositionXInput.addEventListener('input', (e) => {
  const logoEl = document.getElementById('logoImg2');
  const posX = parseInt(e.target.value) || 0;
  logoEl.style.left = posX + 'px';
});

logo2PositionYInput.addEventListener('input', (e) => {
  const logoEl = document.getElementById('logoImg2');
  const posY = parseInt(e.target.value) || 0;
  logoEl.style.top = posY + 'px';
});

// =====================
// Step Status Update
// =====================
function updateStepStatus() {
  if (csvData.length > 0) {
    step1Status.textContent = '✓ Complete';
    step1Status.style.background = 'rgba(34, 197, 94, 0.2)';
    step1Status.style.color = '#22c55e';
  }
  if (logoUploaded) {
    step2Status.textContent = '✓ Complete';
    step2Status.style.background = 'rgba(34, 197, 94, 0.2)';
    step2Status.style.color = '#22c55e';
  }
  if (customTextAdded) {
    step3Status.textContent = '✓ Added';
    step3Status.style.background = 'rgba(34, 197, 94, 0.2)';
    step3Status.style.color = '#22c55e';
  }
  if (csvData.length > 0) {
    step5Status.textContent = 'Ready';
    generateHint.style.display = generateBtn.disabled ? 'none' : 'block';
  }
}

// =====================
// CSV Upload Handler
// =====================
dataFileInput.addEventListener('change', handleCSVUpload);

function handleCSVUpload(e) {
  const file = e.target.files[0];

  if (!file) {
    csvStatus.textContent = 'No file selected.';
    csvStatus.className = 'status error';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const result = parseCSV(event.target.result);
      csvData = result.data;
      const headers = result.headers;

      if (csvData.length === 0) {
        throw new Error('CSV is empty or invalid');
      }

      csvStatus.textContent = `✅ Loaded ${csvData.length} records`;
      csvStatus.className = 'status';
      recordsBadge.textContent = `${csvData.length} records`;

      // Update placeholders dynamically
      updatePlaceholders(headers);
      
      updatePreview(csvData[0]);
      generateBtn.disabled = false;
      updateStepStatus();

    } catch (err) {
      csvStatus.textContent = `❌ ${err.message}`;
      csvStatus.className = 'status error';
    }
  };

  reader.readAsText(file);
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return { data: [], headers: [] };

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIdx = headers.indexOf('name');
  const courseIdx = headers.indexOf('course');
  const periodIdx = headers.indexOf('period');
  const collegeIdx = headers.indexOf('college');
  const conductedByIdx = headers.indexOf('conducted_by');
  const durationIdx = headers.indexOf('duration');

  if (nameIdx === -1 || courseIdx === -1 || periodIdx === -1 || collegeIdx === -1) {
    throw new Error('CSV must contain name, course, period, and college columns');
  }

  const data = lines.slice(1).map(row => {
    const cols = row.split(',').map(c => c.trim());
    return {
      name: cols[nameIdx] || '',
      course: cols[courseIdx] || '',
      period: cols[periodIdx] || '',
      college: cols[collegeIdx] || '',
      conducted_by: cols[conductedByIdx] || '',
      duration: cols[durationIdx] || ''
    };
  });

  return { data, headers };
}

// =====================
// Update Dynamic Placeholders
// =====================
function updatePlaceholders(headers) {
  const placeholderList = document.querySelector('.placeholder-list');
  
  // Clear existing placeholders
  placeholderList.innerHTML = '';
  
  // Create new placeholders for each header
  headers.forEach(header => {
    const placeholderSpan = document.createElement('span');
    placeholderSpan.className = 'placeholder';
    placeholderSpan.textContent = `{${header}}`;
    placeholderSpan.style.cursor = 'pointer';
    
    // Add click event listener
    placeholderSpan.addEventListener('click', () => {
      insertPlaceholder(`{${header}}`);
    });
    
    placeholderList.appendChild(placeholderSpan);
  });
}

// =====================
// Insert Placeholder into Textarea
// =====================
function insertPlaceholder(placeholderText) {
  const textarea = document.getElementById('customText');
  
  // Get current cursor position
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  const textBefore = textarea.value.substring(0, startPos);
  const textAfter = textarea.value.substring(endPos, textarea.value.length);
  
  // Add space before placeholder if text exists and doesn't end with space
  const spaceBefore = textBefore.length > 0 && !textBefore.endsWith(' ') ? ' ' : '';
  // Add space after placeholder
  const spaceAfter = ' ';
  
  // Insert placeholder
  textarea.value = textBefore + spaceBefore + placeholderText + spaceAfter + textAfter;
  
  // Move cursor after the inserted text
  const newCursorPos = startPos + spaceBefore.length + placeholderText.length + spaceAfter.length;
  textarea.selectionStart = newCursorPos;
  textarea.selectionEnd = newCursorPos;
  
  // Focus on textarea
  textarea.focus();
  
  // Trigger input event to update preview
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

// =====================
// Template Variable Replacement
// =====================
function replaceTemplateVariables(template, record) {
  if (!template) return '';
  
  let result = template;
  
  // Replace all placeholders dynamically from record object
  // Make all fields bold except period
  for (const [key, value] of Object.entries(record)) {
    const placeholder = `{${key}}`;
    const isBold = key !== 'period'; // Don't bold period
    const replacementValue = isBold ? `<strong>${value || ''}</strong>` : (value || '');
    
    result = result.replace(new RegExp(placeholder, 'gi'), replacementValue);
  }
  
  return result;
}

// =====================
// Logo Upload
// =====================
logoFileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    logoImg = ev.target.result;
    logoImgEl.src = logoImg;
    document.getElementById('logoImg').src = logoImg;
    logoUploaded = true;
    updateStepStatus();
  };
  reader.readAsDataURL(file);
});

// =====================
// Logo 2 Upload
// =====================
logo2FileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    logo2Img = ev.target.result;
    logo2ImgEl.src = logo2Img;
    document.getElementById('logoImg2').src = logo2Img;
    updateStepStatus();
  };
  reader.readAsDataURL(file);
});


// =====================
// Signature Uploads
// =====================
sign1FileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    sign1ImgData = ev.target.result;
    sign1ImgEl.src = sign1ImgData;
    document.getElementById('signImg').src = sign1ImgData;
  };
  reader.readAsDataURL(file);
});

sign2FileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    sign2ImgData = ev.target.result;
    sign2ImgEl.src = sign2ImgData;
    document.getElementById('signImg2').src = sign2ImgData;
  };
  reader.readAsDataURL(file);
});

// =====================
// =====================
// Signature Position/Title (with template editor support)
// =====================
function updateSignaturePositionDisplay(id, value) {
  const el = document.getElementById(id);
  if (el) {
    // If value is empty or only whitespace, show a placeholder to keep box visible
    const safeValue = value.replace(/\n/g, '<br>');
    if (safeValue.replace(/<br>/g, '').trim() === '') {
      el.innerHTML = `<span style="opacity:0.3;">${id === 'sign1PositionDisplay' ? 'Signature 1 details...' : 'Signature 2 details...'}</span>`;
    } else {
      el.innerHTML = safeValue;
    }
    el.style.display = 'block';
    el.style.minHeight = '40px';
    // Restore position from templateConfig every update
    const config = templateConfig[id];
    if (config) {
      el.style.fontSize = config.fontSize + 'px';
      el.style.color = config.color;
      el.style.fontFamily = config.fontFamily;
      el.style.fontWeight = config.bold ? '700' : '500';
      el.style.maxWidth = config.width + 'px';
      el.style.width = '100%';
      el.style.left = (config.posX || 0) + 'px';
      el.style.top = (config.posY || 0) + 'px';
    }
  }
}

if (sign1PositionInput) {
  sign1PositionInput.addEventListener('input', (e) => {
    updateSignaturePositionDisplay('sign1PositionDisplay', e.target.value);
    console.log('Signature 1 position updated:', e.target.value);
  });
}

if (sign2PositionInput) {
  sign2PositionInput.addEventListener('input', (e) => {
    updateSignaturePositionDisplay('sign2PositionDisplay', e.target.value);
    console.log('Signature 2 position updated:', e.target.value);
  });
}


// =====================
// Preview Update
// =====================
function updatePreview(record) {
  studentNameEl.textContent = record.name || 'Student Name';
  
  // update custom text display from textarea - with template replacement
  customTextDisplayEl.innerHTML = replaceTemplateVariables(customTextEl.value, record);
  
  // Apply stored positions to all elements
  applyStoredPositions();
  
  // Make elements draggable
  makeDraggable();
}

function applyStoredPositions() {
  const certificate = document.getElementById('certificate');
  const certRect = certificate ? certificate.getBoundingClientRect() : { width: 1200, height: 840 };
  Object.keys(templateConfig).forEach(elementId => {
    const el = document.getElementById(elementId);
    if (el && templateConfig[elementId]) {
      const config = templateConfig[elementId];
      // Clamp initial position so box stays inside template
      let left = config.posX || 0;
      let top = config.posY || 0;
      const boxWidth = el.offsetWidth || 180;
      const boxHeight = el.offsetHeight || 180;
      left = Math.max(0, Math.min(left, certRect.width - boxWidth));
      top = Math.max(0, Math.min(top, certRect.height - boxHeight));
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      if (config.width) {
        el.style.maxWidth = config.width + 'px';
        el.style.width = '100%';
      }
      if (config.fontFamily) el.style.fontFamily = config.fontFamily;
      if (config.bold) el.style.fontWeight = '700';
    }
  });
}

// Track custom text input
customTextEl.addEventListener('input', () => {
  customTextAdded = customTextEl.value.length > 0;
  updatePreview(csvData.length > 0 ? csvData[0] : { name: 'Student Name', course: 'Course Name', college: 'College Name', period: '' });
  updateStepStatus();
});

// update preview when mode changes
document.querySelectorAll('input[name="certMode"]').forEach(r => {
  r.addEventListener('change', () => {
    if (csvData && csvData.length > 0) updatePreview(csvData[0]);
    else updatePreview({ name: 'Student Name', course: 'Course Name', college: 'College Name', period: '' });
  });
});

// update preview when custom text changes
customTextEl.addEventListener('input', (e) => {
  if (csvData.length > 0) {
    customTextDisplayEl.innerHTML = replaceTemplateVariables(e.target.value, csvData[0]);
  } else {
    customTextDisplayEl.innerHTML = e.target.value;
  }
});


// =====================
// Generate Certificates
// =====================
generateBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (csvData.length === 0) {
    alert('❌ No CSV data');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating certificates...';

  let success = 0;
  const zip = new JSZip();
  const mode = (document.querySelector('input[name="certMode"]:checked') || { value: 'completed' }).value;
  const folderName = `Certificates_${mode}_${new Date().getTime()}`;
  const folder = zip.folder(folderName);

  try {
    for (let i = 0; i < csvData.length; i++) {
      try {
        updatePreview(csvData[i]);
        await new Promise(r => setTimeout(r, 100));

        generateBtn.textContent = `Generating (${i + 1}/${csvData.length})...`;

        const cert = document.getElementById('certificate');
        const canvas = await html2canvas(cert, {
          scale: 2,
          backgroundColor: '#ffffff'
        });

        // Convert canvas to image data
        const imgData = canvas.toDataURL('image/png');
        
        // Create PDF from image
        const jsPDFConstructor = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        const pdf = new jsPDFConstructor({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Get PDF as blob and add to zip
        const pdfBlob = pdf.output('blob');
        const fileName = `Certificate_${csvData[i].name.replace(/\s+/g, '_')}_${mode}.pdf`;
        folder.file(fileName, pdfBlob);

        success++;
      } catch (err) {
        console.error('Certificate generation error:', err);
      }
    }

    // Generate and download ZIP
    if (success > 0) {
      generateBtn.textContent = 'Creating ZIP file...';
      await new Promise(r => setTimeout(r, 200));
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificates_${mode}_${new Date().toISOString().split('T')[0]}.zip`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`✅ Successfully generated ${success}/${csvData.length} certificates and downloaded as ZIP`);
    }
  } catch (err) {
    console.error('ZIP generation error:', err);
    alert('❌ Error generating certificates: ' + err.message);
  }

  generateBtn.disabled = false;
  generateBtn.textContent = '⚡ Generate All Certificates';
});

// =====================
// Template Editor
// =====================

// Initialize template editor after DOM is ready
function initTemplateEditor() {
  // make certificate elements clickable
  const certElements = document.querySelectorAll('.cert-element');
  certElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(el.id);
    });
    el.style.cursor = 'pointer';
    el.style.outline = 'none';
  });

  // Check if editor controls exist
  if (elementSelect && fontSizeInput && textColorInput && posXInput && posYInput && resetTemplateBtn) {
    // element select change
    elementSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        selectElement(e.target.value);
      }
    });

    // font size change
    fontSizeInput.addEventListener('input', (e) => {
      if (!selectedElement) return;
      const size = parseInt(e.target.value) || 14;
      
      templateConfig[selectedElement].fontSize = size;
      const el = document.getElementById(selectedElement);
      el.style.fontSize = size + 'px';
    });

    // text color change
    textColorInput.addEventListener('input', (e) => {
      if (!selectedElement) return;
      const color = e.target.value;
      
      templateConfig[selectedElement].color = color;
      const el = document.getElementById(selectedElement);
      el.style.color = color;
    });

    // position X change
    posXInput.addEventListener('input', (e) => {
      if (!selectedElement) return;
      const posX = parseInt(e.target.value) || 0;
      
      templateConfig[selectedElement].posX = posX;
      const el = document.getElementById(selectedElement);
      el.style.marginLeft = posX + 'px';
    });

    // position Y change
    posYInput.addEventListener('input', (e) => {
      if (!selectedElement) return;
      const posY = parseInt(e.target.value) || 0;
      
      templateConfig[selectedElement].posY = posY;
      const el = document.getElementById(selectedElement);
      el.style.marginTop = posY + 'px';
    });

    // font style change
    fontStyleInput.addEventListener('change', (e) => {
      if (!selectedElement) return;
      const fontFamily = e.target.value;
      
      templateConfig[selectedElement].fontFamily = fontFamily;
      const el = document.getElementById(selectedElement);
      el.style.fontFamily = fontFamily;
    });

    // width change
    elementWidth.addEventListener('input', (e) => {
      if (!selectedElement) return;
      const width = parseInt(e.target.value) || 400;
      
      templateConfig[selectedElement].width = width;
      const el = document.getElementById(selectedElement);
      el.style.maxWidth = width + 'px';
      el.style.width = '100%';
    });

    // bold toggle for student name
    boldToggleBtn.addEventListener('click', () => {
      if (!selectedElement) return;
      
      // Only allow bold toggle for student name
      if (selectedElement !== 'studentName') {
        alert('Bold control is only available for the student name');
        return;
      }
      
      const isBold = templateConfig[selectedElement].bold;
      templateConfig[selectedElement].bold = !isBold;
      
      // Update button state
      if (!isBold) {
        boldToggleBtn.classList.remove('btn-toggle-off');
        boldToggleBtn.classList.add('btn-toggle-on');
        boldToggleBtn.textContent = 'ON';
      } else {
        boldToggleBtn.classList.remove('btn-toggle-on');
        boldToggleBtn.classList.add('btn-toggle-off');
        boldToggleBtn.textContent = 'OFF';
      }
      
      // Apply to element
      const el = document.getElementById(selectedElement);
      el.style.fontWeight = !isBold ? '700' : '400';
    });

    // reset to default
    resetTemplateBtn.addEventListener('click', () => {
      if (confirm('Reset all template settings to default?')) {
        templateConfig = {
          studentName: { fontSize: 48, color: '#1a1a1a', posX: 0, posY: 0, width: 600, fontFamily: 'Poppins', bold: false },
          customTextDisplay: { fontSize: 14, color: '#333333', posX: 0, posY: 0, width: 800, fontFamily: 'Poppins', bold: false }
        };
        
        // apply defaults to all elements
        Object.keys(templateConfig).forEach(elementId => {
          const el = document.getElementById(elementId);
          if (el) {
            const config = templateConfig[elementId];
            el.style.fontSize = config.fontSize + 'px';
            el.style.color = config.color;
            el.style.marginLeft = config.posX + 'px';
            el.style.marginTop = config.posY + 'px';
          }
        });

        // deselect
        elementSelect.value = '';
        selectedElement = null;
        document.querySelectorAll('.cert-element').forEach(el => {
          el.style.outline = 'none';
        });
      }
    });
  }
}

function selectElement(elementId) {
  // remove previous highlight
  document.querySelectorAll('.cert-element').forEach(el => {
    el.style.outline = 'none';
  });

  selectedElement = elementId;
  if (elementSelect) elementSelect.value = elementId;

  // highlight selected
  const el = document.getElementById(elementId);
  if (el) {
    el.style.outline = '2px dashed #38bdf8';

    // load config into inputs
    const config = templateConfig[elementId] || { fontSize: 14, color: '#1e293b', posX: 0, posY: 0, width: 400, fontFamily: 'Poppins', bold: false };
    if (fontSizeInput) fontSizeInput.value = config.fontSize;
    if (fontSizeValue) fontSizeValue.textContent = config.fontSize + 'px';
    if (fontStyleInput) fontStyleInput.value = config.fontFamily || 'Poppins';
    if (textColorInput) textColorInput.value = config.color;
    if (posXInput) posXInput.value = config.posX;
    if (posYInput) posYInput.value = config.posY;
    if (elementWidth) elementWidth.value = config.width || 400;
    if (elementWidthValue) elementWidthValue.textContent = (config.width || 400) + 'px';
    
    // handle bold button
    if (boldToggleBtn) {
      if (elementId === 'studentName') {
        boldToggleBtn.disabled = false;
        const isBold = config.bold || false;
        if (isBold) {
          boldToggleBtn.classList.remove('btn-toggle-off');
          boldToggleBtn.classList.add('btn-toggle-on');
          boldToggleBtn.textContent = 'ON';
        } else {
          boldToggleBtn.classList.remove('btn-toggle-on');
          boldToggleBtn.classList.add('btn-toggle-off');
          boldToggleBtn.textContent = 'OFF';
        }
      } else {
        boldToggleBtn.disabled = true;
        boldToggleBtn.classList.remove('btn-toggle-on');
        boldToggleBtn.classList.add('btn-toggle-off');
        boldToggleBtn.textContent = 'OFF';
      }
    }
  }
}

// =====================
// Draggable & Resizable Elements
// =====================
// Add click-to-select for signature position boxes
['sign1PositionDisplay', 'sign2PositionDisplay'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('cert-element');
    el.setAttribute('data-element', id);
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(id);
    });
  }
});

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;

function makeDraggable() {
  const certElements = document.querySelectorAll('.cert-element, .cert-logo, .cert-signature, .cert-signature-position');
  const certificate = document.getElementById('certificate');
  
  certElements.forEach(element => {
    // Only add listeners once
    if (element.dataset.draggable === 'true') return;
    element.dataset.draggable = 'true';
    
    element.style.position = 'absolute';
    
    element.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left mouse button
      
      draggedElement = element;
      const rect = element.getBoundingClientRect();
      const certRect = certificate.getBoundingClientRect();
      
      startX = e.clientX;
      startY = e.clientY;
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      
      element.style.opacity = '0.7';
      element.style.zIndex = '999';
      e.preventDefault();
    });
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!draggedElement) return;

    const certificate = document.getElementById('certificate');
    const certRect = certificate.getBoundingClientRect();
    const elemRect = draggedElement.getBoundingClientRect();

    let x = e.clientX - certRect.left - offsetX;
    let y = e.clientY - certRect.top - offsetY;

    // Clamp position so the entire box stays inside the certificate
    const maxX = certRect.width - elemRect.width;
    const maxY = certRect.height - elemRect.height;
    x = Math.max(0, Math.min(x, maxX > 0 ? maxX : 0));
    y = Math.max(0, Math.min(y, maxY > 0 ? maxY : 0));

    draggedElement.style.left = x + 'px';
    draggedElement.style.top = y + 'px';
  });
  
  document.addEventListener('mouseup', (e) => {
    if (!draggedElement) return;
    
    draggedElement.style.opacity = '1';
    draggedElement.style.zIndex = '3';
    
    // Store position in templateConfig
    const elementId = draggedElement.id;
    const x = parseFloat(draggedElement.style.left) || 0;
    const y = parseFloat(draggedElement.style.top) || 0;
    
    if (templateConfig[elementId]) {
      templateConfig[elementId].posX = x;
      templateConfig[elementId].posY = y;
    }
    
    draggedElement = null;
  });
}


// Make elements draggable when certificate is loaded
function initDraggable() {
  setTimeout(makeDraggable, 100);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTemplateEditor();
    initDraggable();
  });
} else {
  initTemplateEditor();
  initDraggable();
}

console.log('✅ main.js loaded with draggable elements and template editor');
