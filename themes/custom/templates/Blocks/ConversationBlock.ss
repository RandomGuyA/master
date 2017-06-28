<div class="conversation-block">
    <% if $ConversationBubbles %>
        <% loop $ConversationBubbles %>
            <div class="conversation-bubble $Align" style="background-color:#$BubbleColor;">
                <% if $Author %><span class="bubble-author">$Author Says:</span><% end_if %>
                $BubbleText
            </div>
        <% end_loop %>
    <% end_if %>
</div>