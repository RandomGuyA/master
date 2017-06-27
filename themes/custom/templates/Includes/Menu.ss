<% if $Children %>
    <ul>
        <% control $Children %>
            <li link="$Link" title="$MenuTitle" pageID="$ID" parentID="$ParentID" className="$ClassName">$MenuTitle
                <% include Menu %>
            </li>
        <% end_control %>
    </ul>
<% end_if %>