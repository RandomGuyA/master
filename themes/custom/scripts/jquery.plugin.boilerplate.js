;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'app_name';
    var ID = 678401;

    
    $.app_name = function (element, options) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

			required:true

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance

        //--------------------------------------//
        //       CUSTOM SETTING SETUP
        //--------------------------------------//


        plugin.settings = {}; //initialise empty settings object

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
            element = element;        // reference to the actual DOM element

        //gather individual plugin defaults from the attr tags in the plugin element
        //example attribute: <div data-{plugin name}-opts='{"custom_variable":"value"}' />*
        var meta = $element.data(name + '-opts');


        //--------------------------------------//
        //              CONSTRUCTOR
        //--------------------------------------//

        plugin.init = function () {

            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, meta);

            console.log("initialised plugin " + name + " -- " + id);

      


        };


        //--------------------------------------//
        //              PUBLIC METHODS
        //--------------------------------------//

        /**
         *  these methods can be called like:
         *  plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
         *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
         *  is the element the plugin is attached to;
         */

        plugin.foo_public_method = function () {

            // code goes here

        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var private_method = function () {
			
			// code goes here
            

        };

       


        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//
		
		/**
		*	Add custom methods to selectors
		*	These are called by adding the function to the selectors
		*	eg: $('.element).bind_event(args);
		*/
		
        $.fn.bind_event = function (args) {
            
		
			// code goes here
			
        };

        
   

      


        //-----------------------------------------
        //				INITIALISATION
        //-----------------------------------------

        plugin.init();


    };


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    /**
     *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
     *  element.data('pluginName').settings.propertyName
     *
     */

    $.fn.app_name = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.app_name(this, options);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);