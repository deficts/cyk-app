var roots = [] //= ["S", "A", "B", "C"];
var productions = [] //= ["AB|BC", "BA|a", "CC|b", "AB|a"];
var chart;

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

function createTable(n) {
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

function createIndexes(n) {
  const t = [];
  for (let i = 0; i < n; i++) {
    var st = []
    for (let j = 0; j < n - i; j++) {
      st.push(new Map());
    }
    t.push(st);
  }
  return t;
}

function combine(x, y) {
  com = new Set();
  if (x.size == 0 || y.size == 0) {
    return com;
  }
  for (i of x) {
    for (j of y) {
      com.add(i + j);
    }
  }
  return com;
}

function cykParser(word) {
  const hashMap = grammarToHashMap();
  console.log(hashMap);
  var len = word.length;
  var t = createTable(len);
  var indexes = createIndexes(len);
  //Primera iteración checar terminales
  for (let i = 0; i < len; i++) {
    if (hashMap[word[i]]) {
      for (let j = 0; j < hashMap[word[i]].length; j++) {
        t[0][i].add(hashMap[word[i]][j]);
        indexes[0][i][hashMap[word[i]][j]] = word[i];
        //if (indexes[0][i][word[i]][j]) {
        //  indexes[0][i][word[i]][j].push(i,j,hashMap[word[i]][j]);
        //} else {
        //  indexes[0][i][word[i]][j] = [i,j,hashMap[word[i]][j]];
        //}
      }
    }

  }
  //cyk
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < len - i; j++) {
      for (let k = 0; k < i; k++) {
        var index1 = t[k][j];
        var index2 = t[i - k - 1][j + k + 1];
        var com = combine(index1, index2);
        for (c of com) {
          if (hashMap[c]) {
            for (let d = 0; d < hashMap[c].length; d++) {
              t[i][j].add(hashMap[c][d]);
              if (indexes[i][j][hashMap[c][d]]) {
                indexes[i][j][hashMap[c][d]].push(...[k, j, i - k - 1, j + k + 1, c]);
              } else {
                indexes[i][j][hashMap[c][d]] = [k, j, i - k - 1, j + k + 1, c];
              }
            }
          }
        }
      }
    }
  }
  console.log(t);
  if (t[len - 1][0].has("S")) {
    $("#result").text("Es parte de la gramática");
    $("#result").css('color','green');
    if(chart){
      chart.destroy();
      var newChart;
      $("#cyktree").remove();
      $("#resultContainer").append('<div id="cyktree" class="chart mx-auto"></div>');
      newChart = new Treant(createGraphic(createTree(t, indexes)),null,$)
    }else{
      chart = new Treant(createGraphic(createTree(t, indexes)),null,$)
    }
  } else {
    if(chart){
      chart.destroy();
    }
    $("#result").text("No es parte de la gramática");
    $("#result").css('color','red');
  }
}

function getNextNode(tree, table, indexes, x, y, gen, i, parent) {
  //si es terminal
  if (x == 0) {
    tree[gen + "" + i] = {
      text: gen+" -> " + indexes[x][y][gen],
      parent: parent
    }
    return;
  }
  var index = indexes[x][y][gen];
  tree[gen + "" + i] = {
    text: gen,
    parent: parent
  }
  getNextNode(tree, table, indexes, index[0], index[1], index[4][0], i + 1, gen + "" + i);
  getNextNode(tree, table, indexes, index[2], index[3], index[4][1], i + 2, gen + "" + i);
}

function createTree(table, indexes) {
  length = table.length;
  gen = "S";
  tree = {};
  var i = length - 1;
  var j = 0;
  var index = indexes[i][j][gen];
  tree[gen] = {
    text: "S"
  };
  getNextNode(tree, table, indexes, index[0], index[1], index[4][0], 1, gen);
  getNextNode(tree, table, indexes, index[2], index[3], index[4][1], 2, gen);
  return tree;
}

function createGraphic(tree) {
  console.log(tree);
  var chart_config =[];
  var config = {
    container: "#cyktree",
    connectors: {
      type: 'step'
    },
    node: {
      HTMLclass: 'node'
    }
  }
  chart_config.push(config);
  parents = {};
  c=0;
  for (i in tree){
    if(c==0){
      var node = {
        text:{
          title:tree[i].text
        }
      }
      parents[i]=node;
      chart_config.push(node);
    }else{
      var node = {
        text:{
          title:tree[i].text
        },
        parent:parents[tree[i].parent]
      }
      parents[i]=node;
      chart_config.push(node);
    }
    c++;
  }
  return chart_config;
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
