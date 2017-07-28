<?php

class SectionConversationBlock extends Section {

    private static $db = array(
        'Dialog' => 'VarChar(50)'
    );

    private static $has_many = array(
        'ConversationBubbles' => 'ConversationBubble'
    );

    //-------------------------------------------- CMS Fields

    public function getCMSFields() {

        $fields = parent::getCMSFields();

        $dataColumns = new GridFieldDataColumns();
        $dataColumns->setDisplayFields(
            array(
                'ID' => 'ID',
                'ClassName' => 'Class Name'
            )
        );

        //---------------------- Main Tab

        $saveWarning = LiteralField::create("Warning","<p class='cms-warning-label'>You must first save the Conversation block before adding conversation bubbles</p>");

        $bubbles = GridField::create('ConversationBubbles', 'Bubbles', $this->ConversationBubbles(),
            GridFieldConfig::create()->addComponents(
                $dataColumns,
                new GridFieldToolbarHeader(),
                new GridFieldAddNewButton('toolbar-header-right'),
                new GridFieldDetailForm(),
                new GridFieldEditButton(),
                new GridFieldDeleteAction('unlinkrelation'),
                new GridFieldDeleteAction(),
                new GridFieldTitleHeader(),
                new GridFieldAddExistingAutocompleter('before', array('Title'))
            )
        );

        if(!$this->ID){
            $bubbles->getConfig()->removeComponentsByType('GridFieldAddNewButton');
            $fields->addFieldToTab('Root.Main',$saveWarning);
        }

        $fields->addFieldToTab('Root.Main',TextField::create('Dialog', 'Dialog'));
        $fields->addFieldToTab('Root.Main',$bubbles);
        $this->removeEmptyTabs($fields);

        return $fields;
    }

    public function populateDefaults(){
        $this->Dialog = "Says";
        parent::populateDefaults();
    }

}