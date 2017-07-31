<?php

class SectionAudioBlock extends Section
{
    private static $db = array(

    );

    private static $has_one = array(
        'Avatar' => 'Image',
        'Audio' => 'File'
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