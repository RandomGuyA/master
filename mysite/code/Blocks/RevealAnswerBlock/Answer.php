<?php

class Answer extends DataObject
{
    static $db = array(
        'Answer'=>'varchar(200)'
    );

    private static $has_one = array(
        'SectionRevealAnswerBlock'=> 'SectionRevealAnswerBlock'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->addFieldToTab('Root.Main', TextField::create('Answer', 'Answer'));

        return $fields;
    }
}