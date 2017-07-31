<div class="audio-block">
    <% if $ShowTitle %>
        <h2>$Title</h2>
    <% end_if %>
    <div class="main-wrapper panel wrapper rounded">
        <div class="panel question-wrapper">
            <h4 class="question">This is a question</h4>
        </div>
        <div class="bottom-wrapper">
            <div class="avatar col-sm-6">
                $Avatar
            </div>
            <div class="audio-section nopadding col-sm-6">
                <div class="audio-player">
                    <audio>
                        <source src="$Audio.URL" type="audio/mpeg"/>
                        Your browser does not support the audio element.
                    </audio>

                    <div class="audio-panel panel rounded no-margin">
                        <!-- PLAY BUTTON -->

                        <div class="controls col-xs-2 audio-block-play" action="play_pause">
                            <span class="glyphicon glyphicon-play"></span>
                        </div>

                        <!-- TRACK AND CONTROLS -->

                        <div class="controls col-xs-8">

                            <div class="nav-controls">


                            </div>
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
    $(document).ready(function(){
       $('.audio-player').hades_audio_player();
    });
</script>