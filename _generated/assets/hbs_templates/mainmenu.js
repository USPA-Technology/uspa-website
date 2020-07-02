define(["handlebars"], function(Handlebars) { return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "			<li>\n				<a "
    + ((stack1 = (lookupProperty(helpers,"ternary")||(depth0 && lookupProperty(depth0,"ternary"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"new_window") : depth0),"target=\"_blank\"",{"name":"ternary","hash":{},"data":data,"loc":{"start":{"line":9,"column":7},"end":{"line":9,"column":49}}})) != null ? stack1 : "")
    + " href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"link") || (depth0 != null ? lookupProperty(depth0,"link") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"link","hash":{},"data":data,"loc":{"start":{"line":9,"column":56},"end":{"line":9,"column":64}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":9,"column":66},"end":{"line":9,"column":75}}}) : helper)))
    + "</a>\n			</li>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<nav class=\"screen-menu\">\n	<label for=\"endrjs_collapsed_menu\" class=\"collapsed-menu\">\n		<i class=\"fa fa-bars\"></i>\n	</label>\n	<input id=\"endrjs_collapsed_menu\" type=\"checkbox\">\n	<ul>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"global") : depth0)) != null ? lookupProperty(stack1,"mainmenu") : stack1)) != null ? lookupProperty(stack1,"items") : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":2},"end":{"line":11,"column":11}}})) != null ? stack1 : "")
    + "	</ul>\n</nav>";
},"useData":true}); });