<?php

class SectionAudioAvatarBlock extends Section
{

    private static $has_one = array(

    );

    private static $has_many = array(
        'AudioTexts' => 'AudioText'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();




        /*------------- QUESTIONS AND AUDIO -------------*/

        $dataColumns = new GridFieldDataColumns();
        $dataColumns->setDisplayFields(
            array(
                'ID' => 'ID',
                'ClassName' => 'Class Name'
            )
        );

        //---------------------- Main Tab

        $saveWarning = LiteralField::create("Warning","<p class='cms-warning-label'>You must first save the Conversation block before adding conversation bubbles</p>");

        $audio = GridField::create('AudioTexts', 'AudioText', $this->AudioTexts(),
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
            $audio->getConfig()->removeComponentsByType('GridFieldAddNewButton');
            $fields->addFieldToTab('Root.Main',$saveWarning);
        }

        $fields->addFieldToTab('Root.Main', $audio);
        $this->removeEmptyTabs($fields);


        return $fields;
    }
}