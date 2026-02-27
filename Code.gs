// ==========================================
//      BUILD THE SIDEBAR UI
// ========================================== 
function onHomepage(e) {
  return onSheetsHomepage(e); 
}

function onSheetsHomepage(e) {
  var builder = CardService.newCardBuilder();
  var props = PropertiesService.getUserProperties();

  // Updated defaults
  var defFill = props.getProperty('c_fill') || '#F2F2F2 | #ECF7FE | #E2E0FF | #5F59FF'; 
  var defFont = props.getProperty('c_font') || '#000000 | #0000ff | #008000'; 
  var defNum  = props.getProperty('c_num')  || '_(#,##0_);(#,##0);_("–")_;_(@_) | _(#,##0.0_);(#,##0.0);_("–")_;_(@_)';
  var defCur  = props.getProperty('c_cur')  || '_($#,##0_);($#,##0);_("–")_;_(@_) | _($#,##0.0_);($#,##0.0);_("–")_;_(@_)';
  var defPer  = props.getProperty('c_per')  || '_(#,##0%_);(#,##0%);_("–"_)_%;_(@_)_% | _(#,##0.0%_);(#,##0.0%);_("–"_)_%;_(@_)_%';

  // SECTION 1: FORMULA AUDITING
  var auditSection = CardService.newCardSection().setHeader("Formula Auditing");
  var auditSet1 = CardService.newButtonSet()
    .addButton(CardService.newTextButton().setText("🔍 Precedents").setOnClickAction(CardService.newAction().setFunctionName("launchTraceModal")))
    .addButton(CardService.newTextButton().setText("🎯 Dependents").setOnClickAction(CardService.newAction().setFunctionName("launchDependentsModal")));
  
  var auditSet2 = CardService.newButtonSet()
    .addButton(CardService.newTextButton().setText("⬅ Jump Back").setOnClickAction(CardService.newAction().setFunctionName("jumpBack")));

  auditSection.addWidget(auditSet1).addWidget(auditSet2);
  builder.addSection(auditSection);

  // SECTION 2: MODEL FORMATTING
  var autoSection = CardService.newCardSection().setHeader("Model Formatting");
  autoSection.addWidget(CardService.newTextButton()
    .setText("🎨 Auto Color Sheet")
    .setOnClickAction(CardService.newAction().setFunctionName("autoColorSheet")));
  builder.addSection(autoSection);

  // SECTION 2: MODELING TOOLS
  var modelSection = CardService.newCardSection().setHeader("Modeling Tools");
  var modelSet1 = CardService.newButtonSet()
    .addButton(CardService.newTextButton().setText("+/- Flip Sign").setOnClickAction(CardService.newAction().setFunctionName("flipSign")))
    .addButton(CardService.newTextButton().setText("IFERROR").setOnClickAction(CardService.newAction().setFunctionName("wrapIferror")));
  
  modelSection.addWidget(modelSet1);
  builder.addSection(modelSection);

  // SECTION 3: ONE-CLICK CYCLES
  var actionSection = CardService.newCardSection().setHeader("Format Cycles");
  
  var actionSet1 = CardService.newButtonSet()
    .addButton(CardService.newTextButton().setText("Fill").setOnClickAction(CardService.newAction().setFunctionName("cycleFill")))
    .addButton(CardService.newTextButton().setText("Font").setOnClickAction(CardService.newAction().setFunctionName("cycleFont")));
    
  var actionSet2 = CardService.newButtonSet()
    .addButton(CardService.newTextButton().setText("Number").setOnClickAction(CardService.newAction().setFunctionName("cycleNumber")))
    .addButton(CardService.newTextButton().setText("$").setOnClickAction(CardService.newAction().setFunctionName("cycleCurrency")))
    .addButton(CardService.newTextButton().setText("%").setOnClickAction(CardService.newAction().setFunctionName("cyclePercent")));
    
  actionSection.addWidget(actionSet1).addWidget(actionSet2);
  builder.addSection(actionSection);

  // SECTION 4: NUMBER FORMAT PAINTER
  var painterSection = CardService.newCardSection().setHeader("Number Format Painter");
  var numFormatSet = CardService.newButtonSet()
    .addButton(CardService.newTextButton().setText("Save").setOnClickAction(CardService.newAction().setFunctionName("saveNumberFormat")))
    .addButton(CardService.newTextButton().setText("Apply").setOnClickAction(CardService.newAction().setFunctionName("applyNumberFormat")));
  painterSection.addWidget(numFormatSet);
  builder.addSection(painterSection);

  // SECTION 5: CYCLE SETTINGS CONTROLS
  var settingsCtrl = CardService.newCardSection().setHeader("⚙️ Cycle Settings");
  var settingsBtns = CardService.newButtonSet()
    .addButton(CardService.newTextButton()
      .setText("💾 Save Settings")
      .setOnClickAction(CardService.newAction().setFunctionName("saveSettings")))
    .addButton(CardService.newTextButton()
      .setText("🔄 Reset All")
      .setOnClickAction(CardService.newAction().setFunctionName("resetSettings")));
  settingsCtrl.addWidget(settingsBtns);
  builder.addSection(settingsCtrl);

  // Helper function to extract array of 4 formats
  function getArr(key, defaultStr) {
    var saved = props.getProperty(key);
    var str = saved !== null ? saved : defaultStr;
    var arr = str.split('|').map(function(s) { return s.trim(); });
    return [arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || ''];
  }

  // Helper to build smart-collapsing sections that hide empty buttons
  function buildConfigSection(title, keyPrefix, arr, testType) {
    var sec = CardService.newCardSection().setHeader(title).setCollapsible(true);
    
    var btnSet = CardService.newButtonSet();
    var filledCount = 0;
    
    for (var i = 0; i < 4; i++) {
      if (arr[i] !== "") {
        btnSet.addButton(CardService.newTextButton()
          .setText(String(i+1))
          .setOnClickAction(CardService.newAction()
            .setFunctionName("testFormat")
            .setParameters({"key": keyPrefix + (i+1), "type": testType})));
        filledCount++;
      }
    }
    
    if (filledCount > 0) {
      sec.addWidget(btnSet);
    }
    
    for (var i = 0; i < 4; i++) {
      sec.addWidget(CardService.newTextInput()
        .setFieldName(keyPrefix + (i+1))
        .setTitle("Format " + (i+1))
        .setValue(arr[i]));
    }
    
    var visibleWidgets = filledCount > 0 ? (1 + filledCount) : 1;
    sec.setNumUncollapsibleWidgets(visibleWidgets);
    
    return sec;
  }

  builder.addSection(buildConfigSection("Number Formats", "c_num", getArr('c_num', defNum), 'number'));
  builder.addSection(buildConfigSection("Currency Formats", "c_cur", getArr('c_cur', defCur), 'number'));
  builder.addSection(buildConfigSection("Percent Formats", "c_per", getArr('c_per', defPer), 'number'));
  builder.addSection(buildConfigSection("Fill Colors", "c_fill", getArr('c_fill', defFill), 'fill'));
  builder.addSection(buildConfigSection("Font Colors", "c_font", getArr('c_font', defFont), 'font'));

  return builder.build();
}

