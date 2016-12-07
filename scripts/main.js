!function e(o,t,n){function r(c,i){if(!t[c]){if(!o[c]){var l="function"==typeof require&&require;if(!i&&l)return l(c,!0);if(a)return a(c,!0);var s=new Error("Cannot find module '"+c+"'");throw s.code="MODULE_NOT_FOUND",s}var u=t[c]={exports:{}};o[c][0].call(u.exports,function(e){var t=o[c][1][e];return r(t?t:e)},u,u.exports,e,o,t,n)}return t[c].exports}for(var a="function"==typeof require&&require,c=0;c<n.length;c++)r(n[c]);return r}({1:[function(e,o,t){"use strict";function n(e,o){if(!(e instanceof o))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,o){for(var t=0;t<o.length;t++){var n=o[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(o,t,n){return t&&e(o.prototype,t),n&&e(o,n),o}}(),a=function(){function e(){n(this,e),this.container=document.querySelector(".js-map"),this.query="\n      SELECT world_borders.*, payments_and_capabilities.currency_name, payments_and_capabilities.currency_symbol, \n        payments_and_capabilities.payments, payments_and_capabilities.collections, payments_and_capabilities.cutoff, \n        payments_and_capabilities.category, payments_and_capabilities.value_date\n      FROM world_borders\n      LEFT JOIN payments_and_capabilities\n        ON world_borders.iso_a3=payments_and_capabilities.country_iso_code\n      WHERE world_borders.iso_a3 != 'ATA'\n      ORDER BY world_borders.labelrank;\n    ",this.cartocss="\n      #world_borders{\n        polygon-fill: #D9D9D9;\n        polygon-opacity: 1;\n        line-color: #FFF;\n        line-width: 0.5;\n        line-opacity: 1;\n      }\n      \n      #world_borders[category={{ category_code }}]{\n        polygon-fill: {{ category_color }};\n      }\n      \n      #world_borders::labels\n      [zoom > 3][labelrank < 3],\n      [zoom > 4][labelrank < 4],\n      [zoom > 5][labelrank < 5],\n      [zoom > 6][labelrank < 6],\n      [zoom > 7][labelrank < 7]\n      [zoom > 8][labelrank < 8]\n      [zoom > 9][labelrank < 9]\n      [zoom > 10][labelrank >= 9]\n      {\n        text-name: [name];\n        text-face-name: 'DejaVu Sans Book';\n        text-size: 10;\n        text-label-position-tolerance: 0;\n        text-fill: #000;\n        text-allow-overlap: false;\n        text-placement: point;\n        text-placement-type: simple;\n        text-placements: \"N,E,S,W\";\n      }\n    ",this.tooltipTemplate='\n      <div class="map__tooltip">\n        <h6 class="map__tooltip__title">{{ currency_name }}</h6>\n        <table class="map__tooltip__data">\n          <tbody>\n            <tr>\n              <td>Currency</td>\n              <td>{{ currency_symbol }}</td>\n            </tr>\n            <tr>\n              <td>Payments</td>\n              <td>{{#payments}}Yes{{/payments}}{{^payments}}No{{/payments}}</td>\n            </tr>\n           <tr>\n              <td>Collections</td>\n              <td>{{#collections}}Yes{{/collections}}{{^collections}}No{{/collections}}</td>\n            </tr>           \n            <tr>\n              <td>Cut off</td>\n              <td>{{ cutoff }}</td>\n            </tr>\n            <tr>\n              <td>Value date</td>\n              <td>{{ value_date }}</td>\n            </tr>\n          </tbody>  \n        </table>\n      </div>\n      ';var o=1,t=2,r=3;this.categories=[{code:o,color:"#00C0F0"},{code:t,color:"#9AD7E5"},{code:r,color:"#144257"}],this.currentCategory=_.findWhere(this.categories,{code:o}),this.configureSize(),this.createMap(),this.addCartoLayer(),this.handleCategoryChange()}return r(e,[{key:"configureSize",value:function(){var e=this,o=[{minScreenWidth:1200,center:[30,0],zoom:3},{minScreenWidth:992,center:[30,0],zoom:2},{minScreenWidth:768,center:[30,0],zoom:2},{minScreenWidth:0,center:[30,0],zoom:1}];o.some(function(o){var t=$(window).width();if(t>=o.minScreenWidth)return e.options=o,!0})}},{key:"createMap",value:function(){this.map=new L.Map(this.container,{center:this.options.center,zoom:this.options.zoom,minZoom:this.options.zoom,zoomControl:!1,scrollWheelZoom:!1,attributionControl:!1}),L.control.zoom({position:"topright"}).addTo(this.map)}},{key:"addCartoLayer",value:function(){var e=this;cartodb.createLayer(this.map,{user_name:"ebury",type:"cartodb",sublayers:[{sql:this.query,cartocss:this.cartocss.replace("{{ category_code }}",this.currentCategory.code).replace("{{ category_color }}",this.currentCategory.color),interactivity:"currency_name, currency_symbol, payments, collections, cutoff, category, cartodb_id, iso_a3, value_date, name"}]},{https:!0}).addTo(this.map).on("done",function(o){e.cartoLayer=o.getSubLayer(0),e.addTooltip(o),e.handleCountryClick()})}},{key:"addTooltip",value:function(e){var o=this,t=e.leafletMap.viz.addOverlay({type:"tooltip",layer:this.cartoLayer,template:this.tooltipTemplate,position:"top|center",fields:[{currency_name:"currency_name",currency_symbol:"currency_symbol",payments:"payments",collections:"collections",cutoff:"cutoff",category:"category",value_date:"value_date"}]});this.cartoLayer.off("mouseover").on("mouseover",function(e,n,r,a){a.category===o.currentCategory.code&&(t.show(r,a),t.showing=!0)})}},{key:"handleCountryClick",value:function(){var e=this;this.countryInfo=new Vue({el:".js-country-info",data:{countryName:null,currencyName:null,currencySymbol:null,payments:null,collections:null,cutoff:null,valueDate:null,info:null}}),this.cartoLayer.on("mouseover",function(o,t,n,r){r.category===e.currentCategory.code?e.container.style.cursor="pointer":e.container.style.cursor=""}).on("mouseout",function(){e.container.style.cursor=""}).on("featureClick",function(o,t,n,r){r.category===e.currentCategory.code&&e.showCountryInfo(r.name,r.iso_a3)})}},{key:"showCountryInfo",value:function(e,o){var t=this,n=new cartodb.SQL({user:"ebury"}),r=$(this.countryInfo.$el);r.addClass("country-info--loading"),n.execute("SELECT * FROM payments_and_capabilities WHERE country_iso_code = '{{country}}'",{country:o}).done(function(o){t.countryInfo.countryName=e,t.countryInfo.currencyName=o.rows[0].currency_name,t.countryInfo.currencySymbol=o.rows[0].currency_symbol,t.countryInfo.payments=o.rows[0].payments,t.countryInfo.collections=o.rows[0].collections,t.countryInfo.cutoff=o.rows[0].cutoff,t.countryInfo.valueDate=o.rows[0].value_date,t.countryInfo.info=o.rows[0].info,r.modal("show"),r.removeClass("country-info--loading")}).error(function(e){console.log("errors:"+e)})}},{key:"handleCategoryChange",value:function(){var e=this;$(".js-category").on("change",function(o){return e.changeCategory(parseInt($(o.currentTarget).val()))})}},{key:"changeCategory",value:function(e){this.currentCategory=_.findWhere(this.categories,{code:e}),this.cartoLayer.setCartoCSS(this.cartocss.replace("{{ category_code }}",this.currentCategory.code).replace("{{ category_color }}",this.currentCategory.color))}}]),e}();new a},{}]},{},[1]);