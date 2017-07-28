;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'hades_audio_player';
    var ID = 477171;


    $.hades_audio_player = function (element, options) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

            required: true

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance
        var config;


        /*------------ CONTROLS ---------*/

        var volume;
        var sound_on = true;

        /*------------ BUTTONS ---------*/

        var $volume_button;

        /*---------OTHER ELEMENTS ---------*/

        var $volume_hover_pad;
        var $volume_meter;


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
            config = plugin.settings;
            console.log("initialised plugin " + name + " -- " + id);
            _create();



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

        var _create = function(){
            _setup_variables();
            _bind_events();

        };

        var _update = function(){

        };

        var _bind_events = function () {
            $volume_hover_pad.volume_hover();
            $volume_meter.volume_hover();
            $volume_button.volume_hover();
            $volume_button.volume_click();
        };


        var _setup_variables = function(){
            $volume_hover_pad = $element.find('.volume-hover-pad');
            $volume_meter = $element.find('.volume-meter');
            $volume_button = $element.find('.volume-button');

        };

        var toggle_volume_on_and_off = function($button){

            var $glyph = $button.find('.glyphicon');

            if(sound_on){
                sound_on = false;
                $glyph
                    .removeClass('glyphicon-volume-up')
                    .addClass('glyphicon-volume-off');
            }else{
                sound_on=true;
                $glyph
                    .removeClass('glyphicon-volume-off')
                    .addClass('glyphicon-volume-up');
            }

        };


        //--------------------------------------//
        //    BASIC CONTROLS
        //--------------------------------------//


        var _play = function(){

        };
        var _stop = function(){

        };
        var _next = function(){

        };
        var _prev = function(){

        };
        var _volume_off  = function(){

        };
        var _volume_on = function(){

        };

        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//

        /**
         *    Add custom methods to selectors
         *    These are called by adding the function to the selectors
         *    eg: $('.element).bind_event(args);
         */


        $.fn.volume_hover = function () {

            $(this).each(function () {
                $(this)
                    .on('mouseover', function () {
                        $('.volume-meter').show();
                    })
                    .on('mouseleave', function () {
                        $('.volume-meter').hide();
                    });
            });
        };

        $.fn.volume_click = function(){

            $(this).on('click', function(){
                toggle_volume_on_and_off($(this));


            });
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

    $.fn.hades_audio_player = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.hades_audio_player(this, options);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);