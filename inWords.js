
if ( config.runsInApp ) {
  await writeText(await showAlert());
}

async function showAlert() {
  const alert = new Alert();

  alert.title = '저장할 단어';
  alert.addTextField('단어|뜻|설명');
  alert.addCancelAction('취소');
  alert.addAction('저장');

  const result = await alert.present();

  return result == -1 ? '' : alert.textFieldValue(0);
};

async function writeText(text = '') {
  const fileName = 'glossary.txt';
  const fm = FileManager.iCloud();
  const dataPath = fm.joinPath(fm.documentsDirectory(), fileName);

  let data = '';

  if ( fm.fileExists(dataPath) ) {
    data = fm.readString(dataPath);
  }

  fm.writeString(dataPath, `${data}\n${text}`);
};

Script.complete();