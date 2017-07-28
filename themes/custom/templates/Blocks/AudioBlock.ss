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
                    <div class="audio-panel panel rounded no-margin">
                        <!-- PLAY BUTTON -->

                        <div class="controls col-xs-2 ">
                            <span class="glyphicon glyphicon-play"></span>
                        </div>

                        <!-- TRACK AND CONTROLS -->

                        <div class="controls col-xs-8">

                            <div class="nav-controls">


                            </div>
                            <div class="track">

                            </div>
                        </div>

                        <!-- VOLUME SECTION -->

                        <div class="controls volume-button col-xs-2">
                            <span class="glyphicon glyphicon-volume-up"></span>
                        </div>
                        <div class="volume-hover-pad col-xs-2">
                        </div>


                        <div class="volume-meter panel rounded top">
                            <div class="volume-track"></div>
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