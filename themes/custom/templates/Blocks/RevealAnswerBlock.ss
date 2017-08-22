<div class="reveal-answer-block" id="reveal-answer-$ID">

    <div class="custom-panel-list closed">

        <!-- Top Section -->

        <div class="panel header rounded top">
            <span>$Question</span>
        </div>

        <!-- Middle Section -->

        <div class="panel wrapper reveal-answers">
            <ul>
                <% loop $Answers %>
                    <li class="panel">
                        <span class="text">$Answer</span>
                        <div class="audio-block">
                            <div class="audio-player">
                                <audio>
                                    <source src="$Audio.URL" type="audio/mpeg"/>
                                    Your browser does not support the audio element.
                                </audio>
                                <div class="audio-panel panel no-margin">
                                    <!-- PLAY BUTTON -->

                                    <div class="controls col-xs-2 audio-block-play" action="play_pause">
                                        <span class="glyphicon glyphicon-play"></span>
                                    </div>

                                    <!-- TRACK AND CONTROLS -->

                                    <div class="controls middle col-xs-8">
                                        <div class="track horizontal audio-block-track">
                                            <div class="track-line audio-block-track-line"></div>
                                        </div>
                                    </div>

                                    <!-- VOLUME SECTION -->

                                    <div class="controls audio-block-volume-button col-xs-2" action="volume">
                                        <span class="glyphicon glyphicon-volume-up"></span>
                                    </div>
                                    <div class="audio-block-volume-hover-pad col-xs-2">
                                    </div>
                                    <div class="audio-block-volume-meter panel rounded top">
                                        <div class="track vertical audio-block-volume-track">
                                            <div class="track-line audio-block-volume-track-line"></div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </li>
                <% end_loop %>
            </ul>
        </div>

        <!-- Bottom Section -->

        <div class="panel footer rounded bottom reveal-button">
            <span class="glyphicon glyphicon-arrow-down"></span>
            <span class="glyphicon glyphicon-arrow-up"></span>
        </div>

    </div>
</div>
<script>
    $(document).ready(function () {

        $('.audio-block').hades_audio_player({solo:true});

        var reveal_answer_block = $('#reveal-answer-$ID');
        var custom_panel = reveal_answer_block.find('.custom-panel-list');
        var reveal_button = reveal_answer_block.find('.reveal-button');

        reveal_button.on('click', function () {

            if (custom_panel.hasClass('closed')) {
                custom_panel.removeClass('closed');
            } else {
                custom_panel.addClass('closed');
            }
        });
    });
</script>