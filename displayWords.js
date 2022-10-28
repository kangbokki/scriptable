

if ( config.runsInWidget ) {
  Script.setWidget(createWidget());
} else if ( Device.isPhone() ) {
  const cwidget = createWidget();

  cwidget.presentMedium();

  Script.setWidget(cwidget);
} else {
  await QuickLook.present(createTable(), false);
}

function loadData() {
  const fileName = 'glossary.txt';
  const fm = FileManager.iCloud();
  const dataPath = fm.joinPath(fm.documentsDirectory(), fileName);
  const dispayRow = 4;
  let result = [];

  if ( fm.fileExists(dataPath) ) {
    const data = fm.readString(dataPath);
    const arrData = data.split('\n');
    const playCnt = arrData.length > dispayRow ? dispayRow : arrData.length;
    const set = new Set();
    
    while ( set.size < playCnt ) {
      set.add(Math.round(Math.random() * (arrData.length - 1)));
    }

    result = arrData
        .filter(el => el.split('|').length == 3)
        .filter((el, idx) => Array.from(set).includes(idx));
  }

  return result;
}

function createWidget() {
  const playItems = loadData();
  const widget = new ListWidget();

  widget.refreshAfterDate = new Date(+new Date + 1000 * 120);
  widget.url = 'https://github.com/kangbokki';

  playItems.forEach(el => {
    const wordItem = el.split('|');

    const boxStack = widget.addStack();

    boxStack.layoutHorizontally();
    boxStack.centerAlignContent();
    // boxStack.borderWidth = 1;
    // boxStack.borderColor = Color.red();

    const wordStack = boxStack.addStack();

    wordStack.layoutVertically();
    wordStack.centerAlignContent();
    // wordStack.borderWidth = 1
    // wordStack.borderColor = Color.blue()
    wordStack.size = new Size(100, 32)

    const mainWt = wordStack.addText(wordItem[0]);

    mainWt.font = Font.boldSystemFont(15);

    const subWt = wordStack.addText(wordItem[1]);

    subWt.textColor = Color.lightGray();
    subWt.centerAlignText();
    subWt.font = Font.lightSystemFont(12);

    const descWt = boxStack.addText(wordItem[2]);

    descWt.leftAlignText();
    descWt.font = Font.regularSystemFont(12);

    boxStack.addSpacer();
  });

  // widget.setPadding(12, 12, 12, 12);

  return widget;
}

function createTable() {
  const table = new UITable();
  const playItems = loadData();

  table.showSeparators = true;
    
  playItems.forEach(el => {
    const words = el.split('|');
    const row = new UITableRow();

    row.cellSpacing = 2;

    const wordCell = row.addText(words[0], words[1]);
    wordCell.widthWeight = 20;
    wordCell.titleFont = Font.boldSystemFont(15);
    wordCell.subtitleFont = Font.lightSystemFont(12);

    const descCell = row.addText(words[2]);

    descCell.widthWeight = 80;
    descCell.titleFont = Font.regularSystemFont(12);

    table.addRow(row);
  });

  return table;
}

function decode(str = '') {
  const regex = /&#(\d+);/g;

  return str.replace(regex, (match, dec) => String.fromCharCode(dec));
}

Script.complete();