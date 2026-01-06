// =====================
// Global State
// =====================
let csvData = [];
let logoImg = null;
let sign1ImgData = null;
let sign2ImgData = null;

// Template styling storage
let templateConfig = {
  certTitle: { fontSize: 56, color: '#1a1a1a', posX: 0, posY: 0 },
  studentName: { fontSize: 48, color: '#1a1a1a', posX: 0, posY: 0 },
  courseName: { fontSize: 28, color: '#333333', posX: 0, posY: 0 },
  customTextDisplay: { fontSize: 14, color: '#333333', posX: 0, posY: 0 }
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
const periodTextEl = document.getElementById('periodText');

const certTitleEl = document.getElementById('certTitle');
const subtitleTopEl = document.getElementById('subtitleTop');
const subtitleBottomEl = document.getElementById('subtitleBottom');
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

  if (nameIdx === -1 || courseIdx === -1 || periodIdx === -1) {
    throw new Error('CSV must contain name, course, period');
  }

  return lines.slice(1).map(row => {
    const cols = row.split(',').map(c => c.trim());
    return {
      name: cols[nameIdx] || '',
      course: cols[courseIdx] || '',
      period: cols[periodIdx] || ''
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
  const modeEl = document.querySelector('input[name="certMode"]:checked');
  const mode = modeEl ? modeEl.value : 'completed';

  // Title and subtitle differ by mode
  if (mode === 'participation') {
    certTitleEl.textContent = 'CERTIFICATE OF PARTICIPATION';
    subtitleTopEl.textContent = 'This is to certify that';
    subtitleBottomEl.textContent = 'has participated in';
  } else {
    certTitleEl.textContent = 'CERTIFICATE OF COMPLETION';
    subtitleTopEl.textContent = 'This is proudly presented to';
    subtitleBottomEl.textContent = 'for successfully completing';
  }

  studentNameEl.textContent = record.name || 'Student Name';
  courseNameEl.textContent = record.course || 'Course Name';
  periodTextEl.textContent = record.period ? `Period: ${record.period}` : 'Period: dd/mm/yyyy - dd/mm/yyyy';
  
  // update custom text display from textarea
  customTextDisplayEl.textContent = customTextEl.value;
}

// update preview when mode changes
document.querySelectorAll('input[name="certMode"]').forEach(r => {
  r.addEventListener('change', () => {
    if (csvData && csvData.length > 0) updatePreview(csvData[0]);
    else updatePreview({ name: 'Student Name', course: 'Course Name', period: '' });
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
  generateBtn.textContent = 'Generating...';

  let success = 0;

  for (let i = 0; i < csvData.length; i++) {
    try {
      updatePreview(csvData[i]);
      await new Promise(r => setTimeout(r, 100));

      const cert = document.getElementById('certificate');
      const canvas = await html2canvas(cert, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const imageData = canvas.toDataURL('image/png');
      
      // Use fetch + blob for more reliable downloads
      const response = await fetch(imageData);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const mode = (document.querySelector('input[name="certMode"]:checked') || { value: 'completed' }).value;
      link.download = `Certificate_${csvData[i].name.replace(/\s+/g, '_')}_${mode}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      success++;
    } catch (err) {
      console.error('Generation error:', err);
    }
  }

  alert(`✅ Generated ${success}/${csvData.length} certificates`);
  generateBtn.disabled = false;
  generateBtn.textContent = 'Generate all certificates';
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
          certTitle: { fontSize: 56, color: '#1a1a1a', posX: 0, posY: 0 },
          studentName: { fontSize: 48, color: '#1a1a1a', posX: 0, posY: 0 },
          courseName: { fontSize: 28, color: '#333333', posX: 0, posY: 0 },
          customTextDisplay: { fontSize: 14, color: '#333333', posX: 0, posY: 0 }
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTemplateEditor);
} else {
  initTemplateEditor();
}

console.log('✅ main.js loaded with template editor');
