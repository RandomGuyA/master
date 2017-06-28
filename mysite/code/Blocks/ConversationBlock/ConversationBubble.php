<?php

class ConversationBubble extends DataObject
{

    private static $db = array(
        'Align' => 'VarChar(30)',
        'BubbleColor' => 'Color',
        'BubbleText' => 'HTMLText',
        'Author' => 'VarChar(50)'
    );

    private static $has_one = array(
        'SectionConversationBlock' => 'SectionConversationBlock'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $alignment = array(
            'left' => 'Left',
            'right' => 'Right'
        );

        $fieldList = array(
            DropdownField::create('Align', 'Alignment', $alignment),
            ColorField::create('BubbleColor', 'Bubble Color'),
            HtmlEditorField::create('BubbleText', 'Bubble Text'),
            TextField::create('Author', 'Author')
        );

        $fields->addFieldsToTab("Root.Main", $fieldList);

        return $fields;
    }

}