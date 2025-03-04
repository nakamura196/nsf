const fs = require('fs');
const csv = require('csv-parser');

const inputFile = './metadata.csv'; // CSVファイルのパス
const outputFile = './index.json'; // 出力JSONファイル

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (data) => {
    // titleが空の場合はスキップ
    if (!data.title || data.title.trim() === '') {
      return;
    }

    // objectidをidとして設定し、元のobjectidは削除
    const id = data.objectid;
    delete data.objectid;

    // latitude, longitude を数値に変換
    data.latitude = parseFloat(data.latitude);
    data.longitude = parseFloat(data.longitude);
    // subject, type を配列に変換
    data.subject = data.subject.split('|');
    data.type = data.type.split(';');

    // 新しい構造のオブジェクトを作成
    const newData = {
      id: id,
      attributes: { ...data },
    };

    results.push(newData);
  })
  .on('end', () => {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  });
