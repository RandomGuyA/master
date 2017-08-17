;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'hades_audio_player';
    var SERIAL = 477171;


    $.hades_audio_player = function (element, options, serial) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {
            update_speed: 1000,
            solo: false
        };

        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        //set unique ID for plugin instance
        var config;
        var id = "hades-audio-player-" + serial;

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
        var $prev_track;
        var $next_track;
        var track;
        var tracks = [];
        var current_track;
        var audio_available = false;

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
            console.log("initialised plugin " + name + " -- " + serial);
            $element.attr('id', id);
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

        plugin.stop_all = function () {
            if ($('.audio-block').length != 0) {
                $('.audio-block').each(function () {
                    if ($(this).data('hades_audio_player') != undefined) {
                        $(this).data('hades_audio_player').stop();
                    }
                });
            }
        };

        plugin.stop = function () {
            var $glyph = $play_pause_button.find('.glyphicon');
            swap_glyphs($glyph, 'glyphicon-pause', 'glyphicon-play');
            _pause();

        };

        plugin.play_pause = function ($button) {
            if (audio_available) {
                _play_pause_toggle($button);
            }
        };

        plugin.volume = function ($button) {
            if (audio_available) {
                _toggle_volume_on_and_off($button);
            }
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
            if (audio_available) {
                _bind_events();
                _setup_layout();
            }
        };

        var _update = function () {

            if (track.currentTime >= track.duration) {
                _reset_track();
            } else {
                _update_track_line(track.currentTime);
            }
        };

        var _bind_events = function () {
            $volume_hover_pad.volume_hover();
            $volume_meter.volume_hover();
            $volume_button.volume_hover();
            $play_pause_button.button_click();
            $volume_button.button_click();
            $volume_track.vertical_track();
            $audio_block_track.horizontal_track();
            $prev_track.change_track();
            $next_track.change_track();
        };

        var _setup_layout = function () {
            hide_and_show_arrows();
            set_volume_meter_position();
        };

        var _setup_variables = function () {

            load_tracks();

            $volume_hover_pad = $element.find('.audio-block-volume-hover-pad');
            $volume_meter = $element.find('.audio-block-volume-meter');
            $volume_button = $element.find('.audio-block-volume-button');
            $play_pause_button = $element.find('.audio-block-play');

            $audio_block_track = $element.find('.audio-block-track');
            $track_line = $element.find('.audio-block-track-line');
            $volume_track = $element.find('.audio-block-volume-track');
            $volume_track_line = $element.find('.audio-block-volume-track-line');

            $prev_track = $element.find('.glyphicon-step-backward');
            $next_track = $element.find('.glyphicon-step-forward');

        };

        var load_tracks = function () {

            if (plugin.settings.solo) {
                audio_available = true;
                set_current_track(Track(0, $element.find('source').attr('src'), false, false));
            } else {

                var $audio_blocks = $element.find('.audio-text');
                $audio_blocks.each(function (index) {

                    var $a_block = $(this);
                    var source = $a_block.find('source').attr('src');
                    var avatar = $a_block.attr('avatar');
                    tracks.push(Track(index, $a_block.find('source').attr('src'), false, (avatar.length == 0) ? false : avatar));
                });

                if (tracks.length > 0) {
                    console.log((tracks.length + 1) + ' audio files found');
                    audio_available = true;
                    set_current_track(tracks[0])
                } else {
                    console.log('no audio found');
                    audio_available = false;
                }
            }
        };

        var hide_and_show_arrows = function () {

            $next_track.show();
            $prev_track.show();
            if (current_track.id == 0) {
                $prev_track.hide();
            }
            if (current_track.id == tracks.length - 1) {
                $next_track.hide();
            }
        };

        var set_current_track = function (a_track) {

            current_track = a_track;

            for (var a = 0; a < tracks.length; a++) {
                tracks[a].current = false;
                console.log(tracks[a].avatar);
            }
            a_track.current = true;
            if (a_track.avatar != false) {
                set_avatar(a_track);
            }
            track = new Audio(a_track.src);
        };


        var set_avatar = function (a_track) {

            var $av_wrapper = $element.find('.bottom-wrapper');
            $av_wrapper.find('.avatar').remove();
            $av_wrapper.prepend(
                $('<div>').addClass('avatar col-md-6 col-xs-12 ' + a_track.alignment).append(
                    $('<img>').attr('src', a_track.avatar)
                ));
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

        var _reset_track = function () {

            track.currentTime = 0;
            _update_track_line(0);
            _pause();
            swap_glyphs($play_pause_button.find('.glyphicon'), 'glyphicon-pause', 'glyphicon-play');
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
                plugin.stop_all();
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

        var go_to_track = function (id) {

            var $glyph = $play_pause_button.find('.glyphicon');
            swap_glyphs($glyph, 'glyphicon-pause', 'glyphicon-play');
            _pause();
            set_current_track(tracks[id]);
            hide_and_show_arrows();
            var $audio_text = $element.find('.audio-text');
            $audio_text.removeClass('current');
            $audio_text.eq(id).addClass('current');
            swap_glyphs($glyph, 'glyphicon-play', 'glyphicon-pause');
            _play();
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
        //    OBJECTS
        //--------------------------------------//


        var Track = function (id, src, current, avatar) {
            id = parseInt(id);
            var alignment = (id % 2) ? "right" : "left";
            return {
                id: id,
                src: src,
                current: current,
                avatar: avatar,
                alignment: alignment
            }

        };


        //--------------------------------------//
        //    HELPER FUNCTIONS
        //--------------------------------------//


        var set_volume_meter_position = function () {

            var offset = (($volume_button.width() / 2) + 15) - ($volume_meter.width() / 2);
            $volume_meter.css('margin-right', offset + 'px');
        };

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

        $.fn.change_track = function () {
            $(this).each(function () {
                $(this).on('click', function () {
                    var new_id;
                    plugin.stop_all();
                    if ($(this).hasClass('glyphicon-step-backward')) {

                        console.log('back');
                        new_id = current_track.id - 1;
                        go_to_track(new_id);
                    }
                    if ($(this).hasClass('glyphicon-step-forward')) {

                        console.log('forward');
                        new_id = current_track.id + 1;
                        go_to_track(new_id);
                    }
                });
            });
        };

        $.fn.volume_hover = function () {

            $(this).each(function () {
                $(this)
                    .on('mouseover', function () {
                        $element.find('.audio-block-volume-meter').show();
                    })
                    .on('mouseleave', function () {
                        $element.find('.audio-block-volume-meter').hide();
                    });
            });
        };

        $.fn.button_click = function () {

            $(this).on('click', function () {
                var call = $(this).attr('action');
                $('#' + id).data('hades_audio_player')[call]($(this));
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


        $(window).on('resize', function () {
            set_volume_meter_position();
        });

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
                var plugin = new $.hades_audio_player(this, options, SERIAL++);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);