// ========================================== 
//      SETTINGS MANAGEMENT
// ========================================== 

function notify(text) {
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText(text))
    .build();
}

function saveSettings(e) {
  var props = PropertiesService.getUserProperties();
  var categories = ['c_num', 'c_cur', 'c_per', 'c_fill', 'c_font'];
  
  categories.forEach(function(cat) {
    var v1 = e.formInputs[cat + '1'] ? e.formInputs[cat + '1'][0].trim() : '';
    var v2 = e.formInputs[cat + '2'] ? e.formInputs[cat + '2'][0].trim() : '';
    var v3 = e.formInputs[cat + '3'] ? e.formInputs[cat + '3'][0].trim() : '';
    var v4 = e.formInputs[cat + '4'] ? e.formInputs[cat + '4'][0].trim() : '';
    
    var arr = [];
    if (v1) arr.push(v1);
    if (v2) arr.push(v2);
    if (v3) arr.push(v3);
    if (v4) arr.push(v4);
    
    props.setProperty(cat, arr.join(' | '));
  });
  
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText('Settings Saved!'))
    .setNavigation(CardService.newNavigation().updateCard(onSheetsHomepage(e)))
    .build();
}

function resetSettings(e) {
  var props = PropertiesService.getUserProperties();
  props.deleteProperty('c_fill');
  props.deleteProperty('c_font');
  props.deleteProperty('c_num');
  props.deleteProperty('c_cur');
  props.deleteProperty('c_per');
  
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText('Defaults Restored!'))
    .setNavigation(CardService.newNavigation().updateCard(onSheetsHomepage(e)))
    .build();
}

