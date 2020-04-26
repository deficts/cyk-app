var roots = [];
var productions = [];

function grammarToHashMap() {
  var hashMap = {};
  for (var i in productions) {
    var prodArray = productions[i].split("|");
    for (j in prodArray) {
      prodArray[j] = prodArray[j].trim();
      if (!hashMap[prodArray[j]]) {
        hashMap[prodArray[j]] = [];
      }
      hashMap[prodArray[j]].push(roots[i]);
    }
  }
  return hashMap;
}

function createTable(word, n) {
  const t = [];
  for (let i = 0; i < n; i++) {
    var st = []
    for (let j = 0; j < n - i; j++) {
      st.push(new Set());
    }
    t.push(st);
  }
  return t;
}

function combine(x,y){
  com = new Set();
  if(x.size == 0 || y.size == 0){
    return com;
  }
  for(i of x){
    for(j of y){
      com.add(i+j);
    }
  }
  return com;
}

function cykParser(word) {
  const hashMap = grammarToHashMap();
  var len = word.length;
  var t = createTable(word, len);
  //Primera iteración checar terminales
  for (let i = 0; i < len; i++) {
    if (hashMap[word[i]]) {
      for (let j=0; j<hashMap[word[i]].length;j++) {
        t[0][i].add(hashMap[word[i]][j]);
      }
    }
  }
  //cyk
  for (let i=1;i<len;i++){
    for(let j=0;j<len-i;j++){
      for(let k=0; k<i;k++){
        var com = combine(t[k][j],t[i-k-1][j+k+1])
        for(c of com){
          if(hashMap[c]){
            for (let d=0; d<hashMap[c].length;d++) {
              t[i][j].add(hashMap[c][d]);
            }
          }
        }
      }
    }
  }
  return t;
}

function saveProductions() {
  if ($("#root").val() != "" && $("#production").val() != "") {
    roots.push($("#root").val());
    productions.push($("#production").val());
    $("#gramatica").append("<span>" + $("#root").val() + " -> " + $("#production").val() + "<span/><br>");
    $("#root").val("")
    $("#production").val("")
  }
}

function deleteProductions() {
  $("#gramatica > span:last").remove();
  roots.pop();
  productions.pop();
}

$("#addProductions").click(function() {
  saveProductions();
})

$("#deleteProductions").click(function() {
  deleteProductions();
})

$("#process").click(function() {
  cykParser($("#word").val());
})
