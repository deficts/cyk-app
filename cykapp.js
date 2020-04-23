var roots = [];
var productions = [];

function grammarToHashMap(){
  var hashMap = {};
  for(var i in productions){
    var prodArray = productions[i].split("|");
    for(j in prodArray){
      prodArray[j] = prodArray[j].trim();
    }
    if(!hashMap[roots[i]]){
      hashMap[roots[i]]=[];
    }
    hashMap[roots[i]].push(prodArray);
  }
  console.log(hashMap);
  return hashMap;
}


function saveProductions() {
  if($("#root").val()!="" && $("#production").val()!=""){
    roots.push($("#root").val());
    productions.push($("#production").val());
    $("#gramatica").append("<span>"+$("#root").val()+"->"+$("#production").val()+"<span/><br>");
    $("#root").val("")
    $("#production").val("")
  }
}

function deleteProductions(){
  $("#gramatica > span:last").remove();
}

$("#addProductions").click(function() {
  saveProductions();
})

$("#deleteProductions").click(function() {
  deleteProductions();
})

$("#process").click(function() {
  grammarToHashMap();
})