function testFormat(e) {
  var key = e.parameters.key;
  var type = e.parameters.type;
  var val = e.formInputs[key] ? e.formInputs[key][0].trim() : '';
  
  if (!val) return notify("Input box is empty.");
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var range = sheet.getActiveRange();
  if (!range) return notify("Select a cell to apply format.");
  
  try {
    if (type === 'fill') range.setBackground(val);
    if (type === 'font') range.setFontColor(val);
    if (type === 'number') range.setNumberFormat(val);
    return notify("Format applied to active cell!");
  } catch (err) {
    return notify("Invalid format code.");
  }
}

// ========================================== 
//      TARGETED FORMAT PAINTER
// ========================================== 

function saveNumberFormat(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var range = sheet.getActiveRange();
  if (!range) return notify('Select a cell first.');
  
  var format = range.getNumberFormat();
  PropertiesService.getUserProperties().setProperty('saved_number_format', format);
  
  return notify('Number format saved!');
}

function applyNumberFormat(e) {
  var savedFormat = PropertiesService.getUserProperties().getProperty('saved_number_format');
  if (!savedFormat) return notify('Save a number format first.');
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var range = sheet.getActiveRange();
  if (!range) return notify('Select cells to format.');
  
  range.setNumberFormat(savedFormat);
  return notify('Number format applied!');
}

// ========================================== 
//      AUTO COLOR ENGINE
// ========================================== 

function autoColorSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  
  if (!range) return notify('No data found to format.');

  var formulas = range.getFormulas();
  var values = range.getValues();
  var currentColors = range.getFontColors(); 
  
  var newColors = [];

  for (var r = 0; r < formulas.length; r++) {
    var rowColors = [];
    for (var c = 0; c < formulas[r].length; c++) {
      var formula = formulas[r][c];
      var value = values[r][c];
      var color = currentColors[r][c]; 
      
      if (formula) {
        if (formula.toUpperCase().indexOf('IMPORTRANGE') !== -1) {
          color = '#800080'; // Purple
        } else if (formula.indexOf('!') !== -1) {
          color = '#008000'; // Green
        } else {
          color = '#000000'; // Black
        }
      } else if (value !== "") {
        if (typeof value === 'number') {
          color = '#0000ff'; // Blue
        }
      }
      rowColors.push(color);
    }
    newColors.push(rowColors);
  }

  range.setFontColors(newColors);
  return notify('Auto-Coloring Complete!');
}

// ========================================== 
//      CYCLE LOGIC ENGINE
// ========================================== 

function applyCycle(cycleStr, type) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var range = sheet.getActiveRange();
  if (!range) return;
  
  var cycleArr = cycleStr.split('|').map(function(s) { return s.trim(); });
  if (cycleArr.length === 0 || cycleArr[0] === "") return;

  var currentIndex = -1;
  
  if (type === 'fill') {
    var currentBg = range.getBackground().toLowerCase();
    currentIndex = cycleArr.map(function(x) { return x.toLowerCase(); }).indexOf(currentBg);
    range.setBackground(cycleArr[(currentIndex + 1) % cycleArr.length]);
  } else if (type === 'font') {
    var currentFont = range.getFontColor().toLowerCase();
    currentIndex = cycleArr.map(function(x) { return x.toLowerCase(); }).indexOf(currentFont);
    range.setFontColor(cycleArr[(currentIndex + 1) % cycleArr.length]);
  } else if (type === 'number') {
    var currentFormat = range.getNumberFormat();
    currentIndex = cycleArr.indexOf(currentFormat);
    range.setNumberFormat(cycleArr[(currentIndex + 1) % cycleArr.length]);
  }
}

