<?php

class SectionAudioBlock extends Section
{

    private static $db = array(

    );

    private static $has_one = array(
        'Avatar' => 'Image'
    );


    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $uploadField = UploadField ::create('Avatar');
        $uploadField->setFolderName('SectionAudioBlock');
        $uploadField->getValidator()->setAllowedExtensions(array(
            'png','gif','jpeg','jpg'
        ));

        $fields->addFieldToTab("Root.Main", $uploadField);

        return $fields;
    }


}