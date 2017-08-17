<div class="audio-block">
    <% if $ShowTitle %>
        <h2>$Title</h2>
    <% end_if %>

    <div class="main-wrapper panel wrapper rounded">

        <div class="panel question-wrapper">
            <div class="col-xs-1 nopadding">
                <span class="glyphicon glyphicon-step-backward"></span>
            </div>
            <div class="question col-xs-10">

                <% if $AudioTexts %>
                    <% loop $AudioTexts %>
                        <div class="audio-text <% if $First %>current<% end_if %>"
                             avatar="<% if $Avatar %>$Avatar.Filename<% end_if %>">
                            <% if $Text %>
                                $Text
                            <% end_if %>
                            <audio>
                                <source src="$Audio.URL" type="audio/mpeg"/>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    <% end_loop %>
                <% end_if %>
            </div>
            <div class="col-xs-1 nopadding">
                <span class="glyphicon glyphicon-step-forward"></span>
            </div>
        </div>
        <div class="bottom-wrapper">
            <div class="audio-section nopadding col-md-12 col-xs-12">
                <div class="audio-player">

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
        </div>

    </div>

</div>
<script>
    $(document).ready(function () {
        $('.audio-block').hades_audio_player();
    });
</script>