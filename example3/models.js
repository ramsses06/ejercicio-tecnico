var ProductModel = Backbone.Model.extend({
    defaults : {
    }
});

var ProductCollection = Backbone.Collection.extend({
  url : 'https://jsonplaceholder.typicode.com/photos?albumId=4',
  model : ProductModel
});

micoleccion = new ProductCollection();
var data = micoleccion.fetch({
  success: function(){
    templateHandle(data.responseJSON);
  }
});

function templateHandle(datos){
  // console.log(datos);
  var template = Handlebars.compile( $("#template").html() );
  $("#contenedorpadre").append(template(datos));

}




function buscarUno(id){
  var ProductCollection2 = Backbone.Collection.extend({
    url : 'https://jsonplaceholder.typicode.com/photos?albumId=4&id='+id,
    model : ProductModel
  });

  micoleccion2 = new ProductCollection2();
    var data2 = micoleccion2.fetch({
    success: function(){
      templateHandle2(data2.responseJSON);
    }
  });

  function templateHandle2(datos2){
    console.log(datos2);
    var template2 = Handlebars.compile( $("#template2").html() );
    $("#galery").append(template2(datos2));
    $("#contenedorpadre").remove();
  }
}
