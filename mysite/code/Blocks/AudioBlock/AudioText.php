<?php

class AudioText extends DataObject
{

    private static $db = array(
        'Text' => 'HTMLText',
    );

    private static $has_one = array(
        'SectionAudioAvatarBlock' => 'SectionAudioAvatarBlock',
        'Audio' => 'File',
        'Avatar' => 'Image',
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        /*------------- AVATAR -------------*/

        $uploadField = UploadField ::create('Avatar');
        $uploadField->setFolderName('SectionAudioBlock');
        $uploadField->getValidator()->setAllowedExtensions(array(
            'png','gif','jpeg','jpg'
        ));

        $fields->addFieldToTab("Root.Main", $uploadField);


        /*----------- TEXT -------------*/

        $fieldList = array(
            HtmlEditorField::create('Text', 'Text'),
        );
        $fields->addFieldsToTab("Root.Main", $fieldList);


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