function cycleFill() {
  var str = PropertiesService.getUserProperties().getProperty('c_fill') || '#F2F2F2 | #ECF7FE | #E2E0FF | #5F59FF';
  applyCycle(str, 'fill');
}

function cycleFont() {
  var str = PropertiesService.getUserProperties().getProperty('c_font') || '#000000 | #0000ff | #008000';
  applyCycle(str, 'font');
}

function cycleNumber() {
  var str = PropertiesService.getUserProperties().getProperty('c_num') || '_(#,##0_);(#,##0);_("–")_;_(@_) | _(#,##0.0_);(#,##0.0);_("–")_;_(@_)';
  applyCycle(str, 'number');
}

function cycleCurrency() {
  var str = PropertiesService.getUserProperties().getProperty('c_cur') || '_($#,##0_);($#,##0);_("–")_;_(@_) | _($#,##0.0_);($#,##0.0);_("–")_;_(@_)';
  applyCycle(str, 'number');
}

function cyclePercent() {
  var str = PropertiesService.getUserProperties().getProperty('c_per') || '_(#,##0%_);(#,##0%);_("–"_)_%;_(@_)_% | _(#,##0.0%_);(#,##0.0%);_("–"_)_%;_(@_)_%';
  applyCycle(str, 'number');
}

// ========================================== 
//      MODELING TOOLS ENGINE
// ========================================== 

function wrapIferror() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getActiveRange();
  if (!range) return notify("Select a range.");
  
  var formulas = range.getFormulas();
  var hasFormula = false;
  
  for (var i = 0; i < formulas.length; i++) {
    for (var j = 0; j < formulas[i].length; j++) {
      var f = formulas[i][j];
      if (f && f.startsWith('=') && f.toUpperCase().indexOf('IFERROR') === -1) {
        formulas[i][j] = "=IFERROR(" + f.substring(1) + ", \"\")";
        hasFormula = true;
      }
    }
  }
  
  if (hasFormula) {
    range.setFormulas(formulas);
    return notify("Formulas wrapped in IFERROR.");
  } else {
    return notify("No suitable formulas found.");
  }
}

function flipSign() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getActiveRange();
  if (!range) return notify("Select a range.");
  
  var formulas = range.getFormulas();
  var values = range.getValues();
  var newValues = [];
  var newFormulas = [];
  
  for (var i = 0; i < values.length; i++) {
    var rVal = [];
    var rForm = [];
    for (var j = 0; j < values[i].length; j++) {
      var f = formulas[i][j];
      var v = values[i][j];
      
      if (f && f.startsWith('=')) {
        // Wrap formula
        rForm.push("=-1*(" + f.substring(1) + ")");
        rVal.push(null); 
      } else if (typeof v === 'number') {
        // Flip number
        rVal.push(v * -1);
        rForm.push(null);
      } else {
        // Keep as is
        rVal.push(v);
        rForm.push(f);
      }
    }
    newValues.push(rVal);
    newFormulas.push(rForm);
  }
  
  // Apply changes. We must do formulas first, or values will overwrite.
  // Actually, standard practice is: if it's a formula, use setFormulas. If value, use setValues.
  // We can't mix easily in one batch call if they are mixed in the range without being careful.
  // But setValues() overwrites formulas. setFormulas() overwrites values.
  
  // Safe approach: Iterate and set individually? Too slow.
  // Better: Create a 2D array of mixed content? No, API has setValues (for values) and setFormulas (for strings).
  // If we pass a string starting with '=' to setValues, it effectively sets a formula.
  
  var finalOutput = [];
  for (var i = 0; i < values.length; i++) {
    var row = [];
    for (var j = 0; j < values[i].length; j++) {
      if (newFormulas[i][j]) {
        row.push(newFormulas[i][j]);
      } else {
        row.push(newValues[i][j]);
      }
    }
    finalOutput.push(row);
  }
  
  range.setValues(finalOutput); // setValues handles formulas if they are strings starting with =
  return notify("Signs flipped.");
}

// === NAVIGATION HISTORY ===

