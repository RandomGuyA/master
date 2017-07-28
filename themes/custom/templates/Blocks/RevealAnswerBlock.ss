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
                        <span>$Answer</span>
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