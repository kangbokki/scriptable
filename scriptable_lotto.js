// export
//copy([...document.querySelectorAll('#aaa tr')].filter((el, idx) => idx > 1).map(el => { return {[el.children[0].textContent]: [el.children[4].textContent, el.children[5].textContent, el.children[6].textContent, el.children[7].textContent, el.children[8].textContent, el.children[9].textContent, el.children[10].textContent]}}))


((async () => {
  const response = await fetch('https://raw.githubusercontent.com/kangbokki/scriptable/main/lotto.json');
  const data = await response.json();
  
  console.log(`data load count:${data.length}`);
  
  const arrData = data.map((el, idx) => el[data.length - idx].slice(0, 6)).reverse();
  
  const cntData = data.reduce((acc, cur, idx, arr) => { 
    for (key in cur) {
      const arrTmp = cur[key].slice(0, 6);
  
      for (itm of arrTmp) {
        if ( itm in acc ) {
          acc[itm] += 1;
        } else {
          acc[itm] = 1;
        }
      }
    }
  
    return acc
  }, {});
  
  // 랭킹 추출
  const rnkData = Object.keys(cntData).map(el => {return {cnt: cntData[el], rounds: el};});
  const bottom5 = rnkData.sort((a, b) => a.cnt > b.cnt ? 1 : -1 ).filter((el, idx) => idx < 5);
  const top5 = rnkData.sort((a, b) => a.cnt < b.cnt ? 1 : -1 ).filter((el, idx) => idx < 5);
  
  console.log('랭킹');
  // console.table(top5);
  // console.table(bottom5);
  
  // 번호별 포함된 번호 수 추출
  const includeNumber = {};
  for (let number = 1; number <= 45; number++) {
    includeNumber[number] = {};
  
    for (let nextNumber = 1; nextNumber < 46; nextNumber++) {
      includeNumber[number][nextNumber] = arrData.filter(el => el.includes(String(number))).filter(el => el.includes(String(nextNumber))).length
    }
  }
  
  console.log('-----------------------------', '회차별 중복 건수');
  const includeRounds3 = {};
  const includeRounds4 = {};
  const includeRounds5 = {};
  for (let number = 0; number < 45; number++) {
    arrData//.filter((el, idx) => idx > number)
    .forEach((el, idx) => {
      const arrTemp = arrData[number].filter(ele => el.includes(ele));
  
      if ( arrTemp.length == 3 ) {
        if ( includeRounds3[number] == undefined ) {
          includeRounds3[number] = [];
        }
  
        includeRounds3[number].push(idx);
      } else if ( arrTemp.length == 4 ) {
        if ( includeRounds4[number] == undefined ) {
          includeRounds4[number] = [];
        }
  
        includeRounds4[number].push(idx);
      } else if ( arrTemp.length == 5 ) {
        if ( includeRounds5[number] == undefined ) {
          includeRounds5[number] = [];
        }
  
        includeRounds5[number].push(idx);
      }
    });
  };
  
  // console.table(includeRounds3);
  // console.table(includeRounds4);
  // console.table(includeRounds5);
  // let arrDuplicates3 = [];
  // Object.keys(includeRounds3).forEach(el=> arrDuplicates3 = arrDuplicates3.concat(el).concat(includeRounds3[el]));
  const setDuplicates3 = new Set(Object.keys(includeRounds3).flatMap(el => [Number(el)].concat(includeRounds3[el])).map(el => Number(el) + 1));
  // const setDuplicates4 = new Set(Object.keys(includeRounds4).flatMap(el => Array.of(Number(el), includeRounds4[el])).flat().map(el => Number(el) + 1));
  let arrDuplicates4 = [];
  Object.keys(includeRounds4).forEach(el => arrDuplicates4 = arrDuplicates4.concat(el).concat(includeRounds4[el]));
  const setDuplicates4 = new Set(arrDuplicates4.map(el=> Number(el) + 1));
  
  let arrDuplicates5 = [];
  Object.keys(includeRounds5).forEach(el => arrDuplicates5 = [...arrDuplicates5, el, ...includeRounds5[el]]);
  const setDuplicates5 = new Set(arrDuplicates5.map(el=> Number(el) + 1));
  
  console.log(`3번:${setDuplicates3.size}    4번:${setDuplicates4.size}    5번:${setDuplicates5.size}`);
  
  
  const topAndBottom = {};
  for (let number = 1; number <= 45; number++) {
    const num = Object.keys(includeNumber[number]);
  
    const top5 = num.sort((a, b) => includeNumber[number][a] < includeNumber[number][b] ? 1 : -1).filter((el, idx) => idx > 0 && idx < 6);
    const bottom5 = num.sort((a, b) => includeNumber[number][a] > includeNumber[number][b] ? 1 : -1).filter((el, idx) => idx < 5);
  
    topAndBottom[number] = top5.map(el => el + ':' + includeNumber[number][el]).concat('<-상위:하위->').concat(bottom5.map(el => el + ':' + includeNumber[number][el]));
  }
  console.log('-----------------------------', '번호별 상위 하위 건수');
  console.table(topAndBottom);
  
  const rounds = data.map((el) => Object.keys(el)[0]);
  const roundsData = rounds.map((el, idx) => data[idx][el].slice(0, 6));
  
  // TODO: 랜덤 추출
  const set = new Set();
  
  console.log('-----------------------------', '비교시작');
  const result = [];
  let totCnt = 0;
  
  while ( result.length < 5 ) {
    while ( set.size < 6) {
      set.add(String(Math.floor(Math.random() * 45) + 1));
    }
  
    const arrTmp = Array.from(set).sort((a, b) => a - b);
  
    totCnt +=1;
  
    set.clear();
  
    let isSucsses = true;
  
    roundsData.forEach((el, idx) => {
      let count = 0;
  
      if ( arrTmp.filter(ele => el.includes(ele)).length > 3 ) {
        isSucsses = false;
  
        return ;
      }
  
      count = 0;
    });
  
    if ( isSucsses ) {
      result.push(arrTmp);
    }
  }

  console.log(`번호 생성 (종료 총수): ${totCnt}`);
  // console.table(result);
  
  // TODO: 퍼센트별 제외로직
  
})());