function pushHistory(loc) {
  var props = PropertiesService.getUserProperties();
  var json = props.getProperty('nav_history');
  var history = json ? JSON.parse(json) : [];
  
  // Add new location to top
  history.push(loc);
  
  // Cap at 20
  if (history.length > 20) history.shift();
  
  props.setProperty('nav_history', JSON.stringify(history));
}

function jumpBack() {
  var props = PropertiesService.getUserProperties();
  var json = props.getProperty('nav_history');
  var history = json ? JSON.parse(json) : [];
  
  if (history.length === 0) return notify("No history found.");
  
  var lastLoc = history.pop();
  props.setProperty('nav_history', JSON.stringify(history));
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var range = ss.getRange(lastLoc);
    var sheet = range.getSheet();
    if (ss.getActiveSheet().getName() !== sheet.getName()) {
      sheet.activate();
    }
    range.activate();
    return notify("Jumped back!");
  } catch (e) {
    return notify("Could not find previous location.");
  }
}


// ========================================== 
//      TRACE PRECEDENTS ENGINE
// ========================================== 

function extractPrecedents(formula) {
  if (!formula || !formula.startsWith('=')) return [];
  
  var precedents = [];
  
  // 1. Standard A1 Notation (e.g., Sheet1!A1, $B$2, 'Data Set'!D4)
  var a1Regex = /('?[a-zA-Z0-9_\s\-\(\)\.,]+'?!)?\$?[A-Z]+\$?[0-9]+(:\$?[A-Z]+\$?[0-9]+)?/gi;
  var a1Matches = formula.match(a1Regex);
  if (a1Matches) {
    precedents = precedents.concat(a1Matches);
  }

  // 2. Named Ranges (Heuristic)
  var tokens = formula.split(/[^a-zA-Z0-9_.]+/);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  tokens.forEach(function(token) {
    if (!token || /^[0-9]+$/.test(token)) return; // Skip numbers
    if (a1Regex.test(token)) return; // Skip things that look like A1
    
    // Optimization: Only check valid-looking names to save API calls
    if (token.length > 2) { 
      var range = ss.getRangeByName(token);
      if (range) {
        precedents.push(token);
      }
    }
  });

  // Deduplicate
  var unique = [];
  precedents.forEach(function(p) {
    var clean = p.trim();
    if (unique.indexOf(clean) === -1) unique.push(clean);
  });
  
  return unique;
}

// 1. Sidebar button now launches a floating HTML window
function launchTraceModal(e) {
  PropertiesService.getUserProperties().setProperty('trace_mode', 'precedents');
  var html = HtmlService.createHtmlOutputFromFile('Trace')
      .setWidth(500)
      .setHeight(400);
  SpreadsheetApp.getUi().showModelessDialog(html, 'Trace In');
}

// 2. The HTML window calls this to get data
function getTraceData(targetA1) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var cell;

  // OPTIMIZATION: Do NOT activate the cell/sheet. Just read the data.
  if (targetA1) {
    cell = ss.getRange(targetA1);
  } else {
    cell = sheet.getActiveCell();
  }
  
  var props = PropertiesService.getUserProperties();
  var mode = props.getProperty('trace_mode') || 'precedents';
  
  var sheetName = cell.getSheet().getName();
  var cellA1 = cell.getA1Notation();
  var fullHomeRef = "'" + sheetName + "'!" + cellA1;

  var results = [{
    shortRef: "🏠 " + sheetName + "!" + cellA1,
    fullRef: fullHomeRef,
    value: cell.getDisplayValue() || "0"
  }];

  if (mode === 'dependents') {
    return findDependents(ss, cell, results);
  } else {
    var formula = cell.getFormula();
    if (!formula) return { error: "No formula found in " + cellA1 };
    
    var precedents = extractPrecedents(formula);
    precedents.forEach(function(target) {
      var fullRef = target.indexOf('!') === -1 ? "'" + sheetName + "'!" + target : target;
      results.push({ 
        shortRef: target, 
        fullRef: fullRef, 
        value: getVal(ss, fullRef) 
      });
    });
    return { formula: formula, precedents: results, mode: 'Precedents' };
  }
}

