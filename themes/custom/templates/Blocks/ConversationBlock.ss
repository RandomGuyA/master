<div class="conversation-block">
    <% if $ConversationBubbles %>
        <% loop $ConversationBubbles %>
            <div class="conversation-bubble $Align" style="background-color:#$BubbleColor;">
                <% if $Author %><span class="bubble-author">$Author $Dialog:</span><% end_if %>
                $BubbleText
                <span class="$Align glyphicon glyphicon-triangle-bottom" style="color:#$BubbleColor;"></span>
            </div>

        <% end_loop %>
    <% end_if %>
</div>