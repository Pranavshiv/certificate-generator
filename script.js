let rows = [];
let logoDataUrl = null;
let signDataUrl = null;

const dataInput = document.getElementById("dataFile");
const logoInput = document.getElementById("logoFile");
const signInput = document.getElementById("signFile");
const generateBtn = document.getElementById("generateBtn");

const logoImg = document.getElementById("logoImg");
const signImg = document.getElementById("signImg");
const logoPreview = document.getElementById("logoPreview");
const signPreview = document.getElementById("signPreview");

const studentNameEl = document.getElementById("studentName");
const courseNameEl = document.getElementById("courseName");
const periodTextEl = document.getElementById("periodText");

const csvStatus = document.getElementById("csvStatus");
const recordsBadge = document.getElementById("recordsBadge");

function readFileAsDataURL(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => callback(e.target.result);
  reader.readAsDataURL(file);
}

function readFileAsText(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => callback(e.target.result);
  reader.readAsText(file);
}

/* logo */

logoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  readFileAsDataURL(file, (result) => {
    logoDataUrl = result;
    logoImg.src = logoDataUrl;
    logoPreview.src = logoDataUrl;
  });
});

/* signature */

signInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  readFileAsDataURL(file, (result) => {
    signDataUrl = result;
    signImg.src = signDataUrl;
    signPreview.src = signDataUrl;
  });
});

/* CSV */

dataInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".csv")) {
    csvStatus.textContent = "Please upload a .csv file.";
    csvStatus.classList.add("error");
    return;
  }
  csvStatus.classList.remove("error");

  readFileAsText(file, (text) => {
    rows = parseCsvToObjects(text);
    if (!rows.length) {
      csvStatus.textContent = "No records found. Check header row.";
      recordsBadge.textContent = "0 records";
      generateBtn.disabled = true;
      return;
    }
    csvStatus.textContent = `Loaded ${rows.length} records from ${file.name}`;
    recordsBadge.textContent = `${rows.length} records`;
    generateBtn.disabled = false;
    fillCertificate(rows[0]); // live preview of first row
  });
});

function parseCsvToObjects(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const dataRows = lines.slice(1);

  return dataRows
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const cells = line.split(",");
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = (cells[i] || "").trim();
      });
      return {
        name: obj.name || "",
        course: obj.course || "",
        period: obj.period || "",
      };
    });
}

function fillCertificate(row) {
  studentNameEl.textContent = row.name || "Student Name";
  courseNameEl.textContent = row.course || "Course name";
  periodTextEl.textContent = row.period
    ? `Period: ${row.period}`
    : "Period: dd/mm/yyyy - dd/mm/yyyy";
}

/* one certificate */

async function generateForRow(row, index) {
  fillCertificate(row);
  const certDiv = document.getElementById("certificate");

  const canvas = await html2canvas(certDiv, {
    scale: 2,
    useCORS: true,
  });

  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  const safeName = (row.name || `student_${index + 1}`).replace(
    /[^a-z0-9]/gi,
    "_"
  );
  a.href = dataUrl;
  a.download = `certificate_${safeName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* bulk */

generateBtn.addEventListener("click", async () => {
  if (!rows.length) return;

  generateBtn.disabled = true;
  const originalText = generateBtn.textContent;
  generateBtn.textContent = "Generating…";

  for (let i = 0; i < rows.length; i++) {
    await generateForRow(rows[i], i);
  }

  generateBtn.textContent = originalText;
  generateBtn.disabled = false;
  alert("All certificates generated successfully.");
});
