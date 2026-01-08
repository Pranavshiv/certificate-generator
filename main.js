// =====================
// Global State
// =====================
let csvData = [];
let logoImg = null;
let sign1ImgData = null;
let sign2ImgData = null;
let logoUploaded = false;
let customTextAdded = false;

// Template styling storage
let templateConfig = {
  studentName: { fontSize: 48, color: '#1a1a1a', posX: 0, posY: 0 },
  courseName: { fontSize: 28, color: '#333333', posX: 0, posY: 0 },
  collegeName: { fontSize: 18, color: '#333333', posX: 0, posY: 0 },
  customTextDisplay: { fontSize: 14, color: '#333333', posX: 0, posY: 0 },
  periodText: { fontSize: 14, color: '#333333', posX: 0, posY: 0 }
};

let selectedElement = null;

// =====================
// DOM Elements
// =====================
const dataFileInput = document.getElementById('dataFile');
const logoFileInput = document.getElementById('logoFile');
const sign1FileInput = document.getElementById('signFile');
const sign2FileInput = document.getElementById('signFile2');

const csvStatus = document.getElementById('csvStatus');
const generateBtn = document.getElementById('generateBtn');
const recordsBadge = document.getElementById('recordsBadge');

const studentNameEl = document.getElementById('studentName');
const courseNameEl = document.getElementById('courseName');
const collegeNameEl = document.getElementById('collegeName');
const periodTextEl = document.getElementById('periodText');

const customTextEl = document.getElementById('customText');
const customTextDisplayEl = document.getElementById('customTextDisplay');

const logoImgEl = document.getElementById('logoPreview');
const sign1ImgEl = document.getElementById('signPreview');
const sign2ImgEl = document.getElementById('signPreview2');

// Template editor elements
const elementSelect = document.getElementById('elementSelect');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
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
      csvData = parseCSV(event.target.result);

      if (csvData.length === 0) {
        throw new Error('CSV is empty or invalid');
      }

      csvStatus.textContent = `✅ Loaded ${csvData.length} records`;
      csvStatus.className = 'status';
      recordsBadge.textContent = `${csvData.length} records`;

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
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIdx = headers.indexOf('name');
  const courseIdx = headers.indexOf('course');
  const periodIdx = headers.indexOf('period');
  const collegeIdx = headers.indexOf('college');

  if (nameIdx === -1 || courseIdx === -1 || periodIdx === -1 || collegeIdx === -1) {
    throw new Error('CSV must contain name, course, period, and college columns');
  }

  return lines.slice(1).map(row => {
    const cols = row.split(',').map(c => c.trim());
    return {
      name: cols[nameIdx] || '',
      course: cols[courseIdx] || '',
      period: cols[periodIdx] || '',
      college: cols[collegeIdx] || ''
    };
  });
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
// Preview Update
// =====================
function updatePreview(record) {
  studentNameEl.textContent = record.name || 'Student Name';
  courseNameEl.textContent = record.course || 'Course Name';
  collegeNameEl.textContent = record.college || 'College Name';
  periodTextEl.textContent = record.period ? `Period: ${record.period}` : 'Period: dd/mm/yyyy - dd/mm/yyyy';
  
  // update custom text display from textarea
  customTextDisplayEl.textContent = customTextEl.value;
  
  // Apply stored positions to all elements
  applyStoredPositions();
  
  // Make elements draggable
  makeDraggable();
}

function applyStoredPositions() {
  Object.keys(templateConfig).forEach(elementId => {
    const el = document.getElementById(elementId);
    if (el && templateConfig[elementId]) {
      const config = templateConfig[elementId];
      if (config.posX) el.style.left = config.posX + 'px';
      if (config.posY) el.style.top = config.posY + 'px';
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
  customTextDisplayEl.textContent = e.target.value;
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
      const size = parseInt(e.target.value);
      fontSizeValue.textContent = size + 'px';
      
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

    // reset to default
    resetTemplateBtn.addEventListener('click', () => {
      if (confirm('Reset all template settings to default?')) {
        templateConfig = {
          studentName: { fontSize: 48, color: '#1a1a1a', posX: 0, posY: 0 },
          courseName: { fontSize: 28, color: '#333333', posX: 0, posY: 0 },
          collegeName: { fontSize: 18, color: '#333333', posX: 0, posY: 0 },
          customTextDisplay: { fontSize: 14, color: '#333333', posX: 0, posY: 0 },
          periodText: { fontSize: 14, color: '#333333', posX: 0, posY: 0 }
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
    const config = templateConfig[elementId] || { fontSize: 14, color: '#1e293b', posX: 0, posY: 0 };
    if (fontSizeInput) fontSizeInput.value = config.fontSize;
    if (fontSizeValue) fontSizeValue.textContent = config.fontSize + 'px';
    if (textColorInput) textColorInput.value = config.color;
    if (posXInput) posXInput.value = config.posX;
    if (posYInput) posYInput.value = config.posY;
  }
}

// =====================
// Draggable & Resizable Elements
// =====================
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;

function makeDraggable() {
  const certElements = document.querySelectorAll('.cert-element, .cert-logo, .cert-signature');
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
    
    let x = e.clientX - certRect.left - offsetX;
    let y = e.clientY - certRect.top - offsetY;
    
    // Clamp position within certificate bounds
    x = Math.max(0, Math.min(x, certRect.width - draggedElement.offsetWidth));
    y = Math.max(0, Math.min(y, certRect.height - draggedElement.offsetHeight));
    
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
