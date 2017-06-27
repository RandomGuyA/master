/*---------------- PLUGIN -----------------*/

;(function($, doc, win){
    "use strict";

    /*---------------------- GLOBAL VARIABLES ------------------------*/

    var name = 'plugin name';
    var self, $el, opts;

    /*---------------------- INITIALISATION ------------------------*/

    function App(el, opts){

        console.log(name+" activated");

        this.$el = $(el);
        this.$el.data(name, this);

        this.defaults = {

            required:true

        };

        var meta = this.$el.data(name + '-opts');
        this.opts = $.extend(this.defaults,opts, meta);

        this.init();
    }

    App.prototype.init = function() {

        /*---------------------- VARIABLES ------------------------*/

        self = this;
        $el = self.$el;
        opts = self.defaults;


    };

    /*---------------------- BINDING FUNCTIONS ------------------------*/





    /*---------------------- PRIVATE FUNCTIONS ------------------------*/


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    $.fn.plugin_name = function(opts) {
        return this.each(function() {
            new App(this, opts);
        });
    };

})(jQuery, document, window);




