<?php

class Answer extends DataObject
{
    static $db = array(
        'Answer'=>'varchar(200)',
    );

    private static $has_one = array(
        'SectionRevealAnswerBlock'=> 'SectionRevealAnswerBlock',
        'Audio' => 'File',
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->addFieldToTab('Root.Main', TextField::create('Answer', 'Answer'));

        /*----------- AUDIO FILE -------------*/

        $uploadField = UploadField ::create('Audio');
        $uploadField->setFolderName('SectionAudioBlock/audio');
        $uploadField->getValidator()->setAllowedExtensions(array(
            'mp3'
        ));
        $fields->addFieldToTab("Root.Main", $uploadField);


        return $fields;
    }
}