// THE STICKY LEFT ARROW FIX: Standardizing Deep Trace
function getDeepTraceData(targetA1) {
  return getTraceData(targetA1);
}

// 3. THE JUMP FUNCTION (CRITICAL FIX)
function goToPrecedent(params) {
  var targetA1 = params.targetA1;
  var ss = SpreadsheetApp.getActive();
  
  // SAVE HISTORY BEFORE JUMPING
  try {
    var currentCell = ss.getActiveCell();
    var currentLoc = "'" + currentCell.getSheet().getName() + "'!" + currentCell.getA1Notation();
    pushHistory(currentLoc);
  } catch (e) {
    console.error("Failed to save history: " + e);
  }

  try {
    var range = ss.getRange(targetA1);
    var targetSheet = range.getSheet();
    if (ss.getActiveSheet().getName() !== targetSheet.getName()) {
      targetSheet.activate();
    }
    range.activate();
    SpreadsheetApp.flush(); 
  } catch (err) {
    console.error("Jump failed: " + err);
  }
}

// Launches the Trace Dependents version of the modal
function launchDependentsModal() {
  PropertiesService.getUserProperties().setProperty('trace_mode', 'dependents');
  var html = HtmlService.createHtmlOutputFromFile('Trace')
      .setWidth(500)
      .setHeight(400);
  SpreadsheetApp.getUi().showModelessDialog(html, 'Trace Out (Dependents)');
}

// IMPROVED DEPENDENT SEARCH (Using TextFinder)
function findDependents(ss, targetCell, results) {
  var targetA1 = targetCell.getA1Notation();
  var targetSheetName = targetCell.getSheet().getName();
  
  // 1. Search Globally for "SheetName!A1" refs
  var tf = ss.createTextFinder(targetSheetName).matchFormulaText(true);
  var candidates = tf.findAll();
  
  // 2. Search Locally for "A1" refs on the same sheet
  var localTf = targetCell.getSheet().createTextFinder(targetA1).matchFormulaText(true);
  var localCandidates = localTf.findAll();
  
  var allRanges = candidates.concat(localCandidates);
  var processedMap = {}; 
  
  var baseAddr = targetA1.replace(/\$/g, ""); 
  var col = baseAddr.match(/[A-Z]+/)[0];
  var row = baseAddr.match(/[0-9]+/)[0];
  
  var refPattern = "(\\$?" + col + "\\$?" + row + ")";
  
  var localRegex = new RegExp("(?!!" + refPattern + ")(^|[^A-Z0-9])" + refPattern + "(?![0-9A-Z])", "i");
  
  var escapedSheet = targetSheetName.replace(/[-\/\\^$*+?.()|[\\\]{}]/g, '\\$&');
  var globalRegex = new RegExp("'" + escapedSheet + "'!" + refPattern + "(?![0-9A-Z])", "i");
  var globalRegexNoQuote = new RegExp(escapedSheet + "!" + refPattern + "(?![0-9A-Z])", "i");

  allRanges.forEach(function(range) {
    var key = range.getSheet().getName() + "!" + range.getA1Notation();
    if (processedMap[key]) return;
    processedMap[key] = true;
    
    // Ignore self
    if (range.getSheet().getName() === targetSheetName && range.getA1Notation() === targetA1) return;

    var formula = range.getFormula();
    if (!formula) return;

    var isMatch = false;
    if (range.getSheet().getName() === targetSheetName) {
      if (localRegex.test(formula)) isMatch = true;
    }
    if (globalRegex.test(formula) || globalRegexNoQuote.test(formula)) isMatch = true;

    if (isMatch) {
       results.push({
        shortRef: range.getSheet().getName() + "!" + range.getA1Notation(),
        fullRef: "'" + range.getSheet().getName() + "'!" + range.getA1Notation(),
        value: range.getDisplayValue()
      });
    }
  });

  return { 
    formula: "Tracing Dependents of " + targetSheetName + "!" + targetA1, 
    precedents: results, 
    mode: 'Dependents' 
  };
}

function getVal(ss, ref) {
  try { return ss.getRange(ref).getDisplayValue(); } catch(e) { return "N/A"; }
}