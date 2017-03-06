$(document).ready(function(){

var $loading = $('#loadingDiv').hide();
$(document).ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });

});






function cities(){
  $.ajax({
            url:"https://forms.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=408&deploy=1&compid=3803303&h=768e554d1169907e8957",
            type: "GET",
            dataType: "json",
            success: function (data) {
                 console.log(data);
                 accion(data);
            },
            error: function (data) {
                 alert("error");
            }
         });

  var accion = function(data){
    var datos = data;
    var datosDateFor = [];
    var allCity = [];
    var allClients = [];
    var allDate = [];

    for (var i = 0; i < datos.length; i++) {
      allCity.push(datos[i].city);
    }
    for (var i = 0; i < datos.length; i++) {
      allClients.push(datos[i].customer);
    }
    for (var i = 0; i < datos.length; i++) {
      datosDateFor.push([toDate(datos[i].date), datos[i].quantity]);
    }
    for (var i = 0; i < datosDateFor.length; i++) {
      allDate.push(datosDateFor[i][0]);
    }

    var uniqMonths = uniq_elements(allDate);
    var uniqClient = uniq_elements(allClients);
    var uniqCity = uniq_elements(allCity);
    var salesWithCity = withCity(uniqCity);
    var salesWithoutCity = withoutCity(uniqCity);

    var mesVentas = saleProcess(uniqMonths,datosDateFor,0,1);
    var clientesVentas = saleProcess(uniqClient,data,"customer","quantity");
    var ventasCon = saleProcess(salesWithCity,data,"city","quantity");
    var ventasSin = saleProcess(salesWithoutCity,data,"city","quantity");

    var clientesVentasOrdered = orderArray(clientesVentas);

    // console.log(uniqCity);
    // console.log(salesWithCity);
    // console.log(salesWithoutCity);
    // console.log(ventasCon);
    // console.log(ventasSin);
    // console.log(uniqClient);
    console.log(clientesVentas);
    // console.log(clientesVentasOrdered);
    console.log(datosDateFor);
    console.log(allDate);
    console.log(uniqMonths);
    console.log(mesVentas);

    printSales(salesWithCity,ventasCon,1);
    printSales(salesWithoutCity,ventasSin,2);
    printSalesMonths(uniqMonths,mesVentas,3);
    printClients(clientesVentasOrdered,4);

  }
}

function printSalesMonths(uniqMonths,mesVentas,punto){
  var months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var total=0;
  for(var i in uniqMonths) {
    var parts = uniqMonths[i];
    parts = parts.split("/")
    var fecha = months[parseInt(parts[0])+1];
    $("#punto"+punto.toString()+"").append("<li>"+(fecha)+": "+mesVentas[uniqMonths[i]]+"</li>");
    total += parseInt(mesVentas[uniqMonths[i]]);
  }
  var promedio = (total/uniqMonths.length) ;
  $("#punto"+punto.toString()+"").prepend("<li style='color:red;padding-top:10px;'>Promedio de ventas al mes: "+promedio+"</li>");
}

function printClients(clientesVentasOrdered,punto){
  for(var i = 0; i<5; i++) {
      $("#punto"+punto.toString()+"").append("<li>"+clientesVentasOrdered[i][0]+": <strong>"+clientesVentasOrdered[i][1]+"</strong></li>");
    }
}

function printSales(salesWC,ventasCS,punto){
  for(var i in salesWC) {
      $("#punto"+punto.toString()+"").append("<li>"+salesWC[i]+": "+ventasCS[salesWC[i]]+"</li>");
    }
}

function saleProcess(saleParam,datos,fieldWith,quantity){
  var citySales = {};
  for(var y=0; y<saleParam.length; y++ ){
    citySales[saleParam[y]] = suma(saleParam[y],datos,fieldWith,quantity);
  }
  return citySales;
}
function suma(city,data,fieldWith,quantity){
  var total = 0;
  for (var i = 0; i < data.length; i++) {
    if(data[i][fieldWith] == city){
      total += data[i][quantity];
    }
  }
  return total;
}

function withCity(uniqCity){
  var newSales = [];
  for (var i = 0; i < uniqCity.length; i++) {
    if(uniqCity[i] != ""){
      newSales.push(uniqCity[i]);
    }
  }
  return newSales;
}
function withoutCity(uniqCity){
  var newSales = [];
  for (var i = 0; i < uniqCity.length; i++) {
    if(uniqCity[i] == ""){
      newSales.push(uniqCity[i]);
    }
  }
  return newSales;
}

function uniq_elements(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

function orderArray(arrayPass){
  var sortable = [];
  for (var newArray in arrayPass){
    sortable.push([newArray, arrayPass[newArray]]);
  }

  sortable.sort(function(a, b) {
    return a[1] - b[1];
  });
  return sortable.reverse();
}


function toDate(dateStr) {
  var parts = dateStr.split("/");
  var datenew = new Date(parts[2], parts[1] - 1, parts[0]);

  var newdate = (datenew.getMonth()+1) + "/" + datenew.getFullYear();
  return newdate
}
