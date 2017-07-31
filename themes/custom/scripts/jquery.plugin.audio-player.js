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
            update_speed: 1000
        };

        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance
        var config;


        var playing = false;

        var timer;

        /*------------ CONTROLS ---------*/

        var volume;
        var sound_on = true;

        /*------------ BUTTONS ---------*/

        var $play_pause_button;
        var $volume_button;


        /*---------OTHER ELEMENTS ---------*/

        var $volume_hover_pad;
        var $volume_meter;
        var $audio;
        var $source;
        var $audio_block_track;
        var $track_line;
        var $volume_track;
        var $volume_track_line;
        var track;


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


        plugin.play_pause = function ($button) {
            _play_pause_toggle($button);
        };

        plugin.volume = function ($button) {
            _toggle_volume_on_and_off($button);
        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var _create = function () {
            _setup_variables();
            _bind_events();
        };

        var _update = function () {
            _update_track_line(track.currentTime);

        };

        var _bind_events = function () {
            $volume_hover_pad.volume_hover();
            $volume_meter.volume_hover();
            $volume_button.volume_hover();
            $play_pause_button.button_click();
            $volume_button.button_click();
            $volume_track.vertical_track();
            $audio_block_track.horizontal_track();
        };

        var _setup_variables = function () {

            $audio = $element.find('audio');
            $source = $element.find('source');
            track = new Audio($source.attr('src'));

            $volume_hover_pad = $element.find('.audio-block-volume-hover-pad');
            $volume_meter = $element.find('.audio-block-volume-meter');
            $volume_button = $element.find('.audio-block-volume-button');
            $play_pause_button = $element.find('.audio-block-play');

            $audio_block_track = $element.find('.audio-block-track');
            $track_line = $element.find('.audio-block-track-line');
            $volume_track = $element.find('.audio-block-volume-track');
            $volume_track_line = $element.find('.audio-block-volume-track-line');

        };

        var _update_track_line = function (time) {

            var position = (time / track.duration ) * 100;
            /*
             console.log("track.duration " + track.duration);
             console.log("time " + time);
             console.log("position " + position);
             */
            if (position > 100) {
                $track_line.css('width', "100%");
            } else {
                $track_line.css('width', position + "%");
            }
        };


        var _toggle_volume_on_and_off = function ($button) {

            var $glyph = $button.find('.glyphicon');

            if (sound_on) {
                sound_on = false;
                swap_glyphs($glyph, 'glyphicon-volume-up', 'glyphicon-volume-off');
                _volume_off();
            } else {
                sound_on = true;
                swap_glyphs($glyph, 'glyphicon-volume-off', 'glyphicon-volume-up');
                _volume_on();
            }
        };

        var _play_pause_toggle = function ($button) {

            var $glyph = $button.find('.glyphicon');

            if (playing) {
                swap_glyphs($glyph, 'glyphicon-pause', 'glyphicon-play');
                _pause();
            } else {
                swap_glyphs($glyph, 'glyphicon-play', 'glyphicon-pause');
                _play();
            }
        };

        var set_track_position = function (position) {

            track.currentTime = track.duration * position;
            _update();

        };

        var update_volume = function () {

            var position = track.volume * 100;
            $volume_track_line.css('height', position + "%");
        };

        var time_interval = function () {

            return setInterval(function () {
                _update();
            }, config.update_speed);
        };


        //--------------------------------------//
        //    BASIC CONTROLS
        //--------------------------------------//

        var _play = function () {
            playing = true;
            track.play();
            timer = time_interval();
        };
        var _pause = function () {
            playing = false;
            track.pause();
            clearInterval(timer);
        };
        var _volume_off = function () {
            volume = track.volume;
            track.volume = 0;
            update_volume();
        };
        var _volume_on = function () {
            track.volume = volume;
            update_volume();
        };
        var set_volume = function (volume) {
            sound_on = (volume > 0);
            track.volume = volume;
            update_volume();
        };

        var _next = function () {

        };
        var _prev = function () {

        };

        //--------------------------------------//
        //    HELPER FUNCTIONS
        //--------------------------------------//


        var swap_glyphs = function ($glyph, old_glyph, new_glyph) {
            $glyph.removeClass(old_glyph);
            $glyph.addClass(new_glyph);
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
                        $('.audio-block-volume-meter').show();
                    })
                    .on('mouseleave', function () {
                        $('.audio-block-volume-meter').hide();
                    });
            });
        };

        $.fn.button_click = function () {

            $(this).on('click', function () {
                var call = $(this).attr('action');
                $('.audio-player').data('hades_audio_player')[call]($(this));
            });
        };


        $.fn.vertical_track = function () {

            $(this).on('click', function (e) {

                var offset = $(this).offset();
                var click_position = e.pageY - offset.top;
                var position = 1 - (click_position / $(this).height());
                position = (position > 0.9) ? 1 : position;
                position = (position < 0.1) ? 0 : position;
                set_volume(position);
            });

        };

        $.fn.horizontal_track = function () {

            $(this).on('click', function (e) {

                var offset = $(this).offset();
                var click_position = e.pageX - offset.left;
                var position = click_position / $(this).width();
                set_track_position(position);
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