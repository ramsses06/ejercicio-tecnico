$(document).ready(function(){

});

var data = null;

$("#enviarAJAX").click(function(){
  enviapost();
});


function enviapost(){
    var vname = $("#USState").val();
    // console.log("enviado");
    $.post("http://www.webservicex.net/uszip.asmx/GetInfoByState",
    {
    USState:vname
    },
    function(response,status){
      data = response;
      // console.log(data);
      appInit();
    });
}

function appInit(){
  var jsonText = xmlToJson(data);
  // console.log(jsonText);

  var objeto = jsonText.NewDataSet.Table;
  // console.log(objeto);

  var finalObj = {};
  for(var i=0; i<objeto.length; i++){
    finalObj[objeto[i].ZIP["#text"]] = { city: objeto[i].CITY["#text"] ,area: objeto[i].AREA_CODE["#text"] ,timezone: objeto[i].TIME_ZONE["#text"] ,state: objeto[i].STATE["#text"] }
  }
  console.log(finalObj);

  finalObj2 = [];
  var areas = [];
  for(var i=0; i<objeto.length; i++){
    areas.push(parseInt(objeto[i].AREA_CODE["#text"]));
  }
  var maxLevel = areas.max();
  maxLevel = maxLevel;

  for(var level = 0; level<=maxLevel; level+=100){
    var inicio = level;
    var fin = level + 100;
    var cities=[];
    for(var x=0; x<objeto.length; x++){
      if(parseInt(objeto[x].AREA_CODE["#text"]) >= inicio && parseInt(objeto[x].AREA_CODE["#text"]) <= fin ){
        var citiesObj = { area: objeto[x].AREA_CODE["#text"], city: objeto[x].CITY["#text"] ,state: objeto[x].STATE["#text"] ,zip: objeto[x].ZIP["#text"],timezone: objeto[x].TIME_ZONE["#text"] };
        cities.push(citiesObj);
      }
    }
    var principals = { area: inicio+"-"+fin , cities: cities };
    finalObj2.push(principals);
  }
  console.log(finalObj2);
  imprimir(JSON.stringify(finalObj2));

}


function imprimir(obj){
  $("#json").html("");
  $("#json").append(""+obj+"");
}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

// Changes XML to JSON
function xmlToJson(xml) {

  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}
